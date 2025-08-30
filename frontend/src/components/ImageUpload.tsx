'use client'

import { useState, useRef } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { Upload, X, User } from 'lucide-react'

export default function ImageUpload() {
  const { personalInfo, uploadImage } = useResumeStore()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      await uploadImage(file)
    } catch (error) {
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    useResumeStore.setState((state) => ({
      personalInfo: { ...state.personalInfo, image_url: '' }
    }))
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Profile Photo
      </label>
      
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
          {personalInfo.image_url ? (
            <img 
              src={personalInfo.image_url} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-gray-400" />
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
          </button>

          {personalInfo.image_url && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-sm"
            >
              <X className="w-4 h-4" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
