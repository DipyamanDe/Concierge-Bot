# routes.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy.orm import sessionmaker
from models import (
    Guest,
    Services,
    Room,
    Reservation,
    Preferences,
    Recommendation,
    Billing,
    Staff,
    Hotel,
    Booking,
)
from db import user_profiles_engine, billing_engine, manager_engine
import azure.cognitiveservices.speech as speechsdk
import openai
from sqlalchemy import and_, desc ,asc
from datetime import datetime, timedelta, timezone
import re
import os
import requests
import tiktoken
import wave

openai.api_key = "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"
subscription_key = "7f3f190f4ddd4273989358d304df47d7"
region = "centralindia"


app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

UserProfilesSession = sessionmaker(bind=user_profiles_engine)
BillingSession = sessionmaker(bind=billing_engine)
ManagerSession = sessionmaker(bind=manager_engine)


# Routes using SQLAlchemy
@app.route("/hotel", methods=["GET"])
def get_all_hotels():
    Manager_Session = ManagerSession()
    hotels = Manager_Session.query(Hotel).all()
    Manager_Session.close()
    if hotels:
        return jsonify({"Hotels": [hotels.serialize() for hotels in hotels]})
    else:
        return jsonify({"message": "No hotels found"}), 404


@app.route("/booking", methods=["POST"])
def booking():
    data = request.get_json()
    guest_id = data.get("Guest_Id")
    Manager_Session = ManagerSession()
    booking = Manager_Session.query(Booking).filter(Booking.Guest_Id == guest_id).\
        order_by(asc(Booking.CheckIn_Time)).all()
    Manager_Session.close()
    if booking:
        return jsonify({"Booking_data": [booking.serialize() for booking in booking]})
    else:
        return jsonify({"message": "No hotels found"}), 404


@app.route("/check_prev_Book", methods=["POST"])
def check_prev_Book():
    data = request.get_json()
    guest_id = data.get("Guest_Id")
    Manager_Session = ManagerSession()
    booking = (
        Manager_Session.query(Booking).filter(Booking.Guest_Id == guest_id).first()
    )
    Manager_Session.close()
    print("prev bookin id :", booking.Booking_Id)
    if booking:
        return jsonify({"Prev_Booking_data": booking.Booking_Id})
    else:
        return jsonify({"message": "No hotels found"}), 404


# GET request for all guests
@app.route("/guest", methods=["GET"])
def get_all_guests():
    user_profiles_session = UserProfilesSession()
    guests = user_profiles_session.query(Guest).all()

    if guests:
        user_profiles_session.close()
        return jsonify({"GuestData": [guest.serialize() for guest in guests]})
    else:
        user_profiles_session.close()
        return jsonify({"message": "No guests found"}), 404


@app.route("/guest_room", methods=["POST"])
def get_guest_room():
    # Get Guest_Id from request JSON
    data = request.get_json()
    guest_id = data.get("Guest_Id")

    # Use the DBSession to interact with the 'Room' table
    session = ManagerSession()

    # Query to get rooms based on Guest_Id
    rooms = session.query(Room).filter(Room.Guest_Id == guest_id).all()

    session.close()

    if rooms:
        # Serialize the room data
        room_data = [room.serialize() for room in rooms]
        return jsonify({"Roomdata": room_data})
    else:
        return jsonify({"message": "No rooms found for the specified guest"}), 404


@app.route("/id_room", methods=["POST"])
def get_id_room():
    # Get Guest_Id from request JSON
    data = request.get_json()
    room_id = data.get("Room_Id")

    # Use the DBSession to interact with the 'Room' table
    session = ManagerSession()

    # Query to get rooms based on Guest_Id
    rooms = session.query(Room).filter(Room.Room_Id == room_id).all()

    session.close()

    if rooms:
        # Serialize the room data
        room_data = [room.serialize() for room in rooms]
        return jsonify({"Roomdata": room_data})
    else:
        return jsonify({"message": "No rooms found for the specified roomId"}), 404


# GET request for all preferences
@app.route("/preferances", methods=["GET"])
def get_all_preferences():
    user_profiles_session = UserProfilesSession()
    preferences = user_profiles_session.query(Preferences).all()

    if preferences:
        user_profiles_session.close()
        return jsonify({"Preferancesdata": [pref.serialize() for pref in preferences]})
    else:
        user_profiles_session.close()
        return jsonify({"message": "No preferences found"}), 404


# GET request for all staff
@app.route("/staff", methods=["GET"])
def get_all_staff():
    manager_session = ManagerSession()
    staff_members = manager_session.query(Staff).all()
    manager_session.close()
    if staff_members:
        return jsonify({"StaffData": [staff.serialize() for staff in staff_members]})
    else:
        return jsonify({"message": "No staff members found"}), 404


@app.route("/room_fc", methods=["GET"])
def get_room():
    hotel_id = request.args.get("Hotel_Id")

    manager_session = ManagerSession()

    # Query to get rooms based on Hotel_Id where Guest_Id is not null, ordered by Room_Number
    rooms = (
        manager_session.query(Room)
        .filter(Room.Hotel_Id == hotel_id, Room.Guest_Id.isnot(None))
        .order_by(Room.Room_Number.asc())
        .all()
    )

    # Serialize the results using the existing 'serialize' method
    room_data = [room.serialize() for room in rooms]
    manager_session.close()
    return jsonify({"RoomData": room_data})


@app.route("/room_empty_fc", methods=["GET"])
def get_room_emp():
    hotel_id = request.args.get("Hotel_Id")
    empty_rooms = get_room_empty(hotel_id)
    if empty_rooms:
        return jsonify({"EmptyRoomData": empty_rooms})
    else:
        return jsonify({"message": "No empty rooms found for the specified hotel"}), 404


def get_room_empty(hotel_id):
    # Use the ManagerSession to interact with the 'Room' table
    manager_session = ManagerSession()

    # Query to get empty rooms based on Hotel_Id
    empty_rooms = (
        manager_session.query(Room)
        .filter(and_(Room.Hotel_Id == hotel_id, Room.Guest_Id.is_(None)))
        .order_by(Room.Room_Number.asc())
        .all()
    )
    manager_session.close()
    return [roms.serialize() for roms in empty_rooms]


@app.route("/room", methods=["GET"])
def get_rooms_by_date():
    hotel_id = request.args.get("Hotel_Id")
    date = request.args.get("date")

    manager_session = ManagerSession()

    # Convert the date string to a datetime object
    # date_obj = datetime.datetime.strptime(date, '%Y-%m-%d')

    # Query to get rooms based on Hotel_Id and date from Booking table
    bookings = (
        manager_session.query(Booking)
        .filter(
            Booking.Hotel_Id == hotel_id,
            Booking.CheckIn_Time <= date,
            Booking.CheckOut_Time >= date,
        )
        .all()
    )

    # Get the Room_Id values from the bookings
    room_ids = [booking.Room_Id for booking in bookings]

    # Query to get rooms from Room table based on Room_Id values
    rooms = manager_session.query(Room).filter(Room.Room_Id.in_(room_ids)).all()

    room_data = [room.serialize() for room in rooms]
    manager_session.close()

    return jsonify({"RoomData": room_data})


@app.route("/room_empty", methods=["GET"])
def get_empty_rooms_by_date():
    hotel_id = request.args.get("Hotel_Id")
    date = request.args.get("date")

    manager_session = ManagerSession()

    # Convert the date string to a datetime object
    # date_obj = datetime.datetime.strptime(date, '%Y-%m-%d')

    # Query to get rooms based on Hotel_Id and date from Booking table
    bookings = (
        manager_session.query(Booking)
        .filter(
            Booking.Hotel_Id == hotel_id,
            Booking.CheckIn_Time <= date,
            Booking.CheckOut_Time >= date,
        )
        .all()
    )

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


@app.route("/services", methods=["GET"])
def get_services_fun():
    if request.is_json:
        data = request.get_json()
        room_id = data.get("Room_Id")

    else:
        room_id = request.args.get("Room_Id")
    print(room_id)
    # Use the ManagerSession to interact with the 'Services' table
    return get_services(room_id)
    # if services:
    #     return jsonify({"ServicesData": [service.serialize() for service in services]})
    # else:
    #     return jsonify({'message': 'No services found for the specified room'}), 404


def get_services(room_id):
    manager_session = ManagerSession()

    services = (
        manager_session.query(Services)
        .filter(Services.Room_Id == room_id)
        .order_by(Services.Service_Id.desc())
        .all()
    )
    manager_session.close()
    return jsonify({"ServicesData": [service.serialize() for service in services]})


# from flask import jsonify


@app.route("/get_room_details", methods=["GET"])
def get_room_details():
    if request.is_json:
        data = request.get_json()
        room_id = data.get("Room_Id")
    else:
        room_id = request.args.get("Room_Id")

    if not room_id:
        return jsonify({"error": "Room_Id is required"}), 400

    manager_session = ManagerSession()

    # Query to get the room by room_id
    rooms = manager_session.query(Room).filter_by(Room_Id=room_id).all()

    manager_session.close()

    if rooms:
        return jsonify(
            {"Room_Details": [room.serialize() for room in rooms]}
        )  # Assuming Room has a serialize method
    else:
        return jsonify({"message": "No room found for the specified Room_Id"}), 404


@app.route("/services_staff", methods=["GET"])
def get_services_staff():
    staff_id = None

    if request.is_json:
        data = request.get_json()
        staff_id = data.get("Staff_Id")
    else:
        staff_id = request.args.get("Staff_Id")

    return get_services_by_staff(staff_id)


def get_services_by_staff(staff_id):
    # Assuming there's a StaffServices table that connects Staff and Services
    manager_session = ManagerSession()
    services = (
        manager_session.query(Services).filter(Services.Staff_Id == staff_id).all()
    )
    manager_session.close()
    return jsonify({"ServicesData": [service.serialize() for service in services]})


@app.route("/insert_service", methods=["POST"])
def insert_service():
    data = request.get_json()
    service_name = data.get("Service_Name")
    service_dept = data.get("Service_Dept")
    service_status = data.get("Service_Status")
    service_description = data.get("Service_Description")
    room_id = data.get("Room_Id")

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
            Service_Start_Time=datetime.now(),  # Assign the Room instance to the relationship
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
                Service_Id=temp,  # Assign the Service instance to the relationship
            )

            # Add the new reservation to the session
            manager_session.add(new_reservation)

            # Commit the changes to the database
            manager_session.commit()

        return jsonify(
            {
                "message": "Service and Reservation updated successfully",
                "service_id": temp,
            }
        )

    except Exception as e:
        # Handle exceptions, roll back changes, and return an error response
        manager_session.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        # Close the session in the 'finally' block to ensure it's always closed
        manager_session.close()
    #     return jsonify({'message': f'Room with Room_ID {room_id} not found'}), 404


