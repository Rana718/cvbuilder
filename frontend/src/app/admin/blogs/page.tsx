"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Star } from 'lucide-react';
import { blogsAPI, Blog, CreateBlogData, UpdateBlogData } from '@/lib/api/blogs';
import { showAlert } from '@/components/ui/alert-utils';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await blogsAPI.getAllBlogsAdmin();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showAlert('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (blogData: CreateBlogData) => {
    setIsCreating(true);
    try {
      await blogsAPI.createBlog(blogData);
      showAlert('Blog created successfully');
      setShowCreateForm(false);
      fetchBlogs();
    } catch (error) {
      console.error('Error creating blog:', error);
      showAlert('Failed to create blog');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (blogId: number, updateData: UpdateBlogData) => {
    setIsUpdating(true);
    try {
      await blogsAPI.updateBlog(blogId, updateData);
      showAlert('Blog updated successfully');
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      showAlert('Failed to update blog');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (blogId: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    setIsDeletingId(blogId);
    try {
      await blogsAPI.deleteBlog(blogId);
      showAlert('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      showAlert('Failed to delete blog');
    } finally {
      setIsDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Blog</span>
        </button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <BlogFormModal
          onSave={handleCreate}
          onCancel={() => setShowCreateForm(false)}
          isLoading={isCreating}
        />
      )}

      {/* Blogs List */}
      <div className="space-y-6">
        {blogs.map((blog) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            {editingBlog?.id === blog.id ? (
              <BlogEditForm
                blog={blog}
                onSave={(updateData) => handleUpdate(blog.id, updateData)}
                onCancel={() => setEditingBlog(null)}
                isLoading={isUpdating}
              />
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{blog.title}</h3>
                    {blog.is_featured && (
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                      blog.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {blog.is_published ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                      {blog.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{blog.excerpt}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Slug: {blog.slug}</span>
                    <span>Views: {blog.views_count}</span>
                    <span>Reading Time: {blog.reading_time} min</span>
                    {blog.category && <span>Category: {blog.category}</span>}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingBlog(blog)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    disabled={isDeletingId === blog.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                  >
                    {isDeletingId === blog.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BlogFormModal({ 
  onSave, 
  onCancel,
  isLoading 
}: { 
  onSave: (data: CreateBlogData) => void; 
  onCancel: () => void;
  isLoading?: boolean; 
}) {
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    keywords: [],
    category: '',
    tags: [],
    is_published: false,
    is_featured: false,
    reading_time: 5
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create New Blog</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors"
                placeholder="Blog title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors"
                placeholder="blog-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors h-20"
                placeholder="Brief description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors"
                  placeholder="Career Tips"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reading Time (min)</label>
                <input
                  type="number"
                  value={formData.reading_time}
                  onChange={(e) => setFormData({ ...formData, reading_time: parseInt(e.target.value) || 5 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="mr-2"
                />
                Published
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="mr-2"
                />
                Featured
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors h-64"
                placeholder="Blog content (HTML supported)..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors"
                placeholder="SEO title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors h-20"
                placeholder="SEO description..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{isLoading ? 'Creating...' : 'Create Blog'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function BlogEditForm({ 
  blog, 
  onSave, 
  onCancel,
  isLoading 
}: { 
  blog: Blog; 
  onSave: (data: UpdateBlogData) => void; 
  onCancel: () => void;
  isLoading?: boolean; 
}) {
  const [formData, setFormData] = useState<UpdateBlogData>({
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    featured_image: blog.featured_image,
    meta_title: blog.meta_title,
    meta_description: blog.meta_description,
    category: blog.category,
    is_published: blog.is_published,
    is_featured: blog.is_featured,
    reading_time: blog.reading_time
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea
          value={formData.excerpt || ''}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-colors h-20"
        />
      </div>

      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_published || false}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="mr-2"
          />
          Published
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_featured || false}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="mr-2"
          />
          Featured
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(formData)}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isLoading ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
}
