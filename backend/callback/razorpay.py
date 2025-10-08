from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import razorpay
import hmac
import hashlib
import os
from datetime import datetime, timedelta
from db.db import get_db
from db.scheme import User, Subscription, PaymentHistory
from config.firebase import set_custom_user_claims
import logging
import asyncio

logger = logging.getLogger(__name__)

razorypayrouter = APIRouter()

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(
    os.getenv("NEXT_PUBLIC_RAZORPAY_KEY_ID"),
    os.getenv("RAZORPAY_KEY_SECRET")
))


async def update_firebase_claims(firebase_uid: str, new_claims: dict):
    """Update Firebase custom claims while preserving existing ones"""
    try:
        await asyncio.get_event_loop().run_in_executor(
            None, 
            lambda: set_custom_user_claims(firebase_uid, new_claims)
        )
        logger.info(f"Firebase claims updated for user {firebase_uid}")
    except Exception as e:
        logger.warning(f"Failed to update Firebase claims for {firebase_uid}: {e}")


async def remove_firebase_claims(firebase_uid: str, claims_to_remove: list):
    """Remove specific Firebase custom claims"""
    try:
        from firebase_admin import auth
        
        def _remove_claims():
            try:
                # Get current claims
                user = auth.get_user(firebase_uid)
                current_claims = user.custom_claims or {}
                
                # Remove specified claims
                for claim in claims_to_remove:
                    current_claims.pop(claim, None)
                
                # Update with remaining claims
                auth.set_custom_user_claims(firebase_uid, current_claims)
                logger.info(f"Removed claims {claims_to_remove} for user {firebase_uid}")
            except Exception as e:
                logger.error(f"Failed to remove claims: {e}")
        
        await asyncio.get_event_loop().run_in_executor(None, _remove_claims)
    except Exception as e:
        logger.error(f"Failed to remove Firebase claims for {firebase_uid}: {e}")


def verify_razorpay_signature(payload: str, signature: str, secret: str) -> bool:
    """Verify Razorpay webhook signature"""
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected_signature, signature)