@app.route("/post_guest", methods=["POST"])
def post_guest():
    data = request.get_json()
    guest_id = data.get("Guest_Id")
    # guest_id = request.args.get('Guest_Id')

    # Use the UserProfilesSession to interact with the 'Guest' table
    user_profiles_session = UserProfilesSession()

    # Query to get guest details based on Guest_Id
    guest = user_profiles_session.query(Guest).filter_by(Guest_Id=guest_id).all()
    user_profiles_session.close()

    if guest:
        return jsonify({"Guest_Details": [g.serialize() for g in guest]})
    else:
        return jsonify({"message": "No services found for the specified guest"}), 404

@app.route("/guest_update", methods=["PUT"])
def guest_update():
    data = request.get_json()
    guest_id = data.get("Guest_Id")

    # Start a session
    user_profiles_session = UserProfilesSession()

    # Query to get the guest by guest_id
    guest_to_update = user_profiles_session.query(Guest).filter_by(Guest_Id=guest_id).first()

    if guest_to_update:
        # Update the guest attributes
        guest_to_update.Guest_Name = data.get("Guest_Name")
        guest_to_update.Guest_address = data.get("Guest_address")
        guest_to_update.Guest_Phone_Number = data.get("Guest_Phone_Number")
        guest_to_update.Guest_Gender = data.get("Guest_Gender")
        guest_to_update.Guest_email = data.get("Guest_email")
        guest_to_update.Guest_email_password = data.get("Guest_email_password")
        # guest_to_update.Guest_CheckIn_Time = data.get("Guest_CheckIn_Time")
        # guest_to_update.Guest_CheckOut_Time = data.get("Guest_CheckOut_Time")
        # guest_to_update.Id_Proof_Filename = data.get("Id_Proof_Filename")
        # guest_to_update.Id_Proof = base64.b64decode(data.get("Id_Proof")) if data.get("Id_Proof") else None
        # Add more fields as needed

        # Commit the changes
        user_profiles_session.commit()
        user_profiles_session.close()
        return jsonify({"Message": "Guest updated successfully"})
    else:
        session.close()
        return jsonify({"Message": "Guest not found"}), 404

@app.route("/update_service_end_time", methods=["POST"])
def update_service_end_time():
    try:
        # Use the Session to interact with the 'Services' table
        manager_session = ManagerSession()

        # Retrieve the Services instance based on the service ID provided in the request body
        service_id = request.json.get("service_id")
        service = manager_session.query(Services).get(service_id)

        # Check if the service exists
        if service:
            # Update Service_End_Time to the provided value
            service_end_time = request.json.get("service_end_time")
            service.Service_End_Time = service_end_time

            # Commit the changes to the database
            manager_session.commit()

            return jsonify({"message": f"Service {service_id} updated successfully"})

        else:
            return (
                jsonify({"error": f"Service with Service_Id {service_id} not found"}),
                404,
            )

    except Exception as e:
        # Handle exceptions, roll back changes, and return an error response
        manager_session.rollback()
        return jsonify({"error": str(e)}), 500

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


@app.route("/insert_preferences", methods=["POST"])
def insert_preferences():
    data = request.get_json()
    guest_id = data.get("Guest_Id")
    preferance_type = data.get("Preferance_Type")
    preferance_description = data.get("Preferance_Description")

    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()

    # Create a new Preferences instance
    new_preference = Preferences(
        Guest_Id=guest_id,
        Preferance_Type=preferance_type,
        Preferance_Description=preferance_description,
    )

    # Add the new preference to the session
    user_profiles_session.add(new_preference)

    # Commit the changes to the databa
    user_profiles_session.commit()
    user_profiles_session.close()
    return jsonify({"message": "Preference added successfully"})


@app.route("/services_user", methods=["GET"])
def get_services_user_fun():
    guest_id = request.args.get("Guest_Id")

    temp = []

    Manager_Session = ManagerSession()

    all_booking = (
        Manager_Session.query(Booking).filter(Booking.Guest_Id == guest_id).all()
    )

    if all_booking:
        sorted_bookings = sorted(all_booking, key=lambda x: x.CheckIn_Time)
        now_local = datetime.now(timezone.utc).astimezone()
        checkin_time = (
            sorted_bookings[0].CheckIn_Time.replace(tzinfo=timezone.utc).astimezone()
        )
        checkout_time = (
            sorted_bookings[0].CheckOut_Time.replace(tzinfo=timezone.utc).astimezone()
        )

        booking_week = False

        if (
            checkin_time.date() > now_local.date()
            or checkout_time.date() < now_local.date()
        ):
            booking_week = False
            return jsonify({"ServicesUserData": temp, "Booking_Week": booking_week})
        else:
            booking_week = True
    else:
        print("No bookings found for the specified guest.")
        booking_week = False

    Manager_Session.close()

    # Get services based on Guest_Id
    serialized_data = get_services_user(guest_id)

    # Check for retrieved data
    if serialized_data:
        # Serialize the data

        # Return the serialized data
        return jsonify(
            {"ServicesUserData": serialized_data, "Booking_Week": booking_week}
        )
    else:
        # Return no-data message with 404 status code
        return jsonify({"message": "No services found for the specified guest"}), 404
    # Use the ManagerSession to interact with the 'Services' and 'Room' tables


def get_services_user(guest_id):
    Manager_Session = ManagerSession()

    all_booking = (
        Manager_Session.query(Booking).filter(Booking.Guest_Id == guest_id).all()
    )

    sorted_bookings = sorted(all_booking, key=lambda x: x.CheckIn_Time)
    now_local = datetime.now(timezone.utc).astimezone()
    checkin_time = (
        sorted_bookings[0].CheckIn_Time.replace(tzinfo=timezone.utc).astimezone()
    )
    checkout_time = (
        sorted_bookings[0].CheckOut_Time.replace(tzinfo=timezone.utc).astimezone()
    )

    if (
        checkin_time.date() > now_local.date()
        or checkout_time.date() < now_local.date()
    ):
        return "you can only access Services between the check-in and check-out date of your stay."

    Manager_Session.close()

    manager_session = ManagerSession()

    # Query to get services based on Guest_Id
    services_user_data = (
        manager_session.query(Services)
        .join(Room, Services.Room_Id == Room.Room_Id)
        .filter(Room.Guest_Id == guest_id)
        .order_by(Services.Service_Id.desc())
        .all()
    )

    # Close the session
    manager_session.close()
    serialized_data = [service.serialize() for service in services_user_data]
    return serialized_data


@app.route("/reservation", methods=["POST"])
def index_reservation():
    data = request.get_json()
    guest_id = data.get("Guest_Id")

    # Use the ManagerSession to interact with the 'Reservation', 'Services', 'Booking' tables
    manager_session = ManagerSession()

    bookings= manager_session.query(Booking).filter(Booking.Guest_Id == guest_id).\
        order_by(asc(Booking.CheckIn_Time)).first()
 
    # Query to get reservations based on Guest_Id from Booking table
    reservations = manager_session.query(Reservation).\
        join(Services, Reservation.Service_Id == Services.Service_Id).\
        join(Booking, Services.Room_Id == bookings.Room_Id).all()
    
    # reservations = manager_session.query(Reservation).\
    #     join(Services, Reservation.Service_Id == Services.Service_Id).\
    #     join(Booking, Services.Room_Id == Booking.Room_Id).\
    #     filter(Booking.Guest_Id == guest_id).\
    #     order_by(asc(Booking.CheckIn_Time)).all()
    
    manager_session.close() 
    
    if reservations:
       return jsonify({'Reservation_Details': [res.serialize() for res in reservations]})
    else:
        return jsonify({'message': 'failed'}), 401

@app.route('/preference', methods=['POST'])
def index_preference():
    data = request.get_json()
    guest_id = data.get("Guest_Id")

    user_profiles_session = UserProfilesSession()

    # Query to get recommendations based on Guest_Id
    preferences = (
        user_profiles_session.query(Preferences).filter_by(Guest_Id=guest_id).all()
    )
    user_profiles_session.close()
    if preferences:
        return jsonify(
            {"Preferences_Details": [pre.serialize() for pre in preferences]}
        )
    else:
        return jsonify({"message": "failed"}), 401


@app.route("/cab_preference", methods=["POST"])
def index_cab_preference():
    data = request.get_json()
    guest_id = data.get("Guest_Id")

    cab_pref = index_cab_preference_fc(guest_id)

    if cab_pref:
        return jsonify({"Cab_Preference": cab_pref})
    else:
        return jsonify({"message": "failed"}), 40


def index_cab_preference_fc(guest_id):
    preference_type = "Cab Preference"

    user_profiles_session = UserProfilesSession()
    preferences = (
        user_profiles_session.query(Preferences)
        .filter_by(Guest_Id=guest_id, Preferance_Type=preference_type)
        .all()
    )
    pre_data = [pre.serialize() for pre in preferences]
    user_profiles_session.close()
    return pre_data


@app.route("/room_preference", methods=["POST"])
def index_room_preference():
    data = request.get_json()
    guest_id = data.get("Guest_Id")

    room_pref = index_room_preference_fc(guest_id)

    if room_pref:
        return jsonify({"Room_Preference": room_pref})
    else:
        return jsonify({"message": "failed"}), 401


def index_room_preference_fc(guest_id):
    preference_type = "Room Preference"

    user_profiles_session = UserProfilesSession()
    # Query to get recommendations based on Guest_Id
    preferences = (
        user_profiles_session.query(Preferences)
        .filter_by(Guest_Id=guest_id, Preferance_Type=preference_type)
        .all()
    )
    pre_data = [pre.serialize() for pre in preferences]
    user_profiles_session.close()
    return pre_data


@app.route("/food_preference", methods=["POST"])
def index_food_preference():
    data = request.get_json()
    guest_id = data.get("Guest_Id")

    food_pref = index_food_preference_fc(guest_id)

    if food_pref:
        return jsonify({"Food_Preference": food_pref})
    else:
        return jsonify({"message": "failed"}), 401


def index_food_preference_fc(guest_id):
    preference_type = "Food Preference"

    user_profiles_session = UserProfilesSession()
    # Query to get recommendations based on Guest_Id
    preferences = (
        user_profiles_session.query(Preferences)
        .filter_by(Guest_Id=guest_id, Preferance_Type=preference_type)
        .all()
    )
    pre_data = [pre.serialize() for pre in preferences]
    return pre_data



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


