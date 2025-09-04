export interface RevenueMetrics {
    total_revenue: number;
    current_month_revenue: number;
    revenue_growth_percentage: number;
}

export interface SubscriptionMetrics {
    active_subscriptions: number;
    subscription_growth_percentage: number;
}

export interface SuccessRateMetrics {
    current_success_rate: number;
    success_rate_change: number;
}

export interface PaymentMethodDistribution {
    method: string;
    count: number;
    percentage: number;
    total_amount: number;
}

export interface PaymentTransaction {
    transaction_id: string;
    user_name: string;
    user_email: string;
    user_image?: string;
    amount: number;
    status: string;
    method?: string;
    purchase_date: string;
}

export interface FailedPayment {
    transaction_id: string;
    user_name: string;
    user_email: string;
    amount: number;
    date: string;
}

export interface PaymentManagementResponse {
    revenue_metrics: RevenueMetrics;
    subscription_metrics: SubscriptionMetrics;
    success_rate_metrics: SuccessRateMetrics;
    payment_method_distribution: PaymentMethodDistribution[];
    payment_transactions: PaymentTransaction[];
    recent_failed_payments: FailedPayment[];
}
