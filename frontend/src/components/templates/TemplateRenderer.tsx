"use client";

import { getTemplateById } from '@/constants/templates';
import ExecutiveElite from './ExecutiveElite';
import ModernMinimalist from './ModernMinimalist';
import CreativeDesigner from './CreativeDesigner';

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  job_title?: string;
  summary?: string;
  skills?: Array<{
    name: string;
    rating: number;
  }>;
  experience?: any[];
  education?: any[];
  projects?: any[];
  certifications?: any[];
  languages?: any[];
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
}

interface TemplateRendererProps {
  templateId: number;
  userData: UserData;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export default function TemplateRenderer({ templateId, userData, colors }: TemplateRendererProps) {
  const template = getTemplateById(templateId);

  if (!template) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Template Not Found</h2>
        <p className="text-gray-600">The requested template could not be found.</p>
      </div>
    );
  }

  // Use template default colors if no custom colors provided
  const themeColors = colors || template.colors;

  // Render the appropriate template component based on ID
  switch (templateId) {
    case 1: // executive-elite
      return <ExecutiveElite userData={userData} colors={themeColors} />;

    case 2: // modern-minimalist
      return <ModernMinimalist userData={userData} colors={themeColors} />;

    case 3: // creative-designer
      return <CreativeDesigner userData={userData} colors={themeColors} />;

    default:
      return <ModernMinimalist userData={userData} colors={themeColors} />;
  }
}

// Export template preview component for template selection
export function TemplatePreview({ templateId, scale = 0.3 }: { templateId: number; scale?: number }) {
  const template = getTemplateById(templateId);

  if (!template) return null;

  const sampleData: UserData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "New York, NY",
    job_title: "Senior Professional",
    summary: "Experienced professional with a proven track record of success.",
    skills: [
      { name: "Leadership", rating: 5 },
      { name: "Strategy", rating: 4 },
      { name: "Innovation", rating: 5 }
    ],
    experience: [
      {
        title: "Senior Position",
        company: "Tech Company",
        duration: "2020 - Present",
        description: "Led strategic initiatives and drove business growth."
      }
    ],
    education: [
      {
        degree: "Master's Degree",
        institution: "University",
        year: "2018"
      }
    ]
  };

  return (
    <div
      className="origin-top-left pointer-events-none overflow-hidden"
      style={{
        transform: `scale(${scale})`,
        width: `${100 / scale}%`,
        height: `${100 / scale}%`
      }}
    >
      <TemplateRenderer templateId={templateId} userData={sampleData} />
    </div>
  );
}

// Color theme presets
export const COLOR_THEMES = {
  blue: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#06b6d4',
    text: '#334155',
    background: '#ffffff'
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#a855f7',
    accent: '#ec4899',
    text: '#374151',
    background: '#ffffff'
  },
  green: {
    primary: '#059669',
    secondary: '#047857',
    accent: '#10b981',
    text: '#1f2937',
    background: '#ffffff'
  },
  red: {
    primary: '#dc2626',
    secondary: '#991b1b',
    accent: '#f87171',
    text: '#374151',
    background: '#ffffff'
  },
  orange: {
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#fbbf24',
    text: '#374151',
    background: '#ffffff'
  },
  slate: {
    primary: '#1a365d',
    secondary: '#2d3748',
    accent: '#3182ce',
    text: '#2d3748',
    background: '#ffffff'
  }
};
