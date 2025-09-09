"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe, Code, Cpu, Database, Zap } from 'lucide-react'

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

interface ModernTechProps {
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

export default function ModernTech({ userData, colors, size = 'normal', mode = 'default' }: ModernTechProps) {
  const theme = colors || {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#22d3ee',
    text: '#0f172a',
    background: '#f8fafc'
  };

  const isSmall = size === 'small';

  // Modern tech styling with improved spacing
  const styles = {
    container: {
      fontSize: isSmall ? '7px' : '12px',
      lineHeight: isSmall ? 1.4 : 1.6,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
    },
    name: {
      fontSize: isSmall ? '18px' : '36px',
      fontWeight: '700',
      letterSpacing: '-1.2px'
    },
    jobTitle: {
      fontSize: isSmall ? '9px' : '16px',
      fontWeight: '500',
      letterSpacing: '0.2px'
    },
    sectionTitle: {
      fontSize: isSmall ? '8px' : '14px',
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      letterSpacing: '1.2px'
    },
    text: {
      fontSize: isSmall ? '7px' : '11px',
      lineHeight: isSmall ? 1.5 : 1.7
    },
    spacing: {
      section: isSmall ? '14px' : '28px',
      item: isSmall ? '7px' : '14px',
      micro: isSmall ? '4px' : '8px'
    },
    padding: {
      container: isSmall ? '14px' : '28px'
    }
  };

  // Helper function to check if section has content
  const hasContent = (data: any) => {
    if (Array.isArray(data)) return data && data.length > 0;
    return data && data.trim && data.trim().length > 0;
  };

  return (
    <div
      className="w-full h-full"
      style={{
        fontFamily: styles.container.fontFamily,
        fontSize: styles.container.fontSize,
        lineHeight: styles.container.lineHeight,
        color: theme.text,
        backgroundColor: theme.background,
        minHeight: isSmall ? 'auto' : '297mm',
        width: isSmall ? 'auto' : '210mm',
        margin: '0 auto',
        boxShadow: isSmall ? 'none' : '0 0 30px rgba(0,0,0,0.1)',
        padding: styles.padding.container
      }}
    >
      {/* Tech-style header with grid pattern */}
      <div 
        style={{ 
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
          color: 'white',
          padding: styles.padding.container,
          marginBottom: styles.spacing.section,
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Grid pattern overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            opacity: 0.5
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-3 mb-3">
            <div 
              style={{
                width: isSmall ? '12px' : '24px',
                height: isSmall ? '12px' : '24px',
                backgroundColor: theme.accent,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Code style={{ width: isSmall ? '8px' : '16px', height: isSmall ? '8px' : '16px', color: 'white' }} />
            </div>
            <div>
              <h1 
                style={{ 
                  fontSize: styles.name.fontSize,
                  fontWeight: styles.name.fontWeight,
                  letterSpacing: styles.name.letterSpacing,
                  marginBottom: '2px'
                }}
              >
                {userData.name || "developer_name"}
              </h1>
              {hasContent(userData.job_title) && (
                <p 
                  style={{ 
                    fontSize: styles.jobTitle.fontSize,
                    fontWeight: styles.jobTitle.fontWeight,
                    opacity: 0.9
                  }}
                >
                  // {userData.job_title}
                </p>
              )}
            </div>
          </div>
          
          {/* Terminal-style contact info */}
          <div 
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '8px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: styles.text.fontSize
            }}
          >
            <div style={{ marginBottom: '2px' }}>
              <span style={{ color: theme.accent }}>$</span> contact --info
            </div>
            {hasContent(userData.email) && (
              <div style={{ marginLeft: '8px', marginBottom: '1px' }}>
                email: {userData.email}
              </div>
            )}
            {hasContent(userData.phone) && (
              <div style={{ marginLeft: '8px', marginBottom: '1px' }}>
                phone: {userData.phone}
              </div>
            )}
            {hasContent(userData.address) && (
              <div style={{ marginLeft: '8px', marginBottom: '1px' }}>
                location: {userData.address}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="flex gap-4">
        {/* Left column - 70% */}
        <div className="flex-1" style={{ flex: '0 0 70%' }}>
          {/* Summary */}
          {hasContent(userData.summary) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <div 
                className="flex items-center gap-2 mb-2"
                style={{ 
                  borderLeft: `4px solid ${theme.primary}`,
                  paddingLeft: '8px'
                }}
              >
                <Cpu style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    color: theme.primary,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  ./about_me
                </h2>
              </div>
              <div 
                style={{ 
                  backgroundColor: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: `2px solid ${theme.accent}20`
                }}
              >
                <p style={{ fontSize: styles.text.fontSize, lineHeight: styles.text.lineHeight }}>
                  {userData.summary}
                </p>
              </div>
            </div>
          )}

          {/* Experience */}
          {hasContent(userData.experience) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <div 
                className="flex items-center gap-2 mb-3"
                style={{ 
                  borderLeft: `4px solid ${theme.primary}`,
                  paddingLeft: '8px'
                }}
              >
                <Zap style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    color: theme.primary,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  ./work_experience
                </h2>
              </div>
              {(userData.experience || []).slice(0, isSmall ? 3 : 5).map((exp, i) => (
                <div 
                  key={i}
                  style={{ 
                    backgroundColor: 'white',
                    padding: '12px',
                    borderRadius: '6px',
                    border: `1px solid ${theme.accent}30`,
                    marginBottom: styles.spacing.item
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '700',
                        color: theme.text
                      }}
                    >
                      {exp.title || exp.jobTitle || 'position'}
                    </h3>
                    <span 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.secondary,
                        backgroundColor: `${theme.accent}20`,
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontFamily: 'monospace'
                      }}
                    >
                      {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'present'}`}
                    </span>
                  </div>
                  <p 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      color: theme.secondary,
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}
                  >
                    @ {exp.company || exp.employer || 'company'}
                  </p>
                  {exp.description && (
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        lineHeight: styles.text.lineHeight,
                        color: theme.text
                      }}
                    >
                      {isSmall && exp.description.length > 120 
                        ? exp.description.substring(0, 120) + '...' 
                        : exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {hasContent(userData.projects) && (
            <div>
              <div 
                className="flex items-center gap-2 mb-3"
                style={{ 
                  borderLeft: `4px solid ${theme.primary}`,
                  paddingLeft: '8px'
                }}
              >
                <Database style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    color: theme.primary,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  ./projects
                </h2>
              </div>
              <div className="grid gap-3">
                {(userData.projects || []).slice(0, isSmall ? 2 : 4).map((project, i) => (
                  <div 
                    key={i}
                    style={{ 
                      backgroundColor: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: `1px solid ${theme.accent}30`,
                      borderLeft: `4px solid ${theme.secondary}`
                    }}
                  >
                    <h3 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '700',
                        color: theme.text,
                        marginBottom: '4px'
                      }}
                    >
                      {project.name || 'project_name'}
                    </h3>
                    {project.description && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          lineHeight: styles.text.lineHeight,
                          color: theme.text
                        }}
                      >
                        {isSmall && project.description.length > 100 
                          ? project.description.substring(0, 100) + '...' 
                          : project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar - 30% */}
        <div className="w-1/3">
          {/* Skills as tech stack */}
          {hasContent(userData.skills) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.primary,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item
                }}
              >
                tech_stack[]
              </h2>
              <div 
                style={{ 
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.accent}30`
                }}
              >
                {(userData.skills || []).slice(0, isSmall ? 8 : 12).map((skill, i) => (
                  <div key={i} style={{ marginBottom: '6px' }}>
                    <div className="flex justify-between items-center mb-1">
                      <span 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          fontFamily: 'monospace',
                          color: theme.text
                        }}
                      >
                        {skill.name}
                      </span>
                      <span 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: theme.secondary,
                          fontFamily: 'monospace'
                        }}
                      >
                        {skill.rating}/5
                      </span>
                    </div>
                    <div 
                      style={{ 
                        width: '100%',
                        height: '3px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${(skill.rating / 5) * 100}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                          borderRadius: '2px'
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
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.primary,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item
                }}
              >
                education[]
              </h2>
              {(userData.education || []).slice(0, isSmall ? 2 : 4).map((edu, i) => (
                <div 
                  key={i}
                  style={{ 
                    backgroundColor: 'white',
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.accent}30`,
                    marginBottom: '6px'
                  }}
                >
                  <p 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      fontWeight: '700',
                      color: theme.text,
                      fontFamily: 'monospace'
                    }}
                  >
                    {edu.degree || 'degree'}
                  </p>
                  <p 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      color: theme.secondary
                    }}
                  >
                    {edu.institution || edu.school || 'institution'}
                  </p>
                  {edu.year && (
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.accent,
                        fontFamily: 'monospace'
                      }}
                    >
                      {edu.year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {hasContent(userData.certifications) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.primary,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item
                }}
              >
                certs[]
              </h2>
              {(userData.certifications || []).slice(0, isSmall ? 3 : 5).map((cert, i) => (
                <div 
                  key={i}
                  style={{ 
                    padding: '6px',
                    borderLeft: `3px solid ${theme.secondary}`,
                    backgroundColor: 'white',
                    marginBottom: '4px',
                    borderRadius: '0 4px 4px 0'
                  }}
                >
                  <p 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      fontWeight: '600',
                      color: theme.text
                    }}
                  >
                    {cert.name || cert.title || 'certification'}
                  </p>
                  {(cert.issuer || cert.year) && (
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.secondary,
                        fontFamily: 'monospace'
                      }}
                    >
                      {cert.issuer && cert.year ? `${cert.issuer} • ${cert.year}` : cert.issuer || cert.year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {hasContent(userData.languages) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.primary,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item
                }}
              >
                languages[]
              </h2>
              <div className="flex flex-wrap gap-1">
                {(userData.languages || []).slice(0, isSmall ? 4 : 6).map((lang, i) => (
                  <span 
                    key={i}
                    style={{ 
                      fontSize: styles.text.fontSize,
                      backgroundColor: theme.accent,
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontFamily: 'monospace'
                    }}
                  >
                    {typeof lang === 'string' ? lang : lang.name || 'lang'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links as JSON */}
          {(hasContent(userData.linkedin_url) || hasContent(userData.github_url) || hasContent(userData.portfolio_url)) && (
            <div>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.primary,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item
                }}
              >
                links: &#123;
              </h2>
              <div 
                style={{ 
                  backgroundColor: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                  border: `1px solid ${theme.accent}30`,
                  fontFamily: 'monospace',
                  fontSize: styles.text.fontSize
                }}
              >
                {hasContent(userData.linkedin_url) && (
                  <div style={{ marginBottom: '2px' }}>
                    <span style={{ color: theme.secondary }}>linkedin:</span> <span style={{ color: theme.accent }}>"url"</span>
                  </div>
                )}
                {hasContent(userData.github_url) && (
                  <div style={{ marginBottom: '2px' }}>
                    <span style={{ color: theme.secondary }}>github:</span> <span style={{ color: theme.accent }}>"url"</span>
                  </div>
                )}
                {hasContent(userData.portfolio_url) && (
                  <div style={{ marginBottom: '2px' }}>
                    <span style={{ color: theme.secondary }}>portfolio:</span> <span style={{ color: theme.accent }}>"url"</span>
                  </div>
                )}
              </div>
              <div style={{ fontSize: styles.sectionTitle.fontSize, color: theme.primary, fontFamily: 'monospace' }}>
                &#125;
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
