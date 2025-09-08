"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, Calendar, Briefcase } from 'lucide-react'

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

interface CreativeDesignerProps {
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

export default function CreativeDesigner({ userData, colors, size = 'normal', mode = 'default' }: CreativeDesignerProps) {
  const theme = colors || {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    text: '#1f2937',
    background: '#ffffff'
  };

  const isSmall = size === 'small';

  // A4 optimized sizing with better typography
  const styles = {
    container: {
      fontSize: isSmall ? '6px' : '11px',
      lineHeight: isSmall ? 1.2 : 1.4,
      fontFamily: "'Inter', sans-serif"
    },
    name: {
      fontSize: isSmall ? '14px' : '28px',
      fontWeight: '700',
      letterSpacing: '-0.5px'
    },
    jobTitle: {
      fontSize: isSmall ? '8px' : '14px',
      fontWeight: '500',
      opacity: 0.9
    },
    sectionTitle: {
      fontSize: isSmall ? '8px' : '13px',
      fontWeight: '700',
      letterSpacing: '0.5px',
      textTransform: 'uppercase' as const
    },
    text: {
      fontSize: isSmall ? '6px' : '10px',
      lineHeight: isSmall ? 1.3 : 1.5
    },
    subtext: {
      fontSize: isSmall ? '5px' : '9px',
      lineHeight: isSmall ? 1.2 : 1.4
    },
    contact: {
      fontSize: isSmall ? '5px' : '9px'
    },
    spacing: {
      section: isSmall ? '8px' : '16px',
      item: isSmall ? '4px' : '8px',
      micro: isSmall ? '2px' : '4px'
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
      className="w-full h-full bg-white"
      style={{
        fontFamily: styles.container.fontFamily,
        fontSize: styles.container.fontSize,
        lineHeight: styles.container.lineHeight,
        color: theme.text,
        backgroundColor: theme.background,
        minHeight: isSmall ? 'auto' : '297mm', // A4 height
        width: isSmall ? 'auto' : '210mm', // A4 width
        margin: '0 auto',
        boxShadow: isSmall ? 'none' : '0 0 20px rgba(0,0,0,0.1)'
      }}
    >
      {/* Modern Header with Gradient */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.accent} 100%)`,
          padding: styles.padding.container,
          borderRadius: isSmall ? '0' : '0 0 30px 30px'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-white transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 bg-white transform -translate-x-12 translate-y-12" />
        
        <div className="relative z-10">
          {/* Name and Title */}
          <div className="text-white mb-4">
            <h1 
              className="font-bold mb-1 text-white"
              style={{ 
                fontSize: styles.name.fontSize,
                fontWeight: styles.name.fontWeight,
                letterSpacing: styles.name.letterSpacing
              }}
            >
              {userData.name || "Your Name"}
            </h1>
            {hasContent(userData.job_title) && (
              <p 
                className="font-medium"
                style={{ 
                  fontSize: styles.jobTitle.fontSize,
                  fontWeight: styles.jobTitle.fontWeight,
                  opacity: styles.jobTitle.opacity
                }}
              >
                {userData.job_title}
              </p>
            )}
          </div>
          
          {/* Contact Info in Pills */}
          <div className="flex flex-wrap gap-2">
            {hasContent(userData.email) && (
              <div 
                className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm"
                style={{ fontSize: styles.contact.fontSize }}
              >
                <Mail style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                <span className="text-white">{userData.email}</span>
              </div>
            )}
            {hasContent(userData.phone) && (
              <div 
                className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm"
                style={{ fontSize: styles.contact.fontSize }}
              >
                <Phone style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                <span className="text-white">{userData.phone}</span>
              </div>
            )}
            {hasContent(userData.address) && (
              <div 
                className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm"
                style={{ fontSize: styles.contact.fontSize }}
              >
                <MapPin style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                <span className="text-white">{userData.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex" style={{ padding: styles.padding.container }}>
        {/* Left Sidebar */}
        <div 
          className="w-2/5 bg-gray-50 rounded-lg mr-4"
          style={{ padding: styles.padding.section }}
        >
          {/* Professional Summary */}
          {hasContent(userData.summary) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-1 h-6 rounded"
                  style={{ backgroundColor: theme.primary }}
                />
                <h3 
                  className="font-bold"
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    color: theme.primary,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  About Me
                </h3>
              </div>
              <p 
                style={{ 
                  fontSize: styles.text.fontSize,
                  lineHeight: styles.text.lineHeight,
                  color: theme.text
                }}
              >
                {userData.summary}
              </p>
            </div>
          )}

          {/* Skills with Modern Progress Bars */}
          {hasContent(userData.skills) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-1 h-6 rounded"
                  style={{ backgroundColor: theme.secondary }}
                />
                <h3 
                  className="font-bold"
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    color: theme.primary,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  Skills
                </h3>
              </div>
              <div>
                {(userData.skills || []).slice(0, isSmall ? 6 : 10).map((skill, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.item }}>
                    <div className="flex justify-between items-center mb-1">
                      <span 
                        className="font-medium"
                        style={{ fontSize: styles.text.fontSize }}
                      >
                        {skill.name}
                      </span>
                      <span 
                        style={{ 
                          fontSize: styles.subtext.fontSize,
                          color: theme.secondary 
                        }}
                      >
                        {skill.rating}/5
                      </span>
                    </div>
                    <div 
                      className="w-full bg-gray-200 rounded-full overflow-hidden"
                      style={{ height: isSmall ? '3px' : '4px' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(skill.rating / 5) * 100}%`,
                          background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`
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
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-1 h-6 rounded"
                  style={{ backgroundColor: theme.accent }}
                />
                <h3 
                  className="font-bold"
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    color: theme.primary,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  Education
                </h3>
              </div>
              <div>
                {(userData.education || []).slice(0, isSmall ? 2 : 4).map((edu, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      marginBottom: styles.spacing.item,
                      paddingBottom: styles.spacing.micro,
                      borderLeft: `2px solid ${theme.accent}`,
                      paddingLeft: styles.spacing.item
                    }}
                  >
                    <p 
                      className="font-bold"
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.text
                      }}
                    >
                      {edu.degree || 'Degree'}
                    </p>
                    <p 
                      className="font-medium"
                      style={{ 
                        fontSize: styles.subtext.fontSize,
                        color: theme.secondary
                      }}
                    >
                      {edu.institution || edu.school || 'Institution'}
                    </p>
                    {edu.year && (
                      <p 
                        style={{ 
                          fontSize: styles.subtext.fontSize,
                          color: '#6b7280'
                        }}
                      >
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
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-1 h-6 rounded"
                  style={{ backgroundColor: theme.primary }}
                />
                <h3 
                  className="font-bold"
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    color: theme.primary,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  Languages
                </h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {(userData.languages || []).slice(0, isSmall ? 4 : 6).map((lang, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 rounded-full text-white"
                    style={{ 
                      fontSize: styles.subtext.fontSize,
                      backgroundColor: theme.secondary
                    }}
                  >
                    {typeof lang === 'string' ? lang : lang.name || 'Language'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {/* Professional Experience */}
          {hasContent(userData.experience) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase 
                  style={{ 
                    width: isSmall ? '12px' : '16px', 
                    height: isSmall ? '12px' : '16px',
                    color: theme.primary
                  }} 
                />
                <h3 
                  className="font-bold"
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    color: theme.primary,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  Professional Experience
                </h3>
              </div>
              <div className="relative">
                {/* Timeline line */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300"
                  style={{ display: isSmall ? 'none' : 'block' }}
                />
                
                {(userData.experience || []).slice(0, isSmall ? 3 : 5).map((exp, i) => (
                  <div 
                    key={i} 
                    className="relative mb-4"
                    style={{ 
                      paddingLeft: isSmall ? '0' : '1rem',
                      marginBottom: styles.spacing.item
                    }}
                  >
                    {/* Timeline dot */}
                    {!isSmall && (
                      <div 
                        className="absolute left-0 w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: theme.primary,
                          top: '2px'
                        }}
                      />
                    )}
                    
                    <div style={{ paddingBottom: styles.spacing.micro }}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 
                          className="font-bold"
                          style={{ 
                            fontSize: styles.text.fontSize,
                            color: theme.text
                          }}
                        >
                          {exp.title || exp.jobTitle || 'Position'}
                        </h4>
                        <span 
                          style={{ 
                            fontSize: styles.subtext.fontSize,
                            color: theme.primary,
                            fontWeight: '500'
                          }}
                        >
                          {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}
                        </span>
                      </div>
                      <p 
                        className="font-medium mb-1"
                        style={{ 
                          fontSize: styles.subtext.fontSize,
                          color: theme.secondary
                        }}
                      >
                        {exp.company || exp.employer || 'Company'}
                      </p>
                      {exp.description && (
                        <p 
                          style={{ 
                            fontSize: styles.text.fontSize,
                            lineHeight: styles.text.lineHeight,
                            color: '#4b5563',
                            marginTop: styles.spacing.micro
                          }}
                        >
                          {isSmall && exp.description.length > 120 
                            ? exp.description.substring(0, 120) + '...' 
                            : exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {hasContent(userData.projects) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-4 h-4 rounded border-2"
                  style={{ borderColor: theme.accent }}
                />
                <h3 
                  className="font-bold"
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    color: theme.primary,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  Key Projects
                </h3>
              </div>
              <div>
                {(userData.projects || []).slice(0, isSmall ? 2 : 4).map((project, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      marginBottom: styles.spacing.item,
                      paddingBottom: styles.spacing.micro,
                      borderLeft: `2px solid ${theme.accent}`,
                      paddingLeft: styles.spacing.item
                    }}
                  >
                    <h4 
                      className="font-bold mb-1"
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.text
                      }}
                    >
                      {project.name || 'Project Name'}
                    </h4>
                    {project.description && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          lineHeight: styles.text.lineHeight,
                          color: '#4b5563'
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

          {/* Certifications */}
          {hasContent(userData.certifications) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <div className="flex items-center gap-2 mb-3">
                <Award 
                  style={{ 
                    width: isSmall ? '12px' : '16px', 
                    height: isSmall ? '12px' : '16px',
                    color: theme.accent
                  }} 
                />
                <h3 
                  className="font-bold"
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    color: theme.primary,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  Certifications
                </h3>
              </div>
              <div>
                {(userData.certifications || []).slice(0, isSmall ? 3 : 5).map((cert, i) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-2 mb-2"
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <div>
                      <p 
                        className="font-medium"
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: theme.text
                        }}
                      >
                        {cert.name || cert.title || 'Certification'}
                      </p>
                      {(cert.issuer || cert.year) && (
                        <p 
                          style={{ 
                            fontSize: styles.subtext.fontSize,
                            color: '#6b7280'
                          }}
                        >
                          {cert.issuer && cert.year ? `${cert.issuer} • ${cert.year}` : cert.issuer || cert.year}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Professional Links */}
          {(hasContent(userData.linkedin_url) || hasContent(userData.github_url) || hasContent(userData.portfolio_url)) && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe 
                  style={{ 
                    width: isSmall ? '12px' : '16px', 
                    height: isSmall ? '12px' : '16px',
                    color: theme.primary
                  }} 
                />
                <h3 
                  className="font-bold"
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    color: theme.primary,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  Professional Links
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {hasContent(userData.linkedin_url) && (
                  <a
                    href={userData.linkedin_url}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: theme.primary,
                      fontSize: styles.text.fontSize
                    }}
                  >
                    <Linkedin style={{ width: isSmall ? '10px' : '14px', height: isSmall ? '10px' : '14px' }} />
                    LinkedIn
                  </a>
                )}
                {hasContent(userData.github_url) && (
                  <a
                    href={userData.github_url}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: theme.secondary,
                      fontSize: styles.text.fontSize
                    }}
                  >
                    <Github style={{ width: isSmall ? '10px' : '14px', height: isSmall ? '10px' : '14px' }} />
                    GitHub
                  </a>
                )}
                {hasContent(userData.portfolio_url) && (
                  <a
                    href={userData.portfolio_url}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105"
                    style={{ 
                      backgroundColor: theme.accent,
                      fontSize: styles.text.fontSize
                    }}
                  >
                    <Globe style={{ width: isSmall ? '10px' : '14px', height: isSmall ? '10px' : '14px' }} />
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