@app.route("/recommendation", methods=["GET", "POST"])
def index_recommendation():
    if request.method == "GET":
        # Handle GET request

        # Use the ManagerSession to interact with the 'Recommendation' table
        Manager_Session = ManagerSession()
        # Query to get recommendations based on Hotel_Id
        recommendations = Manager_Session.query(Recommendation).all()

        if recommendations:
            return jsonify(
                {"Recommendation_Details": [rec.serialize() for rec in recommendations]}
            )
        else:
            return jsonify({"message": "failed"}), 401
    elif request.method == "POST":
        # Handle POST request
        data = request.get_json()
        hotel_id = data.get("Hotel_Id")

        # Use the ManagerSession to interact with the 'Recommendation' table
        Manager_Session = ManagerSession()
        # Query to get recommendations based on Hotel_Id
        recommendations = (
            Manager_Session.query(Recommendation).filter_by(Hotel_Id=hotel_id).all()
        )

        if recommendations:
            return jsonify(
                {"Recommendation_Details": [rec.serialize() for rec in recommendations]}
            )
        else:
            return jsonify({"message": "failed"}), 401
        # Your POST request handling logic goes here

    return jsonify({"message": "success"})


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


# API endpoint for bulk payment update
@app.route("/bulk_payment_update", methods=["PUT"])
def bulk_payment_update():
    data = request.get_json()
    billing_session = BillingSession()
    # Ensure the 'bills' key is present in the JSON data
    if "bills" not in data:
        return jsonify({"error": "Invalid request data"}), 400

    updated_bills = data["bills"]

    for updated_bill_data in updated_bills:
        billing_id = updated_bill_data.get("Billing_Id")
        billing = (
            billing_session.query(Billing).filter_by(Billing_Id=billing_id).first()
        )

        if billing:
            billing.Billing_Status = updated_bill_data.get(
                "Billing_Status", billing.Billing_Status
            )

    billing_session.commit()

    return jsonify({"message": "Bulk payment update successful"}), 200

@app.route("/billing", methods=["POST"])
def get_billing_by_guest_id_fun():
    data = request.get_json()
    guest_id = data.get("Guest_Id")

    billing_info = get_billing_by_guest_id(guest_id)

    if billing_info:
        return jsonify({"Bills": billing_info})
    else:
        return (
            jsonify(
                {"message": "No billing information found for the specified guest"}
            ),
            404,
        )


def get_billing_by_guest_id(guest_id):
    billing_session = BillingSession()

    # Query to get billing information based on Guest_Id
    billing_info = billing_session.query(Billing).filter_by(Guest_Id=guest_id).all()

    billing_session.close()

    # Serialize the data
    serialized_data = [bill.serialize() for bill in billing_info]

    return serialized_data

@app.route("/billing/update_latest", methods=["PUT"])
def update_latest_billing_record():
    billing_session = BillingSession()

    # Query to get the latest billing record based on Billing_Id (assuming it's an auto-incremented primary key)
    latest_record = billing_session.query(Billing).order_by(desc(Billing.Billing_Id)).first()

    if latest_record:
        # Update the status of the latest billing record to 'Paid'
        latest_record.Billing_Status = 'Paid'
        billing_session.commit()
        billing_session.close()
        return jsonify({"message": "Latest billing record updated successfully."})
    else:
        billing_session.close()
        return jsonify({"message": "No billing records found."}), 404


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user_profiles_session = UserProfilesSession()

    # Query to get the guest based on email and password
    guest = (
        user_profiles_session.query(Guest)
        .filter_by(Guest_email=email, Guest_email_password=password)
        .first()
    )
    user_profiles_session.close()
    if guest:
        update_rooms()
        remove_previous()
        return jsonify({"Guest_Details": guest.serialize()})
    else:
        return jsonify({"message": "Login failed"}), 401


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    guest_Name = data.get("Guest_Name")
    guest_Phone_Number = data.get("Guest_Phone_Number")
    guest_Gender=data.get("Guest_Gender")
    guest_Email = data.get("Guest_Email")
    guest_Email_Password = data.get("Guest_Email_Password")

    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()

    existing_guest = (
        user_profiles_session.query(Guest).filter_by(Guest_email=guest_Email).first()
    )
    if existing_guest:
        user_profiles_session.close()
        print("Email is already in use")
        return jsonify({"error": "Email is already in use"})

    # Create a new Preferences instance
    new_guest = Guest(
        Guest_Name=guest_Name,
        Guest_Phone_Number=guest_Phone_Number,
        Guest_Gender=guest_Gender,
        Guest_email=guest_Email,
        Guest_email_password=guest_Email_Password,
    )

    # Add the new preference to the session
    user_profiles_session.add(new_guest)

    # Commit the changes to the database
    user_profiles_session.commit()
    user_profiles_session.close()
    return jsonify({"message": "Guest added successfully"})


@app.route("/create_preference", methods=["POST"])
def create_preference():
    data = request.get_json()

    guest_Email = data.get("Guest_Email")

    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()
    guest = (
        user_profiles_session.query(Guest).filter_by(Guest_email=guest_Email).first()
    )

    if not guest:
        user_profiles_session.close()
        return jsonify({"message": "Guest not found"}), 404

    # Create a new Preferences instance
    cab_pref = Preferences(
        Guest_Id=guest.Guest_Id,
        Preferance_Type="Cab Preference",
        # Preferance_Description=""
    )
    room_pref = Preferences(
        Guest_Id=guest.Guest_Id,
        Preferance_Type="Room Preference",
        # Preferance_Description=""
    )
    food_pref = Preferences(
        Guest_Id=guest.Guest_Id,
        Preferance_Type="Food Preference",
        # Preferance_Description=""
    )

    # Add the new preference to the session
    user_profiles_session.add(cab_pref)
    user_profiles_session.add(room_pref)
    user_profiles_session.add(food_pref)

    # Commit the changes to the database
    user_profiles_session.commit()

    user_profiles_session.close()

    return jsonify({"message": "Preferences added successfully"})


# Endpoint to create a billing entry
@app.route("/create_billing", methods=["POST"])
def create_billing():
    data = request.get_json()

    # Extract data from the request
    order_name = data.get("Order_Name")
    order_department = data.get("Order_Department")
    order_price = data.get("Order_Price")
    billing_status = data.get("Billing_Status")
    guest_id = data.get(
        "Guest_Id"
    )  # Assuming you have Guest_Id associated with Billing

    # Create a new Billing instance
    new_billing = Billing(
        Order_Name=order_name,
        Order_Department=order_department,
        Order_Price=order_price,
        Billing_Status=billing_status,
        Guest_Id=guest_id,
    )

    # Add the new billing entry to the session
    billing_session = BillingSession()
    billing_session.add(new_billing)
    billing_session.commit()
    billing_session.close()

    return jsonify({"message": "Billing entry added successfully"})


# Endpoint to create a reservation entry
@app.route("/create_reservation", methods=["POST"])
def create_reservation():
    data = request.get_json()

    # Extract data from the request
    reservation_type = data.get("Reservation_Type")
    reservation_status = data.get("Reservation_Status")
    reservation_description = data.get("Reservation_Description")
    service_id = data.get(
        "Service_Id"
    )  # Assuming you have Service_Id associated with Reservation

    # Create a new Reservation instance
    new_reservation = Reservation(
        Reservation_Type=reservation_type,
        Reservation_Status=reservation_status,
        Reservation_Description=reservation_description,
        Service_Id=service_id,
    )

    # Add the new reservation entry to the session
    reservation_session = ManagerSession()
    reservation_session.add(new_reservation)
    reservation_session.commit()
    reservation_session.close()

    return jsonify({"message": "Reservation entry added successfully"})


@app.route("/city", methods=["POST"])
def city():
    data = request.get_json()
    state = data.get("state")

    manager_session = ManagerSession()

    # Query to get distinct hotel cities based on state
    hotels = (
        manager_session.query(Hotel.Hotel_City)
        .filter_by(Hotel_State=state)
        .distinct()
        .all()
    )

    # Extract cities from the result
    cities = [city[0] for city in hotels]
    manager_session.close()
    return jsonify({"CityData": cities})


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


@app.route("/book_room", methods=["POST"])
def book_room():
    try:
        data = request.get_json()
        room_type = data.get("Room_Type")
        num_beds = data.get("No_of_Beds")
        guest_email = data.get("Guest_email")
        hotel_id = data.get("Hotel_Id")
        checkin_date = data.get("CheckIn_Time")
        checkout_date = data.get("CheckOut_Time")

        user_profiles_session = UserProfilesSession()

        # Query to get the room by room_number
        guest_info = (
            user_profiles_session.query(Guest)
            .filter(Guest.Guest_email == guest_email)
            .first()
        )
        user_profiles_session.close()
        guest_id = guest_info.Guest_Id

        Bookin = book_room_fc(
            room_type, num_beds, checkin_date, checkout_date, hotel_id, guest_email
        )

       

        booking_data = {
            key: value for key, value in Bookin.items() if key != "_sa_instance_state"
        }
        print("main--->", booking_data)
        if Bookin:
            return jsonify({"Booking_data": [booking_data]})
        else:
            return (
                jsonify(
                    {"message": "No Rooms found, Please try with different  dates"}
                ),
                404,
            )

    except Exception as e:
        return str(e)  # Return the error message as a response





