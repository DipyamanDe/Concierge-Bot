from operator import or_
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, ForeignKey,and_, not_
from sqlalchemy.orm import sessionmaker, relationship, joinedload
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, Text
from sqlalchemy import LargeBinary
import base64
from sqlalchemy import and_
from datetime import datetime
 
import azure.cognitiveservices.speech as speechsdk
# import speech_recognition as sr 
import openai
import os
openai.api_key="" 
openai.api_key = "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"
messages = [{"role": "system", "content": "You are an intelligent assistant"}]
#openai.api_key = "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"
subscription_key = "7f3f190f4ddd4273989358d304df47d7"
region = "centralindia"
 
 
app = Flask(__name__)
CORS(app, origins="http://localhost:3000")
 
# Define SQLAlchemy engine for each database
user_profiles_engine = create_engine(
    "postgresql://conciergebot:Password1@conciergebot.postgres.database.azure.com:5432/User profiles DB"
)
 
billing_engine = create_engine(
    "postgresql://conciergebot:Password1@conciergebot.postgres.database.azure.com:5432/Billing DB"
)
 
manager_engine = create_engine(
    "postgresql://conciergebot:Password1@conciergebot.postgres.database.azure.com:5432/Manager DB"
)
 
# Use MetaData to reflect existing tables
metadata = MetaData()
 
# Reflect the necessary tables

guests_table = Table("Guest", metadata, autoload_with=user_profiles_engine)
services_table = Table("Services", metadata, autoload_with=manager_engine)
room_table = Table("Room", metadata, autoload_with=manager_engine)
reservation_table = Table("Reservation", metadata, autoload_with=manager_engine)
preferences_table = Table("Preferances", metadata, autoload_with=user_profiles_engine)
recommendation_table = Table("Recommendation", metadata, autoload_with=manager_engine)
billing_table = Table("Billing", metadata, autoload_with=billing_engine)
staff_table=Table("Staff", metadata, autoload_with=manager_engine)
hotel_table=Table("Hotel", metadata, autoload_with=manager_engine)
booking_table=Table("Booking", metadata, autoload_with=manager_engine)
 
 
# Define a base class for declarative models
Base = declarative_base()
 
# Define SQLAlchemy models for the tables
class Guest(Base):
    __table__ = guests_table
 
    def serialize(self):
        return {
            'Guest_Id': self.Guest_Id,
            'Guest_Name': self.Guest_Name,
            'Guest_address': self.Guest_address,
            'Guest_Phone_Number': self.Guest_Phone_Number,
            'Guest_Gender': self.Guest_Gender,
            'Guest_email': self.Guest_email,
            'Guest_email_password': self.Guest_email_password,
            'Guest_CheckIn_Time':self.Guest_CheckIn_Time,
            'Guest_CheckOut_Time':self.Guest_CheckOut_Time,
            'Id_Proof_Filename':self.Id_Proof_Filename,
            # 'Id_Proof': self.Id_Proof,
            'Id_Proof': base64.b64encode(self.Id_Proof).decode('utf-8') if self.Id_Proof else None,
            # Add more fields as needed
        }
 
 
class Services(Base):
    __table__ = services_table
 
    def serialize(self):
        return{
             'Service_Id':self.Service_Id,
             'Service_Name':self.Service_Name,
             'Service_Dept':self.Service_Dept,
             'Service_Status':self.Service_Status,
             'Service_Description':self.Service_Description,
             'Service_Start_Time':self.Service_Start_Time,
             'Service_End_Time':self.Service_End_Time,
             'Room_Id':self.Room_Id,
             'IsCharged':self.IsCharged,
             'Staff_Id':self.Staff_Id,
            # Add more fields as needed
 
        }
 
 
class Room(Base):
    __table__ = room_table
 
    def serialize(self):
        return{
          'Room_Type':self.Room_Type,
          'Room_Price':self.Room_Price,
          'No_of_Beds':self.No_of_Beds,
          'Hotel_Id':self.Hotel_Id,
          'Guest_Id':self.Guest_Id,
          'CheckIn_Time':self.CheckIn_Time,
          'CheckOut_Time':self.CheckOut_Time,
          'Room_Number':self.Room_Number,
          'Room_Id':self.Room_Id,
 
            # Add more fields as needed
        }
 
 
 
class Reservation(Base):
    __table__ = reservation_table
   
    def serialize(self):
        return {
           'Reservation_Id':self.Reservation_Id,
           'Reservation_Type':self.Reservation_Type,
           'Reservation_Status':self.Reservation_Status,
           'Reservation_Description':self.Reservation_Description,
           'Service_Id':self.Service_Id,
            # Add more fields as needed
        }
 
class Preferences(Base):
    __table__ = preferences_table
 
    def serialize(self):
        return {
           'Preferance_Id':self.Preferance_Id,
           'Guest_Id':self.Guest_Id,
           'Preferance_Type':self.Preferance_Type,
           'Preferance_Description':self.Preferance_Description,
            # Add more fields as needed
        }
 
 
 
class Recommendation(Base):
    __table__ = recommendation_table
 
    def serialize(self):
        return{
            'Recommendation_Id':self.Recommendation_Id,
            'Recommendation_Rating':self.Recommendation_Rating,
            'Recommendation_Name':self.Recommendation_Name,
            'Recommendation_Type':self.Recommendation_Type,
            'Hotel_Id':self.Hotel_Id,
            # Add more fields as needed
        }
 
class Billing(Base):
    __table__ = billing_table
 
    def serialize(self):
        return{
         'Billing_Id':self.Billing_Id,
         'Order_Id':self.Order_Id,
         'Order_Name':self.Order_Name,
         'Order_Department':self.Order_Department,
         'Order_Price':self.Order_Price,
         'Billing_Status':self.Billing_Status,
         'Guest_Id':self.Guest_Id,
            # Add more fields as needed
        }
 
class Staff(Base):
    __table__ = staff_table
 
    def serialize(self):
        return{
            'Staff_Id':self.Staff_Id,
            'Staff_Name':self.Staff_Name,
            'Staff_Dept':self.Staff_Dept,
            'Service_Id':self.Service_Id,
            'Staff_Status':self.Staff_Status,
            'Staff_email':self.Staff_email,
            'Staff_email_password':self.Staff_email_password,
            # Add more fields as needed
        }
 
class Hotel(Base):
    __table__ = hotel_table
 
    def serialize(self):
        return {
            
            'Hotel_Id': self.Hotel_Id,
            'Hotel_Address': self.Hotel_Address,
            'Total_Rooms': self.Total_Rooms,
            'Hotel_Name': self.Hotel_Name,
            'Hotel_City': self.Hotel_City,
            'Hotel_State': self.Hotel_State,
           
        }

class Booking(Base):
    __table__ = booking_table
 
    def serialize(self):
        return {
            'Booking_Id': self.Booking_Id,
            'Room_Id': self.Room_Id,
            'Guest_Id': self.Guest_Id,
            'CheckIn_Time':self.CheckIn_Time,
            'CheckOut_Time':self.CheckOut_Time,
            'Hotel_Id': self.Hotel_Id,
           
        }
 
