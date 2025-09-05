#!/usr/bin/env python3

import asyncio
from sqlalchemy import select
from db.db import get_db
from db.scheme import User

async def test_db_connection():
    """Test database connection and get all users"""
    try:
        async for db in get_db():
            print("✅ Database connection successful!")
            
            # Get all users
            result = await db.execute(select(User))
            users = result.scalars().all()
            
            print(f"📊 Total users found: {len(users)}")
            print("\n👥 Users:")
            print("-" * 80)
            
            for user in users:
                print(f"ID: {user.id} | Name: {user.full_name} | Email: {user.email} | Premium: {user.is_premium}")
            
            break
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_db_connection())
