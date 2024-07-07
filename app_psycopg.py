## Main
# from transformers import BertTokenizer, BertForSequenceClassification
# import torch
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import psycopg2
import openai
import os
import openai

openai.api_key = "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"
messages=[{"role":"system","content":"You are an intelligent assistant"}]

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")





user_db_connection = psycopg2.connect(
    dbname="User profiles DB",
    user="conciergebot",
    password="password1234-",
    host="conciergebot.postgres.database.azure.com",
    port="5432"
)

billing_db_connection = psycopg2.connect(
    dbname="Billing DB",
    user="conciergebot",
    password="password1234-",
    host="conciergebot.postgres.database.azure.com",
    port="5432"
)

manager_db_connection = psycopg2.connect(
    dbname="Manager DB",
    user="conciergebot",
    password="password1234-",
    host="conciergebot.postgres.database.azure.com",
    port="5432"
)

# Function to fetch data from the database
def get_hotel():
    cursor = manager_db_connection.cursor()
    cursor.execute('SELECT * FROM "Hotel";')
    results = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    Hotels = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return Hotels


def get_guestData():
    cursor = user_db_connection.cursor()
    cursor.execute('SELECT * FROM "Guest"')
    results = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  
    GuestData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return GuestData



def get_reservationData():
    cursor = manager_db_connection.cursor()
    cursor.execute('SELECT * FROM "Reservation";')
    results = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    ReservationtData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return ReservationtData

def get_preferancesData():
    cursor=user_db_connection.cursor()
    cursor.execute('SELECT * FROM "Preferances"')
    results = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    PreferancesData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return PreferancesData

# def get_recommendation(guest_id):
#     cursor=user_db_connection.cursor()
#     cursor.execute('SELECT * FROM "Recommendation" WHERE "Guest_ID"=%s',(guest_id,))
#     results=cursor.fetchall()
#     columns = [desc[0] for desc in cursor.description]  # Get column names
#     RecommendationData = [dict(zip(columns, row)) for row in results]
#     cursor.close()
#     return RecommendationData

def get_services():
    cursor=manager_db_connection.cursor()
    cursor.execute('SELECT * FROM "Services"')
    results=cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    ServicesData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return ServicesData

@app.route('/staff',methods=['GET'])
def index_staff():
    cursor=manager_db_connection.cursor()
    cursor.execute('SELECT * FROM "Staff"')
    results=cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    StaffData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return jsonify(StaffData=StaffData)

# @app.route('/room',methods=['GET'])
# def index_room():
#     cursor=manager_db_connection.cursor()
#     cursor.execute('SELECT * FROM "Room"')
#     results=cursor.fetchall()
#     columns = [desc[0] for desc in cursor.description]  # Get column names
#     RoomData = [dict(zip(columns, row)) for row in results]
#     cursor.close()
#     return jsonify(RoomData=RoomData)


@app.route('/room', methods=['GET'])
def get_room():
    cursor = manager_db_connection.cursor()
    Hotel_Id = request.args.get('Hotel_Id')
    cursor.execute('SELECT * FROM "Room" WHERE "Hotel_Id" = %s AND "Guest_Id" IS NOT NULL ORDER BY "Room_Number" ASC', (Hotel_Id,))
    results = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    RoomData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return jsonify({"RoomData": RoomData})

@app.route('/room_empty', methods=['GET'])
def get_room_empty():
    cursor = manager_db_connection.cursor()
    Hotel_Id = request.args.get('Hotel_Id')
    cursor.execute('SELECT * FROM "Room" WHERE "Hotel_Id" = %s AND "Guest_Id" IS NULL ORDER BY "Room_Number" ASC', (Hotel_Id,))
    results = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    EmptyRoomData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return jsonify({"EmptyRoomData": EmptyRoomData})

# API endpoint to fetch services based on Room_Number
@app.route('/services', methods=['GET'])
def get_services():
    cursor=manager_db_connection.cursor()
    Room_Id = request.args.get('Room_Id')
    # Execute SQL query to fetch services based on Room_Id
    cursor.execute('SELECT * FROM "Services" WHERE "Room_Id" = %s ORDER BY "Service_Id" ASC', (Room_Id,))
    results=cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    ServicesData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return ServicesData