def book_room_fc(
    room_type, num_beds, checkin_date, checkout_date, hotel_id, guest_email
):
    temp = ""
    if room_type == "" or room_type == "/":
        temp = temp + "Please Provide the Room Type, to proceed with the booking"
    elif num_beds == "" or num_beds == "/":
        temp = (
            temp
            + "Please Provide the No. of Beds needed or No. of Guests staying  with us to proceed with the booking "
        )
    elif checkin_date == "" or checkin_date == "/":
        temp = temp + "Please Provide the Check-in date to proceed with the booking"
    elif checkout_date == "" or checkout_date == "/":
        temp = temp + "Please Provide the Check-out date to proceed with the booking"
    elif hotel_id == "" or hotel_id == "/":
        temp = temp + "Please Provide the Hotel Id to proceed with the booking"
    elif guest_email == "" or guest_email == "/":
        temp = temp + "Please Provide the your Email to proceed with the booking"
    if temp != "":
        return temp

    if (
        room_type == "Single"
        or room_type == "Single Room"
        or room_type == "single"
        or room_type == "single room"
    ):
        room_type = "Single room"
    if (
        room_type == "Double"
        or room_type == "Double Room"
        or room_type == "double"
        or room_type == "double room"
    ):
        room_type = "Double room"
    if (
        room_type == "Family"
        or room_type == "Family Room"
        or room_type == "family"
        or room_type == "family room"
    ):
        room_type = "Family room"
    if (
        room_type == "Suite"
        or room_type == "Suite Room"
        or room_type == "suite"
        or room_type == "suite room"
    ):
        room_type = "Suite room"

    available_room_ids = get_available_rooms(
        room_type, num_beds, checkin_date, checkout_date, hotel_id
    )
    if len(available_room_ids) == 0:
        return "There are No Rooms available for the above Date...Enter the Check-in and Check-out Dates you want to book!!"
    room_id = available_room_ids[0]

    user_profiles_session = UserProfilesSession()

    # Query to get the room by room_number
    guest_info = (
        user_profiles_session.query(Guest)
        .filter(Guest.Guest_email == guest_email)
        .first()
    )
    user_profiles_session.close()
    guest_id = guest_info.Guest_Id

    Manager_Session = ManagerSession()
    if guest_id:
        existing_booking = (
            Manager_Session.query(Booking)
            .filter(
                and_(
                    Booking.Guest_Id == guest_id,
                    Booking.CheckOut_Time > checkin_date,
                    Booking.CheckIn_Time < checkout_date,
                )
            )
            .all()
        )
        Manager_Session.close()
        if existing_booking:
            return "Sorry, You have allready booked a room between these dates, please select different dates."

    print("Guest_ID ->", guest_id)
    # Use the ManagerSession to interact with the 'Room' table
    manager_session = ManagerSession()

    # Query to get the room by room_number
    room = manager_session.query(Room).filter(Room.Room_Id == room_id).first()

    if room:
        # print(room)
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
            CheckOut_Time=checkout_date,
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
        guest = (
            user_profiles_session.query(Guest)
            .filter(Guest.Guest_Id == guest_id)
            .first()
        )
        # print(str(guest))
        if guest:
            # Update guest's CheckIn_Time and CheckOut_Time
            guest.Guest_CheckIn_Time = checkin_date
            guest.Guest_CheckOut_Time = checkout_date

            # Commit the changes to the UserProfiles database
            user_profiles_session.commit()

            # Close the UserProfiles session
            user_profiles_session.close()

        Manager_Session = ManagerSession()
        booking = (
            Manager_Session.query(Booking)
            .filter(Booking.Guest_Id == guest_id)
            .order_by(desc(Booking.Booking_Id))
            .first()
        )
        Manager_Session.close()
        print(vars(booking))
        update_rooms()
         # Create billing entry
        create_billing_entry(guest_id)

        # Create reservation entry
        #create_reservation_entry()
        if booking:
            return vars(booking)
        else:
            return (
                jsonify(
                    {"message": "No Rooms found, Please try with different  dates"}
                ),
                404,
            )

        # return '1'  # Successful booking
    else:
        return "Room not found"  # If the room with the given room_id is not found

def create_billing_entry(guest_id):
    try:
        # Create a billing entry for the guest
        new_billing = Billing(
            Order_Name="Hotel Bill",
            Order_Department="Hotel",
            Order_Price=10000,
            Billing_Status="Not Paid",
            Guest_Id=guest_id,
        )

        # Add the new billing entry to the session and commit
        billing_session = BillingSession()
        billing_session.add(new_billing)
        billing_session.commit()
        billing_session.close()
        return True  # Return True if the operation succeeds
    except Exception as e:
        # Rollback changes and return False if an error occurs
        billing_session.rollback()
        return False


def create_reservation_entry():
    try:
        # Create a reservation entry for the guest
        new_reservation = Reservation(
            Reservation_Type="Hotel Booking",
            Reservation_Status="Done",
            Reservation_Description="Hotel Booking is done",  # Add your description here
            Service_Id="50",
        )

        # Add the new reservation entry to the session and commit
        reservation_session = ManagerSession()
        reservation_session.add(new_reservation)
        reservation_session.commit()
        reservation_session.close()
        return True  # Return True if the operation succeeds
    except Exception as e:
        # Rollback changes and return False if an error occurs
        reservation_session.rollback()
        return False
    
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


@app.route("/remove_previous", methods=["POST"])
def remove_previous():
    try:
        today_date = datetime.now()
        print("Remove Previous started --------------------------------------------")
        print(today_date)
        # Create a database session
        session = ManagerSession()

        bookings_past = (
            session.query(Booking).filter(Booking.CheckOut_Time < today_date).all()
        )
        print("Bookings with CheckOut_Date in the past:", bookings_past)

        for booking in bookings_past:
            # Check if there are services associated with the booking's Room_Id
            services_to_remove = (
                session.query(Services)
                .filter(Services.Room_Id == booking.Room_Id)
                .all()
            )

            # Remove the associated services
            for service in services_to_remove:
                session.delete(service)

            session.delete(booking)

        # Commit changes to the database
        session.commit()

        # Close the database session
        session.close()

        return jsonify({"message": "Previous services removed successfully"})

    except Exception as e:
        return jsonify({"error": f"Error processing request: {e}"}), 500


@app.route("/update_rooms", methods=["POST"])
def update_rooms():
    try:
        # Extract input parameter from the request
        today_date = datetime.now()
        print("update room started --------------------------------------------")
        print(today_date)
        # Create a database session
        session = ManagerSession()

        # Query to find bookings for today
        bookings_today = (
            session.query(Booking)
            .filter(
                Booking.CheckIn_Time <= today_date, Booking.CheckOut_Time >= today_date
            )
            .all()
        )
        print(bookings_today)

        # Get all rooms
        all_rooms = session.query(Room).all()

        # Update the corresponding rooms
        for room in all_rooms:
            room.Guest_Id = None  # Set Guest_Id to null for all rooms
            room.CheckIn_Time = None
            room.CheckOut_Time = None

        # Update the corresponding rooms
        for booking in bookings_today:
            room = session.query(Room).filter(Room.Room_Id == booking.Room_Id).first()
            if room:
                room.Guest_Id = booking.Guest_Id
                room.CheckIn_Time = booking.CheckIn_Time
                room.CheckOut_Time = booking.CheckOut_Time

        # Commit changes to the database
        session.commit()

        # Close the database session
        session.close()

        return jsonify({"message": "Rooms updated successfully"})

    except Exception as e:
        return jsonify({"error": f"Error processing request: {e}"}), 500


@app.route("/room_availability", methods=["POST"])
def get_available():
    try:
        # Extract input parameters from the request
        room_type = request.json["Room_Type"]
        num_beds = request.json["No_of_Beds"]
        checkin_date = request.json["CheckIn_Time"]
        checkout_date = request.json["CheckOut_Time"]
        hotel_id = request.json["Hotel_Id"]
        guest_id = request.json["Guest_Id"]

        Manager_Session = ManagerSession()
        # booking = Manager_Session.query(Booking).filter(Booking.Guest_Id == guest_id).first()
        existing_booking = (
            Manager_Session.query(Booking)
            .filter(
                and_(
                    Booking.Guest_Id == guest_id,
                    Booking.CheckOut_Time > checkin_date,
                    Booking.CheckIn_Time < checkout_date,
                )
            )
            .all()
        )
        Manager_Session.close()
        existing_booking_flag = bool(existing_booking)
        print("existing_booking-->", existing_booking_flag)

    except KeyError as e:
        return jsonify({"error": f"Missing required parameter: {e}"}), 400
    except Exception as e:
        return jsonify({"error": f"Error processing request: {e}"}), 500

    # Create a database session
    available_room_ids = get_available_rooms(
        room_type, num_beds, checkin_date, checkout_date, hotel_id
    )

    # Return the list of available room IDs
    return jsonify(
        {
            "existing_booking": existing_booking_flag,
            "available_room_ids": available_room_ids,
        }
    )


def get_available_rooms(room_type, num_beds, checkin_date, checkout_date, hotel_id):
    with ManagerSession() as session:
        print(room_type, "--->", type(room_type))
        print(num_beds, "--->", type(num_beds))
        print(hotel_id, "--->", type(hotel_id))
        print(checkin_date, "--->", type(checkin_date))
        print(checkout_date, "--->", type(checkout_date))
        # Subquery to get booked room IDs during the specified time frame
        booked_rooms_subquery = (
            session.query(Booking.Room_Id)
            .filter(Booking.Hotel_Id == hotel_id)
            .filter(
                and_(
                    Booking.CheckIn_Time < checkout_date,
                    Booking.CheckOut_Time > checkin_date,
                )
            )
            .subquery()
        )
        # print("Query--->",booked_rooms_subquery)
        # Query the Room table excluding booked rooms
        available_rooms_query = (
            session.query(Room.Room_Id)
            .filter(Room.Room_Type == room_type)
            .filter(Room.No_of_Beds >= num_beds)
            .filter(Room.Hotel_Id == hotel_id)
            .filter(~Room.Room_Id.in_(booked_rooms_subquery.select()))
            .all()
        )

        # Convert room IDs to a list
        available_room_ids = [room.Room_Id for room in available_rooms_query]
        print("Available Rooms--->", available_room_ids)
        print("length--->", len(available_room_ids))

    return available_room_ids


def get_available_rooms_fc(room_type, num_beds, checkin_date, checkout_date, hotel_id):
    with ManagerSession() as session:
        print(room_type, "--->", type(room_type))
        print(num_beds, "--->", type(num_beds))
        print(hotel_id, "--->", type(hotel_id))
        print(checkin_date, "--->", type(checkin_date))
        print(checkout_date, "--->", type(checkout_date))
        # Subquery to get booked room IDs during the specified time frame
        booked_rooms_subquery = (
            session.query(Booking.Room_Id)
            .filter(Booking.Hotel_Id == hotel_id)
            .filter(
                and_(
                    Booking.CheckIn_Time < checkout_date,
                    Booking.CheckOut_Time > checkin_date,
                )
            )
            .subquery()
        )
        # print("Query--->",booked_rooms_subquery)
        # Query the Room table excluding booked rooms
        available_rooms_query = (
            session.query(Room.Room_Id)
            .filter(Room.Room_Type == room_type)
            .filter(Room.No_of_Beds >= num_beds)
            .filter(Room.Hotel_Id == hotel_id)
            .filter(~Room.Room_Id.in_(booked_rooms_subquery.select()))
            .all()
        )

        # Convert room IDs to a list
        available_room_ids = [room.Room_Id for room in available_rooms_query]
        print("Available Rooms--->", available_room_ids)
        print("length--->", len(available_room_ids))

    return len(available_room_ids)


@app.route("/hotelname", methods=["POST"])
def hotel_name():
    data = request.get_json()
    state = data.get("state")
    city = data.get("city")

    manager_session = ManagerSession()

    # Query to get hotels based on state and city
    hotels = (
        manager_session.query(Hotel).filter_by(Hotel_State=state, Hotel_City=city).all()
    )

    # Serialize the results using the existing 'serialize' method
    hotel_data = [hotel.serialize() for hotel in hotels]
    manager_session.close()
    return jsonify({"HotelData": hotel_data})


