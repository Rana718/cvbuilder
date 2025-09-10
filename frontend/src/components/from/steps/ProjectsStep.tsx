import React, { useState } from 'react'
import { Plus, X, FolderOpen, ExternalLink, Github, Edit3, Save, ChevronLeft, ChevronRight } from 'lucide-react'
import { useResumeStore, Project } from '@/store/resumeStore'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectsStepProps {
    onNext: () => void
    onPrev: () => void
}

function ProjectsStep({ onNext, onPrev }: ProjectsStepProps) {
    const { projects, addProject, updateProject, removeProject } = useResumeStore()
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const handleAddProject = () => {
        const newProject: Omit<Project, 'id'> = {
            name: '',
            description: '',
            url: '',
            github_url: ''
        }
        addProject(newProject)
        setIsAdding(true)
        // Get the last project (newly added) and set it to editing mode
        setTimeout(() => {
            const lastProject = projects[projects.length]
            if (lastProject) {
                setEditingId(lastProject.id)
            }
        }, 100)
    }

    const handleSaveProject = (projectId: string) => {
        setEditingId(null)
        setIsAdding(false)
    }

    const handleDeleteProject = (projectId: string) => {
        removeProject(projectId)
        if (editingId === projectId) {
            setEditingId(null)
            setIsAdding(false)
        }
    }

    const handleEdit = (projectId: string) => {
        setEditingId(projectId)
    }

    const handleCancel = () => {
        if (isAdding && projects.length > 0) {
            const lastProject = projects[projects.length - 1]
            if (lastProject && lastProject.name === '') {
                removeProject(lastProject.id)
            }
        }
        setEditingId(null)
        setIsAdding(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 md:space-y-6 lg:space-y-8"
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-left"
            >
                <div className="flex items-start mb-3 md:mb-4">
                    <div className="p-1.5 md:p-2 lg:p-3 bg-blue-100 rounded-full mr-2 md:mr-3">
                        <FolderOpen className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Projects</h2>
                        <p className="text-sm md:text-base lg:text-lg text-gray-600">Showcase your key projects and achievements</p>
                    </div>
                </div>
            </motion.div>

            {/* Projects List */}
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
                <AnimatePresence>
                    {projects.map((project: Project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-gray-300 rounded-sm p-2 md:p-3 lg:p-4 hover:border-blue-600 transition-all"
                        >
                            {editingId === project.id ? (
                                <div className="space-y-4">
                                    {/* Project Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Project Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={project.name}
                                            onChange={(e) => updateProject(project.id, { name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all"
                                            placeholder="E.g., E-commerce Platform"
                                            required
                                        />
                                    </div>

                                    {/* Project Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            value={project.description}
                                            onChange={(e) => updateProject(project.id, { description: e.target.value })}
                                            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-600 focus:border-blue-600 resize-none transition-all"
                                            placeholder="Describe your project, technologies used, and key achievements..."
                                            required
                                        />
                                    </div>

                                    {/* URLs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Live URL
                                            </label>
                                            <div className="relative">
                                                <ExternalLink className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="url"
                                                    value={project.url}
                                                    onChange={(e) => updateProject(project.id, { url: e.target.value })}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all"
                                                    placeholder="https://yourproject.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                GitHub URL
                                            </label>
                                            <div className="relative">
                                                <Github className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="url"
                                                    value={project.github_url}
                                                    onChange={(e) => updateProject(project.id, { github_url: e.target.value })}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all"
                                                    placeholder="https://github.com/username/repo"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-300">
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-black bg-white rounded-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSaveProject(project.id)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Save Project</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name || 'Untitled Project'}</h3>
                                        {project.description && (
                                            <p className="text-gray-700 mb-3 leading-relaxed">{project.description}</p>
                                        )}
                                        <div className="flex space-x-4">
                                            {project.url && (
                                                <a
                                                    href={project.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    <span>Live Demo</span>
                                                </a>
                                            )}
                                            {project.github_url && (
                                                <a
                                                    href={project.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm"
                                                >
                                                    <Github className="w-4 h-4" />
                                                    <span>Source Code</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(project.id)}
                                            className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="p-1.5 md:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add Project Button */}
                {!isAdding && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={handleAddProject}
                        className="w-full py-4 md:py-6 border-2 border-dashed border-gray-300 rounded-sm text-gray-600 hover:border-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center gap-3 group"
                    >
                        <div className="p-3 bg-white border border-gray-300 rounded-sm group-hover:border-blue-600 transition-colors">
                            <Plus className="h-6 w-6" />
                        </div>
                        <span className="font-medium">Add Project</span>
                        <span className="text-sm text-blue-500">Showcase your best work</span>
                    </motion.button>
                )}
            </div>

            {/* Skip Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
            >
                <button
                    onClick={onNext}
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                    Skip Projects Section
                </button>
            </motion.div>

            {/* Navigation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between pt-4 border-t border-gray-300"
            >
                <motion.button
                    whileHover={{ scale: 1.02, x: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPrev}
                    className="flex items-center space-x-2 px-4 py-2 border border-black rounded-sm text-gray-700 hover:bg-gray-50 transition-all font-medium bg-white"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNext}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-all font-medium"
                >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            </motion.div>
        </motion.div>
    )
}

export default ProjectsStep
