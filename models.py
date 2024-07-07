from sqlalchemy import Table, Column, Integer, String, ForeignKey, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from db import guests_table , services_table , room_table , reservation_table , preferences_table , recommendation_table , billing_table , staff_table , hotel_table , booking_table
import base64
 
 
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