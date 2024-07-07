#app.py
 
from flask import Flask
from flask_cors import CORS
from sqlalchemy.orm import sessionmaker
from db import user_profiles_engine, billing_engine, manager_engine, metadata
from models import Base
from routes import app as routes_app
import openai
 
 
openai.api_key = "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"
messages = [{"role": "system", "content": "You are an intelligent assistant"}]
subscription_key = "7f3f190f4ddd4273989358d304df47d7"
region = "centralindia"
 
app = Flask(__name__)
CORS(app, origins="http://localhost:3000")
 
# Reflect tables and create sessionmakers
Base.metadata.create_all(user_profiles_engine)
Base.metadata.create_all(billing_engine)
Base.metadata.create_all(manager_engine)
 
UserProfilesSession = sessionmaker(bind=user_profiles_engine)
BillingSession = sessionmaker(bind=billing_engine)
ManagerSession = sessionmaker(bind=manager_engine)
 
if __name__ == '__main__':
    routes_app.run(debug=True, host='127.0.0.1', port=5000)