@app.route("/service_update", methods=["PUT"])
def service_update():
    data = request.get_json()
    service_id = data.get("Service_Id")
    service_name = data.get("Service_Name")
    service_dept = data.get("Service_Dept")
    service_status = data.get("Service_Status")
    service_description = data.get("Service_Description")
    print(service_status)
    # Use the ManagerSession to interact with the 'Services' table
    manager_session = ManagerSession()

    # Query to get the service by service_id
    service_to_update = (
        manager_session.query(Services).filter_by(Service_Id=service_id).first()
    )

    # Update the service attributes
    if service_to_update:
        service_to_update.Service_Name = service_name
        service_to_update.Service_Dept = service_dept
        service_to_update.Service_Status = service_status
        service_to_update.Service_Description = service_description

        # Commit the changes
        manager_session.commit()
        manager_session.close()
        return jsonify({"Message": "Updated Successfully"})
    else:
        manager_session.close()
        return jsonify({"Message": "Service not found"}), 404


@app.route("/service_assign", methods=["PUT"])
def service_assign():
    data = request.get_json()
    service_id = data.get("Service_Id")
    staff_id = data.get("Staff_Id")

    # Use the ManagerSession to interact with the 'Services' table
    manager_session = ManagerSession()

    # Query to get the service by service_id
    service_to_assign = (
        manager_session.query(Services).filter_by(Service_Id=service_id).first()
    )

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


@app.route("/staff_update", methods=["PUT"])
def staff_update():
    data = request.get_json()
    staff_id = data.get("Staff_Id")
    staff_name = data.get("Staff_Name")
    staff_dept = data.get("Staff_Dept")
    staff_status = data.get("Staff_Status")

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


@app.route("/room_update", methods=["PUT"])
def room_update():
    data = request.get_json()
    room_number = data.get("Room_Number")
    room_price = data.get("Room_Price")
    room_type = data.get("Room_Type")

    # Use the ManagerSession to interact with the 'Room' table
    manager_session = ManagerSession()

    # Query to get the room by room_number
    room_to_update = (
        manager_session.query(Room).filter_by(Room_Number=room_number).first()
    )

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
@app.route("/bill_update", methods=["PUT"])
def bill_upd():
    data = request.get_json()
    billing_id = data.get("Billing_Id")
    order_name = data.get("Order_Name")
    order_department = data.get("Order_Department")
    order_price = data.get("Order_Price")
    billing_status = data.get("Billing_Status")

    # Use the BillingSession to interact with the 'Billing' table
    billing_session = BillingSession()

    # Query to get the billing entry by billing_id
    billing_to_update = bill_update(
        billing_id, order_name, order_department, order_price, billing_status
    )
    return billing_to_update


def bill_update(billing_id, order_name, order_department, order_price, billing_status):
    # Use the BillingSession to interact with the 'Billing' table
    print(
        billing_id,
        " >",
        order_name,
        " >",
        order_department,
        " >",
        order_price,
        " >",
        billing_status,
    )
    billing_session = BillingSession()

    # Query to get the billing entry by billing_id
    billing_to_update = (
        billing_session.query(Billing).filter_by(Billing_Id=billing_id).first()
    )

    # Update the billing details
    if billing_to_update:
        billing_to_update.Order_Name = order_name
        billing_to_update.Order_Department = order_department
        billing_to_update.Order_Price = order_price
        billing_to_update.Billing_Status = billing_status

        # Commit the changes
        billing_session.commit()
        billing_session.close()
        return jsonify({"Message": "Updated Successfully"})
    else:
        return jsonify({"Message": "Billing entry not found"}), 404


# Update route for Recommendation
@app.route("/recommendation_update", methods=["PUT"])
def recommendation_update():
    data = request.get_json()
    recommendation_id = data.get("Recommendation_Id")
    recommendation_name = data.get("Recommendation_Name")
    recommendation_type = data.get("Recommendation_Type")
    recommendation_rating = data.get("Recommendation_Rating")

    # Use the ManagerSession to interact with the 'Recommendation' table
    Manager_Session = ManagerSession()

    # Query to get the recommendation entry by recommendation_id
    recommendation_to_update = (
        Manager_Session.query(Recommendation)
        .filter_by(Recommendation_Id=recommendation_id)
        .first()
    )

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
    return num1 * 2


def sample(num1):
    return num1 * 2


