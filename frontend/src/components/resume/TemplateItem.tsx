import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import TemplateRenderer from '@/components/templates/TemplateRenderer'

const SAMPLE_TEMPLATE_DATA = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "New York, NY",
    job_title: "Senior Professional",
    summary: "Experienced professional with proven track record of success in leading teams and driving business growth.",
    skills: [
        { name: "Leadership", rating: 5 },
        { name: "Strategy", rating: 4 },
        { name: "Innovation", rating: 5 },
        { name: "Management", rating: 4 }
    ],
    experience: [{
        title: "Senior Position",
        company: "Tech Company",
        duration: "2020 - Present",
        description: "Led strategic initiatives and drove business growth."
    }, {
        title: "Manager",
        company: "Previous Company",
        duration: "2018 - 2020",
        description: "Managed team and projects."
    }],
    education: [{
        degree: "Master's Degree",
        institution: "University",
        year: "2018"
    }],
    projects: [{
        title: "Sample Project",
        description: "Project description"
    }]
}

interface TemplateItemProps {
    template: any
    templateId: string | null
    onTemplateChange: (id: number) => void
    index: number
    colorTheme: any
}

const TemplateItem = React.memo<TemplateItemProps>(({ 
    template, 
    templateId, 
    onTemplateChange,
    index,
    colorTheme 
}) => (
    <motion.div
        key={template.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="cursor-pointer"
        onClick={() => onTemplateChange(template.id)}
    >
        <div className={`relative overflow-hidden transition-all duration-200 bg-white rounded-xl border-2 hover:shadow-lg ${
            template.id === Number(templateId) 
                ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20' 
                : 'border-gray-200 hover:border-gray-300'
        }`}>
            {template.isFree && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold z-20 shadow-lg">
                    FREE
                </div>
            )}
            
            <div className="w-full bg-white overflow-hidden flex justify-center" style={{ height: '320px' }}>
                <div 
                    className="bg-white border border-gray-500"
                    style={{
                        width: '794px',
                        height: '1122px',
                        transform: 'scale(0.285)',
                        transformOrigin: 'top center'
                    }}
                >
                    <TemplateRenderer 
                        templateId={template.id} 
                        userData={SAMPLE_TEMPLATE_DATA} 
                        colors={template.isFree ? undefined : colorTheme.colors}
                        size="normal" 
                    />
                </div>
            </div>

            <div className="p-3 text-center border-t border-gray-100">
                <h4 className="text-sm font-semibold text-slate-800">{template.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{template.category}</p>
            </div>

            {template.id === Number(templateId) && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-1.5 z-10 shadow-lg">
                    <CheckCircle className="w-4 h-4" />
                </div>
            )}
        </div>
    </motion.div>
))

TemplateItem.displayName = 'TemplateItem'

export default TemplateItem
