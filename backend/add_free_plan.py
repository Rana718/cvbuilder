import asyncio
from db.db import get_db
from db.scheme import Plan
from sqlalchemy import select

async def add_free_plan():
    # Use existing database connection
    async for session in get_db():
        try:
            # Check if free plan already exists
            result = await session.execute(select(Plan).where(Plan.slug == 'free'))
            existing_plan = result.scalar_one_or_none()
            
            if existing_plan:
                print("Free plan already exists!")
                return
            
            # Create free plan
            free_plan = Plan(
                name="Starter Plan",
                slug="free",
                price=0,
                currency="INR",
                interval="monthly",
                features=[
                    "1 Professional resume",
                    "AI content suggestions", 
                    "3 Premium templates",
                    "PDF download",
                    "Basic customization",
                    "Resume includes watermark"
                ],
                is_active=True,
                is_popular=False,
                sort_order=1
            )
            
            session.add(free_plan)
            await session.commit()
            print("Free plan added successfully!")
            
        except Exception as e:
            print(f"Error: {e}")
            await session.rollback()
        finally:
            break  # Exit the async generator

if __name__ == "__main__":
    asyncio.run(add_free_plan())
