"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Upload, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { blogsAPI, Blog } from '@/lib/api/blogs';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('primereact/editor').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
});

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    /* Style the link dialog */
    .ql-tooltip {
      z-index: 9999 !important;
      background: white !important;
      border: 2px solid #3b82f6 !important;
      border-radius: 0.5rem !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
      padding: 0.75rem !important;
    }
    
    /* Style the link input */
    .ql-tooltip input[type="text"] {
      border: 1px solid #d1d5db !important;
      border-radius: 0.5rem !important;
      padding: 0.5rem 0.75rem !important;
      font-size: 0.875rem !important;
      outline: none !important;
      transition: all 0.2s !important;
    }
    
    .ql-tooltip input[type="text"]:focus {
      border-color: #3b82f6 !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    /* Style the save/edit button */
    .ql-tooltip .ql-action,
    .ql-tooltip .ql-preview {
      color: #3b82f6 !important;
      font-weight: 500 !important;
    }
    
    .ql-tooltip .ql-action:hover {
      color: #2563eb !important;
    }
    
    /* Style the remove button */
    .ql-tooltip .ql-remove {
      color: #ef4444 !important;
    }
    
    .ql-tooltip .ql-remove:hover {
      color: #dc2626 !important;
    }
    
    /* Ensure toolbar is visible */
    .ql-toolbar {
      z-index: 100 !important;
      border: 1px solid #d1d5db !important;
      border-radius: 0.5rem 0.5rem 0 0 !important;
      background: #f9fafb !important;
    }
    
    /* Style the editor container */
    .ql-container {
      border: 1px solid #d1d5db !important;
      border-top: none !important;
      border-radius: 0 0 0.5rem 0.5rem !important;
      font-size: 1rem !important;
    }
  `;
  
  if (!document.querySelector('#editor-custom-styles')) {
    style.id = 'editor-custom-styles';
    document.head.appendChild(style);
  }
}

export default function BlogEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get('id');
  const isEdit = !!blogId;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [blog, setBlog] = useState({
    id: null as number | null,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    keywords: [] as string[],
    category: '',
    tags: [] as string[],
    is_published: false,
    is_featured: false,
    reading_time: 5
  });

  useEffect(() => {
    if (isEdit && blogId) {
      loadBlog();
    }
  }, [blogId]);

  const loadBlog = async () => {
    if (!blogId) return;
    
    try {
      setLoading(true);
      const response = await blogsAPI.getBlogBySlug(blogId);
      setBlog({
        id: response.id,
        title: response.title,
        slug: response.slug,
        excerpt: response.excerpt || '',
        content: response.content,
        featured_image: response.featured_image || '',
        meta_title: response.meta_title || '',
        meta_description: response.meta_description || '',
        keywords: response.keywords || [],
        category: response.category || '',
        tags: response.tags || [],
        is_published: response.is_published,
        is_featured: response.is_featured,
        reading_time: response.reading_time
      });
    } catch (error) {
      toast.error('Failed to load blog');
      router.push('/admin/blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setBlog(prev => ({ ...prev, featured_image: response.data.image_url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  // Custom image handler for Quill editor
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        toast.info('Uploading image...');
        
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const imageUrl = response.data.image_url;
        
        // Insert image URL into editor content
        const currentContent = blog.content;
        const imgTag = `<img src="${imageUrl}" alt="Blog image" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 0.5rem;" />`;
        
        setBlog(prev => ({ 
          ...prev, 
          content: currentContent + imgTag 
        }));
        
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
      }
    };
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setBlog(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      meta_title: title
    }));
  };

  const handleSave = async () => {
    if (!blog.title || !blog.content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      
      const blogData = {
        ...blog,
        keywords: blog.keywords.filter(k => k.trim()),
        tags: blog.tags.filter(t => t.trim())
      };

      if (isEdit && blog.id) {
        await blogsAPI.updateBlog(blog.id, blogData);
        toast.success('Blog updated successfully');
      } else {
        await blogsAPI.createBlog(blogData);
        toast.success('Blog created successfully');
      }
      
      router.push('/admin/blogs');
    } catch (error) {
      toast.error('Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4"
          >
            <div className="flex items-center space-x-4">
              {/* <Button 
                variant="outline" 
                onClick={() => router.push('/admin/blogs')}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Button> */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {isEdit ? 'Edit Blog' : 'Create New Blog'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {isEdit ? 'Update your blog post' : 'Write and publish a new blog post'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                disabled={!blog.slug}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Blog'}
              </Button>
            </div>
          </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 relative z-20">
            {/* Title */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 block">
                Blog Title *
              </Label>
              <Input
                id="title"
                value={blog.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter an engaging blog title..."
                className="text-lg font-medium h-10 px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-gray-500 mt-2">
                A compelling title helps attract readers
              </p>
            </div>

            {/* Slug */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <Label htmlFor="slug" className="text-sm font-semibold text-gray-700 mb-2 block">
                URL Slug
              </Label>
              <Input
                id="slug"
                value={blog.slug}
                onChange={(e) => setBlog(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="blog-url-slug"
                className="font-mono text-sm h-10 px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-gray-500 mt-2">
                URL-friendly version of the title (auto-generated)
              </p>
            </div>

            {/* Excerpt */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <Label htmlFor="excerpt" className="text-sm font-semibold text-gray-700 mb-2 block">
                Excerpt
              </Label>
              <textarea
                id="excerpt"
                value={blog.excerpt}
                onChange={(e) => setBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Write a brief summary that appears in blog listings..."
                className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-2">
                Brief description shown in blog listings (recommended: 120-160 characters)
              </p>
            </div>

            {/* Content Editor */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Blog Content *
              </Label>
              <div className="rounded-lg overflow-visible bg-white relative z-10">
                <Editor
                  value={blog.content}
                  onTextChange={(e) => {
                    const content = e.htmlValue || '';
                    setBlog(prev => ({ ...prev, content }));
                  }}
                  style={{ height: '500px', fontSize: '18px' }}
                />
                <div className="p-3 border rounded-b-sm bg-gray-50 flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    💡 Tip: Click button below to add images.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={imageHandler}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-3 w-3" />
                    Add Image
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Use the toolbar to format your content. Supports headings, lists, links, images, and more.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 relative z-10">
            {/* Featured Image */}
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Featured Image
              </Label>
              {blog.featured_image && (
                <div className="mt-2 mb-4 relative group">
                  <img
                    src={blog.featured_image}
                    alt="Featured"
                    className="w-full h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">Change Image</span>
                  </div>
                </div>
              )}
              {!blog.featured_image && (
                <div className="mt-2 mb-4 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No image uploaded</p>
                  </div>
                </div>
              )}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={uploading}
                  className="w-full rounded-sm border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : blog.featured_image ? 'Change Image' : 'Upload Image'}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Recommended: 1200x630px (16:9 ratio)
              </p>
            </div>

            {/* Publishing Options */}
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 space-y-4">
              <h3 className="font-semibold text-gray-800 text-sm border-b pb-2 mb-3">
                Publishing Options
              </h3>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="published"
                    checked={blog.is_published}
                    onCheckedChange={(checked) => 
                      setBlog(prev => ({ ...prev, is_published: !!checked }))
                    }
                    className="border-gray-300"
                  />
                  <Label htmlFor="published" className="cursor-pointer font-medium text-gray-700">
                    Published
                  </Label>
                </div>
                {blog.is_published && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Live
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="featured"
                    checked={blog.is_featured}
                    onCheckedChange={(checked) => 
                      setBlog(prev => ({ ...prev, is_featured: !!checked }))
                    }
                    className="border-gray-300"
                  />
                  <Label htmlFor="featured" className="cursor-pointer font-medium text-gray-700">
                    Featured
                  </Label>
                </div>
                {blog.is_featured && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                    ⭐
                  </span>
                )}
              </div>
            </div>

            {/* Category & Tags */}
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 space-y-4">
              <h3 className="font-semibold text-gray-800 text-sm border-b pb-2 mb-3">
                Organization
              </h3>
              
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                  Category
                </Label>
                <Input
                  id="category"
                  value={blog.category}
                  onChange={(e) => setBlog(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Career Tips"
                  className="h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <Label htmlFor="tags" className="text-sm font-medium text-gray-700 mb-2 block">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={blog.tags.join(', ')}
                  onChange={(e) => setBlog(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(t => t.trim()) 
                  }))}
                  placeholder="resume, career, job search"
                  className="h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate tags with commas
                </p>
              </div>

              <div>
                <Label htmlFor="reading-time" className="text-sm font-medium text-gray-700 mb-2 block">
                  Reading Time (minutes)
                </Label>
                <Input
                  id="reading-time"
                  type="number"
                  value={blog.reading_time}
                  onChange={(e) => setBlog(prev => ({ 
                    ...prev, 
                    reading_time: parseInt(e.target.value) || 5 
                  }))}
                  min="1"
                  max="60"
                  className="h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 space-y-4">
              <h3 className="font-semibold text-gray-800 text-sm border-b pb-2 mb-3">
                SEO Settings
              </h3>
              
              <div>
                <Label htmlFor="meta-title" className="text-sm font-medium text-gray-700 mb-2 block">
                  Meta Title
                </Label>
                <Input
                  id="meta-title"
                  value={blog.meta_title}
                  onChange={(e) => setBlog(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO-optimized title"
                  className="h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {blog.meta_title.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta-description" className="text-sm font-medium text-gray-700 mb-2 block">
                  Meta Description
                </Label>
                <textarea
                  id="meta-description"
                  value={blog.meta_description}
                  onChange={(e) => setBlog(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Compelling description for search engines..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 resize-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {blog.meta_description.length}/160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="keywords" className="text-sm font-medium text-gray-700 mb-2 block">
                  Keywords
                </Label>
                <Input
                  id="keywords"
                  value={blog.keywords.join(', ')}
                  onChange={(e) => setBlog(prev => ({ 
                    ...prev, 
                    keywords: e.target.value.split(',').map((k: string) => k.trim()) 
                  }))}
                  placeholder="SEO keywords"
                  className="h-10 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate keywords with commas for better SEO
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