@app.route('/insert_service', methods=['POST'])
def insert_service():
    cursor=manager_db_connection.cursor()
    # Room_Number = request.args.get('Room_Number')
    # Execute SQL query to fetch services based on Room_Number
    data = request.get_json()
    service_name = data.get('Service_Name')
    service_dept = data.get('Service_Dept')
    service_status = data.get('Service_Status')
    cursor.execute('INSERT INTO "Services"( "Service_Name", "Service_Dept", "Service_Status")VALUES ( %s, %s, %s);', (service_name,service_dept,service_status))
    # results=cursor.fetchall()
    manager_db_connection.commit()
    # columns = [desc[0] for desc in cursor.description]  # Get column names
    # ServicesData = [dict(zip(columns, row)) for row in results]  
    cursor.close()
    return jsonify({'message': 'Service updated successfully'})

@app.route('/insert_preferences', methods=['POST'])
def insert_preferences():
    cursor=user_db_connection.cursor()
    data = request.get_json()
    Guest_Id = data.get('Guest_Id')
    Preferance_Type = data.get('Preferance_Type')
    Preferance_Description = data.get('Preferance_Description')
    cursor.execute('INSERT INTO "Preferances"( "Guest_Id", "Preferance_Type", "Preferance_Description")VALUES ( %s, %s, %s);', (Guest_Id,Preferance_Type,Preferance_Description))
    # results=cursor.fetchall()
    user_db_connection.commit()
    cursor.close()
    return jsonify({'message': 'Service updated successfully'})

@app.route('/services_user', methods=['GET'])
def get_servicesUser():
    cursor=manager_db_connection.cursor()
    Guest_Id = request.args.get('Guest_Id')
    # Execute SQL query to fetch services based on Guest_Id
    cursor.execute('SELECT "s".* FROM "Services" "s" JOIN "Room" "r" ON "s"."Room_Number" = "r"."Room_Number"  WHERE "r"."Guest_Id"  = %s ORDER BY "Service_Id" ASC', (Guest_Id,))
    results=cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    ServicesUserData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return ServicesUserData

# @app.route('/rooms', methods=['GET'])
# def get_roomHotel():
#     cursor=manager_db_connection.cursor()
#     Hotel_Id = request.args.get('Hotel_Id')
#     cursor.execute('SELECT * FROM "Room" WHERE "Hotel_Id" = %s', (Hotel_Id,))
#     results=cursor.fetchall()
#     columns = [desc[0] for desc in cursor.description]  # Get column names
#     RoomHotelData = [dict(zip(columns, row)) for row in results]
#     cursor.close()
#     return RoomHotelData


@app.route('/reservation', methods=['POST'])
def index_reservation():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    cursor=manager_db_connection.cursor()
    cursor.execute('SELECT "Reservation".* FROM "Reservation" JOIN "Services" ON "Reservation"."Service_Id" = "Services"."Service_Id" JOIN "Room" ON "Room"."Room_Number" = "Services"."Room_Number" WHERE "Room"."Guest_Id" = %s', (guest_id,))
    reservations = cursor.fetchall()
    if reservations:
        return jsonify({'Reservation_Details': [dict(zip([column[0] for column in cursor.description], row)) for row in reservations]})
    else:
        return jsonify({'message': 'failed'}), 401

@app.route('/post_guest', methods=['POST'])
def post_guest():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    cursor=user_db_connection.cursor()
    cursor.execute('SELECT * FROM "Guest" WHERE "Guest"."Guest_Id" = %s', (guest_id,))
    guest = cursor.fetchall()
    if guest:
        return jsonify({'Guest_Details': [dict(zip([column[0] for column in cursor.description], gues)) for gues in guest]})
    else:
        return jsonify({'message': 'failed'}), 401

@app.route('/preferences', methods=['POST'])
def index_preference():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    cursor=user_db_connection.cursor()
    cursor.execute('SELECT * FROM "Preferances" WHERE "Guest_Id" = %s', (guest_id,))
    user = cursor.fetchall()
    if user:
        return jsonify({'Preferences_Details': [dict(zip([column[0] for column in cursor.description], ro)) for ro in user]})
    else:
        return jsonify({'message': 'failed'}), 401

@app.route('/recommendation', methods=['POST'])
def index_recommendation():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    cursor=user_db_connection.cursor()
    cursor.execute('SELECT * FROM "Recommendation" WHERE "Guest_Id" = %s', (guest_id,))
    user = cursor.fetchall()
    if user:
        return jsonify({'Recommendation_Details': [dict(zip([column[0] for column in cursor.description], r)) for r in user]})
    else:
        return jsonify({'message': 'failed'}), 401
    
