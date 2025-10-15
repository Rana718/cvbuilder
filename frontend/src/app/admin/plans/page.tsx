"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Star, Eye, EyeOff, Lock } from 'lucide-react';
import { plansAPI, Plan, CreatePlanData, UpdatePlanData } from '@/lib/api/plans';
import { showAlert } from '@/components/ui/alert-utils';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const { isAdmin, isSuperAdmin, loading: adminLoading } = useAdminAuth();

  const [formData, setFormData] = useState<CreatePlanData>({
    name: '',
    slug: '',
    price: 0,
    currency: 'INR',
    duration_days: 30,
    features: [],
    download_limit: null,
    is_active: true,
    is_popular: false,
    sort_order: 0
  });

  useEffect(() => {
    if (!adminLoading && isSuperAdmin) {
      const timer = setTimeout(() => {
        fetchPlans();
      }, 100);
      return () => clearTimeout(timer);
    } else if (!adminLoading) {
      setLoading(false);
    }
  }, [isSuperAdmin, adminLoading]);

  const fetchPlans = async (retryCount = 0) => {
    try {
      const data = await plansAPI.getAllPlansAdmin();
      setPlans(data);
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      
      if (error?.response?.status === 401 && retryCount < 1) {
        console.log('Auth token might not be ready, retrying...');
        setTimeout(() => {
          fetchPlans(retryCount + 1);
        }, 500);
        return;
      }
      
      showAlert('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const planDataInPaise = {
        ...formData,
        price: formData.price * 100
      };
      await plansAPI.createPlan(planDataInPaise);
      showAlert('Plan created successfully');
      setShowCreateForm(false);
      resetForm();
      fetchPlans();
    } catch (error: any) {
      console.error('Error creating plan:', error);
      if (error?.response?.status === 401) {
        showAlert('Authentication expired. Please refresh the page and try again.');
      } else {
        showAlert('Failed to create plan');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (planId: number, updateData: UpdatePlanData) => {
    setIsUpdating(true);
    try {
      const updateDataInPaise = {
        ...updateData,
        price: updateData.price ? updateData.price * 100 : updateData.price
      };
      await plansAPI.updatePlan(planId, updateDataInPaise);
      showAlert('Plan updated successfully');
      setEditingPlan(null);
      fetchPlans();
    } catch (error: any) {
      console.error('Error updating plan:', error);
      if (error?.response?.status === 401) {
        showAlert('Authentication expired. Please refresh the page and try again.');
      } else {
        showAlert('Failed to update plan');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (planId: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    setIsDeletingId(planId);
    try {
      await plansAPI.deletePlan(planId);
      showAlert('Plan deleted successfully');
      fetchPlans();
    } catch (error: any) {
      console.error('Error deleting plan:', error);
      if (error?.response?.status === 401) {
        showAlert('Authentication expired. Please refresh the page and try again.');
      } else {
        showAlert('Failed to delete plan');
      }
    } finally {
      setIsDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      price: 0,
      currency: 'INR',
      duration_days: 30,
      features: [],
      download_limit: null,
      is_active: true,
      is_popular: false,
      sort_order: 0
    });
  };

  if (loading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Only Super Admins can manage plans and pricing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plans Management</h1>
          <p className="text-sm text-orange-600 mt-1">
            <Lock className="w-4 h-4 inline mr-1" />
            Super Admin Only - Pricing & Plan Management
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Plan</h2>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="e.g., Premium Plan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="e.g., premium-plan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger className="w-full h-[42px] rounded-lg">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Days)</label>
                  <input
                    type="text"
                    min="1"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter duration in days (min: 1)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Examples: 1 day, 7 days (week), 30 days (month), 365 days (year)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Download Limit
                  <span className="text-xs font-normal text-gray-500 ml-2">(Leave empty for unlimited)</span>
                </label>
                <input
                  type="number"
                  value={formData.download_limit || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    download_limit: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  placeholder="e.g., 10 (or leave empty for unlimited)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {formData.download_limit 
                    ? `Users can download ${formData.download_limit} times before plan expires`
                    : 'Users will have unlimited downloads'
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                        placeholder="e.g., Unlimited downloads"
                      />
                      <button
                        onClick={() => {
                          const newFeatures = formData.features.filter((_, i) => i !== index);
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                  className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  + Add Feature
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">Active</span>
                  </label>
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.is_popular}
                      onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">Popular</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="px-6 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isCreating && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{isCreating ? 'Creating...' : 'Create Plan'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingPlan && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Plan</h2>
              <button
                onClick={() => setEditingPlan(null)}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <EditPlanForm
              plan={editingPlan}
              onSave={(data) => handleUpdate(editingPlan.id, data)}
              onCancel={() => setEditingPlan(null)}
              isLoading={isUpdating}
            />
          </motion.div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  {plan.is_popular && (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                    plan.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center text-2xl font-bold text-blue-600">
                    ₹{Math.round(plan.price / 100)}
                    <span className="text-sm text-gray-500 ml-1">/{plan.duration_days} days</span>
                  </div>
                  <span className="text-sm text-gray-500">Slug: {plan.slug}</span>
                  <span className="text-sm text-gray-500">Order: {plan.sort_order}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    plan.download_limit 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    Downloads: {plan.download_limit || 'Unlimited'}
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingPlan(plan)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  disabled={isDeletingId === plan.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  {isDeletingId === plan.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EditPlanForm({ 
  plan, 
  onSave, 
  onCancel,
  isLoading 
}: { 
  plan: Plan; 
  onSave: (data: UpdatePlanData) => void; 
  onCancel: () => void;
  isLoading?: boolean; 
}) {
  const [formData, setFormData] = useState<UpdatePlanData>({
    name: plan.name,
    slug: plan.slug,
    price: Math.round(plan.price / 100),
    currency: plan.currency,
    duration_days: plan.duration_days,
    features: [...plan.features],
    download_limit: plan.download_limit,
    is_active: plan.is_active,
    is_popular: plan.is_popular,
    sort_order: plan.sort_order
  });

  const addFeature = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ''] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
          <input
            type="number"
            value={formData.price || 0}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
          <Select
            value={formData.currency || 'INR'}
            onValueChange={(value) => setFormData({ ...formData, currency: value })}
          >
            <SelectTrigger className="w-full h-[42px] rounded-lg">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Days)</label>
          <input
            type="text"
            min="1"
            value={formData.duration_days || 30}
            onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter duration in days (min: 1)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Examples: 1 day, 7 days (week), 30 days (month), 365 days (year)
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Download Limit
          <span className="text-xs font-normal text-gray-500 ml-2">(Leave empty for unlimited)</span>
        </label>
        <input
          type="text"
          value={formData.download_limit || ''}
          onChange={(e) => setFormData({ 
            ...formData, 
            download_limit: e.target.value ? parseInt(e.target.value) : null 
          })}
          placeholder="e.g., 10 (or leave empty for unlimited)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
        />
        <p className="text-xs text-gray-500 mt-2">
          {formData.download_limit 
            ? `Users can download ${formData.download_limit} times before plan expires`
            : 'Users will have unlimited downloads'
          }
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
        <div className="space-y-2">
          {(formData.features || []).map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="e.g., Unlimited downloads"
              />
              <button
                onClick={() => removeFeature(index)}
                className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addFeature}
          className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          + Add Feature
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sort Order</label>
          <input
            type="number"
            value={formData.sort_order || 0}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            placeholder="0"
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.is_active || false}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">Active</span>
          </label>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.is_popular || false}
              onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900">Popular</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(formData)}
          disabled={isLoading}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
}
