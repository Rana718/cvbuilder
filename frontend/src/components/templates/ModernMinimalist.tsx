"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react'

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
  image_url?: string;
}

interface ModernMinimalistProps {
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

export default function ModernMinimalist({ userData, colors, size = 'normal', mode = 'default' }: ModernMinimalistProps) {
  const theme = colors || {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#06b6d4',
    text: '#334155',
    background: '#ffffff'
  };

  const isSmall = size === 'small';
  
  // A4 optimized sizing
  const styles = {
    container: {
      fontSize: isSmall ? '6px' : '11px',
      lineHeight: isSmall ? 1.2 : 1.4,
      fontFamily: "'Inter', sans-serif"
    },
    name: {
      fontSize: isSmall ? '14px' : '24px',
      fontWeight: '700'
    },
    jobTitle: {
      fontSize: isSmall ? '8px' : '14px',
      fontWeight: '500'
    },
    sectionTitle: {
      fontSize: isSmall ? '7px' : '12px',
      fontWeight: '700',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const
    },
    text: {
      fontSize: isSmall ? '6px' : '10px',
      lineHeight: isSmall ? 1.3 : 1.5
    },
    spacing: {
      section: isSmall ? '8px' : '16px',
      item: isSmall ? '4px' : '8px'
    },
    padding: {
      container: isSmall ? '8px' : '20px',
      section: isSmall ? '6px' : '12px'
    }
  };

  // Helper function to check if section has content
  const hasContent = (data: any) => {
    if (Array.isArray(data)) return data && data.length > 0;
    return data && data.trim && data.trim().length > 0;
  };

  return (
    <div
      className="w-full h-full flex flex-col bg-white"
      style={{
        fontFamily: styles.container.fontFamily,
        fontSize: styles.container.fontSize,
        lineHeight: styles.container.lineHeight,
        color: theme.text,
        backgroundColor: theme.background,
        minHeight: isSmall ? 'auto' : '297mm',
        width: isSmall ? 'auto' : '210mm',
        margin: '0 auto',
        boxShadow: isSmall ? 'none' : '0 0 20px rgba(0,0,0,0.1)',
        padding: styles.padding.container
      }}
    >
      {/* Header */}
      <div 
        className="text-center border-b border-gray-200 pb-4 mb-6"
        style={{ 
          paddingBottom: styles.spacing.item, 
          marginBottom: styles.spacing.section,
          borderBottomWidth: '1px',
          borderBottomColor: '#e5e7eb'
        }}
      >
        <h1 
          className="font-bold mb-1"
          style={{ 
            fontSize: styles.name.fontSize,
            fontWeight: styles.name.fontWeight,
            color: theme.primary
          }}
        >
          {userData.name || "Your Name"}
        </h1>
        {hasContent(userData.job_title) && (
          <p 
            className="font-medium mb-2"
            style={{ 
              fontSize: styles.jobTitle.fontSize,
              fontWeight: styles.jobTitle.fontWeight,
              color: theme.secondary
            }}
          >
            {userData.job_title}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2" style={{ fontSize: styles.text.fontSize }}>
          {hasContent(userData.email) && (
            <div className="flex items-center gap-1">
              <Mail style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
              <span>{userData.email}</span>
            </div>
          )}
          {hasContent(userData.phone) && (
            <div className="flex items-center gap-1">
              <Phone style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
              <span>{userData.phone}</span>
            </div>
          )}
          {hasContent(userData.address) && (
            <div className="flex items-center gap-1">
              <MapPin style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
              <span>{userData.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-4">
        {/* Left Column */}
        <div 
          className="w-1/3 bg-gray-50 rounded-lg"
          style={{ padding: styles.padding.section }}
        >
          {/* Skills */}
          {hasContent(userData.skills) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-2"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Skills
              </h3>
              <div>
                {(userData.skills || []).slice(0, isSmall ? 8 : 12).map((skill, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.item }}>
                    <div className="flex justify-between items-center mb-1">
                      <span style={{ fontSize: styles.text.fontSize, fontWeight: '500' }}>{skill.name}</span>
                      <span style={{ fontSize: styles.text.fontSize, color: theme.secondary }}>
                        {skill.rating}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(skill.rating / 5) * 100}%`,
                          backgroundColor: theme.primary
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {hasContent(userData.education) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-2"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Education
              </h3>
              <div>
                {(userData.education || []).slice(0, isSmall ? 3 : 4).map((edu, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.item }}>
                    <p className="font-medium" style={{ fontSize: styles.text.fontSize }}>
                      {edu.degree || 'Degree'}
                    </p>
                    <p style={{ fontSize: styles.text.fontSize, color: theme.secondary }}>
                      {edu.institution || edu.school || 'Institution'}
                    </p>
                    {edu.year && (
                      <p style={{ fontSize: styles.text.fontSize, color: theme.secondary }}>
                        {edu.year}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {hasContent(userData.languages) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-2"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Languages
              </h3>
              <div className="flex flex-wrap gap-1">
                {(userData.languages || []).slice(0, isSmall ? 4 : 6).map((lang, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 rounded text-white"
                    style={{ 
                      fontSize: styles.text.fontSize,
                      backgroundColor: theme.secondary
                    }}
                  >
                    {typeof lang === 'string' ? lang : lang.name || 'Language'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Professional Links */}
          {(hasContent(userData.linkedin_url) || hasContent(userData.github_url) || hasContent(userData.portfolio_url)) && (
            <div>
              <h3 
                className="font-bold uppercase tracking-wide mb-2"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Links
              </h3>
              <div>
                {hasContent(userData.linkedin_url) && (
                  <div className="flex items-center gap-1 mb-1">
                    <Linkedin style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                    <span style={{ fontSize: styles.text.fontSize }}>LinkedIn</span>
                  </div>
                )}
                {hasContent(userData.github_url) && (
                  <div className="flex items-center gap-1 mb-1">
                    <Github style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                    <span style={{ fontSize: styles.text.fontSize }}>GitHub</span>
                  </div>
                )}
                {hasContent(userData.portfolio_url) && (
                  <div className="flex items-center gap-1 mb-1">
                    <Globe style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                    <span style={{ fontSize: styles.text.fontSize }}>Portfolio</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1" style={{ padding: styles.padding.section }}>
          {/* Summary */}
          {hasContent(userData.summary) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-2"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Professional Summary
              </h3>
              <p style={{ fontSize: styles.text.fontSize, lineHeight: styles.text.lineHeight }}>
                {userData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {hasContent(userData.experience) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-3"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Work Experience
              </h3>
              <div>
                {(userData.experience || []).slice(0, isSmall ? 3 : 4).map((exp, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.section }}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold" style={{ fontSize: styles.text.fontSize }}>
                        {exp.title || exp.jobTitle || 'Position'}
                      </h4>
                      <span 
                        style={{ 
                          fontSize: styles.text.fontSize, 
                          color: theme.accent,
                          fontWeight: '500'
                        }}
                      >
                        {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}
                      </span>
                    </div>
                    <p 
                      className="font-medium mb-1"
                      style={{ 
                        fontSize: styles.text.fontSize, 
                        color: theme.secondary 
                      }}
                    >
                      {exp.company || exp.employer || 'Company'}
                    </p>
                    {exp.description && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize, 
                          marginTop: styles.spacing.item,
                          lineHeight: styles.text.lineHeight
                        }}
                      >
                        {isSmall && exp.description.length > 100 
                          ? exp.description.substring(0, 100) + '...' 
                          : exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {hasContent(userData.projects) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-3"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Projects
              </h3>
              <div>
                {(userData.projects || []).slice(0, isSmall ? 2 : 3).map((project, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.item }}>
                    <h4 className="font-bold" style={{ fontSize: styles.text.fontSize }}>
                      {project.name || 'Project Name'}
                    </h4>
                    {project.description && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize, 
                          marginTop: styles.spacing.item,
                          lineHeight: styles.text.lineHeight
                        }}
                      >
                        {isSmall && project.description.length > 80 
                          ? project.description.substring(0, 80) + '...' 
                          : project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {hasContent(userData.certifications) && (
            <div>
              <h3 
                className="font-bold uppercase tracking-wide mb-3"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Certifications
              </h3>
              <div>
                {(userData.certifications || []).slice(0, isSmall ? 3 : 5).map((cert, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1">
                    <div 
                      className="w-1 h-1 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <div>
                      <p className="font-medium" style={{ fontSize: styles.text.fontSize }}>
                        {cert.name || cert.title || 'Certification'}
                      </p>
                      {(cert.issuer || cert.year) && (
                        <p style={{ fontSize: styles.text.fontSize, color: '#6b7280' }}>
                          {cert.issuer && cert.year ? `${cert.issuer} • ${cert.year}` : cert.issuer || cert.year}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
