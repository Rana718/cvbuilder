"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, Building, Users } from 'lucide-react'

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

interface CorporateClassicProps {
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

export default function CorporateClassic({ userData, colors, size = 'normal', mode = 'default' }: CorporateClassicProps) {
  const theme = colors || {
    primary: '#1e3a8a',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    text: '#1f2937',
    background: '#ffffff'
  };

  const isSmall = size === 'small';

  // Corporate professional styling with enhanced spacing
  const styles = {
    container: {
      fontSize: isSmall ? '7px' : '12px',
      lineHeight: isSmall ? 1.4 : 1.6,
      fontFamily: "'Times New Roman', 'Georgia', serif"
    },
    name: {
      fontSize: isSmall ? '20px' : '40px',
      fontWeight: '700',
      letterSpacing: '0.5px'
    },
    jobTitle: {
      fontSize: isSmall ? '10px' : '18px',
      fontWeight: '500',
      letterSpacing: '0.3px'
    },
    sectionTitle: {
      fontSize: isSmall ? '9px' : '16px',
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
      container: isSmall ? '14px' : '32px',
      header: isSmall ? '12px' : '24px'
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
        minHeight: isSmall ? 'auto' : '297mm',
        width: isSmall ? 'auto' : '210mm',
        margin: '0 auto',
        boxShadow: isSmall ? 'none' : '0 0 20px rgba(0,0,0,0.1)'
      }}
    >
      {/* Corporate Header with Blue Background */}
      <div 
        style={{ 
          backgroundColor: theme.primary,
          color: 'white',
          padding: styles.padding.header,
          marginBottom: styles.spacing.section
        }}
      >
        <div className="text-center">
          <h1 
            style={{ 
              fontSize: styles.name.fontSize,
              fontWeight: styles.name.fontWeight,
              marginBottom: styles.spacing.item
            }}
          >
            {userData.name || "Your Name"}
          </h1>
          {hasContent(userData.job_title) && (
            <p 
              style={{ 
                fontSize: styles.jobTitle.fontSize,
                fontWeight: styles.jobTitle.fontWeight,
                opacity: 0.9
              }}
            >
              {userData.job_title}
            </p>
          )}
        </div>
        
        {/* Contact bar */}
        <div 
          className="flex justify-center items-center gap-6 mt-3"
          style={{ fontSize: styles.text.fontSize }}
        >
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

      <div style={{ padding: styles.padding.container }}>
        {/* Professional Summary */}
        {hasContent(userData.summary) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <div 
              style={{ 
                borderBottom: `2px solid ${theme.primary}`,
                paddingBottom: '4px',
                marginBottom: styles.spacing.item
              }}
            >
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.primary,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Professional Summary
              </h2>
            </div>
            <p 
              style={{ 
                fontSize: styles.text.fontSize,
                lineHeight: styles.text.lineHeight,
                textAlign: 'justify'
              }}
            >
              {userData.summary}
            </p>
          </div>
        )}

