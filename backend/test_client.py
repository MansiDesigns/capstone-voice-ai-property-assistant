import requests
import json

URL = "http://127.0.0.1:8000/chat"
SESSION_ID = "test-session-123"

def send_message(message: str):
    print(f"\nUser: {message}")
    response = requests.post(
        URL, 
        json={"session_id": SESSION_ID, "message": message}
    )
    if response.status_code == 200:
        data = response.json()
        print(f"Assistant: {data['response']}".encode('ascii', 'ignore').decode('ascii'))
    else:
        print(f"Error: {response.status_code} - {response.text}")

def main():
    print("Testing Voice-Based AI Property Assistant API...")
    send_message("Hi, I am looking for a 2BHK in Indiranagar.")
    send_message("My budget is 45000.")
    send_message("Is Indiranagar safe at night?")
    send_message("Are there any metro stations nearby?")
    
if __name__ == "__main__":
    main()
