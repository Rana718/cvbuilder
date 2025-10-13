import React from 'react'
import { Search, X } from 'lucide-react'
import { COLOR_THEMES } from '@/components/ui/ColorThemePicker'
import { TEMPLATE_CATEGORIES } from '@/constants/templates'
import TemplateItem from './TemplateItem'

interface TemplateSelectorPanelProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    filteredTemplates: any[]
    templateId: string | null
    onTemplateChange: (id: number) => void
    onClose?: () => void
    colorTheme: any
    onColorThemeChange: (theme: any) => void
}

const TemplateSelectorPanel = React.memo<TemplateSelectorPanelProps>(({ 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory, 
    filteredTemplates,
    templateId,
    onTemplateChange,
    onClose,
    colorTheme,
    onColorThemeChange
}) => (
    <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl h-full overflow-hidden flex flex-col border border-white/20">
        <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Templates
                </h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                )}
            </div>

            <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Color Theme</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {COLOR_THEMES.map((theme) => (
                        <button
                            key={theme.name}
                            onClick={() => onColorThemeChange(theme)}
                            className={`flex-shrink-0 p-2 rounded-lg border-2 transition-all ${
                                colorTheme.name === theme.name
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            title={theme.name}
                        >
                            <div className="flex space-x-1">
                                <div 
                                    className="w-4 h-4 rounded border border-gray-300" 
                                    style={{ 
                                        backgroundColor: theme.colors?.primary || '#ffffff',
                                        backgroundImage: theme.colors ? undefined : 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
                                        backgroundSize: theme.colors ? undefined : '4px 4px',
                                        backgroundPosition: theme.colors ? undefined : '0 0, 0 2px, 2px -2px, -2px 0px'
                                    }}
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white text-sm transition-all duration-200"
                />
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedCategory("All")}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${"All" === selectedCategory
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                        : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 hover:shadow-sm"
                    }`}
                >
                    All
                </button>
                {TEMPLATE_CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                            selectedCategory === category
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                                : "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 hover:shadow-sm"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredTemplates.map((template, i) => (
                    <TemplateItem
                        key={template.id}
                        template={template}
                        templateId={templateId}
                        onTemplateChange={onTemplateChange}
                        index={i}
                        colorTheme={colorTheme}
                    />
                ))}
            </div>
        </div>
    </div>
))

TemplateSelectorPanel.displayName = 'TemplateSelectorPanel'

export default TemplateSelectorPanel
