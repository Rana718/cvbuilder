"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogsAPI, BlogListItem, BlogsResponse } from '@/lib/api/blogs';

export default function BlogList() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchBlogs();
  }, [pagination.page]);

  const fetchBlogs = async () => {
    try {
      const response: BlogsResponse = await blogsAPI.getBlogs(pagination.page, pagination.limit);
      setBlogs(response.blogs);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6 md:mb-8"
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
            Resume & Career
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Tips</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto px-4">
            Expert advice on resume writing, career development, and job search strategies
          </p>
        </motion.div>

        {/* Featured Blog */}
        {blogs.length > 0 && blogs[0].is_featured && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 md:mb-8"
          >
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0 lg:gap-6">
                <div className="relative h-48 md:h-56 lg:h-full">
                  {blogs[0].featured_image ? (
                    <img
                      src={blogs[0].featured_image}
                      alt={blogs[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-4xl md:text-5xl font-bold">
                        {blogs[0].title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      <span className="hidden sm:inline">{formatDate(blogs[0].published_at || blogs[0].created_at)}</span>
                      <span className="sm:hidden">{new Date(blogs[0].published_at || blogs[0].created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      {blogs[0].reading_time}m
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      {blogs[0].views_count}
                    </div>
                  </div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2">
                    {blogs[0].title}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2 md:line-clamp-3">
                    {blogs[0].excerpt}
                  </p>
                  <Link
                    href={`/blog/${blogs[0].slug}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base"
                  >
                    Read More
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {blogs.slice(blogs[0]?.is_featured ? 1 : 0).map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * (index + 1) }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-40 md:h-44">
                {blog.featured_image ? (
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl md:text-3xl font-bold">
                      {blog.title.charAt(0)}
                    </span>
                  </div>
                )}
                {blog.category && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {blog.category}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3 md:p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="hidden sm:inline">{formatDate(blog.published_at || blog.created_at)}</span>
                    <span className="sm:hidden">{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {blog.reading_time}m
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {blog.views_count}
                  </div>
                </div>
                
                <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
                
                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-xs md:text-sm"
                >
                  Read More
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-6 md:mt-8">
            <div className="flex space-x-1 md:space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
                  className={`px-3 py-2 md:px-4 text-sm rounded-lg transition-colors ${
                    page === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
