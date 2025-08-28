from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DB_URL", "mysql+pymysql://myuser:mypassword@localhost:3306/mydb")

if DATABASE_URL.startswith("mysql+pymysql://"):
    ASYNC_DATABASE_URL = DATABASE_URL.replace("mysql+pymysql://", "mysql+aiomysql://", 1)
else:
    raise ValueError("Invalid DB_URL format. Must start with mysql+pymysql://")

engine = create_async_engine(
    ASYNC_DATABASE_URL,
    poolclass=NullPool, 
    echo=True  # Set to False in production
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
