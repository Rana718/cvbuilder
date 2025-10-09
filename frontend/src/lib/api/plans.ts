import axiosInstance from '@/lib/axios';

export interface Plan {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  is_active?: boolean;
  is_popular: boolean;
  sort_order: number;
}

export interface CreatePlanData {
  name: string;
  slug: string;
  price: number;
  currency?: string;
  interval?: string;
  features: string[];
  is_active?: boolean;
  is_popular?: boolean;
  sort_order?: number;
}

export interface UpdatePlanData extends Partial<CreatePlanData> {}

class PlansAPI {
  // Public endpoints (cached)
  async getPlans(): Promise<Plan[]> {
    const response = await axiosInstance.get('/api/plans/plans');
    return response.data;
  }

  async getPlan(planId: number): Promise<Plan> {
    const response = await axiosInstance.get(`/api/plans/plans/${planId}`);
    return response.data;
  }

  // Payment endpoints
  async createOrder(planId: number) {
    const response = await axiosInstance.post('/api/payment/create-order', null, {
      params: { plan_id: planId }
    });
    return response.data;
  }

  async verifyPayment(paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    plan_id: number;
  }) {
    const response = await axiosInstance.post('/api/payment/verify-payment', paymentData);
    return response.data;
  }

  // Admin endpoints
  async getAllPlansAdmin(): Promise<Plan[]> {
    const response = await axiosInstance.get('/api/admin/plans/');
    return response.data;
  }

  async createPlan(planData: CreatePlanData): Promise<Plan> {
    const response = await axiosInstance.post('/api/admin/plans/', planData);
    return response.data;
  }

  async updatePlan(planId: number, planData: UpdatePlanData): Promise<Plan> {
    const response = await axiosInstance.put(`/api/admin/plans/${planId}`, planData);
    return response.data;
  }

  async deletePlan(planId: number): Promise<void> {
    await axiosInstance.delete(`/api/admin/plans/${planId}`);
  }
}

export const plansAPI = new PlansAPI();