# Create sessionmakers for each database
UserProfilesSession = sessionmaker(bind=user_profiles_engine)
BillingSession = sessionmaker(bind=billing_engine)
ManagerSession = sessionmaker(bind=manager_engine)
 
# Routes using SQLAlchemy
@app.route('/hotel', methods=['GET'])
def get_all_hotels():
    Manager_Session = ManagerSession()
    hotels = Manager_Session.query(Hotel).all()
    Manager_Session.close()
    if hotels:
        return jsonify({'Hotels': [hotels.serialize() for hotels in hotels]})
    else:
        return jsonify({'message': 'No hotels found'}), 404


@app.route('/booking',methods=['POST'])
def booking():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    Manager_Session = ManagerSession()
    booking = Manager_Session.query(Booking).filter(Booking.Guest_Id == guest_id).all()
    Manager_Session.close()
    if booking:
        
        return jsonify({'Booking_data': [booking.serialize() for booking in booking]})
    else:
        return jsonify({'message': 'No hotels found'}), 404
 
 
# GET request for all guests
@app.route('/guest', methods=['GET'])
def get_all_guests():
    user_profiles_session = UserProfilesSession()
    guests = user_profiles_session.query(Guest).all()
 
    if guests:
        user_profiles_session.close()
        return jsonify({'GuestData': [guest.serialize() for guest in guests]})
    else:
        user_profiles_session.close()
        return jsonify({'message': 'No guests found'}), 404

@app.route('/guest_room', methods=['POST'])
def get_guest_room():
    # Get Guest_Id from request JSON
    data = request.get_json()
    guest_id = data.get('Guest_Id')

    # Use the DBSession to interact with the 'Room' table
    session = ManagerSession()

    # Query to get rooms based on Guest_Id
    rooms = session.query(Room).filter(Room.Guest_Id == guest_id).all()

    session.close()

    if rooms:
        # Serialize the room data
        room_data = [room.serialize() for room in rooms]
        return jsonify({'Roomdata': room_data})
    else:
        return jsonify({'message': 'No rooms found for the specified guest'}), 404

@app.route('/id_room', methods=['POST'])
def get_id_room():
    # Get Guest_Id from request JSON
    data = request.get_json()
    room_id = data.get('Room_Id')

    # Use the DBSession to interact with the 'Room' table
    session = ManagerSession()

    # Query to get rooms based on Guest_Id
    rooms = session.query(Room).filter(Room.Room_Id == room_id).all()

    session.close()

    if rooms:
        # Serialize the room data
        room_data = [room.serialize() for room in rooms]
        return jsonify({'Roomdata': room_data})
    else:
        return jsonify({'message': 'No rooms found for the specified roomId'}), 404
 
# GET request for all preferences
@app.route('/preferances', methods=['GET'])
def get_all_preferences():
    user_profiles_session = UserProfilesSession()
    preferences = user_profiles_session.query(Preferences).all()
 
    if preferences:
        user_profiles_session.close()
        return jsonify({'Preferancesdata': [pref.serialize() for pref in preferences]})
    else:
        user_profiles_session.close()
        return jsonify({'message': 'No preferences found'}), 404
   
 
# GET request for all staff
@app.route('/staff', methods=['GET'])
def get_all_staff():
    manager_session = ManagerSession()
    staff_members = manager_session.query(Staff).all()
    manager_session.close()
    if staff_members:
        return jsonify({'StaffData': [staff.serialize() for staff in staff_members]})
    else:
        return jsonify({'message': 'No staff members found'}), 404
 

@app.route('/room_fc', methods=['GET'])
def get_room():
    hotel_id = request.args.get('Hotel_Id')
 
    manager_session = ManagerSession()
 
    # Query to get rooms based on Hotel_Id where Guest_Id is not null, ordered by Room_Number
    rooms = manager_session.query(Room).filter(Room.Hotel_Id == hotel_id, Room.Guest_Id.isnot(None)).order_by(Room.Room_Number.asc()).all()
 
    # Serialize the results using the existing 'serialize' method
    room_data = [room.serialize() for room in rooms]
    manager_session.close()
    return jsonify({"RoomData": room_data})

@app.route('/room_empty_fc', methods=['GET'])
def get_room_emp():
    hotel_id = request.args.get('Hotel_Id')
    empty_rooms =  get_room_empty(hotel_id)
    if empty_rooms:
        return jsonify({"EmptyRoomData": empty_rooms})
    else:
        return jsonify({'message': 'No empty rooms found for the specified hotel'}), 404

def get_room_empty(hotel_id):
 
    # Use the ManagerSession to interact with the 'Room' table
    manager_session = ManagerSession()
 
    # Query to get empty rooms based on Hotel_Id
    empty_rooms = manager_session.query(Room).\
        filter(and_(Room.Hotel_Id == hotel_id, Room.Guest_Id.is_(None))).\
        order_by(Room.Room_Number.asc()).all()
    manager_session.close()
    return [roms.serialize() for roms in empty_rooms]
 

@app.route('/room', methods=['GET'])
def get_rooms_by_date():
    hotel_id = request.args.get('Hotel_Id')
    date = request.args.get('date')

    manager_session = ManagerSession()

    # Convert the date string to a datetime object
    #date_obj = datetime.datetime.strptime(date, '%Y-%m-%d')

    # Query to get rooms based on Hotel_Id and date from Booking table
    bookings = manager_session.query(Booking).filter(
        Booking.Hotel_Id == hotel_id,
        Booking.CheckIn_Time <= date,
        Booking.CheckOut_Time >= date
    ).all()

    # Get the Room_Id values from the bookings
    room_ids = [booking.Room_Id for booking in bookings]

    # Query to get rooms from Room table based on Room_Id values
    rooms = manager_session.query(Room).filter(Room.Room_Id.in_(room_ids)).all()

    room_data = [room.serialize() for room in rooms]
    manager_session.close()

    return jsonify({"RoomData": room_data})

@app.route('/room_empty', methods=['GET'])
def get_empty_rooms_by_date():
    hotel_id = request.args.get('Hotel_Id')
    date = request.args.get('date')

    manager_session = ManagerSession()

    # Convert the date string to a datetime object
    #date_obj = datetime.datetime.strptime(date, '%Y-%m-%d')

    # Query to get rooms based on Hotel_Id and date from Booking table
    bookings = manager_session.query(Booking).filter(
        Booking.Hotel_Id == hotel_id,
        Booking.CheckIn_Time <= date,
        Booking.CheckOut_Time >= date
    ).all()

    # Get the Room_Id values from the bookings
    room_ids = [booking.Room_Id for booking in bookings]

    # Query to get empty rooms from Room table based on Room_Id values
    empty_rooms = manager_session.query(Room).filter(~Room.Room_Id.in_(room_ids)).all()

    empty_room_data = [room.serialize() for room in empty_rooms]
    manager_session.close()

    return jsonify({"EmptyRoomData": empty_room_data})

# @app.route('/services_staff', methods=['GET'])
# def get_services_staff():
#     staff_id = None

