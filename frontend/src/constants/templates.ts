export interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  preview: string;
  isPremium: boolean;
  isFree: boolean; // Free templates that don't require upgrade
  hasPhoto: boolean;
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
  // FREE TEMPLATES - Simple, basic designs for non-premium users
  {
    id: 17,
    name: 'Basic White',
    category: 'Professional',
    description: 'Simple and clean white template - Perfect for getting started',
    preview: '/templates/basic-white.jpg',
    isPremium: false,
    isFree: true,
    hasPhoto: false,
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#555555',
      text: '#000000',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Arial',
      body: 'Arial'
    },
    layout: 'single-column'
  },
  {
    id: 18,
    name: 'Simple Professional',
    category: 'Professional',
    description: 'No-frills professional template - Quick and easy',
    preview: '/templates/simple-professional.jpg',
    isPremium: false,
    isFree: true,
    hasPhoto: false,
    colors: {
      primary: '#2c3e50',
      secondary: '#34495e',
      accent: '#4a5568',
      text: '#2c3e50',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Arial',
      body: 'Arial'
    },
    layout: 'two-column'
  },
  {
    id: 19,
    name: 'Essential Resume',
    category: 'Professional',
    description: 'Essential template with all the basics - Free forever',
    preview: '/templates/essential-resume.jpg',
    isPremium: false,
    isFree: true,
    hasPhoto: false,
    colors: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
      accent: '#666666',
      text: '#1a1a1a',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Calibri',
      body: 'Calibri'
    },
    layout: 'single-column'
  },
  
  // PREMIUM TEMPLATES
  {
    id: 1,
    name: 'Executive Elite',
    category: 'Executive',
    description: 'Sophisticated design for C-level executives and senior management',
    preview: '/templates/executive-elite.jpg',
    isPremium: true,
    isFree: false,
    hasPhoto: true,
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
    id: 2,
    name: 'Modern Minimalist',
    category: 'Professional',
    description: 'Clean, contemporary design perfect for tech and creative professionals',
    preview: '/templates/modern-minimalist.jpg',
    isPremium: false,
    isFree: false,
    hasPhoto: false,
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
    id: 3,
    name: 'Creative Designer',
    category: 'Creative',
    description: 'Bold and artistic layout for designers and creative professionals',
    preview: '/templates/creative-designer.jpg',
    isPremium: true,
    isFree: false,
    hasPhoto: true,
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
    id: 4,
    name: 'Minimalist Professional',
    category: 'Professional',
    description: 'Ultra-clean black and white design with Helvetica typography',
    preview: '/templates/minimalist-professional.jpg',
    isPremium: false,
    isFree: false,
    hasPhoto: false,
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      text: '#000000',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Helvetica',
      body: 'Helvetica'
    },
    layout: 'two-column'
  },
  {
    id: 5,
    name: 'Corporate Classic',
    category: 'Corporate',
    description: 'Traditional corporate design with blue theme and Times New Roman',
    preview: '/templates/corporate-classic.jpg',
    isPremium: false,
    isFree: false,
    hasPhoto: true,
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Times New Roman',
      body: 'Times New Roman'
    },
    layout: 'sidebar'
  },
  {
    id: 6,
    name: 'Modern Tech',
    category: 'Technology',
    description: 'Tech-focused design with monospace fonts and terminal styling',
    preview: '/templates/modern-tech.jpg',
    isPremium: true,
    isFree: false,
    hasPhoto: false,
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#22d3ee',
      text: '#0f172a',
      background: '#f8fafc'
    },
    fonts: {
      heading: 'JetBrains Mono',
      body: 'Fira Code'
    },
    layout: 'two-column'
  },
  {
    id: 7,
    name: 'Creative Portfolio',
    category: 'Creative',
    description: 'Artistic design with gradients and creative layouts',
    preview: '/templates/creative-portfolio.jpg',
    isPremium: true,
    isFree: false,
    hasPhoto: true,
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      accent: '#f59e0b',
      text: '#1e293b',
      background: '#fefce8'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter'
    },
    layout: 'two-column'
  },
  {
    id: 8,
    name: 'Academic Excellence',
    category: 'Academic',
    description: 'Formal academic design with serif fonts and scholarly appearance',
    preview: '/templates/academic-excellence.jpg',
    isPremium: false,
    isFree: false,
    hasPhoto: false,
    colors: {
      primary: '#1e40af',
      secondary: '#064e3b',
      accent: '#dc2626',
      text: '#111827',
      background: '#f9fafb'
    },
    fonts: {
      heading: 'Crimson Text',
      body: 'Times New Roman'
    },
    layout: 'single-column'
  },
  {
    id: 9,
    name: 'Classic Traditional',
    category: 'Classic',
    description: 'Timeless professional design with traditional serif fonts',
    preview: '/templates/classic-traditional.jpg',
    isPremium: false,
    isFree: false,
    hasPhoto: false,
    colors: {
      primary: '#2c3e50',
      secondary: '#34495e',
      accent: '#3498db',
      text: '#2c3e50',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Times New Roman',
      body: 'Times New Roman'
    },
    layout: 'two-column'
  },
  {
    id: 10,
    name: 'Clean Simple',
    category: 'Professional',
    description: 'Straightforward and clean design perfect for any industry',
    preview: '/templates/clean-simple.jpg',
    isPremium: false,
    isFree: false,
    hasPhoto: false,
    colors: {
      primary: '#4a5568',
      secondary: '#718096',
      accent: '#2d3748',
      text: '#2d3748',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Arial',
      body: 'Arial'
    },
    layout: 'two-column'
  },
  {
    id: 11,
    name: 'Business Formal',
    category: 'Professional',
    description: 'Formal business design with centered layout and elegant styling',
    preview: '/templates/business-formal.jpg',
    isPremium: true,
    isFree: false,
    hasPhoto: false,
    colors: {
      primary: '#1a202c',
      secondary: '#2d3748',
      accent: '#4a5568',
      text: '#1a202c',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Georgia',
      body: 'Georgia'
    },
    layout: 'two-column'
  },
  {
    id: 12,
    name: 'Classic Elegant',
    category: 'Classic',
    description: 'Sophisticated classical design with decorative elements',
    preview: '/templates/classic-elegant.jpg',
    isPremium: true,
    isFree: false,
    hasPhoto: false,
    colors: {
      primary: '#1a365d',
      secondary: '#2c5282',
      accent: '#3182ce',
      text: '#2d3748',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Libre Baskerville',
      body: 'Times New Roman'
    },
    layout: 'two-column'
  },
  {
    id: 13,
    name: 'Professional Clean',
    category: 'Professional',
    description: 'Ultra-clean professional design with subtle elements',
    preview: '/templates/professional-clean.jpg',
    isPremium: false,
    isFree: false,
    hasPhoto: false,
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#9ca3af',
      text: '#111827',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Calibri',
      body: 'Arial'
    },
    layout: 'two-column'
  },
  {
    id: 14,
    name: 'Photo Centric',
    category: 'Professional',
    description: 'Modern template with large profile photo as focal point and clean typography',
    preview: '/templates/photo-centric.jpg',
    isPremium: true,
    isFree: false,
    hasPhoto: true,
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      text: '#1f2937',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    layout: 'single-column'
  },
  {
    id: 15,
    name: 'Profile Sidebar',
    category: 'Professional',
    description: 'Professional template with profile photo in left sidebar and modern styling',
    preview: '/templates/profile-sidebar.jpg',
    isPremium: true,
    isFree: false,
    hasPhoto: true,
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      text: '#1f2937',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Roboto',
      body: 'Roboto'
    },
    layout: 'sidebar'
  },
  {
    id: 16,
    name: 'Modern Portrait',
    category: 'Creative',
    description: 'Creative template with artistic profile photo integration and modern elements',
    preview: '/templates/modern-portrait.jpg',
    isPremium: true,
    isFree: false,
    hasPhoto: true,
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#d946ef',
      text: '#1f2937',
      background: '#ffffff'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Poppins'
    },
    layout: 'modern-grid'
  }
];

export const getTemplateById = (id: number): Template | undefined => {
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
  'Corporate',
  'Academic',
  'Classic'
];