# Update route for Reservation
@app.route("/reservation_update", methods=["PUT"])
def reservation_update():
    data = request.get_json()
    reservation_id = data.get("Reservation_Id")
    reservation_type = data.get("Reservation_Type")
    reservation_status = data.get("Reservation_Status")
    reservation_description = data.get("Reservation_Description")

    # Use the ManagerSession to interact with the 'Reservation' table
    manager_session = ManagerSession()

    # Query to get the reservation entry by reservation_id
    reservation_to_update = (
        manager_session.query(Reservation)
        .filter_by(Reservation_Id=reservation_id)
        .first()
    )

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
@app.route("/preference_update", methods=["PUT"])
def preference_update():
    data = request.get_json()
    preference_id = data.get("Preferance_Id")
    food_preference = data.get("Food_Preferance")
    medical_condition_preference = data.get("Medical_Condition_Preferance")
    cab_preference = data.get("Cab_Preferance")
    room_preference = data.get("Room_Preferance")
    allergic_to = data.get("Allergic_to")

    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()

    # Query to get the preference entry by preference_id
    preference_to_update = (
        user_profiles_session.query(Preferences)
        .filter_by(Preferance_Id=preference_id)
        .first()
    )

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
@app.route("/update_preferences", methods=["PUT"])
def update_preferences():
    data = request.get_json()
    guest_id = data.get("Guest_Id")
    preference_type = data.get("Preferance_Type")
    preference_description = data.get("Preferance_Description")

    try:
        # Update preference
        user_profiles_session = UserProfilesSession()
        pref = (
            user_profiles_session.query(Preferences)
            .filter_by(Guest_Id=guest_id, Preferance_Type=preference_type)
            .first()
        )

        if pref:
            pref.Preferance_Description = preference_description
            user_profiles_session.commit()
            user_profiles_session.close()

            # Create billing and reservation entries for cab
            if create_billing_entry_cab(guest_id) and create_reservation_entry_cab():
                return (
                    jsonify(
                        {
                            "message": "Preference updated successfully and billing/reservation entries created"
                        }
                    ),
                    200,
                )
            else:
                return (
                    jsonify(
                        {
                            "error": "Failed to create billing/reservation entries for cab"
                        }
                    ),
                    500,
                )
        else:
            return jsonify({"error": "Guest or Preference not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def create_billing_entry_cab(guest_id):
    try:
        # Create a billing entry for the guest
        new_billing = Billing(
            Order_Name="Cab Bill",
            Order_Department="Cab",
            Order_Price=1000,
            Billing_Status="Not Paid",
            Guest_Id=guest_id,
        )

        # Add the new billing entry to the session and commit
        billing_session = BillingSession()
        billing_session.add(new_billing)
        billing_session.commit()
        billing_session.close()
        return True  # Return True if the operation succeeds
    except Exception as e:
        # Rollback changes and return False if an error occurs
        billing_session.rollback()
        return False


def create_reservation_entry_cab():
    try:
        # Create a reservation entry for the guest
        new_reservation = Reservation(
            Reservation_Type="Cab Booking",
            Reservation_Status="Done",
            Reservation_Description="Cab Booking is done",  # Add your description here
            Service_Id=60,
        )

        # Add the new reservation entry to the session and commit
        reservation_session = ManagerSession()
        reservation_session.add(new_reservation)
        reservation_session.commit()
        reservation_session.close()
        return True  # Return True if the operation succeeds
    except Exception as e:
        # Rollback changes and return False if an error occurs
        reservation_session.rollback()
        return False


def update_cab_preferences_fc(guest_id, source, destination, cabtype, comments):
    temp = ""
    if guest_id == "":
        temp = "Please provide the Guest Id"
    elif source == "":
        temp = "Please provide the Source"
    elif destination == "":
        temp = "Please provide the destination"
    elif cabtype == "":
        temp = "Please provide the cabtype(Ola , Uber , Snap E)"
    elif comments == "":
        temp = "Do you have any other comments"

    if temp != "":
        return temp

    if cabtype == "Ola" or cabtype == "ola":
        cabtype = "Ola (24 rs/km)"
    elif cabtype == "Uber" or cabtype == "uber":
        cabtype = "Uber (21 rs/km)"
    if (
        cabtype == "SnapE"
        or cabtype == "snapE"
        or cabtype == "Snape"
        or cabtype == "Snap E"
        or cabtype == "Snap e"
        or cabtype == "snap E"
    ):
        cabtype = "Snap E (18 rs/km)"

    preferance_type = "Cab Preference"
    preferance_description = f"Cab Preference: Source - {source}, Destination - {destination}, CabType - {cabtype}, Comments - {comments}"
    print("preferance_description-->", preferance_description)
    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()

    # Query to get the preference entry by preference_id
    pref = (
        user_profiles_session.query(Preferences)
        .filter_by(Guest_Id=guest_id, Preferance_Type=preferance_type)
        .first()
    )

    if pref:
        pref.Preferance_Description = preferance_description
        user_profiles_session.commit()
        user_profiles_session.close()
        print("pref-->", pref)
        pref_data = {
            key: value
            for key, value in vars(pref).items()
            if key != "_sa_instance_state"
        }
        fin = "Your Cab Preference has been updated successfully"
        return fin
    else:
        return jsonify({"error": "Guest or Preference not found"}), 404


def update_room_preferences_fc(
    guest_id, extraTowel, extraToiletries, extraBed, laundry, comments
):
    temp = ""
    if guest_id == "":
        temp = "Please provide the Guest Id"
    elif extraTowel == "":
        temp = "Will you be needing extra towels"
    elif extraToiletries == "":
        temp = "Will you be needing extra toiletries"
    elif extraBed == "":
        temp = "Will you be needing an extra bed"
    elif laundry == "":
        temp = "Will you be needing laundry services"
    elif comments == "":
        temp = "Do you have any other comments"

    if temp != "":
        return temp

    if (
        extraTowel == "yes"
        or extraTowel == "Yes"
        or extraTowel == "true"
        or extraTowel == "True"
    ):
        extraTowel = "true"
    else:
        extraTowel = "false"

    if (
        extraToiletries == "yes"
        or extraToiletries == "Yes"
        or extraToiletries == "true"
        or extraToiletries == "True"
    ):
        extraToiletries = "true"
    else:
        extraToiletries = "false"

    if (
        extraBed == "yes"
        or extraBed == "Yes"
        or extraBed == "true"
        or extraBed == "True"
    ):
        extraBed = "true"
    else:
        extraBed = "false"

    if laundry == "yes" or laundry == "Yes" or laundry == "true" or laundry == "True":
        laundry = "true"
    else:
        laundry = "false"

    preferance_type = "Room Preference"
    preferance_description = f"Room Preference: Extra Towel - {extraTowel}, Extra Toiletries - {extraToiletries}, Extra Bed - {extraBed}, Laundry - {laundry}, Comments - {comments}"
    print("preferance_description-->", preferance_description)
    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()

    # Query to get the preference entry by preference_id
    pref = (
        user_profiles_session.query(Preferences)
        .filter_by(Guest_Id=guest_id, Preferance_Type=preferance_type)
        .first()
    )

    if pref:
        pref.Preferance_Description = preferance_description
        user_profiles_session.commit()
        user_profiles_session.close()
        print("pref-->", pref)
        pref_data = {
            key: value
            for key, value in vars(pref).items()
            if key != "_sa_instance_state"
        }
        fin = "Your Room Preference has been updated successfully"
        return fin
    else:
        return jsonify({"error": "Guest or Preference not found"}), 404


def update_food_preferences_fc(guest_id, foodtype, allergies, comments):
    temp = ""
    if guest_id == "":
        temp = "Please provide the Guest Id"
    elif foodtype == "":
        temp = "Please provide the food type (Pure Veg , Non Veg , Pure Jain)"
    elif allergies == "":
        temp = "Please provide your allergies if any"
    elif comments == "":
        temp = "Anything extra you want to notify us"

    if temp != "":
        return temp

    if (
        foodtype == "veg"
        or foodtype == "Veg"
        or foodtype == "pureVeg"
        or foodtype == "PureVeg"
        or foodtype == "pureveg"
        or foodtype == "Pureveg"
        or foodtype == "pure Veg"
        or foodtype == "Pure veg"
        or foodtype == "pure veg"
    ):
        foodtype = "Pure Veg"
    if (
        foodtype == "non"
        or foodtype == "Non"
        or foodtype == "NonVeg"
        or foodtype == "nonVeg"
        or foodtype == "Nonveg"
        or foodtype == "nonveg"
        or foodtype == "non Veg"
        or foodtype == "non veg"
        or foodtype == "Non veg"
    ):
        foodtype = "Non Veg"
    if (
        foodtype == "jain"
        or foodtype == "Jain"
        or foodtype == "Pure jain"
        or foodtype == "pure Jain"
        or foodtype == "pure jain"
        or foodtype == "purejain"
        or foodtype == "PureJain"
        or foodtype == "Purejain"
        or foodtype == "pureJain"
    ):
        foodtype = "Pure Jain"

    preferance_type = "Food Preference"
    preferance_description = f"Food Preference: Type - {foodtype}, Allergies - {allergies}, Comments - {comments}"
    print("preferance_description-->", preferance_description)
    # Use the UserProfilesSession to interact with the 'Preferences' table
    user_profiles_session = UserProfilesSession()

    # Query to get the preference entry by preference_id
    pref = (
        user_profiles_session.query(Preferences)
        .filter_by(Guest_Id=guest_id, Preferance_Type=preferance_type)
        .first()
    )

    if pref:
        pref.Preferance_Description = preferance_description
        user_profiles_session.commit()
        user_profiles_session.close()
        print("pref-->", pref)
        pref_data = {
            key: value
            for key, value in vars(pref).items()
            if key != "_sa_instance_state"
        }
        fin = "Your Food Preference has been updated successfully"
        return fin
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


@app.route("/adminlogin", methods=["POST"])
def admin_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Use the ManagerSession to interact with the 'Staff' table
    manager_session = ManagerSession()

    # Query to get staff based on email and password
    staff = (
        manager_session.query(Staff)
        .filter_by(Staff_email=email, Staff_email_password=password)
        .first()
    )
    manager_session.close()
    if staff:
        update_rooms()
        remove_previous()
        return jsonify({"Staff_Details": staff.serialize()})
    else:
        return jsonify({"message": "Login failed"}), 401


# def allowed_file(filename):
#     return "." in filename and filename.rsplit(".", 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]


@app.route("/upload_id_proof", methods=["PUT"])
def update_id_proof():
    try:
        guest_id = int(request.form["Guest_Id"])
        file = request.files["file"]
        filename = request.form.get("filename")
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


# def summarize_object_with_openai(obj):
#     print("summarize is on")
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo-0613",
#         messages=f"Summarize the following JSON object:\n\n{obj}\n\nSummary:",
#     )
#     print("summary response -->",response)
#     summary = response.choices[0]
#     return summary


def summarize_object_with_openai(obj):
    print("summarize is on")
    prompt = f"""Summarize the following JSON object:\n\n{obj}\n\nSummary: as if you are telling the summary to a guest based on what they have availed, do not mention  json object and just summarize the values from the data . Strictly do not Share Guest ID,Preference Id, hotel ID, Room ID in response from JSON data. Keep the conversation as informal and respectful. Also avoid newline characters in the response, Avoid using the word summary"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-0613",
            messages=[{"role": "user", "content": prompt}],
        )

        print("OpenAI API Response:", response)

        if "choices" not in response or not response.choices:
            print("Error: Empty or missing 'choices' in the API response.")
            return "Error: Unable to generate summary."

        summary_message = response.choices[0].message

        if "content" not in summary_message:
            print("Error: Missing 'content' in the summary message.")
            return "Error: Unable to generate summary."

        summary = summary_message["content"]
        print("Summary:", summary)
        return summary

    except Exception as e:
        print("Error during OpenAI API call:", e)
        return "Error: Unable to generate summary."


def get_answers(out):
    print(out)
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0613",
        messages=out,
        functions=function_descriptions,
        function_call="auto",
    )

    if response.choices[0].message.content is None:
        params = json.loads(response.choices[0].message.function_call.arguments)
        chosen_function = eval(response.choices[0].message.function_call.name)

        if chosen_function.__name__ == "get_top_headlines":
            headlines = get_top_headlines(
                query=params.get("query"),
                country=params.get("country"),
                category=params.get("category"),
            )
            summary = summarize_object_with_openai(headlines)
            return summary

        print(response.choices[0].message.function_call)
        flight = chosen_function(**params)
        print("flight -->", type(flight))

        if type(flight) == list or type(flight) == dict:
            # result_string = ", ".join(flight)
            summary = summarize_object_with_openai(flight)
            # print("summary -->",summary)
            return summary

            flight_str = ", ".join(map(str, flight))
            return flight_str

        else:
            return flight
        # print(response.choices[0].message.function_call)
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
        return summary
    # print("response :",type(response.choices[0].message.content))
    return response.choices[0].message.content


def insert_service_fc(service_name, service_description, service_dept, guest_id):
    # Use the ManagerSession to interact with the 'Services' and 'Room' tables
    # print("insert service fc start")
    manager_session = ManagerSession()

    all_booking = (
        manager_session.query(Booking).filter(Booking.Guest_Id == guest_id).all()
    )

    sorted_bookings = sorted(all_booking, key=lambda x: x.CheckIn_Time)
    now_local = datetime.now(timezone.utc).astimezone()
    checkin_time = (
        sorted_bookings[0].CheckIn_Time.replace(tzinfo=timezone.utc).astimezone()
    )
    checkout_time = (
        sorted_bookings[0].CheckOut_Time.replace(tzinfo=timezone.utc).astimezone()
    )
    print(
        "local time querry started________________________________________________________________________________"
    )

    if (
        checkin_time.date() > now_local.date()
        or checkout_time.date() < now_local.date()
    ):
        return "you can only update Services between the check-in and check-out date of your stay."

    temp = ""
    if service_name == "" or service_name == "/":
        temp = temp + "Please Provide the name of the service"
    elif service_description == "" or service_description == "/":
        temp = temp + "Please describe your service"
    elif service_dept == "" or service_dept == "/":
        temp = (
            temp
            + "Pleas provide your Service Department Between Cab Booking , Dining , room Service and Other Booking "
        )
    elif guest_id == "" or guest_id == "/":
        temp = temp + "Please Provide your Guest Id"
    if temp != "":
        return temp

    manager_session = ManagerSession()

    all_booking = (
        manager_session.query(Booking).filter(Booking.Guest_Id == guest_id).all()
    )

    sorted_bookings = sorted(all_booking, key=lambda x: x.CheckIn_Time)
    now_local = datetime.now(timezone.utc).astimezone()
    checkin_time = (
        sorted_bookings[0].CheckIn_Time.replace(tzinfo=timezone.utc).astimezone()
    )
    checkout_time = (
        sorted_bookings[0].CheckOut_Time.replace(tzinfo=timezone.utc).astimezone()
    )
    print(
        "local time querry started________________________________________________________________________________"
    )

    if (
        checkin_time.date() > now_local.date()
        or checkout_time.date() < now_local.date()
    ):
        return "you can only update Services between the check-in and check-out date of your stay."

    room = manager_session.query(Room.Room_Id).filter(Room.Guest_Id == guest_id).first()
    room_id = room.Room_Id
    print("room id -->", room_id)
    service_status = "Not Done"

    try:
        # Create a new Services instance
        new_service = Services(
            Service_Name=service_name,
            Service_Dept=service_dept,
            Service_Status=service_status,
            Service_Description=service_description,
            Room_Id=room_id,
            Service_Start_Time=datetime.now(),
        )
        # print("new service -->",vars(new_service))
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
                Service_Id=temp,  # Assign the Service instance to the relationship
            )

            # Add the new reservation to the session
            manager_session.add(new_reservation)

            # Commit the changes to the database
            manager_session.commit()
        service_response = [
            {"message": "Service Request updated successfully", "service_id": temp}
        ]
        # service_list=service_response.get_json()
        # print("service list -->",service_list)
        return service_response

    except Exception as e:
        # Handle exceptions, roll back changes, and return an error response
        print("Error details:", e)
        manager_session.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        # Close the session in the 'finally' block to ensure it's always closed
        manager_session.close()
    #     return jsonify({'message': f'Room with Room_ID {room_id} not found'}), 404


import json


def add_numbers(num1, num2):
    res = {"result": num1 * num2}

    return json.dumps(res)


os.environ["NEWS_API_KEY"] = "5fc7b08464d148e8acfd8710cb5f7c61"

# Define constants
llm_model = "gpt-3.5-turbo"
llm_max_tokens = 4096  # Adjust this as needed
llm_system_prompt = "You are an assistant that provides news and headlines to user requests. Always try to get the latest breaking stories using the available function calls."
encoding_model_messages = "gpt-3.5-turbo"
encoding_model_strings = "cl100k_base"
function_call_limit = 1


def num_tokens_from_messages(messages):
    """Returns the number of tokens used by a list of messages."""
    try:
        encoding = tiktoken.encoding_for_model(encoding_model_messages)
    except KeyError:
        encoding = tiktoken.get_encoding(encoding_model_strings)

    num_tokens = 0
    for message in messages:
        num_tokens += 4
        for key, value in message.items():
            num_tokens += len(encoding.encode(str(value)))
            if key == "name":
                num_tokens += -1
    num_tokens += 2
    return num_tokens


def get_top_headlines(query=None, country=None, category=None):
    """Retrieve top headlines from newsapi.org (API key required)"""

    base_url = "https://newsapi.org/v2/top-headlines"
    headers = {"x-api-key": os.environ["NEWS_API_KEY"]}
    params = {"category": "general"}

    if query is not None:
        params["q"] = query
    if country is not None:
        params["country"] = country
    if category is not None:
        params["category"] = category

    response = requests.get(base_url, params=params, headers=headers)
    data = response.json()

    if data["status"] == "ok":
        print(f"Processing {data['totalResults']} articles from newsapi.org")
        articles = data["articles"]

        # Extract only author and title from each article
        extracted_data = [
            {"author": article["author"], "title": article["title"]}
            for article in articles
        ]

        return json.dumps(extracted_data)

    else:
        print("Request failed with message:", data["message"])
        return "No articles found"


def get_top_headlines(query, category, hotel_id):
    """Retrieve top headlines for a specific city and target audience (guests staying in a hotel)"""

    base_url = "https://newsapi.org/v2/top-headlines"
    news_api_key = os.environ.get(
        "NEWS_API_KEY"
    )  # Assuming you have an environment variable set for your API key
    headers = {"x-api-key": news_api_key}
    params = {"category": "general"}

    manager_session = ManagerSession()

    # Query to get services based on Hotel_Id
    hotel = manager_session.query(Hotel).filter_by(Hotel_Id=hotel_id).first()

    if hotel is not None:
        city = hotel.Hotel_City
        params["q"] = f"{city} news"  # Add city to the search query

    if category is not None:
        params["category"] = category

    print("params -->", params)

    response = requests.get(base_url, params=params, headers=headers)
    data = response.json()

    if data["status"] == "ok":
        print(f"Processing {data['totalResults']} articles from newsapi.org")
        articles = data["articles"]

        # Extract only author and title from each article
        extracted_data = [
            {"author": article["author"], "title": article["title"]}
            for article in articles
        ]

        return json.dumps(extracted_data)

    else:
        print("Request failed with message:", data["message"])
        return "No articles found"

presentDate=datetime.now()
print("presentDate--->",presentDate)

function_descriptions = [
    {
        "name": "get_billing_by_guest_id",
        "description": "Get billing information by guest ID and summarise it before you display it . strictly do not share the guest id in the summarized information",
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
    {
        "name": "index_cab_preference_fc",
        "description": "Get cab preference information by guest ID and summarise it before you display it . strictly do not share the guest id in the summarized information",
        "parameters": {
            "type": "object",
            "properties": {
                "guest_id": {
                    "type": "integer",
                    "description": "The ID of the guest to retrieve cab preference information",
                },
            },
            "required": ["guest_id"],
        },
    },
    {
        "name": "index_room_preference_fc",
        "description": "Get room preference information by guest ID and summarise it before you display it . strictly do not share the guest id in the summarized information",
        "parameters": {
            "type": "object",
            "properties": {
                "guest_id": {
                    "type": "integer",
                    "description": "The ID of the guest to retrieve room preference information",
                },
            },
            "required": ["guest_id"],
        },
    },
    {
        "name": "index_food_preference_fc",
        "description": "Get food preference information by guest ID and summarise it before you display it . strictly do not share the guest id in the summarized information",
        "parameters": {
            "type": "object",
            "properties": {
                "guest_id": {
                    "type": "integer",
                    "description": "The ID of the guest to retrieve food preference information",
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
    {
        "name": "insert_service_fc",
        "description": """Your task is to insert a service request for the guest in the hotel.
            First acquire the service_name from the user,
            Second acquire the service_description.
            Once you have obtained the service name and description, derive the service department. 
            Take note of the following information from previous messages:\n- Guest ID: [Guest ID from previous messages].
            Then, proceed to input the service request into the system using the acquired information.
            Please note that you should not generate text for this task and only accept the values from the user.
            Also avoid using newline characters in the response.
            Summarize the response.""",
        "parameters": {
            "type": "object",
            "properties": {
                "service_name": {
                    "type": "string",
                    "description": "First acquire the name of the service request",
                },
                "service_description": {
                    "type": "string",
                    "description": "After the user gives the service_name, acquire the service description",
                },
                "service_dept": {
                    "type": "string",
                    "description": "Based on the Service_name and service_description, derive the Service Department. Specifically, only from these 3 departments: Cab Booking, Room Service, Dining. If it doesn't match these 3 departments, put the service department as Other Booking.",
                },
                "guest_id": {
                    "type": "integer",
                    "description": "There will be guest id available in previous messages",
                },
            },
            "required": [
                "service_name",
                "service_dept",
                "service_description",
                "guest_id",
            ],
        },
        "returns": {
            "type": "string",
            "description": "Information regarding the insertion of service requests that has been processed",
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
    # {
    #     "name": "get_available_rooms_fc",
    #     "description": "Get the number of available rooms to book, strictly only available rooms,  in the hotel based on room_type,num_beds,checkin_date,checkout_date,hotel_id and if values are missing ask for the values one at a time so the user doesnt get confused",
    #     "parameters": {
    #         "type": "object",
    #         "properties": {
    #             "room_type": {
    #                 "type": "string",
    #                 "description": "The type of the room which guest wants to book. e.g., Single room/Double room/Family room/Suite room",
    #             },
    #             "num_beds": {
    #                 "type": "integer",
    #                 "description": "No. of guests/people that we are booking for",
    #             },
    #             "checkin_date": {
    #                 "type": "string",
    #                 "description": "The check-in Date we are trying to book in this format MM/DD/YYYY hh:mm a, e.g., 12/14/2023, 04:00 PM",
    #             },
    #             "checkout_date": {
    #                 "type": "string",
    #                 "description": "The check-out Date we are trying to book in this format MM/DD/YYYY hh:mm a, e.g., 12/14/2023, 04:00 PM",
    #             },
    #             "hotel_id": {
    #                 "type": "integer",
    #                 "description": "The ID of the hotel we are trying to book acommodation",
    #             },
    #         },
    #         "required": ["room_type","num_beds","checkin_date","checkout_date","hotel_id"],
    #     },
    #     "returns": {
    #     "type": "integer",
    #     "description": "The number of available rooms that match the specified criteria.",
    # }
    # },
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
            "required": [
                "billing_id",
                "order_name",
                "order_department",
                "order_price",
                "billing_status",
            ],
        },
    },
    {
        "name": "update_cab_preferences_fc",
        "description": """
            Your task is to update the cab preferences of the guest based on Guest_Id, Source, Destination,CabType and Comments.
            First acquire sourse and destination of their travel,
            Second acquire the cab type specifically from these 3 types: Ola , Uber , Snap E
            Third acquire their comments regarding the travel,
            acquire Guest_Id from previous messages,
            Avoid assuming values and taking them as null or none,
            only call the function when you have all the values necessary until that keep asking guest for missing values
            """,
        "parameters": {
            "type": "object",
            "properties": {
                "guest_id": {
                    "type": "integer",
                    "description": "The Guest Id of the guest to update their cab preferences",
                },
                "source": {
                    "type": "string",
                    "description": "The pick-up or source from where the cab travel begins",
                },
                "destination": {
                    "type": "string",
                    "description": "The drop or destination where the cab travel ends",
                },
                "cabtype": {
                    "type": "string",
                    "description": "The cab type specifically from these three cab types: Ola , Uber , SnapE",
                },
                "comments": {
                    "type": "string",
                    "description": "comments regarding the cab travel",
                },
            },
            "required": ["guest_id", "source", "destination", "cabtype", "comments"],
        },
    },
    {
        "name": "update_room_preferences_fc",
        "description": """ 
            Your task is to update the Room Preferences of the guest based on guest_id,  laundry, extraTowel, extraBed, extraToiletries and comments , Strictly Perform all the below steps before calling the function.
            First acquire if the guest wants laundry,
            after acquiring information about laundry Second acquire if the guest wants extra towels,
            after acquiring information about laundry and towels Third acquire if the guest wants extra bed,
            after acquiring information about laundry, towels and bed Fourth acquire if the guest wants extra toiletries,
            after all this ask for comments only once, 
            acquire Guest_Id from previous messages,
            Avoid assuming values and taking them as null or none,
            only call the function when you have all the values necessary.
            """,
        "parameters": {
            "type": "object",
            "properties": {
                "guest_id": {
                    "type": "integer",
                    "description": "The Guest Id of the guest to update their cab preferences",
                },
                "laundry": {
                    "type": "string",
                    "description": "Strictly acquire if the guest wants laundry services",
                },
                "extraTowel": {
                    "type": "string",
                    "description": "Strictly acquire if the guest wants extra towel",
                },
                "extraBed": {
                    "type": "string",
                    "description": "Strictly acquire if the guest wants extra bed",  # and strictly store it as either true or false
                },
                "extraToiletries": {
                    "type": "string",
                    "description": "Strictly acquire if the guest wants extra toiletries",
                },
                "comments": {
                    "type": "string",
                    "description": "if there is anything else to be added provide them as comments, this is optional",
                },
            },
            "required": [
                "guest_id",
                "laundry",
                "extraTowel",
                "extraBed",
                "extraToiletries",
                "comments",
            ],
        },
    },
    {
        "name": "update_food_preferences_fc",
        "description": """
            Your task is to update the food preferences of the guest based on Guest_Id, foodtype, allergies, and Comments.
            First acquire food type of the guest specifically from these three food types : Pure Veg , Non Veg , Pure Jain
            Second acquire allergies of guest,
            Third acquire their comments regarding the food,
            acquire Guest_Id from previous messages,
            Avoid assuming values and taking them as null or none,
            only call the function when you have all the values necessary until that keep asking guest for missing values
            """,
        "parameters": {
            "type": "object",
            "properties": {
                "guest_id": {
                    "type": "integer",
                    "description": "The Guest Id of the guest to update their food preferences",
                },
                "foodtype": {
                    "type": "string",
                    "description": "food type of the guest specifically from these three food types : Pure Veg , Non Veg , Pure Jain",
                },
                "allergies": {
                    "type": "string",
                    "description": "Get the information about allergies of guest if any ",
                },
                "comments": {
                    "type": "string",
                    "description": "comments regarding the food preference",
                },
            },
            "required": ["guest_id", "foodtype", "allergies", "comments"],
        },
    },
    
    {
       "name": "book_room_fc",
       "description": f"""Book a room for the guest in the hotel based on Room Type, No.of Beds, Check-in Date, Check-out Date,
                       Firstly ask the user about Room Type,
                       Secondly ask about the No.of Beds or No.of guests,
                       then thirdly proceed with Check-in and Check-out time before proceeding to Book a room.
                       Strictly consider the user inputs from the previous converstions.
                       If any inputs are not provided and are ambiguous...ask the user for such values before booking a room
                       The year is 2024. Todays date is {presentDate} do not proceed with booking if checkin_date and checkout_date are less than todays date""",  # If you don't have information regarding hotel_id and guest_email, At last ask for them.
       "parameters": {
           "type": "object",
           "properties": {
               "room_type": {
                   "type": "string",
                   "description": "set the room_type as: Single room  or Double room or Family room or Suite room , based on the users response to room type",  # FIrst acquire the type of the room which guest wants to book. e.g., Single room/Double room/Family room/Suite room
               },
               "num_beds": {
                   "type": "integer",
                   "description": "After getting room_type acquire the number of beds or guests for the booking.",
               },
               "checkin_date": {
                   "type": "string",
                   "description": "After getting room_type and num_beds acquire  the check-in date ..... Note:-Strictly Change the user's input Date to this format MM/DD/YYYY hh:mm a like for example:-, 12/14/2024, 04:00 PM. If time is not provided 12:00 is the default. If year is not provide 2024 is default. Never assume the Month and Date values...If not provided ask the user.",
               },
               "checkout_date": {
                   "type": "string",
                   "description": "After getting room_type , num_beds and checkin_date then....acquire  the check-out date ..... Note:- Strictly Change the user's input Date to this format MM/DD/YYYY hh:mm a like for example:-, 12/14/2024, 04:00 PM. If time is not provided 12:00 is the default. If year is not provide 2024 is default.Never assume the Month and Date values...If not provided ask the user.",
               },
               "hotel_id": {
                   "type": "integer",
                   "description": "Get hotel_id from previous messages to book accommodation. ",
               },
               "guest_email": {
                   "type": "string",
                   "description": "Get guest_email from previous messages for the booking process. Double check in the previous messages and if not provided....ask the user...but never assume",
               },
           },
           "required": [
               "room_type",
               "num_beds",
               "checkin_date",
               "checkout_date",
               "hotel_id",
               "guest_email",
           ],
       },
       "returns": {
           "type": "string",
           "description": "Information regarding the booking that has been processed, including the generated Booking ID.",
       },
       "prompts": {
           "book_room": "To book a room, I'll need some information. Let's start with the room type. Could you please specify the type of room you want to book (e.g., Single room, Double room, Family room, Suite room)?",
           "missing_values": "Great! Now, let's continue with the booking process. Please provide the {missing_parameter}.",
           "booking_confirmation": "The booking with ID {booking_id} has been successfully made for the hotel. The check-in time is scheduled for {checkin_date}, and the check-out time is {checkout_date}.",
       },
   },
    {
        "name": "get_top_headlines",
        "description": "Get top news headlines by city and/or category",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Freeform keywords or a phrase to search for.",
                },
                "category": {
                    "type": "string",
                    "description": "The category you want to get headlines for",
                    "enum": [
                        "business",
                        "entertainment",
                        "general",
                        "health",
                        "science",
                        "sports",
                        "technology",
                    ],
                },
                "pageSize": {
                    "type": "integer",
                    "description": "The number of results to return per page",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                },
                "page": {
                    "type": "integer",
                    "description": "Use this to page through the results if the total results found is greater than the page size",
                    "minimum": 1,
                },
            },
            "required": ["query", "category"],
        },
    },
]


def transcribe_audio(file_path, subscription_key, region):
    try:
        speech_config = speechsdk.SpeechConfig(
            subscription=subscription_key, region=region
        )
        audio_config = speechsdk.AudioConfig(filename=file_path)
        speech_recognizer = speechsdk.SpeechRecognizer(
            speech_config=speech_config, audio_config=audio_config
        )

        result = speech_recognizer.recognize_once()

        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            return result.text
        else:
            return "Speech recognition failed"

    except Exception as e:
        return f"Error in transcribe_audio: {str(e)}"


def text_to_speech(text, subscription_key, region, output_file_path="output.wav"):
    try:
        speech_config = speechsdk.SpeechConfig(
            subscription=subscription_key, region=region
        )
        synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)

        result = synthesizer.speak_text(text)

        # Use the audio_data attribute to get the audio data
        audio_data = result.audio_data

        # Write the audio data to a WAV file
        with wave.open(output_file_path, "wb") as wave_file:
            wave_file.setnchannels(1)
            wave_file.setsampwidth(2)
            wave_file.setframerate(16000)
            wave_file.writeframes(audio_data)

        return output_file_path
    except Exception as e:
        return f"Error in text_to_speech: {str(e)}"


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data["message"]
        prev_message = data["prevMessages"]
        guest_email = data["Guest_email"]
        guest_id = data["Guest_Id"]
        # if(prev_message):
        # messages = [{"role": "system", "content": "You are an intelligent assistant for a Guest in their Hotel Stay. You are a friendly concierge Chatbot. Provide information related strictly to hotels, concierge services, and **build upon the context of previous messages in the conversation**. If the user input is related to some other topic, please give a short response as a concierge bot, but still acknowledge the previous conversation flow.Call the function Strictly when you have all required parameters else do not make the function call. Do not assume values or take them blank or None or null. Follwup with the guest for such values"}]

        # messages = [
        #     {"role": "user", "content": "What are the amenities provided by the hotel?"},
        # {"role": "assistant", "content": "The hotel provides a range of amenities, including a pool, gym, spa, and complimentary breakfast."},
        # {"role": "user", "content": "Can I check in early or late?"},
        # {"role": "assistant", "content": "Early check-in and late check-out options are available upon request, subject to availability. Additional charges may apply."},

        # {"role": "user", "content": "Are pets allowed in the hotel?"},
        # {"role": "assistant", "content": "Yes, the hotel is pet-friendly. There may be an additional fee for bringing pets, so it's advisable to check with the hotel in advance."},

        # {"role": "user", "content": "What types of rooms are available?"},
        # {"role": "assistant", "content": "The hotel offers various room types, including standard rooms, suites, and executive rooms. Each room is equipped with modern amenities for your comfort."},

        # {"role": "user", "content": "How far is the hotel from the airport?"},
        # {"role": "assistant", "content": "The hotel is approximately 15 miles away from the airport. The exact travel time may vary depending on traffic conditions."},

        # {"role": "user", "content": "Can I book a conference room for an event?"},
        # {"role": "assistant", "content": "Certainly! The hotel has conference rooms available for events and meetings. You can contact our events team for more information on booking and availability."},

        # {"role": "user", "content": "What restaurants are nearby the hotel?"},
        # {"role": "assistant", "content": "There are several restaurants in the vicinity offering a variety of cuisines. The hotel's concierge can provide recommendations based on your preferences."},

        # {"role": "user", "content": "Is there a shuttle service to the city center?"},
        # {"role": "assistant", "content": "Yes, the hotel provides a shuttle service to the city center. The schedule and availability can be obtained at the front desk."},

        # {"role": "user", "content": "Are there any special offers or discounts for long stays?"},
        # {"role": "assistant", "content": "For extended stays, the hotel may offer special rates or packages. It's recommended to inquire with the reservations team for the most up-to-date information."},
        # {"role": "system", "content": "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous."}]

        # print("previous  - ",prev_message)
        # print("all message - > ",messages)
        system_message = {
            "role": "system",
            "content": f"""Role: Intelligent hotel concierge chatbot
                            Focus:
                            Provide information related strictly to hotels and concierge services.
                            Maintain conversation context, building upon previous messages.
                            If user input is off-topic, provide a short concierge-appropriate response while acknowledging previous conversation flow.
                            Function Calls:
                            Execute only when all required parameters are available.
                            Do not assume values or use blank/None/null.
                            Follow up with the guest for missing information.
                            Avoid using newline characters
                            Summarize everything
                            Additional Considerations:
                            Maintain a friendly and helpful tone.
                            Use language appropriate for a hotel setting.
                            Adapt responses based on user preferences and history (if available).
                            Strive to resolve guest inquiries efficiently and effectively.
                            Strictly provide any message with proper punctuation and spaces.
                            Do not give any  new line character's or any special characters that would confuse the user.
                            The year is 2024. Todays date is {presentDate} 
                            """,
        }
        messages = [system_message]
        if prev_message:
            messages = messages + prev_message

        if guest_email != None:
            messages.extend(
                [
                    {"role": "system", "content": f"Guest_email: {guest_email}"},
                    {"role": "system", "content": f"Guest_Id: {guest_id}"},
                    {"role": "system", "content": f"Hotel Id: 1"},
                ]
            )

        if guest_email != None:
            messages.extend(
                [
                    {"role": "system", "content": f"Guest_email: {guest_email}"},
                    {"role": "system", "content": f"Guest_Id: {guest_id}"},
                    {"role": "system", "content": f"Hotel Id: 1"},
                ]
            )

        if user_message.lower().endswith((".wav", ".mp3", ".flac")):
            audio_text = transcribe_audio(user_message, subscription_key, region)
            assistant_input = {"role": "user", "content": audio_text}

            messages.extend(
                [
                    assistant_input,
                ]
            )
        else:
            messages.extend(
                [
                    {"role": "user", "content": user_message},
                ]
            )
        # messages.extend([{"role": "system", "content": "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous."}])

        # messages.extend([{"role": "system", "content": f"Hotel Id: 1"},{"role":"system","content":".Generate a response to the user's question without any newline characters."},{"role": "user", "content": "Call the function Strictly when you have all required parameters else do not make the function call. Do not assume values or take them blank or None or null. Follwup with the guest for such values"}])

        assistant_message = get_answers(messages)
        print("assistant message", type(assistant_message))

        # Convert the assistant's response to voice
        # audio_output_path = text_to_speech(assistant_message, subscription_key, region)

        # #messages.append({"role": "assistant", "content": assistant_message.replace('\r\n', ''), "audio": audio_output_path})
        # print("messages: -> :", messages)
        # return jsonify({"assistant_message": assistant_message.replace('\n', ' '), "audio_output_path": audio_output_path})
        return jsonify({"assistant_message": assistant_message.replace("\n", ". ")})
        # messages.append({"assistant_message": assistant_message.replace('\r\n', ''), "audio_output_path": audio_output_path})
        # print("messages: -> :", messages)
        # return jsonify({"role": "assistant", "content": assistant_message.replace('\r\n', ''), "audio": audio_output_path})

    except Exception as e:
        print("ERROORRRRRRR-------->", str(e))
        return jsonify({"error": str(e)}), 500
