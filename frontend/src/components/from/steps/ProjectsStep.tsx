import React, { useState } from 'react'
import { Plus, X, FolderOpen, ExternalLink } from 'lucide-react'
import { useResumeStore, Project } from '@/store/resumeStore'
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor'

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Projects</h2>
                <p className="text-gray-600">Showcase your key projects and achievements</p>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
                {projects.map((project: Project) => (
                    <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-6">
                        {editingId === project.id ? (
                            <div className="space-y-4">
                                {/* Project Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={project.name}
                                        onChange={(e) => updateProject(project.id, { name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="E.g., E-commerce Platform"
                                        required
                                    />
                                </div>

                                {/* Project Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <SimpleRichTextEditor
                                        value={project.description}
                                        onChange={(value) => updateProject(project.id, { description: value })}
                                        placeholder="Describe your project, your role, and key achievements..."
                                    />
                                </div>

                                {/* URLs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Live URL
                                        </label>
                                        <input
                                            type="url"
                                            value={project.url || ''}
                                            onChange={(e) => updateProject(project.id, { url: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="https://project-demo.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            value={project.github_url || ''}
                                            onChange={(e) => updateProject(project.id, { github_url: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="https://github.com/username/repo"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => handleSaveProject(project.id)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        disabled={!project.name.trim() || !project.description.trim()}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProject(project.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {project.name || 'Untitled Project'}
                                        </h3>
                                        <div
                                            className="text-gray-600 mb-3"
                                            dangerouslySetInnerHTML={{ __html: project.description || 'No description' }}
                                        />
                                        <div className="flex gap-4 text-sm">
                                            {project.url && (
                                                <a
                                                    href={project.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    Live Demo
                                                </a>
                                            )}
                                            {project.github_url && (
                                                <a
                                                    href={project.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    GitHub
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => setEditingId(project.id)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <FolderOpen className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Add Project Button */}
                {!isAdding && (
                    <button
                        onClick={handleAddProject}
                        className="w-full py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex flex-col items-center gap-2"
                    >
                        <Plus className="h-6 w-6" />
                        <span>Add Project</span>
                    </button>
                )}
            </div>

            {/* Skip Section */}
            <div className="text-center">
                <button
                    onClick={onNext}
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    Skip Projects Section
                </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                    onClick={onPrev}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={onNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default ProjectsStep
