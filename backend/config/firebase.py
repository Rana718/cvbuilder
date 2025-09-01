import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    try:
        firebase_config = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
        if firebase_config:
            cred = credentials.Certificate(firebase_config)
        else:
            cred = credentials.ApplicationDefault()
        
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Firebase initialization failed: {e}")

def verify_firebase_token(token: str):
    """Verify Firebase ID token and return decoded token"""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Firebase token verification failed: {e}")
        return None

def set_custom_user_claims(uid: str, claims: dict):
    try:
        # Check if user exists in Firebase first
        auth.get_user(uid)
        auth.set_custom_user_claims(uid, claims)
        print(f"Custom claims set for user {uid}: {claims}")
    except auth.UserNotFoundError:
        print(f"Firebase user {uid} not found, skipping custom claims")
    except Exception as e:
        print(f"Failed to set custom claims: {e}")