@app.route('/billing', methods=['POST'])
def index_billing():
    data = request.get_json()
    guest_id = data.get('Guest_Id')
    cursor=billing_db_connection.cursor()
    # Execute SQL query to fetch services based on Room_Number
    cursor.execute('SELECT * FROM "Billing" WHERE "Guest_Id" = %s', (guest_id,))
    results=cursor.fetchall()
    if results:
        return jsonify({'Bills': [dict(zip([column[0] for column in cursor.description], r)) for r in results]})
    else:
        return jsonify({'message': 'failed'}), 401
    # columns = [desc[0] for desc in cursor.description]  # Get column names
    # Bills = [dict(zip(columns, row)) for row in results]
    # cursor.close()
    # return Bills

# @app.route('/reservation', methods=['GET'])
# def index_reservation():
#     Reservationdata=get_reservationData()
#     return jsonify(Reservationdata=Reservationdata)

@app.route('/preferances', methods=['GET'])
def index_preferances():
    Preferancesdata=get_preferancesData()
    return jsonify(Preferancesdata=Preferancesdata)

@app.route('/guest', methods=['GET'])
def index_guest():
    GuestData=get_guestData()
    return jsonify(GuestData=GuestData)


@app.route('/hotel', methods=['GET'])
def index_hotel():
    Hotels = get_hotel()
    return jsonify( Hotels=Hotels)


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    
    cursor=user_db_connection.cursor()
    cursor.execute('SELECT * FROM "Guest" WHERE "Guest_email" = %s AND "Guest_email_password" = %s', (email, password))
    user = cursor.fetchone()

    if user:
        return jsonify({'Guest_Details': dict(zip([column[0] for column in cursor.description], user))})
    else:
        return jsonify({'message': 'Login failed'}), 401
@app.route('/city',methods=['POST'])
def city():
    data = request.get_json()
    state = data.get('state')
    cursor = manager_db_connection.cursor()
    cursor.execute('SELECT DISTINCT "Hotel_City" FROM "Hotel" WHERE "Hotel_State" = %s', (state,))
    results = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  
    Citydata = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return Citydata

@app.route('/roomAvailability',methods=['POST'])
def roomAvailability():
    data = request.get_json()
    hotelId = data.get('Hotel_Id')
    roomType = data.get('Room_Type')
    noOfBeds = data.get('No_of_Beds')
    checkin = data.get('CheckIn_Time')
    checkout = data.get('CheckOut_Time')
    cursor = manager_db_connection.cursor()
    cursor.execute('SELECT  "Room_Id" FROM "Room" WHERE "Room_Type" = %s AND "Hotel_Id" = %s AND "No_of_Beds" >= %s ', (roomType,hotelId,noOfBeds))
    results = cursor.fetchall() 
    columns = [desc[0] for desc in cursor.description]  
    availableData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return availableData

@app.route('/hotelname',methods=['POST'])
def hotelname():
    data = request.get_json()
    state = data.get('state')
    city = data.get('city')
    cursor = manager_db_connection.cursor()
    cursor.execute('SELECT * FROM "Hotel" WHERE "Hotel_State" = %s AND "Hotel_City" = %s', (state,city,))
    results = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  
    Citydata = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return Citydata  

@app.route('/service_update', methods=['PUT'])
def service_update():
    data = request.get_json()
    service_id = data.get('Service_Id')
    service_name = data.get('Service_Name')
    service_dept = data.get('Service_Dept')
    service_status = data.get('Service_Status')
    
    cursor=manager_db_connection.cursor()
    
    cursor.execute('UPDATE "Services" SET "Service_Name" = %s, "Service_Dept" = %s, "Service_Status" = %s WHERE "Service_Id" = %s',
                   (service_name, service_dept, service_status, service_id,))
    manager_db_connection.commit()
    
    cursor.close()
    return jsonify({"Message ":"Updated Successfully"})

@app.route('/service_assign', methods=['PUT'])
def service_assign():
    data = request.get_json()
    service_id = data.get('Service_Id')
    Staff_Id = data.get('Staff_Id')
    
    cursor=manager_db_connection.cursor()
    
    cursor.execute('UPDATE "Services" SET "Staff_Id" = %s WHERE "Service_Id" = %s',
                   (Staff_Id, service_id,))
    manager_db_connection.commit()
    
    cursor.close()
    return jsonify({"Message ":"Updated Successfully"})

