"use client";

import { memo, lazy, Suspense, useMemo } from 'react';
import { getTemplateById } from '@/constants/templates';

const ExecutiveElite = lazy(() => import('./ExecutiveElite'));
const ModernMinimalist = lazy(() => import('./ModernMinimalist'));
const CreativeDesigner = lazy(() => import('./CreativeDesigner'));
const MinimalistProfessional = lazy(() => import('./MinimalistProfessional'));
const CorporateClassic = lazy(() => import('./CorporateClassic'));
const ModernTech = lazy(() => import('./ModernTech'));
const CreativePortfolio = lazy(() => import('./CreativePortfolio'));
const AcademicExcellence = lazy(() => import('./AcademicExcellence'));
const ClassicTraditional = lazy(() => import('./ClassicTraditional'));
const CleanSimple = lazy(() => import('./CleanSimple'));
const BusinessFormal = lazy(() => import('./BusinessFormal'));
const ClassicElegant = lazy(() => import('./ClassicElegant'));
const ProfessionalClean = lazy(() => import('./ProfessionalClean'));
const PhotoCentric = lazy(() => import('./PhotoCentric'));
const ProfileSidebar = lazy(() => import('./ProfileSidebar'));
const ModernPortrait = lazy(() => import('./ModernPortrait'));

export interface UserData {
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
  social_links?: Array<{
    label: string;
    url: string;
    username?: string;
  }>;
  image_url?: string;
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
  size?: 'small' | 'normal';
  mode?: 'default' | 'live';
}

const TEMPLATE_COMPONENTS = {
  1: ExecutiveElite,
  2: ModernMinimalist,
  3: CreativeDesigner,
  4: MinimalistProfessional,
  5: CorporateClassic,
  6: ModernTech,
  7: CreativePortfolio,
  8: AcademicExcellence,
  9: ModernPortrait,
  10: CleanSimple,
  11: BusinessFormal,
  12: ClassicElegant,
  13: ProfessionalClean,
  14: PhotoCentric,
  15: ProfileSidebar,
  16: ClassicTraditional,
} as const;

const TemplateComponent = memo(({ templateId, userData, colors, size, mode }: TemplateRendererProps) => {
  const Component = TEMPLATE_COMPONENTS[templateId as keyof typeof TEMPLATE_COMPONENTS] || ModernMinimalist;
  return <Component userData={userData} colors={colors} size={size} mode={mode} />;
});

TemplateComponent.displayName = 'TemplateComponent';

const ErrorFallback = memo(() => (
  <div className="max-w-4xl mx-auto p-8 text-center">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Template Not Found</h2>
    <p className="text-gray-600">The requested template could not be found.</p>
  </div>
));

ErrorFallback.displayName = 'ErrorFallback';

const LoadingFallback = memo(() => (
  <div className="w-full h-full flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

const TemplateRenderer = memo(function TemplateRenderer({ templateId, userData, colors, size = 'normal', mode = 'default' }: TemplateRendererProps) {
  const template = useMemo(() => getTemplateById(templateId), [templateId]);
  const themeColors = useMemo(() => colors || template?.colors, [colors, template?.colors]);

  if (!template) {
    return <ErrorFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TemplateComponent 
        templateId={templateId} 
        userData={userData} 
        colors={themeColors} 
        size={size} 
        mode={mode} 
      />
    </Suspense>
  );
});

export default TemplateRenderer;

const SAMPLE_DATA: UserData = {
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

export const TemplatePreview = memo(function TemplatePreview({ 
  templateId, 
  size = 'small' 
}: { 
  templateId: number; 
  size?: 'small' | 'normal' 
}) {
  const template = useMemo(() => getTemplateById(templateId), [templateId]);

  if (!template) return null;

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all aspect-[1/1.414] overflow-hidden">
      <TemplateRenderer templateId={templateId} userData={SAMPLE_DATA} size="small" />
    </div>
  );
});

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
} as const;