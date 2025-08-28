export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  isPremium: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: 'single-column' | 'two-column' | 'sidebar' | 'modern-grid';
}

export const CV_TEMPLATES: Template[] = [
  {
    id: 'executive-elite',
    name: 'Executive Elite',
    category: 'Executive',
    description: 'Sophisticated design for C-level executives and senior management',
    preview: '/templates/executive-elite.jpg',
    isPremium: true,
    colors: {
      primary: '#1a365d',
      secondary: '#2d3748',
      accent: '#3182ce',
      text: '#2d3748',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Source Sans Pro'
    },
    layout: 'two-column'
  },
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    category: 'Professional',
    description: 'Clean, contemporary design perfect for tech and creative professionals',
    preview: '/templates/modern-minimalist.jpg',
    isPremium: false,
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#06b6d4',
      text: '#334155',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    layout: 'single-column'
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    category: 'Creative',
    description: 'Bold and artistic layout for designers and creative professionals',
    preview: '/templates/creative-designer.jpg',
    isPremium: true,
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#ec4899',
      text: '#374151',
      background: '#fafafa'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Open Sans'
    },
    layout: 'modern-grid'
  },
  {
    id: 'tech-specialist',
    name: 'Tech Specialist',
    category: 'Technology',
    description: 'Developer-focused template with clean code-like aesthetics',
    preview: '/templates/tech-specialist.jpg',
    isPremium: false,
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      text: '#1f2937',
      background: '#ffffff'
    },
    fonts: {
      heading: 'JetBrains Mono',
      body: 'Roboto'
    },
    layout: 'sidebar'
  },
  {
    id: 'healthcare-professional',
    name: 'Healthcare Professional',
    category: 'Healthcare',
    description: 'Trustworthy and professional design for medical professionals',
    preview: '/templates/healthcare-professional.jpg',
    isPremium: true,
    colors: {
      primary: '#dc2626',
      secondary: '#991b1b',
      accent: '#f87171',
      text: '#374151',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Lato'
    },
    layout: 'two-column'
  },
  {
    id: 'fresh-graduate',
    name: 'Fresh Graduate',
    category: 'Entry Level',
    description: 'Energetic and modern design perfect for new graduates',
    preview: '/templates/fresh-graduate.jpg',
    isPremium: false,
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      text: '#374151',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Nunito',
      body: 'Nunito Sans'
    },
    layout: 'single-column'
  },
  {
    id: 'finance-expert',
    name: 'Finance Expert',
    category: 'Finance',
    description: 'Conservative and professional layout for financial sector',
    preview: '/templates/finance-expert.jpg',
    isPremium: true,
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Crimson Text',
      body: 'Source Sans Pro'
    },
    layout: 'two-column'
  },
  {
    id: 'marketing-maven',
    name: 'Marketing Maven',
    category: 'Marketing',
    description: 'Dynamic and engaging design for marketing professionals',
    preview: '/templates/marketing-maven.jpg',
    isPremium: false,
    colors: {
      primary: '#e11d48',
      secondary: '#be185d',
      accent: '#f43f5e',
      text: '#374151',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Open Sans'
    },
    layout: 'modern-grid'
  },
  {
    id: 'academic-scholar',
    name: 'Academic Scholar',
    category: 'Academic',
    description: 'Traditional and scholarly design for academic professionals',
    preview: '/templates/academic-scholar.jpg',
    isPremium: true,
    colors: {
      primary: '#374151',
      secondary: '#4b5563',
      accent: '#6b7280',
      text: '#1f2937',
      background: '#ffffff'
    },
    fonts: {
      heading: 'EB Garamond',
      body: 'Crimson Text'
    },
    layout: 'single-column'
  },
  {
    id: 'sales-champion',
    name: 'Sales Champion',
    category: 'Sales',
    description: 'Results-driven design that highlights achievements and metrics',
    preview: '/templates/sales-champion.jpg',
    isPremium: false,
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#34d399',
      text: '#374151',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Raleway',
      body: 'Lato'
    },
    layout: 'sidebar'
  }
];

export const getTemplateById = (id: string): Template | undefined => {
  return CV_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  return CV_TEMPLATES.filter(template => template.category === category);
};

export const getFreeTemplates = (): Template[] => {
  return CV_TEMPLATES.filter(template => !template.isPremium);
};

export const getPremiumTemplates = (): Template[] => {
  return CV_TEMPLATES.filter(template => template.isPremium);
};

export const TEMPLATE_CATEGORIES = [
  'Professional',
  'Executive',
  'Creative',
  'Technology',
  'Healthcare',
  'Entry Level',
  'Finance',
  'Marketing',
  'Academic',
  'Sales'
];
