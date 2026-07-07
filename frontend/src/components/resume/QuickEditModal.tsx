import React from 'react'
import { motion } from 'framer-motion'
import { X, User, FileText } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'

interface QuickEditModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => Promise<void>
}

const QuickEditModal: React.FC<QuickEditModalProps> = ({ isOpen, onClose, onSave }) => {
    const { personalInfo, summary, setSummary, updatePersonalInfo } = useResumeStore()
    const [editSection, setEditSection] = React.useState<'personal' | 'summary'>('personal')

    if (!isOpen) return null

    const handleSaveAndClose = async () => {
        await onSave()
        onClose()
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose()
                }
            }}
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Quick Edit</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex space-x-2 mt-4">
                        <button
                            onClick={() => setEditSection('personal')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                editSection === 'personal' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <User className="w-4 h-4 inline mr-1" />
                            Personal
                        </button>
                        <button
                            onClick={() => setEditSection('summary')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                editSection === 'summary' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FileText className="w-4 h-4 inline mr-1" />
                            Summary
                        </button>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-96">
                    {editSection === 'personal' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={personalInfo.firstName}
                                        onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={personalInfo.lastName}
                                        onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    value={personalInfo.profession}
                                    onChange={(e) => updatePersonalInfo({ profession: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={personalInfo.email}
                                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={personalInfo.phone}
                                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}
                    
                    {editSection === 'summary' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                placeholder="Write a compelling summary that showcases your professional background..."
                            />
                        </div>
                    )}
                </div>
                
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSaveAndClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default QuickEditModal