#     if request.is_json:
#         data = request.get_json()
#         staff_id = data.get('Staff_Id')
#     else:
#         staff_id = request.args.get('Staff_Id')

    
#     return get_services_by_staff(staff_id)
    

# def get_services_by_staff(staff_id):
#     # Assuming there's a StaffServices table that connects Staff and Services
#     manager_session = ManagerSession()
#     services = manager_session.query(Services).filter(Services.Staff_Id == staff_id).all()
#     manager_session.close()
#     return jsonify({"ServicesData": [service.serialize() for service in services]})

   
@app.route('/services', methods=['GET'])
def get_services_fun():
   
    if request.is_json:
        data = request.get_json()
        room_id = data.get('Room_Id')
        
    else:
        room_id = request.args.get('Room_Id')
    print(room_id)
    # Use the ManagerSession to interact with the 'Services' table
    return get_services(room_id)
    # if services:
    #     return jsonify({"ServicesData": [service.serialize() for service in services]})
    # else:
    #     return jsonify({'message': 'No services found for the specified room'}), 404  

def get_services(room_id):
    manager_session = ManagerSession()

    services = manager_session.query(Services).filter(Services.Room_Id == room_id).order_by(Services.Service_Id.desc()).all()
    manager_session.close()
    return jsonify({"ServicesData": [service.serialize() for service in services]})

# from flask import jsonify

@app.route('/get_room_details', methods=['GET'])
def get_room_details():
    if request.is_json:
        data = request.get_json()
        room_id = data.get('Room_Id')
    else:
        room_id = request.args.get('Room_Id')

    if not room_id:
        return jsonify({'error': 'Room_Id is required'}), 400


    manager_session = ManagerSession()

    # Query to get the room by room_id
    rooms = manager_session.query(Room).filter_by(Room_Id = room_id).all()

    manager_session.close()

    if rooms:
        return jsonify({'Room_Details': [room.serialize() for room in rooms]})  # Assuming Room has a serialize method
    else:
        return jsonify({'message': 'No room found for the specified Room_Id'}), 404



@app.route('/services_staff', methods=['GET'])
def get_services_staff():
    staff_id = None

    if request.is_json:
        data = request.get_json()
        staff_id = data.get('Staff_Id')
    else:
        staff_id = request.args.get('Staff_Id')

    
    return get_services_by_staff(staff_id)
    

def get_services_by_staff(staff_id):
    # Assuming there's a StaffServices table that connects Staff and Services
    manager_session = ManagerSession()
    services = manager_session.query(Services).filter(Services.Staff_Id == staff_id).all()
    manager_session.close()
    return jsonify({"ServicesData": [service.serialize() for service in services]})

@app.route('/insert_service', methods=['POST'])
def insert_service():
    data = request.get_json()
    service_name = data.get('Service_Name')
    service_dept = data.get('Service_Dept')
    service_status = data.get('Service_Status')
    service_description=data.get('Service_Description')
    room_id = data.get('Room_Id')

    # Use the ManagerSession to interact with the 'Services' and 'Room' tables
    manager_session = ManagerSession()

    try:
        # Create a new Services instance
        new_service = Services(
            Service_Name=service_name,
            Service_Dept=service_dept,
            Service_Status=service_status,
            Service_Description=service_description,
            Room_Id=room_id,  # Assign the Room instance to the relationship
            Service_Start_Time=datetime.now() # Assign the Room instance to the relationship
        )

        # Add the new service to the session
        manager_session.add(new_service)

        # Commit the changes to the database
        manager_session.commit()

        # Access the service_id after committing the changes
        temp = new_service.Service_Id

        # Check if the service department is "Booking"
        if service_dept == "Cab Booking":
            # Create a new Reservation instance
            new_reservation = Reservation(
                Reservation_Type=service_name,
                Reservation_Status=service_status,
                Service_Id=temp  # Assign the Service instance to the relationship
            )

            # Add the new reservation to the session
            manager_session.add(new_reservation)

            # Commit the changes to the database
            manager_session.commit()

        return jsonify({'message': 'Service and Reservation updated successfully', 'service_id': temp})

    except Exception as e:
        # Handle exceptions, roll back changes, and return an error response
        manager_session.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the session in the 'finally' block to ensure it's always closed
        manager_session.close()
    #     return jsonify({'message': f'Room with Room_ID {room_id} not found'}), 404



@app.route('/post_guest', methods=['POST'])
def post_guest():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    # guest_id = request.args.get('Guest_Id')

    # Use the UserProfilesSession to interact with the 'Guest' table
    user_profiles_session = UserProfilesSession()
 
    # Query to get guest details based on Guest_Id
    guest = user_profiles_session.query(Guest).filter_by(Guest_Id=guest_id).all()
    user_profiles_session.close()
    if guest:
        return jsonify({'Guest_Details': [g.serialize() for g in guest]})
    else:
        return jsonify({'message': 'No services found for the specified guest'}), 404


@app.route('/update_service_end_time', methods=['POST'])
def update_service_end_time():
    try:
        # Use the Session to interact with the 'Services' table
        manager_session = ManagerSession()

        # Retrieve the Services instance based on the service ID provided in the request body
        service_id = request.json.get('service_id')
        service = manager_session.query(Services).get(service_id)

        # Check if the service exists
        if service:
            # Update Service_End_Time to the provided value
            service_end_time = request.json.get('service_end_time')
            service.Service_End_Time = service_end_time

            # Commit the changes to the database
            manager_session.commit()

            return jsonify({'message': f'Service {service_id} updated successfully'})

        else:
            return jsonify({'error': f'Service with Service_Id {service_id} not found'}), 404

    except Exception as e:
        # Handle exceptions, roll back changes, and return an error response
        manager_session.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the session in the 'finally' block to ensure it's always closed
        manager_session.close()
    
    
# @app.route('/update_service_end_time', methods=['POST'])
# def update_service_end_time():
#     try:
#         # Use the Session to interact with the 'Services' table
#         manager_session = ManagerSession()

#         # Retrieve the Services instance based on the service ID provided in the request body
#         service_id = request.json.get('service_id')
#         service = manager_session.query(Services).get(service_id)

#         # Check if the service exists
#         if service:
#             # Update Service_End_Time to the provided value
#             service_end_time = request.json.get('service_end_time')
#             service.Service_End_Time = service_end_time

#             # Commit the changes to the database
#             manager_session.commit()

#             return jsonify({'message': f'Service {service_id} updated successfully'})

#         else:
#             return jsonify({'error': f'Service with Service_Id {service_id} not found'}), 404

#     except Exception as e:
#         # Handle exceptions, roll back changes, and return an error response
#         manager_session.rollback()
#         return jsonify({'error': str(e)}), 500

#     finally:
#         # Close the session in the 'finally' block to ensure it's always closed
#         manager_session.close()
    
    
@app.route('/insert_preferences', methods=['POST'])
def insert_preferences():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    preferance_type = data.get('Preferance_Type')
    preferance_description = data.get('Preferance_Description')
 
    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()
 
    # Create a new Preferences instance
    new_preference = Preferences(
        Guest_Id=guest_id,
        Preferance_Type=preferance_type,
        Preferance_Description=preferance_description
    )
 
    # Add the new preference to the session
    user_profiles_session.add(new_preference)
 
    # Commit the changes to the databa
    user_profiles_session.commit()
    user_profiles_session.close()
    return jsonify({'message': 'Preference added successfully'})

