from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.db import get_db
from db.scheme import User, Subscription
from middleware.auth import get_current_user
import razorpay
import os
from datetime import datetime, timedelta
import uuid
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(
    os.getenv("NEXT_PUBLIC_RAZORPAY_KEY_ID"),
    os.getenv("RAZORPAY_KEY_SECRET")
))


@router.post("/create-subscription")
async def create_subscription(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new Razorpay subscription for the user"""
    try:
        # Check if user already has an active subscription
        result = await db.execute(
            select(Subscription).where(
                Subscription.user_id == current_user.id,
                Subscription.status.in_(["active", "created"])
            )
        )
        existing_subscription = result.scalar_one_or_none()
        
        if existing_subscription:
            raise HTTPException(
                status_code=400,
                detail="User already has an active subscription"
            )
        
        # Create customer in Razorpay
        customer_data = {
            "name": current_user.full_name,
            "email": current_user.email,
            "fail_existing": "0"  # Don't fail if customer already exists
        }
        
        try:
            razorpay_customer = razorpay_client.customer.create(customer_data)
        except Exception as e:
            # If customer already exists, fetch it
            if "Customer already exists" in str(e):
                customers = razorpay_client.customer.all({"email": current_user.email})
                if customers['items']:
                    razorpay_customer = customers['items'][0]
                else:
                    raise HTTPException(status_code=500, detail="Failed to create customer")
            else:
                logger.error(f"Razorpay customer creation error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Failed to create customer: {str(e)}")
        
        # Create subscription in Razorpay
        plan_id = os.getenv("PLAN_ID")
        if not plan_id:
            raise HTTPException(status_code=500, detail="Plan ID not configured")
            
        subscription_data = {
            "plan_id": plan_id,
            "customer_id": razorpay_customer["id"],
            "quantity": 1,
            "total_count": 12,  # 12 months
            "notes": {
                "user_id": str(current_user.id),
                "email": current_user.email
            }
        }
        
        try:
            razorpay_subscription = razorpay_client.subscription.create(subscription_data)
        except Exception as e:
            logger.error(f"Razorpay subscription creation error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to create subscription: {str(e)}")
        
        # Save subscription to database
        subscription = Subscription(
            user_id=current_user.id,
            razorpay_customer_id=razorpay_customer["id"],
            subscription_id=razorpay_subscription["id"],
            plan="premium",
            status=razorpay_subscription["status"],
            current_period_end=datetime.utcnow() + timedelta(days=30)
        )
        
        db.add(subscription)
        await db.commit()
        await db.refresh(subscription)
        
        return {
            "subscription_id": razorpay_subscription["id"],
            "status": razorpay_subscription["status"],
            "short_url": razorpay_subscription.get("short_url"),
            "customer_id": razorpay_customer["id"]
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating subscription: {str(e)}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create subscription")


@router.get("/subscription-status")
async def get_subscription_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's subscription status"""
    try:
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == current_user.id)
        )
        subscription = result.scalar_one_or_none()
        
        if not subscription:
            return {
                "has_subscription": False,
                "is_premium": current_user.is_premium,
                "status": "none"
            }
        
        # Check if subscription is expired
        if subscription.current_period_end and subscription.current_period_end < datetime.utcnow():
            # Update user premium status if expired
            if current_user.is_premium:
                current_user.is_premium = False
                subscription.status = "expired"
                await db.commit()
        
        return {
            "has_subscription": True,
            "is_premium": current_user.is_premium,
            "status": subscription.status,
            "current_period_end": subscription.current_period_end.isoformat() if subscription.current_period_end else None,
            "plan": subscription.plan
        }
    
    except Exception as e:
        logger.error(f"Error getting subscription status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get subscription status")


@router.post("/cancel-subscription")
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel user's subscription"""
    try:
        result = await db.execute(
            select(Subscription).where(
                Subscription.user_id == current_user.id,
                Subscription.status == "active"
            )
        )
        subscription = result.scalar_one_or_none()
        
        if not subscription:
            raise HTTPException(status_code=404, detail="No active subscription found")
        
        # Cancel subscription in Razorpay
        try:
            razorpay_client.subscription.cancel(subscription.subscription_id, {
                "cancel_at_cycle_end": 1  # Cancel at the end of current cycle
            })
        except Exception as e:
            logger.error(f"Error cancelling subscription in Razorpay: {str(e)}")
            # Continue with local cancellation even if Razorpay fails
        
        # Update subscription status
        subscription.status = "cancelled"
        subscription.updated_at = datetime.utcnow()
        await db.commit()
        
        return {"message": "Subscription cancelled successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling subscription: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to cancel subscription")


@router.get("/payment-plans")
async def get_payment_plans():
    """Get available payment plans"""
    try:
        # Also fetch plan details from Razorpay to verify
        plan_id = os.getenv("PLAN_ID")
        if plan_id:
            try:
                razorpay_plan = razorpay_client.plan.fetch(plan_id)
                logger.info(f"Razorpay plan details: {razorpay_plan}")
            except Exception as e:
                logger.error(f"Failed to fetch Razorpay plan: {str(e)}")
        
        return {
            "plans": [
                {
                    "id": "premium",
                    "name": "Premium Plan",
                    "price": 299,  # ₹299 per month
                    "currency": "INR",
                    "interval": "monthly",
                    "features": [
                        "Unlimited Resume Downloads",
                        "Premium Templates",
                        "AI-Powered Content Suggestions",
                        "Cover Letter Generator",
                        "LinkedIn Integration",
                        "Priority Support"
                    ]
                }
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching payment plans: {str(e)}")
        return {
            "plans": [
                {
                    "id": "premium",
                    "name": "Premium Plan",
                    "price": 299,  # ₹299 per month
                    "currency": "INR",
                    "interval": "monthly",
                    "features": [
                        "Unlimited Resume Downloads",
                        "Premium Templates",
                        "AI-Powered Content Suggestions",
                        "Cover Letter Generator",
                        "LinkedIn Integration",
                        "Priority Support"
                    ]
                }
            ]
        }


