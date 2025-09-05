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

def check_firebase_connection():
    """Check if Firebase Admin SDK is properly initialized and working"""
    try:
        if not firebase_admin._apps:
            return {"connected": False, "error": "Firebase app not initialized"}
        
        app = firebase_admin.get_app()
        project_id = app.project_id if hasattr(app, 'project_id') else "unknown"
        
        return {
            "connected": True, 
            "project_id": project_id,
            "message": "Firebase Admin SDK is properly initialized"
        }
    except Exception as e:
        return {"connected": False, "error": f"Firebase connection failed: {str(e)}"}

def set_custom_user_claims(uid: str, claims: dict):
    try:
        if not uid or uid.strip() == "":
            print("No Firebase UID provided, skipping custom claims")
            return False

        user = auth.get_user(uid)
        existing_claims = user.custom_claims or {}

        # Merge existing and new claims
        merged_claims = {**existing_claims, **claims}

        auth.set_custom_user_claims(uid, merged_claims)
        print(f"Custom claims set for user {uid}: {merged_claims}")
        return True

    except auth.UserNotFoundError:
        print(f"Firebase user {uid} not found, skipping custom claims")
        return False
    except Exception as e:
        if "Invalid JWT Signature" in str(e):
            print(f"Firebase authentication failed - possibly invalid service account key or Firebase user {uid} doesn't exist in this project")
        else:
            print(f"Failed to set custom claims: {e}")
        return False

def remove_custom_user_claims(uid: str, claim_keys: list = None):
    """Remove specific custom claims from user or remove all claims if claim_keys is None"""
        
    try:
        # Skip if no UID provided
        if not uid or uid.strip() == "":
            print("No Firebase UID provided, skipping custom claims removal")
            return False
            
        user = auth.get_user(uid)
        existing_claims = user.custom_claims or {}
        
        # If claim_keys is None, remove all admin-related claims
        if claim_keys is None:
            claim_keys = ["isAdmin", "isSuperAdmin", "dbUser"]
        
        for key in claim_keys:
            existing_claims.pop(key, None)
        
        auth.set_custom_user_claims(uid, existing_claims)
        return True
        
    except auth.UserNotFoundError:
        print(f"Firebase user {uid} not found, cannot remove claims")
        return False
    except Exception as e:
        if "Invalid JWT Signature" in str(e):
            print(f"Firebase authentication failed - possibly invalid service account key or Firebase user {uid} doesn't exist in this project")
        else:
            print(f"Failed to remove custom claims for user {uid}: {e}")
        return False