@app.route('/services_user', methods=['GET'])
def get_services_user_fun():
    guest_id = request.args.get('Guest_Id')

    # Get services based on Guest_Id
    serialized_data = get_services_user(guest_id)

    # Check for retrieved data
    if serialized_data:
        # Serialize the data
        
        # Return the serialized data
        return jsonify({'ServicesUserData': serialized_data})
    else:
        # Return no-data message with 404 status code
        return jsonify({'message': 'No services found for the specified guest'}), 404
    # Use the ManagerSession to interact with the 'Services' and 'Room' tables
def get_services_user(guest_id):
    manager_session = ManagerSession()

    # Query to get services based on Guest_Id
    services_user_data = manager_session.query(Services).\
        join(Room, Services.Room_Id == Room.Room_Id).\
        filter(Room.Guest_Id == guest_id).\
        order_by(Services.Service_Id.desc()).all()

    # Close the session
    manager_session.close()
    serialized_data = [service.serialize() for service in services_user_data]
    return serialized_data

@app.route('/reservation', methods=['POST'])
def index_reservation():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
   
    # Use the ManagerSession to interact with the 'Reservation', 'Services', and 'Room' tables
    manager_session = ManagerSession()
 
    # Query to get reservations based on Guest_Id
    reservations = manager_session.query(Reservation).\
        join(Services, Reservation.Service_Id == Services.Service_Id).\
        join(Room, Services.Room_Id == Room.Room_Id).\
        filter(Room.Guest_Id == guest_id).all()
    manager_session.close()
    if reservations:
        return jsonify({'Reservation_Details': [res.serialize() for res in reservations]})
    else:
        return jsonify({'message': 'failed'}), 401
       
   
   
 
@app.route('/preference', methods=['POST'])
def index_preference():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
 
    user_profiles_session = UserProfilesSession()
 
    # Query to get recommendations based on Guest_Id
    preferences = user_profiles_session.query(Preferences).filter_by(Guest_Id=guest_id).all()
    user_profiles_session.close()
    if preferences:
        return jsonify({'Preferences_Details': [pre.serialize() for pre in preferences]})
    else:
        return jsonify({'message': 'failed'}), 401    
    
@app.route('/cab_preference', methods=['POST'])
def index_cab_preference():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    preference_type="Cab Preference"
 
    user_profiles_session = UserProfilesSession()
 
    # Query to get recommendations based on Guest_Id
    preferences = user_profiles_session.query(Preferences).filter_by(Guest_Id=guest_id,Preferance_Type=preference_type).all()
 
    if preferences:
        return jsonify({'Cab_Preference': [pre.serialize() for pre in preferences]})
    else:
        return jsonify({'message': 'failed'}), 401 
    
@app.route('/room_preference', methods=['POST'])
def index_room_preference():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    preference_type="Room Preference"

    user_profiles_session = UserProfilesSession()
 
    # Query to get recommendations based on Guest_Id
    preferences = user_profiles_session.query(Preferences).filter_by(Guest_Id=guest_id,Preferance_Type=preference_type).all()
 
    if preferences:
        return jsonify({'Room_Preference': [pre.serialize() for pre in preferences]})
    else:
        return jsonify({'message': 'failed'}), 401 
    
@app.route('/food_preference', methods=['POST'])
def index_food_preference():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    preference_type="Food Preference"
 
    user_profiles_session = UserProfilesSession()
 
    # Query to get recommendations based on Guest_Id
    preferences = user_profiles_session.query(Preferences).filter_by(Guest_Id=guest_id,Preferance_Type=preference_type).all()
 
    if preferences:
        return jsonify({'Food_Preference': [pre.serialize() for pre in preferences]})
    else:
        return jsonify({'message': 'failed'}), 401 

# @app.route('/recommendation', methods=[ 'POST'])
# def index_recommend():
#     # if request.method == 'GET':
#     #     # Handle GET request
       

#     #     # Use the ManagerSession to interact with the 'Recommendation' table
#     #     Manager_Session = ManagerSession()
#     #     # Query to get recommendations based on Hotel_Id
#     #     recommendations = Manager_Session.query(Recommendation).all()

#     #     if recommendations:
#     #         return jsonify({'Recommendation_Details': [rec.serialize() for rec in recommendations]})
#     #     else:
#     #         return jsonify({'message': 'failed'}), 401
#     # elif request.method == 'POST':
#         # Handle POST request
#     data = request.get_json()
#     hotel_id = data.get('Hotel_Id')
        
 
#     # Use the ManagerSession to interact with the 'Recommendation' table
#     recommendations = index_recommendation(hotel_id)
#     if recommendations:
#         return recommendations
#     else:
#        return jsonify({'message': 'failed'}), 401 
#         # Your POST request handling logic goes here
        

@app.route('/recommendation', methods=['GET', 'POST'])
def index_recommendation():
    if request.method == 'GET':
        # Handle GET request
       

        # Use the ManagerSession to interact with the 'Recommendation' table
        Manager_Session = ManagerSession()
        # Query to get recommendations based on Hotel_Id
        recommendations = Manager_Session.query(Recommendation).all()

        if recommendations:
            return jsonify({'Recommendation_Details': [rec.serialize() for rec in recommendations]})
        else:
            return jsonify({'message': 'failed'}), 401
    elif request.method == 'POST':
        # Handle POST request
        data = request.get_json()
        hotel_id = data.get('Hotel_Id')
        
 
    # Use the ManagerSession to interact with the 'Recommendation' table
        Manager_Session = ManagerSession()
    # Query to get recommendations based on Hotel_Id
        recommendations = Manager_Session.query(Recommendation).filter_by(Hotel_Id=hotel_id).all()
 
        if recommendations:
           return jsonify({'Recommendation_Details': [rec.serialize() for rec in recommendations]})
        else:
           return jsonify({'message': 'failed'}), 401 
        # Your POST request handling logic goes here

    return jsonify({'message': 'success'})




# @app.route('/recommendation', methods=['GET', 'POST'])
# def index_recomm():
#     if request.method == 'GET':
#         # Handle GET request
#         hotel_id = request.args.get('Hotel_Id')

#         recommendations = index_recommendation(hotel_id)

#         if recommendations:
#             return recommendations
#         else:
#             return jsonify({'message': 'failed'}), 401
#     elif request.method == 'POST':
#         # Handle POST request
#         data = request.get_json()
#         hotel_id = data.get('Hotel_Id')
        
#         recommendations = index_recommendation(hotel_id)
 
#         if recommendations:
#            return recommendations
#         else:
#            return jsonify({'message': 'failed'}), 401 
#         # Your POST request handling logic goes here

#     return jsonify({'message': 'success'})

# def index_recommendation(hotel_id):
#     Manager_Session = ManagerSession()
#     # Query to get recommendations based on Hotel_Id
#     recommendations = Manager_Session.query(Recommendation).filter_by(Hotel_Id=hotel_id).all()
#     return [rec.serialize() for rec in recommendations]
 

    

     
 
