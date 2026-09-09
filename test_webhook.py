import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

webhook_url = os.getenv("N8N_WEBHOOK_URL", "http://localhost:5678/webhook/shortlist")

payload = {
    "email": "test@example.com",
    "shortlist": [
        {
            "id": "PROP-001",
            "society": "Prestige Shantiniketan",
            "rent_amount": 45000,
            "bhk": "3",
            "sqft": 1800
        },
        {
            "id": "PROP-002",
            "society": "Brigade Gateway",
            "rent_amount": 55000,
            "bhk": "3",
            "sqft": 2000
        },
        {
            "id": "PROP-003",
            "society": "Sobha City",
            "rent_amount": 35000,
            "bhk": "2",
            "sqft": 1200
        }
    ]
}

print(f"Sending test payload to: {webhook_url}")
try:
    response = requests.post(webhook_url, json=payload)
    if response.status_code == 200:
        print("Success! Webhook received the payload.")
        print("Response:", response.text)
    else:
        print(f"Failed. Status code: {response.status_code}")
        print("Response:", response.text)
except Exception as e:
    print(f"Error making request: {e}")
