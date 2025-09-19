'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useResumeStore } from '@/store/resumeStore'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface TemplateSelectorProps {
  templateId: string
  children: React.ReactNode
}

export default function TemplateSelector({ templateId, children }: TemplateSelectorProps) {
  const router = useRouter()
  const { hasData, resetStore } = useResumeStore()
  const [showAlert, setShowAlert] = useState(false)

  const handleTemplateClick = () => {
    if (hasData()) {
      setShowAlert(true)
    } else {
      router.push(`/template/${templateId}`)
    }
  }

  const handleCreateNew = () => {
    resetStore()
    setShowAlert(false)
    router.push(`/template/${templateId}`)
  }

  const handleUseSaved = () => {
    setShowAlert(false)
    router.push(`/template/${templateId}`)
  }

  return (
    <>
      <div onClick={handleTemplateClick} className="cursor-pointer">
        {children}
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Data Found</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved resume data. Would you like to create a new resume or continue with your saved data?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCreateNew} 
              className="bg-gray-100 text-gray-900 hover:bg-gray-200"
            >
              Create New
            </AlertDialogAction>
            <AlertDialogAction onClick={handleUseSaved} className='bg-blue-600 text-white hover:bg-blue-700'>
              Use Saved Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