@app.route('/billing', methods=['POST'])
def get_billing_by_guest_id_fun():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
 
    
    billing_info = get_billing_by_guest_id(guest_id)

    if billing_info:
        return jsonify({'Bills': billing_info})
    else:
        return jsonify({'message': 'No billing information found for the specified guest'}), 404

def get_billing_by_guest_id(guest_id):
    billing_session = BillingSession()

    # Query to get billing information based on Guest_Id
    billing_info = billing_session.query(Billing).filter_by(Guest_Id=guest_id).all()

    billing_session.close()

    # Serialize the data
    serialized_data = [bill.serialize() for bill in billing_info]

    return serialized_data
 
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
 
    user_profiles_session = UserProfilesSession()
 
    # Query to get the guest based on email and password
    guest = user_profiles_session.query(Guest).filter_by(Guest_email=email, Guest_email_password=password).first()
    user_profiles_session.close()
    if guest:
        return jsonify({'Guest_Details': guest.serialize()})
    else:
        return jsonify({'message': 'Login failed'}), 401



    

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    guest_Name = data.get('Guest_Name')
    guest_Phone_Number = data.get('Guest_Phone_Number')
    guest_Email = data.get('Guest_Email')
    guest_Email_Password = data.get('Guest_Email_Password')
 
    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()
 
    # Create a new Preferences instance
    new_guest = Guest(
        Guest_Name=guest_Name,
        Guest_Phone_Number=guest_Phone_Number,
        Guest_email=guest_Email,
        Guest_email_password=guest_Email_Password
    )
 
    # Add the new preference to the session
    user_profiles_session.add(new_guest)
 
    # Commit the changes to the database
    user_profiles_session.commit()
    user_profiles_session.close()
    return jsonify({'message': 'Guest added successfully'})



@app.route('/create_preference', methods=['POST'])
def create_preference():
    data = request.get_json()
    
    guest_Email = data.get('Guest_Email')
 
    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()
    guest = user_profiles_session.query(Guest).filter_by(Guest_email=guest_Email).first()

    if not guest:
        user_profiles_session.close()
        return jsonify({'message': 'Guest not found'}), 404
 
    # Create a new Preferences instance
    cab_pref = Preferences(
       Guest_Id=guest.Guest_Id,
       Preferance_Type="Cab Preference",
       #Preferance_Description=""
    )
    room_pref = Preferences(
       Guest_Id=guest.Guest_Id,
       Preferance_Type="Room Preference",
       #Preferance_Description=""
    )
    food_pref = Preferences(
       Guest_Id=guest.Guest_Id,
       Preferance_Type="Food Preference",
       #Preferance_Description=""
    )
 
    # Add the new preference to the session
    user_profiles_session.add(cab_pref)
    user_profiles_session.add(room_pref)
    user_profiles_session.add(food_pref)

    # Commit the changes to the database
    user_profiles_session.commit()

    user_profiles_session.close()

    return jsonify({'message': 'Preferences added successfully'})
 
 
@app.route('/city', methods=['POST'])
def city():
    data = request.get_json()
    state = data.get('state')
 
    manager_session = ManagerSession()
 
    # Query to get distinct hotel cities based on state
    hotels = manager_session.query(Hotel.Hotel_City).filter_by(Hotel_State=state).distinct().all()
 
    # Extract cities from the result
    cities = [city[0] for city in hotels]
    manager_session.close()
    return jsonify({'CityData': cities})

# @app.route('/update_service_end_time', methods=['POST'])
# def update_service_end_time():
#     try:
#         # Use the Session to interact with the 'Services' table
#         manager_session = ManagerSession()

#         # Retrieve the Services instance based on the service ID provided in the request body
#         service_id = request.json.get('service_id')
#         service = manager_session.query(Services).get(service_id)

#         # Check if the service exists
#         if service:
#             # Update Service_End_Time to the provided value
#             service_end_time = request.json.get('service_end_time')
#             service.Service_End_Time = service_end_time

#             # Commit the changes to the database
#             manager_session.commit()

#             return jsonify({'message': f'Service {service_id} updated successfully'})

#         else:
#             return jsonify({'error': f'Service with Service_Id {service_id} not found'}), 404

#     except Exception as e:
#         # Handle exceptions, roll back changes, and return an error response
#         manager_session.rollback()
#         return jsonify({'error': str(e)}), 500

#     finally:
#         # Close the session in the 'finally' block to ensure it's always closed
#         manager_session.close()

@app.route('/book_room', methods=['POST'])
def book_room():
    try:
        data = request.get_json()
        room_id = data.get('Room_Id')
        guest_id = data.get('Guest_Id')
        hotel_id = data.get('Hotel_Id')
        checkin_date = data.get('CheckIn_Time')
        checkout_date = data.get('CheckOut_Time')

        # Use the ManagerSession to interact with the 'Room' table
        manager_session = ManagerSession()

        # Query to get the room by room_number
        room = manager_session.query(Room).filter(Room.Room_Id == room_id).first()

        if room:
            # Update the room's Guest_Id
            room.Guest_Id = guest_id

            # Commit the changes to the database
            manager_session.commit()

            # Create a new booking
            new_booking = Booking(
                Room_Id=room_id,
                Hotel_Id=hotel_id,
                Guest_Id=guest_id,
                CheckIn_Time=checkin_date,
                CheckOut_Time=checkout_date
            )

            # Add the new booking to the database
            manager_session.add(new_booking)

            # Commit the changes to the database
            manager_session.commit()

            # Close the session
            manager_session.close()

            # Use the UserProfilesSession to interact with the 'Guest' table
            user_profiles_session = UserProfilesSession()

            # Query to get the guest by guest_id
            guest = user_profiles_session.query(Guest).filter(Guest.Guest_Id == guest_id).first()

            if guest:
                # Update guest's CheckIn_Time and CheckOut_Time
                guest.Guest_CheckIn_Time = checkin_date
                guest.Guest_CheckOut_Time = checkout_date

                # Commit the changes to the UserProfiles database
                user_profiles_session.commit()

                # Close the UserProfiles session
                user_profiles_session.close()

                return '1'  # Successful booking

        return 'Room not found'  # If the room with the given room_id is not found

    except Exception as e:
        return str(e)  # Return the error message as a response  

# @app.route('/room_availability', methods=['POST'])
# def get_available_rooms():
#     # Extract input parameters from the request
#     room_type = request.json['Room_Type']
#     num_beds = request.json['No_of_Beds']
#     checkin_date = request.json['CheckIn_Time']
#     checkout_date = request.json['CheckOut_Time']
#     hotel_id = request.json['Hotel_Id']

#     # Create a database session
#     session = ManagerSession()

#     availability_check = or_(
#         not_(Room.CheckIn_Time.between(checkin_date, checkout_date)),
#         not_(Room.CheckOut_Time.between(checkin_date, checkout_date))
#         # Room.CheckIn_Time.is_(None),
#         # Room.CheckOut_Time.is_(None)
#     )
    
