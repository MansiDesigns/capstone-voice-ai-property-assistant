import urllib.request
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

html = urllib.request.urlopen('https://bengaluru.rent/', context=ctx).read().decode('utf-8')

table_matches = re.findall(r'from\([\'"]([^\'"]+)[\'"]\)', html)
print('Supabase Tables:', set(table_matches))
