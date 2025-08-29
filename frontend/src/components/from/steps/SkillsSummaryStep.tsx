import React, { useState } from 'react'
import { Plus, X, Award, FileText } from 'lucide-react'
import { useResumeStore, Skill } from '@/store/resumeStore'
import SimpleRichTextEditor from '@/components/ui/SimpleRichTextEditor'

interface SkillsSummaryStepProps {
  onNext: () => void
  onPrev: () => void
}

const suggestedSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'HTML/CSS',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'Git', 'Agile/Scrum', 'REST APIs', 'GraphQL', 'Jest', 'Cypress', 'CI/CD', 'Linux',
  'Project Management', 'Team Leadership', 'Problem Solving', 'Communication',
  'Data Analysis', 'Machine Learning', 'DevOps', 'Microservices'
]

const summaryTemplates = [
  "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading cross-functional teams.",
  "Results-driven marketing professional with expertise in digital marketing, content strategy, and data analysis. Passionate about creating engaging campaigns that drive brand awareness and customer engagement.",
  "Detail-oriented data scientist with strong analytical skills and experience in machine learning, statistical modeling, and data visualization. Proficient in Python, R, and SQL with a focus on deriving actionable insights.",
  "Creative graphic designer with a passion for visual storytelling and brand development. Skilled in Adobe Creative Suite, web design, and user experience optimization.",
  "Dedicated project manager with excellent organizational and leadership skills. Experienced in Agile methodologies and cross-functional team coordination to deliver projects on time and within budget."
]

function SkillsSummaryStep({ onNext, onPrev }: SkillsSummaryStepProps) {
  const { skills, summary, addSkill, removeSkill, setSummary, setSkills } = useResumeStore()
  const [newSkill, setNewSkill] = useState('')
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false)

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill({ name: newSkill.trim() })
      setNewSkill('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const addSuggestedSkill = (skillName: string) => {
    if (!skills.find(skill => skill.name.toLowerCase() === skillName.toLowerCase())) {
      addSkill({ name: skillName })
    }
  }

  const addMultipleSkills = (skillNames: string[]) => {
    const newSkills: Skill[] = skillNames
      .filter(name => !skills.find(skill => skill.name.toLowerCase() === name.toLowerCase()))
      .map(name => ({ id: Math.random().toString(36).substr(2, 9), name }))
    
    setSkills([...skills, ...newSkills])
  }

  const useSummaryTemplate = (template: string) => {
    setSummary(template)
  }

  const isStepValid = skills.length > 0 || summary.trim().length > 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills & Summary</h2>
        <p className="text-gray-600">Highlight your skills and write a professional summary</p>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Professional Skills
          </h3>
          <button
            onClick={() => setShowSkillSuggestions(!showSkillSuggestions)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showSkillSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
          </button>
        </div>

        {/* Add New Skill */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a skill (e.g., JavaScript, Project Management)"
          />
          <button
            onClick={handleAddSkill}
            disabled={!newSkill.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Current Skills */}
        {skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Your Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{skill.name}</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Suggestions */}
        {showSkillSuggestions && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Suggested Skills:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {suggestedSkills.map((skill) => {
                const isAdded = skills.find(s => s.name.toLowerCase() === skill.toLowerCase())
                return (
                  <button
                    key={skill}
                    onClick={() => addSuggestedSkill(skill)}
                    disabled={!!isAdded}
                    className={`text-left p-2 text-sm rounded border transition-colors ${
                      isAdded
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
            
            {/* Quick Add Category Buttons */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-600">Quick Add Categories:</h5>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => addMultipleSkills(['JavaScript', 'React', 'Node.js', 'HTML/CSS'])}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                >
                  + Frontend Skills
                </button>
                <button
                  onClick={() => addMultipleSkills(['Python', 'Java', 'MongoDB', 'PostgreSQL'])}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200"
                >
                  + Backend Skills
                </button>
                <button
                  onClick={() => addMultipleSkills(['Project Management', 'Team Leadership', 'Agile/Scrum', 'Communication'])}
                  className="px-3 py-1 bg-orange-100 text-orange-800 rounded text-xs hover:bg-orange-200"
                >
                  + Management Skills
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional Summary Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Professional Summary
          </h3>
        </div>

        <p className="text-sm text-gray-600">
          Write a brief summary that highlights your experience, skills, and career objectives.
        </p>

        <SimpleRichTextEditor
          value={summary}
          onChange={setSummary}
          placeholder="Write a compelling summary that showcases your professional background, key skills, and what you bring to potential employers..."
          height="120px"
        />

        {/* Summary Templates */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Summary Templates (click to use):</h4>
          <div className="space-y-2">
            {summaryTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => useSummaryTemplate(template)}
                className="w-full text-left p-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded border border-gray-200 transition-colors"
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!isStepValid}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Next: Additional Information
        </button>
      </div>
    </div>
  )
}

export default SkillsSummaryStep