#     # Query the Room table
#     room_ids = session.query(Room.Room_Id) \
#         .filter(Room.Room_Type == room_type) \
#         .filter(Room.No_of_Beds >= num_beds) \
#         .filter(Room.Hotel_Id == hotel_id) \
#         .filter(availability_check) \
#         .all()

#     # Convert room IDs to a list
#     available_room_ids = []
#     for room in room_ids:
#         available_room_ids.append(room.Room_Id)

#     # Return the list of available room IDs
#     return jsonify({'available_room_ids': available_room_ids})


@app.route('/room_availability', methods=['POST'])
def get_available():
    try:
        # Extract input parameters from the request
        room_type = request.json['Room_Type']
        num_beds = request.json['No_of_Beds']
        checkin_date = request.json['CheckIn_Time']
        checkout_date = request.json['CheckOut_Time']
        hotel_id = request.json['Hotel_Id']
    except KeyError as e:
        return jsonify({'error': f'Missing required parameter: {e}'}), 400
    except Exception as e:
        return jsonify({'error': f'Error processing request: {e}'}), 500

    # Create a database session
    available_room_ids = get_available_rooms(room_type,num_beds,checkin_date,checkout_date,hotel_id)

        # Return the list of available room IDs
    return jsonify({'available_room_ids': available_room_ids})
    
def get_available_rooms(room_type,num_beds,checkin_date,checkout_date,hotel_id):
    with ManagerSession() as session:
        print(room_type,"--->",type(room_type))
        print(num_beds,"--->",type(num_beds))
        print(hotel_id,"--->",type(hotel_id))
        print(checkin_date,"--->",type(checkin_date))
        print(checkout_date,"--->",type(checkout_date))
        # Subquery to get booked room IDs during the specified time frame
        booked_rooms_subquery = session.query(Booking.Room_Id) \
            .filter(Booking.Hotel_Id == hotel_id) \
            .filter(and_(
                Booking.CheckIn_Time < checkout_date,
                Booking.CheckOut_Time > checkin_date
            )) \
            .subquery()
        print("Query--->",booked_rooms_subquery)
        # Query the Room table excluding booked rooms
        available_rooms_query = session.query(Room.Room_Id) \
            .filter(Room.Room_Type == room_type) \
            .filter(Room.No_of_Beds >= num_beds) \
            .filter(Room.Hotel_Id == hotel_id) \
            .filter(~Room.Room_Id.in_(booked_rooms_subquery.select())) \
            .all()

        # Convert room IDs to a list
        available_room_ids = [room.Room_Id for room in available_rooms_query]
        print("Rooms--->",available_room_ids)
    return available_room_ids


 
@app.route('/hotelname', methods=['POST'])
def hotel_name():
    data = request.get_json()
    state = data.get('state')
    city = data.get('city')
 
    manager_session = ManagerSession()
 
    # Query to get hotels based on state and city
    hotels = manager_session.query(Hotel).filter_by(Hotel_State=state, Hotel_City=city).all()
 
    # Serialize the results using the existing 'serialize' method
    hotel_data = [hotel.serialize() for hotel in hotels]
    manager_session.close()
    return jsonify({'HotelData': hotel_data})
 
@app.route('/service_update', methods=['PUT'])
def service_update():
    data = request.get_json()
    service_id = data.get('Service_Id')
    service_name = data.get('Service_Name')
    service_dept = data.get('Service_Dept')
    service_status = data.get('Service_Status')
    service_description=data.get('Service_Description')
    print(service_status)
    # Use the ManagerSession to interact with the 'Services' table
    manager_session = ManagerSession()
 
    # Query to get the service by service_id
    service_to_update = manager_session.query(Services).filter_by(Service_Id=service_id).first()
 
    # Update the service attributes
    if service_to_update:
        service_to_update.Service_Name = service_name
        service_to_update.Service_Dept = service_dept
        service_to_update.Service_Status = service_status
        service_to_update.Service_Description=service_description
 
        # Commit the changes
        manager_session.commit()
        manager_session.close()
        return jsonify({"Message": "Updated Successfully"})
    else:
        manager_session.close()
        return jsonify({"Message": "Service not found"}), 404
   
@app.route('/service_assign', methods=['PUT'])
def service_assign():
    data = request.get_json()
    service_id = data.get('Service_Id')
    staff_id = data.get('Staff_Id')
 
    # Use the ManagerSession to interact with the 'Services' table
    manager_session = ManagerSession()
 
    # Query to get the service by service_id
    service_to_assign = manager_session.query(Services).filter_by(Service_Id=service_id).first()
 
    # Update the service's staff assignment
    if service_to_assign:
        service_to_assign.Staff_Id = staff_id
 
        # Commit the changes
        manager_session.commit()
        manager_session.close()
        return jsonify({"Message": "Updated Successfully"})
    else:
        manager_session.close()
        return jsonify({"Message": "Service not found"}), 404
 
@app.route('/staff_update', methods=['PUT'])
def staff_update():
    data = request.get_json()
    staff_id = data.get('Staff_Id')
    staff_name = data.get('Staff_Name')
    staff_dept = data.get('Staff_Dept')
    staff_status = data.get('Staff_Status')
 
    # Use the ManagerSession to interact with the 'Staff' table
    manager_session = ManagerSession()
 
    # Query to get the staff member by staff_id
    staff_to_update = manager_session.query(Staff).filter_by(Staff_Id=staff_id).first()
 
    # Update the staff member's details
    if staff_to_update:
        staff_to_update.Staff_Name = staff_name
        staff_to_update.Staff_Dept = staff_dept
        staff_to_update.Staff_Status = staff_status
 
        # Commit the changes
        manager_session.commit()
        manager_session.close()
        return jsonify({"Message": "Updated Successfully"})
    else:
        manager_session.close()
        return jsonify({"Message": "Staff member not found"}), 404  
   
@app.route('/room_update', methods=['PUT'])
def room_update():
    data = request.get_json()
    room_number = data.get('Room_Number')
    room_price = data.get('Room_Price')
    room_type = data.get('Room_Type')
 
    # Use the ManagerSession to interact with the 'Room' table
    manager_session = ManagerSession()
 
    # Query to get the room by room_number
    room_to_update = manager_session.query(Room).filter_by(Room_Number=room_number).first()
 
    # Update the room's details
    if room_to_update:
        room_to_update.Room_Price = room_price
        room_to_update.Room_Type = room_type
 
        # Commit the changes
        manager_session.commit()
        manager_session.close()
        return jsonify({"Message": "Updated Successfully"})
    else:
        manager_session.close()
        return jsonify({"Message": "Room not found"}), 404    
# Similar conversion for other routes (post_guest, index_preference, index_recommendation, index_billing)
 
# Update route for Billing
@app.route('/bill_update', methods=['PUT'])
def bill_upd():
    data = request.get_json()
    billing_id = data.get('Billing_Id')
    order_name = data.get('Order_Name')
    order_department = data.get('Order_Department')
    order_price = data.get('Order_Price')
    billing_status = data.get('Billing_Status')
 
    # Use the BillingSession to interact with the 'Billing' table
    billing_session = BillingSession()
 
    # Query to get the billing entry by billing_id
    billing_to_update = bill_update(billing_id,order_name,order_department,order_price,billing_status)
    return  billing_to_update
    

