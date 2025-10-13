from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from db.db import get_db
from db.scheme import User, Subscription, PaymentHistory, Plan
from middleware.auth import get_current_user
import razorpay
import os
from datetime import datetime, timedelta
import uuid
import logging
import hmac
import hashlib

logger = logging.getLogger(__name__)

router = APIRouter()

razorpay_client = razorpay.Client(auth=(
    os.getenv("NEXT_PUBLIC_RAZORPAY_KEY_ID"),
    os.getenv("RAZORPAY_KEY_SECRET")
))

@router.post("/create-order")
async def create_order(
    plan_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create payment order for selected plan"""
    try:
        # Get plan details
        result = await db.execute(select(Plan).where(Plan.id == plan_id, Plan.is_active == True))
        plan = result.scalar_one_or_none()
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        if plan.price == 0:
            raise HTTPException(status_code=400, detail="Cannot create payment for free plan")
        
        # Create order
        order_data = {
            "amount": plan.price,
            "currency": plan.currency,
            "receipt": f"order_{current_user.id}_{plan_id}_{int(datetime.utcnow().timestamp())}",
            "notes": {
                "user_id": str(current_user.id),
                "email": current_user.email,
                "plan_id": str(plan_id),
                "plan_name": plan.name
            }
        }
        
        razorpay_order = razorpay_client.order.create(order_data)
        
        # Create customer if needed
        customer_data = {
            "name": current_user.full_name,
            "email": current_user.email,
            "fail_existing": "0"
        }
        
        try:
            razorpay_customer = razorpay_client.customer.create(customer_data)
        except Exception as e:
            if "Customer already exists" in str(e):
                customers = razorpay_client.customer.all({"email": current_user.email})
                razorpay_customer = customers['items'][0] if customers['items'] else None
        
        return {
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "customer_id": razorpay_customer["id"] if razorpay_customer else None,
            "plan": {
                "id": plan.id,
                "name": plan.name,
                "price": plan.price,
                "features": plan.features
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")

@router.post("/verify-payment")
async def verify_payment(
    payment_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Verify payment and activate plan"""
    try:
        razorpay_payment_id = payment_data.get("razorpay_payment_id")
        razorpay_order_id = payment_data.get("razorpay_order_id")
        razorpay_signature = payment_data.get("razorpay_signature")
        plan_id = payment_data.get("plan_id")
        
        if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature, plan_id]):
            raise HTTPException(status_code=400, detail="Missing payment verification data")
        
        # Verify signature
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        message = f"{razorpay_order_id}|{razorpay_payment_id}"
        signature = hmac.new(
            key_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, razorpay_signature):
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Get payment details
        payment_details = razorpay_client.payment.fetch(razorpay_payment_id)
        if payment_details.get("status") != "captured":
            raise HTTPException(status_code=400, detail="Payment not captured")
        
        # Get plan details
        result = await db.execute(select(Plan).where(Plan.id == plan_id))
        plan = result.scalar_one_or_none()
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        # Update user premium status
        if plan.slug != "free":
            current_user.is_premium = True
        current_user.updated_at = datetime.utcnow()
        
        # Create or update subscription
        result = await db.execute(
            select(Subscription)
            .where(Subscription.user_id == current_user.id)
            .order_by(desc(Subscription.created_at))
        )
        subscription_row = result.first()
        
        if not subscription_row:
            subscription = Subscription(
                user_id=current_user.id,
                plan_id=plan.id,
                razorpay_customer_id=payment_details.get("customer_id", f"cust_{current_user.id}"),
                subscription_id=f"sub_{uuid.uuid4()}",
                plan=plan.slug,
                status="active",
                current_period_end=datetime.utcnow() + timedelta(days=30)
            )
            db.add(subscription)
            await db.flush()
        else:
            subscription = subscription_row[0]
            subscription.plan_id = plan.id
            subscription.plan = plan.slug
            subscription.status = "active"
            subscription.current_period_end = datetime.utcnow() + timedelta(days=30)
            subscription.updated_at = datetime.utcnow()
        
        # Create payment history
        payment_history = PaymentHistory(
            user_id=current_user.id,
            subscription_id=subscription.id,
            plan_id=plan.id,
            razorpay_payment_id=razorpay_payment_id,
            razorpay_order_id=razorpay_order_id,
            amount=payment_details.get("amount", 0),
            currency=payment_details.get("currency", "INR"),
            status=payment_details.get("status", "captured"),
            method=payment_details.get("method", ""),
            description=f"{plan.name} subscription payment",
            receipt=payment_details.get("receipt", ""),
            card_last4=payment_details.get("card", {}).get("last4", "") if payment_details.get("card") else "",
            card_network=payment_details.get("card", {}).get("network", "") if payment_details.get("card") else "",
            bank=payment_details.get("bank", "") if payment_details.get("bank") else "",
            payment_date=datetime.fromtimestamp(payment_details.get("created_at", 0)) if payment_details.get("created_at") else datetime.utcnow()
        )
        db.add(payment_history)
        
        await db.commit()
        
        # Update Firebase claims
        try:
            from config.firebase import set_custom_user_claims
            set_custom_user_claims(current_user.firebase_uid, {"premium": str(current_user.is_premium).lower(), "dbUser": "true"})
        except Exception as e:
            logger.warning(f"Failed to update Firebase claims: {str(e)}")
        
        return {
            "success": True,
            "message": "Payment verified and plan activated",
            "is_premium": current_user.is_premium,
            "plan": {
                "id": plan.id,
                "name": plan.name,
                "slug": plan.slug
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Payment verification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Payment verification failed")


@router.get("/subscription-status")
async def get_subscription_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's subscription status with automatic expiration check"""
    try:
        from utils.subscription_utils import verify_and_update_subscription_status
        
        # Verify and update subscription (checks date AND download limits)
        subscription_info = await verify_and_update_subscription_status(current_user, db)
        
        return {
            "has_subscription": subscription_info["has_subscription"],
            "is_premium": subscription_info["is_premium"],
            "is_active": subscription_info["is_active"],
            "status": subscription_info.get("subscription_status", "none"),
            "current_period_end": subscription_info.get("current_period_end"),
            "plan": subscription_info.get("plan_slug", "free"),
            "plan_name": subscription_info.get("plan_name", "Free"),
            "downloads_used": subscription_info.get("downloads_used", 0),
            "download_limit": subscription_info.get("download_limit"),
            "can_download": subscription_info.get("can_download", False)
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
            ).order_by(desc(Subscription.created_at))
        )
        subscription = result.first()
        
        if not subscription:
            raise HTTPException(status_code=404, detail="No active subscription found")
        
        subscription = subscription[0]  
        
        try:
            razorpay_client.subscription.cancel(subscription.subscription_id, {
                "cancel_at_cycle_end": 1
            })
        except Exception as e:
            logger.error(f"Error cancelling subscription in Razorpay: {str(e)}")
        
        subscription.status = "cancelled"
        subscription.updated_at = datetime.utcnow()
        await db.commit()
        
        return {"message": "Subscription cancelled successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error cancelling subscription: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to cancel subscription")


@router.post("/verify-payment")
async def verify_payment(
    payment_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Verify payment and update user premium status immediately"""
    try:
        razorpay_payment_id = payment_data.get("razorpay_payment_id")
        razorpay_order_id = payment_data.get("razorpay_order_id")
        razorpay_signature = payment_data.get("razorpay_signature")
        
        if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
            raise HTTPException(status_code=400, detail="Missing payment verification data")
        
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        message = f"{razorpay_order_id}|{razorpay_payment_id}"
        signature = hmac.new(
            key_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, razorpay_signature):
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        try:
            payment_details = razorpay_client.payment.fetch(razorpay_payment_id)
        except Exception as e:
            logger.error(f"Failed to fetch payment details: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to verify payment")
        
        if payment_details.get("status") != "captured":
            raise HTTPException(status_code=400, detail="Payment not captured")
        
        current_user.is_premium = True
        current_user.updated_at = datetime.utcnow()
        
        result = await db.execute(
            select(Subscription)
            .where(Subscription.user_id == current_user.id)
            .order_by(desc(Subscription.created_at))
        )
        subscription_row = result.first()
        
        if not subscription_row:
            subscription = Subscription(
                user_id=current_user.id,
                razorpay_customer_id=payment_details.get("customer_id", f"cust_{current_user.id}"),
                subscription_id=f"sub_{uuid.uuid4()}",
                plan="premium",
                status="active",
                current_period_end=datetime.utcnow() + timedelta(days=30)
            )
            db.add(subscription)
            await db.flush()  
        else:
            subscription = subscription_row[0]
            subscription.status = "active"
            subscription.current_period_end = datetime.utcnow() + timedelta(days=30)
            subscription.updated_at = datetime.utcnow()
        
        payment_history = PaymentHistory(
            user_id=current_user.id,
            subscription_id=subscription.id,
            razorpay_payment_id=razorpay_payment_id,
            razorpay_order_id=razorpay_order_id,
            amount=payment_details.get("amount", 0),
            currency=payment_details.get("currency", "INR"),
            status=payment_details.get("status", "captured"),
            method=payment_details.get("method", ""),
            description=f"Premium subscription payment",
            receipt=payment_details.get("receipt", ""),
            card_last4=payment_details.get("card", {}).get("last4", "") if payment_details.get("card") else "",
            card_network=payment_details.get("card", {}).get("network", "") if payment_details.get("card") else "",
            bank=payment_details.get("bank", "") if payment_details.get("bank") else "",
            payment_date=datetime.fromtimestamp(payment_details.get("created_at", 0)) if payment_details.get("created_at") else datetime.utcnow()
        )
        db.add(payment_history)
        
        await db.commit()
        
        try:
            from config.firebase import set_custom_user_claims
            set_custom_user_claims(current_user.firebase_uid, {"premium": "true", "dbUser": "true"})
        except Exception as e:
            logger.warning(f"Failed to update Firebase claims: {str(e)}")
        
        return {
            "success": True,
            "message": "Payment verified and premium status updated",
            "is_premium": True,
            "subscription_status": "active"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Payment verification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Payment verification failed")


@router.get("/payment-history")
async def get_payment_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):
    """Get user's payment history with pagination"""
    try:
        offset = (page - 1) * limit
        
        result = await db.execute(
            select(PaymentHistory)
            .where(PaymentHistory.user_id == current_user.id)
            .order_by(desc(PaymentHistory.created_at))
            .offset(offset)
            .limit(limit)
        )
        payments = result.scalars().all()
        
        count_result = await db.execute(
            select(PaymentHistory)
            .where(PaymentHistory.user_id == current_user.id)
        )
        total_count = len(count_result.scalars().all())
        
        payment_list = []
        for payment in payments:
            payment_data = {
                "id": payment.id,
                "razorpay_payment_id": payment.razorpay_payment_id,
                "amount": payment.amount / 100,  
                "currency": payment.currency,
                "status": payment.status,
                "method": payment.method,
                "description": payment.description,
                "payment_date": payment.payment_date.isoformat() if payment.payment_date else None,
                "created_at": payment.created_at.isoformat(),
                "card_last4": payment.card_last4,
                "card_network": payment.card_network,
                "bank": payment.bank
            }
            payment_list.append(payment_data)
        
        return {
            "payments": payment_list,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": (total_count + limit - 1) // limit
            }
        }
    
    except Exception as e:
        logger.error(f"Error getting payment history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get payment history")


@router.get("/subscription-details")
async def get_subscription_details(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed subscription information including Razorpay data"""
    try:
        result = await db.execute(
            select(Subscription)
            .where(Subscription.user_id == current_user.id)
            .order_by(desc(Subscription.created_at))
        )
        subscription_row = result.first()
        
        if not subscription_row:
            return {
                "has_subscription": False,
                "is_premium": current_user.is_premium,
                "status": "none"
            }
        
        subscription = subscription_row[0] 
        
        razorpay_subscription = None
        try:
            razorpay_subscription = razorpay_client.subscription.fetch(subscription.subscription_id)
        except Exception as e:
            logger.error(f"Failed to fetch Razorpay subscription: {str(e)}")
        
        payment_result = await db.execute(
            select(PaymentHistory)
            .where(PaymentHistory.subscription_id == subscription.id)
            .order_by(desc(PaymentHistory.created_at))
            .limit(3)
        )
        recent_payments = payment_result.scalars().all()
        
        response_data = {
            "has_subscription": True,
            "is_premium": current_user.is_premium,
            "status": subscription.status,
            "plan": subscription.plan,
            "current_period_end": subscription.current_period_end.isoformat() if subscription.current_period_end else None,
            "created_at": subscription.created_at.isoformat(),
            "razorpay_customer_id": subscription.razorpay_customer_id,
            "subscription_id": subscription.subscription_id,
            "recent_payments": [
                {
                    "id": payment.id,
                    "amount": payment.amount / 100,
                    "status": payment.status,
                    "payment_date": payment.payment_date.isoformat() if payment.payment_date else None,
                    "method": payment.method
                }
                for payment in recent_payments
            ]
        }
        
        if razorpay_subscription:
            response_data.update({
                "razorpay_status": razorpay_subscription.get("status"),
                "next_charge_at": razorpay_subscription.get("next_charge_at"),
                "charge_at": razorpay_subscription.get("charge_at"),
                "total_count": razorpay_subscription.get("total_count"),
                "paid_count": razorpay_subscription.get("paid_count"),
                "remaining_count": razorpay_subscription.get("remaining_count")
            })
        
        return response_data
    
    except Exception as e:
        logger.error(f"Error getting subscription details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get subscription details")


@router.post("/reactivate-subscription")
async def reactivate_subscription(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Reactivate a cancelled subscription (if within current period)"""
    try:
        result = await db.execute(
            select(Subscription).where(
                Subscription.user_id == current_user.id,
                Subscription.status == "cancelled"
            ).order_by(desc(Subscription.created_at))
        )
        subscription_row = result.first()
        
        if not subscription_row:
            raise HTTPException(status_code=404, detail="No cancelled subscription found")
        
        subscription = subscription_row[0] 
        
        if subscription.current_period_end and subscription.current_period_end < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Subscription period has already ended")
        
        try:
            pass
        except Exception as e:
            logger.error(f"Error reactivating subscription in Razorpay: {str(e)}")
        
        subscription.status = "active"
        subscription.updated_at = datetime.utcnow()
        
        current_user.is_premium = True
        current_user.updated_at = datetime.utcnow()
        
        await db.commit()
        
        return {
            "message": "Subscription reactivated successfully",
            "status": subscription.status,
            "current_period_end": subscription.current_period_end.isoformat() if subscription.current_period_end else None
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error reactivating subscription: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to reactivate subscription")
