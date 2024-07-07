## Main

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")


user_db_connection = psycopg2.connect(
    dbname="User profiles DB",
    user="conciergebot",
    password="passwordDev@2023",
    host="conciergebot.postgres.database.azure.com",
    port="5432"
)

billing_db_connection = psycopg2.connect(
    dbname="Billing DB",
    user="conciergebot",
    password="passwordDev@2023",
    host="conciergebot.postgres.database.azure.com",
    port="5432"
)

manager_db_connection = psycopg2.connect(
    dbname="Manager DB",
    user="conciergebot",
    password="passwordDev@2023",
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

def get_BillData():
   cursor = billing_db_connection.cursor()
   cursor.execute('SELECT * FROM "Billing";')
   results = cursor.fetchall()
   columns = [desc[0] for desc in cursor.description]  # Get column names

   bills = [dict(zip(columns, row)) for row in results]

   cursor.close()
   return bills

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

@app.route('/room',methods=['GET'])
def index_room():
    cursor=manager_db_connection.cursor()
    cursor.execute('SELECT * FROM "Room"')
    results=cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    RoomData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return jsonify(RoomData=RoomData)

# @app.route('/servicedata',methods=['GET'])
# def index_services():
#     Servicesdata=get_services()
#     return jsonify(Servicesdata=Servicesdata)

# API endpoint to fetch services based on Room_Number
@app.route('/services', methods=['GET'])
def get_services():
    cursor=manager_db_connection.cursor()
    Room_Number = request.args.get('Room_Number')
    # Execute SQL query to fetch services based on Room_Number
    cursor.execute('SELECT * FROM "Services" WHERE "Room_Number" = %s', (Room_Number,))
    results=cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # Get column names
    ServicesData = [dict(zip(columns, row)) for row in results]
    cursor.close()
    return ServicesData


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

@app.route('/billing', methods=['GET'])
def index_billing():
    Bills=get_BillData()
    return jsonify(Bills=Bills)

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
    

if __name__ == '__main__':
    app.run(debug=True,host='127.0.0.1', port=5000)
 