def bill_update(billing_id,order_name,order_department,order_price,billing_status):
    # Use the BillingSession to interact with the 'Billing' table
    print(billing_id," >",order_name," >",order_department," >",order_price," >",billing_status)
    billing_session = BillingSession()
 
    # Query to get the billing entry by billing_id
    billing_to_update = billing_session.query(Billing).filter_by(Billing_Id=billing_id).first()
 
    # Update the billing details
    if billing_to_update:
        billing_to_update.Order_Name = order_name
        billing_to_update.Order_Department = order_department
        billing_to_update.Order_Price = order_price
        billing_to_update.Billing_Status = billing_status
 
        # Commit the changes
        billing_session.commit()
        billing_session.close()
        return jsonify({"Message": "Updated Successfully", "data": billing_to_update})
    else:
        return jsonify({"Message": "Billing entry not found"}), 404
    

 
# Update route for Recommendation
@app.route('/recommendation_update', methods=['PUT'])
def recommendation_update():
    data = request.get_json()
    recommendation_id = data.get('Recommendation_Id')
    recommendation_name = data.get('Recommendation_Name')
    recommendation_type = data.get('Recommendation_Type')
    recommendation_rating = data.get('Recommendation_Rating')
 
    # Use the ManagerSession to interact with the 'Recommendation' table
    Manager_Session = ManagerSession()
 
    # Query to get the recommendation entry by recommendation_id
    recommendation_to_update =  Manager_Session.query(Recommendation).filter_by(Recommendation_Id=recommendation_id).first()
 
    # Update the recommendation details
    if recommendation_to_update:
        recommendation_to_update.Recommendation_Name = recommendation_name
        recommendation_to_update.Recommendation_Type = recommendation_type
        recommendation_to_update.Recommendation_Rating = recommendation_rating
 
        # Commit the changes
        Manager_Session.commit()
        Manager_Session.close()
        return jsonify({"Message": "Updated Successfully"})
    else:
        return jsonify({"Message": "Recommendation entry not found"}), 404

def sample(num1):
    return num1*2
 
def sample(num1):
    return num1*2
 
# Update route for Reservation
@app.route('/reservation_update', methods=['PUT'])
def reservation_update():
    data = request.get_json()
    reservation_id = data.get('Reservation_Id')
    reservation_type = data.get('Reservation_Type')
    reservation_status = data.get('Reservation_Status')
    reservation_description = data.get('Reservation_Description')
 
    # Use the ManagerSession to interact with the 'Reservation' table
    manager_session = ManagerSession()
 
    # Query to get the reservation entry by reservation_id
    reservation_to_update = manager_session.query(Reservation).filter_by(Reservation_Id=reservation_id).first()
 
    # Update the reservation details
    if reservation_to_update:
        reservation_to_update.Reservation_Type = reservation_type
        reservation_to_update.Reservation_Status = reservation_status
        reservation_to_update.Reservation_Description = reservation_description
 
        # Commit the changes
        manager_session.commit()
        manager_session.close()
        return jsonify({"Message": "Updated Successfully"})
    else:
        manager_session.close()
        return jsonify({"Message": "Reservation entry not found"}), 404
 
# Update route for Preference
@app.route('/preference_update', methods=['PUT'])
def preference_update():
    data = request.get_json()
    preference_id = data.get('Preferance_Id')
    food_preference = data.get('Food_Preferance')
    medical_condition_preference = data.get('Medical_Condition_Preferance')
    cab_preference = data.get('Cab_Preferance')
    room_preference = data.get('Room_Preferance')
    allergic_to = data.get('Allergic_to')
 
    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()
 
    # Query to get the preference entry by preference_id
    preference_to_update = user_profiles_session.query(Preferences).filter_by(Preferance_Id=preference_id).first()
 
    # Update the preference details
    if preference_to_update:
        preference_to_update.Food_Preferance = food_preference
        preference_to_update.Medical_Condition_Preferance = medical_condition_preference
        preference_to_update.Cab_Preferance = cab_preference
        preference_to_update.Room_Preferance = room_preference
        preference_to_update.Allergic_to = allergic_to
 
        # Commit the changes
        user_profiles_session.commit()
        user_profiles_session.close()
        return jsonify({"Message": "Updated Successfully"})
    else:
        return jsonify({"Message": "Preference entry not found"}), 404
    
# Update route for Preference
@app.route('/update_preferences', methods=['PUT'])
def update_preferences():
    data = request.get_json()
    guest_id=data.get('Guest_Id')
    preferance_type =data.get('Preferance_Type')
    preferance_description = data.get('Preferance_Description')

 
    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()
 
    # Query to get the preference entry by preference_id
    pref = user_profiles_session.query(Preferences).filter_by(Guest_Id=guest_id, Preferance_Type=preferance_type).first()

    if pref:
        pref.Preferance_Description = preferance_description
        user_profiles_session.commit()
        user_profiles_session.close()
        return jsonify({"message": "Preference updated successfully"}), 200
    else:
        return jsonify({"error": "Guest or Preference not found"}), 404

# @app.route('/guest_room', methods=['POST'])
# def get_guest_room():
#     # Get Guest_Id from request JSON
#     data = request.get_json()
#     guest_id = data.get('Guest_Id')
 
#     # Use the DBSession to interact with the 'Room' table
#     session = ManagerSession()
 
#     # Query to get rooms based on Guest_Id
#     rooms = session.query(Room).filter(Room.Guest_Id == guest_id).all()
 
#     session.close()
 
