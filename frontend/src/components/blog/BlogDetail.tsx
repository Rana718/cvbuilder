"use client";

import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Blog } from '@/lib/api/blogs';

interface Props {
  blog: Blog;
}

export default function BlogDetail({ blog }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(shareUrl);
      alert('URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <article className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-4 md:mb-6"
        >
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 md:mb-6"
        >
          {blog.category && (
            <span className="inline-block bg-blue-600 text-white px-2 py-1 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4">
              {blog.category}
            </span>
          )}
          
          <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-600 text-xs md:text-sm">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{formatDate(blog.published_at || blog.created_at)}</span>
                <span className="sm:hidden">{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {blog.reading_time} min read
              </div>
              <div className="flex items-center">
                <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                {blog.views_count} views
              </div>
            </div>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 md:space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-xs md:text-sm self-start sm:self-center"
            >
              <Share2 className="w-3 h-3 md:w-4 md:h-4" />
              <span>Share</span>
            </button>
          </div>

          {blog.excerpt && (
            <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
        </motion.header>

        {/* Featured Image */}
        {blog.featured_image && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 md:mb-6"
          >
            <div className="relative h-48 md:h-64 lg:h-80 rounded-lg md:rounded-xl overflow-hidden">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-sm md:prose-base lg:prose-lg prose-blog max-w-none mb-6 md:mb-8 prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 md:mb-8"
          >
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 md:px-3 rounded-full text-xs md:text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8 text-center text-white"
        >
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-4">Ready to Build Your Perfect Resume?</h3>
          <p className="text-blue-100 mb-4 md:mb-6 text-sm md:text-base">
            Use our AI-powered resume builder to create a professional resume that stands out.
          </p>
          <Link
            href="/template"
            className="inline-block bg-white text-blue-600 px-4 py-2 md:px-6 md:py-3 lg:px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
          >
            Start Building Now
          </Link>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
}
