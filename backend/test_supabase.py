import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbmp0a3FrbG13Y3pvd2hvZGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDY1MDUsImV4cCI6MjA5MDc4MjUwNX0.URKz4_8q1I4VLAyxyvhF37xeM_XnQ2S6ncOfKKL3GD0",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbmp0a3FrbG13Y3pvd2hvZGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDY1MDUsImV4cCI6MjA5MDc4MjUwNX0.URKz4_8q1I4VLAyxyvhF37xeM_XnQ2S6ncOfKKL3GD0",
    "Range": "0-4"
}

def fetch_table(table):
    url = f"https://mpnjtkqklmwczowhodfh.supabase.co/rest/v1/{table}?select=*"
    req = urllib.request.Request(url, headers=headers)
    try:
        response = urllib.request.urlopen(req, context=ctx).read()
        print(f"\n{table} table:")
        print(json.dumps(json.loads(response), indent=2))
    except urllib.error.HTTPError as e:
        print(f"HTTPError on {table}: {e.code} - {e.read().decode('utf-8')}")

for t in ["message_board", "comments", "ratings"]:
    fetch_table(t)