#     if rooms:
#         # Serialize the room data
#         room_data = [room.serialize() for room in rooms]
#         return jsonify({'Roomdata': room_data})
#     else:
#         return jsonify({'message': 'No rooms found for the specified guest'}), 404


 
@app.route('/adminlogin', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
 
    # Use the ManagerSession to interact with the 'Staff' table
    manager_session = ManagerSession()
 
    # Query to get staff based on email and password
    staff = manager_session.query(Staff).filter_by(Staff_email=email, Staff_email_password=password).first()
    manager_session.close()
    if staff:
        return jsonify({'Staff_Details': staff.serialize()})
    else:
        return jsonify({'message': 'Login failed'}), 401
    
# def allowed_file(filename):
#     return "." in filename and filename.rsplit(".", 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]

 





@app.route('/upload_id_proof', methods=['PUT'])

def update_id_proof():
    try:
        guest_id = int(request.form['Guest_Id'])
        file = request.files['file']
        filename = request.form.get('filename')
        user_profiles_session = UserProfilesSession()

        guest = user_profiles_session.query(Guest).filter_by(Guest_Id=guest_id).first()
        # print("Before Commit - Id_Proof:", guest.Id_Proof)
        
        if guest:
            try:
                file.seek(0)
                file_content = file.read()

                # Save the file content to the database
                guest.Id_Proof = file_content
                guest.Id_Proof_Filename = filename
                user_profiles_session.commit()
                
                # print("After Commit - Id_Proof:", guest.Id_Proof)
            except Exception as e:
                print(f"Error updating ID proof in the database: {e}")
                user_profiles_session.rollback()
            user_profiles_session.close()
            return jsonify({"message": "ID proof updated successfully"}), 200
        else:
            user_profiles_session.close()
            return jsonify({"error": "Guest not found"}), 404
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal Server Error"}), 500

@app.errorhandler(500)
def internal_server_error(e):
    # Log the error details
    app.logger.error(f"Internal Server Error: {str(e)}")
    return jsonify(error=str(e)), 500

def summarize_object_with_openai(obj):
    # # Convert the object to a JSON string
    # obj_json = json.dumps((obj))
    # result_string = ", ".join(obj_json)
    # Use OpenAI to generate a summary
    print("obj :",type(obj))
    response = openai.Completion.create(
        engine="davinci-codex",
        prompt=f"Summarize the following JSON object:\n\n{obj}\n\nSummary:",
    )

    # Extract the generated summary from the response
    summary = response.choices[0].text.strip()
    return summary

def get_answers(out):
    
    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo-0613",
    messages=out,
    functions=function_descriptions,
        function_call = 'auto'
    )
    
    if(response.choices[0].message.content is None):
        params = json.loads(response.choices[0].message.function_call.arguments)
        chosen_function = eval(response.choices[0].message.function_call.name)
        print(response.choices[0].message.function_call)
        flight = chosen_function(**params)
        print("flight ",type(flight))
        flight_str = ', '.join(map(str, flight))
        return flight_str
        #print(response.choices[0].message.function_call)
        # flight = chosen_function(**params)

        # response1 = openai.ChatCompletion.create(
        # model="gpt-3.5-turbo-0613",
        # messages=out,
        # #functions=function_descriptions,
        # function_call = chosen_function
        # )
        # print("response1 : ",response1) 
        result_string = ", ".join(flight)
        summary = summarize_object_with_openai(result_string)
        return (summary)
    print("response :",type(response.choices[0].message.content))
    return (response.choices[0].message.content)

import json

def add_numbers(num1,num2):
    res =  {
            "result": num1*num2
        }
   
    return json.dumps(res)
 
 
function_descriptions = [
    {
        "name": "get_billing_by_guest_id",
        "description": "Get billing information by guest ID and summarise it before you display it",
        "parameters": {
            "type": "object",
            "properties": {
                "guest_id": {
                    "type": "integer",
                    "description": "The ID of the guest to retrieve billing information",
                },
            },
            "required": ["guest_id"],
        },
    },
    # {
    #     "name": "get_room_empty",
    #     "description": "Get empty rooms based on Hotel Id",
    #     "parameters": {
    #         "type": "object",
    #         "properties": {
    #             "hotel_id": {
    #                 "type": "string",
    #                 "description": "The ID of the hotel to retrieve empty  rooms",
    #             },
    #         },
    #         "required": ["hotel_id"],
    #     },
    # },
    {
        "name": "get_services_user",
        "description": "Get services based on Guest Id. The Guest Id is expected as input",
        "parameters": {
            "type": "object",
            "properties": {
                "guest_id": {
                    "type": "integer",
                    "description": "The ID of the guest to retrieve services",
                },
            },
            "required": ["guest_id"],
        },
    },
    # {
    #     "name": "index_recommendation",
    #     "description": "Get recommendation based on Hotel Id",
    #     "parameters": {
    #         "type": "object",
    #         "properties": {
    #             "hotel_id": {
    #                 "type": "string",
    #                 "description": "The ID of the hotel to retrieve recommendations for that particular hotel",
    #             },
    #         },
    #         "required": ["hotel_id"],
    #     },
    # },
    {
        "name": "get_available_rooms",
        "description": "Get all available rooms in the hotel based on room_type,num_beds,checkin_date,checkout_date,hotel_id",
        "parameters": {
            "type": "object",
            "properties": {
                "room_type": {
                    "type": "string",
                    "description": "The type of the room which guest wants to book. e.g., Single room/Double room/Family room/Suite room",
                },
                "num_beds": {
                    "type": "integer",
                    "description": "No. of guests/people that we are booking for",
                },
                "checkin_date": {
                    "type": "string",
                    "description": "The check-in Date we are trying to book in this format MM/DD/YYYY hh:mm a, e.g., 12/14/2023, 04:00 PM",
                },
                "checkout_date": {
                    "type": "string",
                    "description": "The check-out Date we are trying to book in this format MM/DD/YYYY hh:mm a, e.g., 12/14/2023, 04:00 PM",
                },
                "hotel_id": {
                    "type": "integer",
                    "description": "The ID of the hotel we are trying to book acommodation",
                },
            },
            "required": ["room_type","num_beds","checkin_date","checkout_date","hotel_id"],
        },
    },
    {
        "name": "bill_update",
        "description": "Update that bill with respective Billing Id ,order_name,order_department,order_price,billing_status",
        "parameters": {
            "type": "object",
            "properties": {
                "billing_id": {
                    "type": "integer",
                    "description": "The billing Id to update that particular billing data",
                },
                "order_name": {
                    "type": "number",
                    "description": "The order name or Service name that you have availed which is billable",
                },
                "order_department": {
                    "type": "string",
                    "description": "The order Department or Service Department that you have availed which is billable",
                },
                "order_price": {
                    "type": "string",
                    "description": "The price of the Order or Service that has been availed which is billable",
                },
                "billing_status": {
                    "type": "number",
                    "description": "The status of the Bill which is Paid or Not Paid",
                },
            },
            "required": ["billing_id","order_name","order_department","order_price","billing_status"],
        },
    },
]
 
def transcribe_audio(file_path, subscription_key, region):
    try:
        speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
        audio_config = speechsdk.AudioConfig(filename=file_path)
        speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
 
        result = speech_recognizer.recognize_once()
 
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            return result.text
        else:
            return "Speech recognition failed"
 
    except Exception as e:
        return f"Error in transcribe_audio: {str(e)}"
 
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data['message']

        guest_id=data['Guest_Id']

        messages = [{"role": "system", "content": f"Guest_Id: {guest_id}"},
             {"role": "system", "content": f"Hotel Id: 1"},
        {"role": "system", "content": "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous."}]
        

        if user_message.lower().endswith(('.wav', '.mp3', '.flac')):
            audio_text = transcribe_audio(user_message, subscription_key, region)
            assistant_input = {"role": "user", "content": audio_text}
            system_message = {"role": "system", "content": "You are a concierge bot. Provide information related strictly to hotels, concierge services. If the user input is related to some other topic, please give a short response as a concierge bot."}
            messages.extend([
                system_message,
                assistant_input,
            ])
        else:
            system_message = {"role": "system", "content": "You are a concierge bot. Provide information related strictly to hotels, concierge services. If the user input is related to some other topic, please give a short response as a concierge bot."}
            messages.extend([
                system_message,
                {"role": "user", "content": user_message},
            ])
 
        assistant_message = get_answers(messages)
        print("assistant message",type(assistant_message))
        
        messages.append({"role": "assistant", "content": assistant_message})
        #print("messages : -> :",messages)
        return jsonify({"assistant_message": assistant_message})
 
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)