@razorypayrouter.post("/callback")
async def razorpay_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Razorpay webhook events"""
    try:
        # Get request body and signature
        body = await request.body()
        signature = request.headers.get("X-Razorpay-Signature", "")
        
        # Verify webhook signature
        webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
        if webhook_secret and not verify_razorpay_signature(body.decode(), signature, webhook_secret):
            logger.error("Invalid webhook signature")
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Parse the event
        import json
        event = json.loads(body.decode())
        
        event_type = event.get("event")
        payment_entity = event.get("payload", {}).get("payment", {}).get("entity", {})
        subscription_entity = event.get("payload", {}).get("subscription", {}).get("entity", {})
        
        logger.info(f"Received webhook event: {event_type}")
        
        if event_type == "subscription.charged":
            await handle_subscription_charged(db, subscription_entity, payment_entity)
        elif event_type == "subscription.activated":
            await handle_subscription_activated(db, subscription_entity)
        elif event_type == "subscription.cancelled":
            await handle_subscription_cancelled(db, subscription_entity)
        elif event_type == "payment.captured":
            await handle_payment_captured(db, payment_entity)
        elif event_type == "payment.failed":
            await handle_payment_failed(db, payment_entity)
        
        return {"status": "success"}
    
    except Exception as e:
        logger.error(f"Webhook processing error: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")


async def handle_subscription_charged(db: AsyncSession, subscription_data: dict, payment_data: dict):
    """Handle successful subscription payment"""
    try:
        customer_id = subscription_data.get("customer_id")
        
        # Find user by customer ID
        result = await db.execute(
            select(User).join(Subscription).where(
                Subscription.razorpay_customer_id == customer_id
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            logger.error(f"User not found for customer_id: {customer_id}")
            return
        
        # Update subscription
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user.id)
        )
        subscription = result.scalar_one_or_none()
        
        if subscription:
            # Update subscription details
            subscription.status = "active"
            subscription.current_period_end = datetime.utcnow() + timedelta(days=30)
            subscription.updated_at = datetime.utcnow()
            
            # Update user premium status
            user.is_premium = True
            user.updated_at = datetime.utcnow()
            
            # Store payment history
            payment_history = PaymentHistory(
                user_id=user.id,
                subscription_id=subscription.id,
                razorpay_payment_id=payment_data.get("id", ""),
                razorpay_order_id=payment_data.get("order_id", ""),
                amount=payment_data.get("amount", 0),
                currency=payment_data.get("currency", "INR"),
                status=payment_data.get("status", "captured"),
                method=payment_data.get("method", ""),
                description=f"Subscription payment for {subscription.plan} plan",
                receipt=payment_data.get("receipt", ""),
                card_last4=payment_data.get("card", {}).get("last4", "") if payment_data.get("card") else "",
                card_network=payment_data.get("card", {}).get("network", "") if payment_data.get("card") else "",
                bank=payment_data.get("bank", "") if payment_data.get("bank") else "",
                payment_date=datetime.fromtimestamp(payment_data.get("created_at", 0)) if payment_data.get("created_at") else datetime.utcnow()
            )
            
            db.add(payment_history)
            await db.commit()
            
            # Update Firebase custom claims
            await update_firebase_claims(user.firebase_uid, {"premium": "true", "dbUser": "true"})
            
            logger.info(f"Updated subscription and stored payment history for user {user.id}")
    
    except Exception as e:
        logger.error(f"Error handling subscription charged: {str(e)}")
        await db.rollback()


async def handle_payment_captured(db: AsyncSession, payment_data: dict):
    """Handle direct payment capture (instant payments)"""
    try:
        notes = payment_data.get("notes", {})
        user_id = notes.get("user_id")
        
        if not user_id:
            logger.warning("No user_id found in payment notes")
            return
        
        result = await db.execute(
            select(User).where(User.id == int(user_id))
        )
        user = result.scalar_one_or_none()
        
        if not user:
            logger.error(f"User not found for user_id: {user_id}")
            return
        
        # INSTANT ACTIVATION - No waiting for subscription
        user.is_premium = True
        user.updated_at = datetime.utcnow()
        
        # Find or create subscription record
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user.id)
        )
        subscription = result.scalar_one_or_none()
        
        if not subscription:
            subscription = Subscription(
                user_id=user.id,
                razorpay_customer_id=payment_data.get("customer_id", f"cust_{user.id}"),
                subscription_id=f"instant_{user.id}_{int(datetime.utcnow().timestamp())}",
                plan="premium",
                status="active",  # Immediately active
                current_period_end=datetime.utcnow() + timedelta(days=30)
            )
            db.add(subscription)
            await db.flush()
        else:
            subscription.status = "active"
            subscription.current_period_end = datetime.utcnow() + timedelta(days=30)
            subscription.updated_at = datetime.utcnow()
        
        # Store payment history
        payment_history = PaymentHistory(
            user_id=user.id,
            subscription_id=subscription.id,
            razorpay_payment_id=payment_data.get("id", ""),
            razorpay_order_id=payment_data.get("order_id", ""),
            amount=payment_data.get("amount", 0),
            currency=payment_data.get("currency", "INR"),
            status=payment_data.get("status", "captured"),
            method=payment_data.get("method", ""),
            description="Premium subscription - First month (Instant)",
            receipt=payment_data.get("receipt", ""),
            card_last4=payment_data.get("card", {}).get("last4", "") if payment_data.get("card") else "",
            card_network=payment_data.get("card", {}).get("network", "") if payment_data.get("card") else "",
            bank=payment_data.get("bank", "") if payment_data.get("bank") else "",
            payment_date=datetime.fromtimestamp(payment_data.get("created_at", 0)) if payment_data.get("created_at") else datetime.utcnow()
        )
        
        db.add(payment_history)
        await db.commit()
        
        # Update Firebase custom claims
        await update_firebase_claims(user.firebase_uid, {"premium": "true", "dbUser": "true"})
        
        logger.info(f"INSTANT ACTIVATION: Payment captured and premium status updated for user {user.id}")
    
    except Exception as e:
        logger.error(f"Error handling instant payment captured: {str(e)}")
        await db.rollback()


async def handle_subscription_activated(db: AsyncSession, subscription_data: dict):
    """Handle subscription mandate activation (for future recurring payments)"""
    try:
        customer_id = subscription_data.get("customer_id")
        
        result = await db.execute(
            select(User).join(Subscription).where(
                Subscription.razorpay_customer_id == customer_id
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            logger.error(f"User not found for customer_id: {customer_id}")
            return
        
        # Update subscription mandate status (user already has premium from instant payment)
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user.id)
        )
        subscription = result.scalar_one_or_none()
        
        if subscription:
            # Update mandate status - user already premium, just confirming recurring setup
            subscription.subscription_id = subscription_data.get("id", subscription.subscription_id)
            subscription.updated_at = datetime.utcnow()
            
            await db.commit()
            logger.info(f"Subscription mandate activated for user {user.id} - recurring payments ready")
    
    except Exception as e:
        logger.error(f"Error handling subscription mandate activation: {str(e)}")
        await db.rollback()


async def handle_subscription_cancelled(db: AsyncSession, subscription_data: dict):
    """Handle subscription cancellation"""
    try:
        customer_id = subscription_data.get("customer_id")
        
        # Find user by customer ID
        result = await db.execute(
            select(User).join(Subscription).where(
                Subscription.razorpay_customer_id == customer_id
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            logger.error(f"User not found for customer_id: {customer_id}")
            return
        
        # Update subscription status
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user.id)
        )
        subscription = result.scalar_one_or_none()
        
        if subscription:
            subscription.status = "cancelled"
            subscription.updated_at = datetime.utcnow()
            
            # Keep premium until current period ends
            # Premium will be revoked when period expires
            
            await db.commit()
            logger.info(f"Cancelled subscription for user {user.id}")
    
    except Exception as e:
        logger.error(f"Error handling subscription cancellation: {str(e)}")
        await db.rollback()


async def handle_payment_failed(db: AsyncSession, payment_data: dict):
    """Handle failed payment"""
    try:
        # Extract user info from payment notes
        notes = payment_data.get("notes", {})
        user_id = notes.get("user_id")
        
        if user_id:
            # Store failed payment record
            payment_history = PaymentHistory(
                user_id=int(user_id),
                subscription_id=None,
                razorpay_payment_id=payment_data.get("id", ""),
                razorpay_order_id=payment_data.get("order_id", ""),
                amount=payment_data.get("amount", 0),
                currency=payment_data.get("currency", "INR"),
                status="failed",
                method=payment_data.get("method", ""),
                description="Failed premium payment",
                payment_date=datetime.fromtimestamp(payment_data.get("created_at", 0)) if payment_data.get("created_at") else datetime.utcnow()
            )
            
            db.add(payment_history)
            await db.commit()
        
        logger.warning(f"Payment failed: {payment_data.get('id')}")
    
    except Exception as e:
        logger.error(f"Error handling payment failure: {str(e)}")
        await db.rollback()