        {/* Two-column layout */}
        <div className="flex gap-6">
          {/* Left column - Main content */}
          <div className="flex-1" style={{ flex: '0 0 65%' }}>
            {/* Professional Experience */}
            {hasContent(userData.experience) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <div 
                  style={{ 
                    borderBottom: `2px solid ${theme.primary}`,
                    paddingBottom: '4px',
                    marginBottom: styles.spacing.item
                  }}
                >
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      color: theme.primary,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Professional Experience
                  </h2>
                </div>
                {(userData.experience || []).slice(0, isSmall ? 3 : 5).map((exp, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      marginBottom: styles.spacing.item,
                      paddingBottom: styles.spacing.item,
                      borderBottom: i < (userData.experience?.length || 0) - 1 ? `1px solid ${theme.accent}30` : 'none'
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          fontWeight: '700',
                          color: theme.text
                        }}
                      >
                        {exp.title || exp.jobTitle || 'Position'}
                      </h3>
                      <div 
                        className="flex items-center gap-1"
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: theme.secondary,
                          fontWeight: '600'
                        }}
                      >
                        <Calendar style={{ width: isSmall ? '6px' : '10px', height: isSmall ? '6px' : '10px' }} />
                        <span>{exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}</span>
                      </div>
                    </div>
                    <div 
                      className="flex items-center gap-1 mb-2"
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.secondary,
                        fontWeight: '600'
                      }}
                    >
                      <Building style={{ width: isSmall ? '6px' : '10px', height: isSmall ? '6px' : '10px' }} />
                      <span>{exp.company || exp.employer || 'Company'}</span>
                    </div>
                    {exp.description && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          lineHeight: styles.text.lineHeight,
                          textAlign: 'justify'
                        }}
                      >
                        {isSmall && exp.description.length > 140 
                          ? exp.description.substring(0, 140) + '...' 
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
                  style={{ 
                    borderBottom: `2px solid ${theme.primary}`,
                    paddingBottom: '4px',
                    marginBottom: styles.spacing.item
                  }}
                >
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      color: theme.primary,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Key Projects
                  </h2>
                </div>
                {(userData.projects || []).slice(0, isSmall ? 2 : 4).map((project, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.item }}>
                    <h3 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '700',
                        color: theme.text,
                        marginBottom: '2px'
                      }}
                    >
                      {project.name || 'Project Name'}
                    </h3>
                    {project.description && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          lineHeight: styles.text.lineHeight,
                          textAlign: 'justify'
                        }}
                      >
                        {isSmall && project.description.length > 120 
                          ? project.description.substring(0, 120) + '...' 
                          : project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="w-1/3">
            {/* Skills */}
            {hasContent(userData.skills) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <div 
                  style={{ 
                    backgroundColor: theme.primary,
                    color: 'white',
                    padding: '4px 8px',
                    marginBottom: styles.spacing.item
                  }}
                >
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Core Skills
                  </h2>
                </div>
                <div>
                  {(userData.skills || []).slice(0, isSmall ? 8 : 12).map((skill, i) => (
                    <div key={i} style={{ marginBottom: '6px' }}>
                      <div className="flex justify-between items-center mb-1">
                        <span 
                          style={{ 
                            fontSize: styles.text.fontSize,
                            fontWeight: '600'
                          }}
                        >
                          {skill.name}
                        </span>
                        <span 
                          style={{ 
                            fontSize: styles.text.fontSize,
                            color: theme.secondary
                          }}
                        >
                          {skill.rating}/5
                        </span>
                      </div>
                      <div 
                        style={{ 
                          width: '100%',
                          height: '4px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '2px'
                        }}
                      >
                        <div
                          style={{
                            width: `${(skill.rating / 5) * 100}%`,
                            height: '100%',
                            backgroundColor: theme.secondary,
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
                <div 
                  style={{ 
                    backgroundColor: theme.primary,
                    color: 'white',
                    padding: '4px 8px',
                    marginBottom: styles.spacing.item
                  }}
                >
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Education
                  </h2>
                </div>
                {(userData.education || []).slice(0, isSmall ? 2 : 4).map((edu, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.item }}>
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '700',
                        color: theme.text
                      }}
                    >
                      {edu.degree || 'Degree'}
                    </p>
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.secondary,
                        fontWeight: '600'
                      }}
                    >
                      {edu.institution || edu.school || 'Institution'}
                    </p>
                    {edu.year && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: theme.accent
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
                <div 
                  style={{ 
                    backgroundColor: theme.primary,
                    color: 'white',
                    padding: '4px 8px',
                    marginBottom: styles.spacing.item
                  }}
                >
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Certifications
                  </h2>
                </div>
                {(userData.certifications || []).slice(0, isSmall ? 3 : 5).map((cert, i) => (
                  <div key={i} style={{ marginBottom: '6px' }}>
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '600',
                        color: theme.text
                      }}
                    >
                      {cert.name || cert.title || 'Certification'}
                    </p>
                    {(cert.issuer || cert.year) && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: theme.secondary
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
                <div 
                  style={{ 
                    backgroundColor: theme.primary,
                    color: 'white',
                    padding: '4px 8px',
                    marginBottom: styles.spacing.item
                  }}
                >
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Languages
                  </h2>
                </div>
                {(userData.languages || []).slice(0, isSmall ? 4 : 6).map((lang, i) => (
                  <p 
                    key={i}
                    style={{ 
                      fontSize: styles.text.fontSize,
                      color: theme.text,
                      marginBottom: '2px',
                      fontWeight: '500'
                    }}
                  >
                    {typeof lang === 'string' ? lang : lang.name || 'Language'}
                  </p>
                ))}
              </div>
            )}

            {/* Professional Links */}
            {(hasContent(userData.linkedin_url) || hasContent(userData.github_url) || hasContent(userData.portfolio_url)) && (
              <div>
                <div 
                  style={{ 
                    backgroundColor: theme.primary,
                    color: 'white',
                    padding: '4px 8px',
                    marginBottom: styles.spacing.item
                  }}
                >
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Professional Links
                  </h2>
                </div>
                <div>
                  {hasContent(userData.linkedin_url) && (
                    <div className="flex items-center gap-1 mb-1">
                      <Linkedin style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
                      <span style={{ fontSize: styles.text.fontSize, fontWeight: '500' }}>LinkedIn</span>
                    </div>
                  )}
                  {hasContent(userData.github_url) && (
                    <div className="flex items-center gap-1 mb-1">
                      <Github style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
                      <span style={{ fontSize: styles.text.fontSize, fontWeight: '500' }}>GitHub</span>
                    </div>
                  )}
                  {hasContent(userData.portfolio_url) && (
                    <div className="flex items-center gap-1 mb-1">
                      <Globe style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
                      <span style={{ fontSize: styles.text.fontSize, fontWeight: '500' }}>Portfolio</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
