from sqlalchemy import create_engine, MetaData, Table
 
 
# Define SQLAlchemy engine for each database
user_profiles_engine = create_engine(
    "postgresql://postgres:1234@localhost:5432/User DB"
)

billing_engine = create_engine(
    "postgresql://postgres:1234@localhost:5432/Billing DB"
)

manager_engine = create_engine(
    "postgresql://postgres:1234@localhost:5432/Manager DB"
)
 
# user_profiles_engine = create_engine(
#     "postgresql://postgres:Password1@localhost:5432/User profiles DB"
# )

# billing_engine = create_engine(
#     "postgresql://postgres:Password1@localhost:5432/Billing DB"
# )

# manager_engine = create_engine(
#     "postgresql://postgres:Password1@localhost:5432/Manager DB"
# )
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