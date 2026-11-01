import os, sys
sys.stdout.reconfigure(encoding='utf-8')
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('backend/.env')
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

client = create_client(url, key)
res = client.table('papers').select('title, publication_year, journal, doi, citation_count').limit(10).execute()

print(f"Total Papers Retrieved: {len(res.data)}")
for idx, p in enumerate(res.data):
    print(f"\n[{idx+1}] ({p.get('publication_year')}) {p.get('title')}")
    print(f"    Journal: {p.get('journal')}")
    print(f"    DOI: {p.get('doi')}")
    print(f"    Citations: {p.get('citation_count')}")
