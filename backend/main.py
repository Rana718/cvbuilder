from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
from routes import mainrouter
from middleware.auth import JWTAuthMiddleware 
from middleware.retelimter import RateLimitMiddleware
from config.redis import init_redis

load_dotenv()

app = FastAPI(
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.add_middleware(RateLimitMiddleware)
app.add_middleware(JWTAuthMiddleware)

app.include_router(mainrouter, prefix="/api")

@app.on_event("startup")
async def startup_event():
    await init_redis()

@app.get("/")
async def root():
    return {"message": "Welcome to the AI CV Builder API!"} 

@app.get("/private")
async def private():
    return {"message": "This is a private endpoint."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)