@app.route('/staff_update', methods=['PUT'])
def staff_update():
    data = request.get_json()
    Staff_id = data.get('Staff_Id')
    Staff_name = data.get('Staff_Name')
    Staff_dept = data.get('Staff_Dept')
    Staff_status = data.get('Staff_Status')
    
    cursor=manager_db_connection.cursor()
    
    cursor.execute('UPDATE "Staff" SET "Staff_Name" = %s, "Staff_Dept" = %s, "Staff_Status" = %s WHERE "Staff_Id" = %s',
                   (Staff_name, Staff_dept, Staff_status, Staff_id))
    manager_db_connection.commit()
    
    cursor.close()
    return jsonify({"Message ":"Updated Successfully"})

@app.route('/room_update', methods=['PUT'])
def room_update():
    data = request.get_json()
    Room_number = data.get('Room_Number')
    Room_price = data.get('Room_Price')
    Room_type = data.get('Room_Type')
    
    cursor=manager_db_connection.cursor()
    
    cursor.execute('UPDATE "Room" SET "Room_Price" = %s, "Room_Type" = %s WHERE "Room_Number" = %s',
                   (Room_price, Room_type, Room_number))
    manager_db_connection.commit()
    
    cursor.close()
    return jsonify({"Message ":"Updated Successfully"})

@app.route('/bill_update', methods=['PUT'])
def bill_update():
    data = request.get_json()
    Billing_Id = data.get('Billing_Id')
    Order_Name = data.get('Order_Name')
    Order_Department = data.get('Order_Department')
    Order_Price = data.get('Order_Price')
    Billing_Status = data.get('Billing_Status')
    
    cursor=billing_db_connection.cursor()
    
    cursor.execute('UPDATE "Billing" SET "Order_Name" = %s, "Order_Department" = %s, "Order_Price" = %s, "Billing_Status" = %s WHERE "Billing_Id" = %s',
                   (Order_Name, Order_Department, Order_Price, Billing_Status, Billing_Id))
    billing_db_connection.commit()
    
    cursor.close()
    return jsonify({"Message ":"Updated Successfully"})

@app.route('/recommendation_update', methods=['PUT'])
def recommendation_update():
    data = request.get_json()
    Recommendation_Id = data.get('Recommendation_Id')
    Recommendation_Name = data.get('Recommendation_Name')
    Recommendation_Type = data.get('Recommendation_Type')
    Recommendation_Rating = data.get('Recommendation_Rating')
    
    cursor=user_db_connection.cursor()
    
    cursor.execute('UPDATE "Recommendation" SET "Recommendation_Name" = %s, "Recommendation_Type" = %s, "Recommendation_Rating" = %s WHERE "Recommendation_Id" = %s',
                   (Recommendation_Name, Recommendation_Type, Recommendation_Rating, Recommendation_Id))
    user_db_connection.commit()
    
    cursor.close()
    return jsonify({"Message ":"Updated Successfully"})
    
@app.route('/reservation_update', methods=['PUT'])
def reservation_update():
    data = request.get_json()
    Reservation_Id = data.get('Reservation_Id')
    Reservation_Type = data.get('Reservation_Type')
    Reservation_Status = data.get('Reservation_Status')
    Reservation_Description = data.get('Reservation_Description')
    
    cursor=manager_db_connection.cursor()
    
    cursor.execute('UPDATE "Reservation" SET "Reservation_Type" = %s, "Reservation_Status" = %s, "Reservation_Description" = %s WHERE "Reservation_Id" = %s',
                   (Reservation_Type, Reservation_Status,  Reservation_Description, Reservation_Id))
    manager_db_connection.commit()
    
    cursor.close()
    return jsonify({"Message ":"Updated Successfully"})

