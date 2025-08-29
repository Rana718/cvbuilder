'use client'

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuillNoSSR = dynamic(
  () => import('react-quill'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-32 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
        <span className="text-gray-500">Loading editor...</span>
      </div>
    )
  }
)

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

function RichTextEditor({ value, onChange, placeholder = "Enter description...", height = "120px" }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  }), [])

  const formats = useMemo(() => [
    'bold', 'italic', 'underline',
    'list', 'bullet'
  ], [])

  return (
    <div className="rich-text-editor">
      <ReactQuillNoSSR
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'white',
          borderRadius: '0.375rem',
        }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-editor {
          min-height: ${height};
          font-size: 14px;
          line-height: 1.5;
        }
        
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.375rem 0.375rem 0 0;
        }
        
        .rich-text-editor .ql-container {
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 0.375rem 0.375rem;
        }
        
        .rich-text-editor .ql-editor:focus {
          outline: none;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
