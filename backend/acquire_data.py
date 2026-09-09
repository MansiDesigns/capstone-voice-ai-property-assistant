import os
import psycopg2
import urllib.request
import json
import ssl
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = "https://mpnjtkqklmwczowhodfh.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbmp0a3FrbG13Y3pvd2hvZGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDY1MDUsImV4cCI6MjA5MDc4MjUwNX0.URKz4_8q1I4VLAyxyvhF37xeM_XnQ2S6ncOfKKL3GD0"

def fetch_data():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    url = f"{SUPABASE_URL}/rest/v1/pins_public?select=*"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }

    req = urllib.request.Request(url, headers=headers)
    try:
        response = urllib.request.urlopen(req, context=ctx).read()
        return json.loads(response)
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []

def init_db():
    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME', 'property_db'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', 'postgres'),
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432')
    )
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS properties (
            id TEXT PRIMARY KEY,
            lat REAL,
            lng REAL,
            rent_amount REAL,
            bhk TEXT,
            sqft REAL,
            furnished BOOLEAN,
            gated BOOLEAN,
            society TEXT,
            feedback TEXT,
            occupant_type TEXT,
            available_from TEXT
        )
    ''')
    conn.commit()
    return conn

def load_data(conn, data):
    cursor = conn.cursor()
    count = 0
    for row in data:
        # Filter explicitly marked 'Not for rent'
        if row.get('pin_kind') == 'not_for_rent':
            continue
            
        # Sanitize PII
        for key in list(row.keys()):
            if 'name' in key.lower() or 'phone' in key.lower() or 'email' in key.lower() or 'contact' in key.lower():
                del row[key]
                
        cursor.execute('''
            INSERT INTO properties 
            (id, lat, lng, rent_amount, bhk, sqft, furnished, gated, society, feedback, occupant_type, available_from)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                lat=EXCLUDED.lat, lng=EXCLUDED.lng, rent_amount=EXCLUDED.rent_amount,
                bhk=EXCLUDED.bhk, sqft=EXCLUDED.sqft, furnished=EXCLUDED.furnished,
                gated=EXCLUDED.gated, society=EXCLUDED.society, feedback=EXCLUDED.feedback,
                occupant_type=EXCLUDED.occupant_type, available_from=EXCLUDED.available_from
        ''', (
            row.get('id'),
            row.get('lat'),
            row.get('lng'),
            row.get('rent_amount'),
            str(row.get('bhk')),
            row.get('sqft'),
            bool(row.get('furnished')),
            bool(row.get('gated')),
            row.get('society'),
            row.get('feedback'),
            row.get('occupant_type'),
            row.get('available_from')
        ))
        count += 1
    conn.commit()
    print(f"Successfully loaded {count} properties into PostgreSQL database.")

def main():
    print("Fetching data from bengaluru.rent (Supabase)...")
    data = fetch_data()
    print(f"Fetched {len(data)} raw records.")
    
    print("Connecting to PostgreSQL...")
    conn = init_db()
    
    print("Filtering, sanitizing, and loading data into PostgreSQL...")
    load_data(conn, data)
    conn.close()

if __name__ == '__main__':
    main()