@app.route('/preference_update', methods=['PUT'])
def preference_update():
    data = request.get_json()
    Preferance_Id = data.get('Preferance_Id')
    Food_Preferance = data.get('Food_Preferance')
    Medical_Condition_Preferance = data.get('Medical_Condition_Preferance')
    Cab_Preferance = data.get('Cab_Preferance')
    Room_Preferance = data.get('Room_Preferance')
    Allergic_to = data.get('Allergic_to')
    
    cursor=user_db_connection.cursor()
    
    cursor.execute('UPDATE "Preferances" SET "Food_Preferance" = %s, "Medical_Condition_Preferance" = %s, "Cab_Preferance" = %s, "Room_Preferance" = %s, "Allergic_to" = %s WHERE "Preferance_Id" = %s',
                   (Food_Preferance, Medical_Condition_Preferance,  Cab_Preferance, Room_Preferance, Allergic_to, Preferance_Id))
    user_db_connection.commit()
    
    cursor.close()
    return jsonify({"Message ":"Updated Successfully"})

@app.route('/adminlogin', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    
    cursor=manager_db_connection.cursor()
    cursor.execute('SELECT * FROM "Staff" WHERE "Staff_email" = %s AND "Staff_email_password" = %s', (email, password))
    staff = cursor.fetchone()

    if staff:
        return jsonify({'Staff_Details': dict(zip([column[0] for column in cursor.description], staff))})
    else:
        return jsonify({'message': 'Login failed'}), 401

# messages = []

# @app.route("/chat", methods=["POST"])
# def chat():
#     """Generates a response to a chat message."""
#     message = request.get_json()["message"]
#     messages.append({"role": "system", "content": message})
#     # if(is_related_to_hotel_using_bert(message)):
#     chat = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
#     reply = chat.choices[0].message.content
#     # else:
#     #     reply = "Aks me questions related to our services...."
#     messages.append({"role": "assistant", "content": reply})
#     return jsonify({"message": reply})

# def is_related_to_specific_topics(message):
#     # Implement your logic to determine if the message is related to specific topics
#     # For example, you can use keyword matching or a more sophisticated approach.
#     topics = ["hotel", "concierge", "services","conversation"]
#     return any(topic in message.lower() for topic in topics)

# @app.route("/chat", methods=["POST"])
# def chat():
#     """Generates a response to a chat message."""
#     try:
#         message = request.get_json()["message"]
#     except KeyError:
#         return jsonify({"error": "Invalid request format"}), 400

#     system_message = {"role": "system", "content": "You are a concierge bot. Provide information related strictly to hotels, concierge services if the user input is related to some other topic please give a short response as a concierge bot"}
#     messages.append(system_message)
#     messages.append({"role": "user", "content": message})

#     chat = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
#     reply = chat.choices[0].message.content
#     # if is_related_to_specific_topics(message):
#     #     chat = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
#     #     reply = chat.choices[0].message.content
#     # else:
#     #     # reply = "Please keep your questions limited to hoteland concierge related topics."
#     #     chat = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
#     #     reply = chat.choices[0].message.content

#     messages.append({"role": "assistant", "content": reply})
#     return jsonify({"message": reply})
def get_answers(out):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=out,
        temperature=0,
        max_tokens=600,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None
    )
    ansr = response.choices[0].message['content']
    # print("OpenAI API Response:", response) 
    return ansr


message = [
    
    {"role": "user", "content": "What are the amenities provided by the hotel?"},
    {"role": "assistant", "content": "The hotel provides a range of amenities, including a pool, gym, spa, and complimentary breakfast."},
    {"role": "user", "content": "Can I check in early or late?"},
    {"role": "assistant", "content": "Early check-in and late check-out options are available upon request, subject to availability. Additional charges may apply."},
    
    # Add more user and assistant interactions as needed for your specific use case
]


@app.route("/chat", methods=["POST"])
def chat():

    try:
        user_message = request.get_json()["message"]
    except KeyError:
        return jsonify({"error": "Invalid request format"}), 400

    system_message = {"role": "system", "content": "You are a concierge bot. Provide information related strictly to hotels, concierge services if the user input is related to some other topic please give a short response as a concierge bot"}
    messages.append(system_message)

    
    current_messages = messages.copy()  # Create a copy of the current conversation
    current_messages.append({"role": "user", "content": user_message})

    print("Current Messages:", current_messages)  # Add this print statement

    assistant_message = get_answers(current_messages)
    current_messages.append({"role": "assistant", "content": assistant_message})

    print("Assistant Message:", assistant_message)  # Add this print statement

    return jsonify({"assistant_message": assistant_message})

 

if __name__ == '__main__':
    app.run(debug=True,host='127.0.0.1', port=5000)
 