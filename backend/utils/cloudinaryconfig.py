import cloudinary
import cloudinary.uploader
import os


api_key = os.getenv("CLOUDINARY_API_KEY")
cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
api_secret = os.getenv("CLOUDINARY_API_SECRET")

cloudinary.config(
    cloud_name = cloud_name,
    api_key = api_key,
    api_secret = api_secret,
    secure = True  
)

def upload_to_cloudinary(file_path: str, filename: str) -> str:
    try:
        name_without_ext = os.path.splitext(filename)[0]
        
        response = cloudinary.uploader.upload(
            file_path,
            public_id=f"cvs/{name_without_ext}",
            resource_type="auto", 
            folder="fitly_cvs"
        )
        
        return response.get('secure_url')
        
    except Exception as e:
        raise Exception(f"Failed to upload file to Cloudinary: {str(e)}")