import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file")
    sys.exit(1)

supabase: Client = create_client(url, key)
bucket_name = "invitation-assets"

# Frontend path to files
files_to_upload = [
    "../frontend/public/assets/banks/bca.png",
    "../frontend/public/assets/banks/bni.png",
    "../frontend/public/assets/banks/bri.png",
    "../frontend/public/assets/banks/mandiri.png",
    "../frontend/public/assets/banks/card-banks.png",
    "../frontend/assets/banks/card.png"
]

public_urls = {}

for file_path in files_to_upload:
    if os.path.exists(file_path):
        file_name = os.path.basename(file_path)
        supabase_path = f"static_banks/{file_name}"
        
        try:
            # Check if file exists in bucket, if so just get the URL
            # To overwrite, we just upload and ignore if it exists, or handle exception.
            print(f"Uploading {file_name}...")
            with open(file_path, "rb") as f:
                res = supabase.storage.from_(bucket_name).upload(
                    file=f,
                    path=supabase_path,
                    file_options={"cache-control": "3600", "upsert": "true"}
                )
            # Get public url
            public_url = supabase.storage.from_(bucket_name).get_public_url(supabase_path)
            public_urls[file_name] = public_url
            print(f"Success: {public_url}")
        except Exception as e:
            # If already exists or error
            print(f"Failed to upload {file_name} (might already exist): {e}")
            public_url = supabase.storage.from_(bucket_name).get_public_url(supabase_path)
            public_urls[file_name] = public_url
            print(f"Fallback URL: {public_url}")
    else:
        print(f"File not found: {file_path}")

print("\n--- FINAL URLS ---")
for fname, purl in public_urls.items():
    print(f"'{fname}': '{purl}'")
