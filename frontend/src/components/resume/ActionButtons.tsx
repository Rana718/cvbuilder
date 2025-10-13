import React from 'react'
import { motion } from 'framer-motion'
import { Download, Save, Edit, Share, CheckCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import ColorThemePicker from '@/components/ui/ColorThemePicker'
import { CV_TEMPLATES } from '@/constants/templates'

interface ActionButtonsProps {
    templateId: string | null
    resumeId: string | string[]
    isSaving: boolean
    isSharing: boolean
    isDownloading: boolean
    showShareSuccess: boolean
    isPremium: boolean
    user: any
    colorTheme: any
    onSave: () => void
    onShare: () => void
    onDownload: () => void
    onQuickEdit: () => void
    onColorThemeChange: (theme: any) => void
}

export const DesktopActionButtons: React.FC<ActionButtonsProps> = ({
    templateId,
    resumeId,
    isSaving,
    isSharing,
    isDownloading,
    showShareSuccess,
    isPremium,
    user,
    colorTheme,
    onSave,
    onShare,
    onDownload,
    onQuickEdit,
    onColorThemeChange
}) => (
    <div className="hidden sm:flex justify-center items-center space-x-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
                href={`/template/${templateId}?resumeId=${resumeId}`}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md"
            >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
            </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
                onClick={onQuickEdit}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
            >
                <FileText className="w-4 h-4" />
                <span>Quick Edit</span>
            </button>
        </motion.div>

        <ColorThemePicker
            selectedTheme={colorTheme}
            onThemeChange={onColorThemeChange}
        />

        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 font-medium transition-all duration-200 rounded-xl border border-green-200 hover:border-green-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </motion.button>

        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            disabled={isSharing}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800 font-medium transition-all duration-200 rounded-xl border border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {showShareSuccess ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
                <Share className="w-4 h-4" />
            )}
            <span>
                {isSharing ? 'Sharing...' : showShareSuccess ? 'Link Copied!' : 'Share'}
            </span>
        </motion.button>

        <motion.button
            whileHover={{ scale: isPremium ? 1.05 : 1.02 }}
            whileTap={{ scale: isPremium ? 0.95 : 0.98 }}
            onClick={onDownload}
            disabled={isDownloading}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            title={
                !user
                    ? (CV_TEMPLATES.find(t => t.id === Number(templateId))?.isFree ? 'Login to download' : 'Login required')
                    : (!isPremium && !CV_TEMPLATES.find(t => t.id === Number(templateId))?.isFree)
                        ? 'Premium feature - Upgrade to download'
                        : ''
            }
        >
            <Download className="w-4 h-4" />
            <span>
                {isDownloading
                    ? 'Downloading...'
                    : !user
                        ? (CV_TEMPLATES.find(t => t.id === Number(templateId))?.isFree ? 'Login to Download' : 'Login Required')
                        : (!isPremium && !CV_TEMPLATES.find(t => t.id === Number(templateId))?.isFree)
                            ? 'Upgrade to Download'
                            : 'Download'
                }
            </span>
        </motion.button>
    </div>
)

export const MobileActionButtons: React.FC<ActionButtonsProps> = ({
    templateId,
    resumeId,
    isSaving,
    isSharing,
    isDownloading,
    showShareSuccess,
    isPremium,
    user,
    colorTheme,
    onSave,
    onShare,
    onDownload,
    onQuickEdit,
    onColorThemeChange
}) => (
    <div className="sm:hidden space-y-3">
        <div className="flex space-x-3">
            <Link
                href={`/template/${templateId}?resumeId=${resumeId}`}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-600 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-md"
            >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
            </Link>

            <button
                onClick={onQuickEdit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm shadow-sm hover:shadow-md"
            >
                <FileText className="w-4 h-4" />
                <span>Quick Edit</span>
            </button>
        </div>

        <div className="w-full">
            <ColorThemePicker
                selectedTheme={colorTheme}
                onThemeChange={onColorThemeChange}
                className="w-full"
            />
        </div>

        <div className="flex space-x-3">
            <button
                onClick={onSave}
                disabled={isSaving}
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm border border-green-200 shadow-sm hover:shadow-md"
            >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            <button
                onClick={onShare}
                disabled={isSharing}
                className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm border border-purple-200 shadow-sm hover:shadow-md"
            >
                {showShareSuccess ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                    <Share className="w-4 h-4" />
                )}
                <span>
                    {isSharing ? 'Sharing...' : showShareSuccess ? 'Copied!' : 'Share'}
                </span>
            </button>
        </div>

        <div className="flex">
            <button
                onClick={onDownload}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg text-sm"
            >
                <Download className="w-4 h-4" />
                <span>
                    {isDownloading
                        ? 'Downloading...'
                        : !user
                            ? (CV_TEMPLATES.find(t => t.id === Number(templateId))?.isFree ? 'Login' : 'Login')
                            : (!isPremium && !CV_TEMPLATES.find(t => t.id === Number(templateId))?.isFree)
                                ? 'Upgrade'
                                : 'Download'
                    }
                </span>
            </button>
        </div>
    </div>
)
