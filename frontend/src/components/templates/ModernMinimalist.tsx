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
  social_links?: Array<{
    label: string;
    url: string;
    username?: string;
  }>;
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
  
  // A4 optimized sizing with improved spacing
  const styles = {
    container: {
      fontSize: isSmall ? '7px' : '12px',
      lineHeight: isSmall ? 1.3 : 1.5,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    name: {
      fontSize: isSmall ? '16px' : '28px',
      fontWeight: '700',
      letterSpacing: '-0.5px'
    },
    jobTitle: {
      fontSize: isSmall ? '9px' : '16px',
      fontWeight: '500',
      letterSpacing: '0.2px'
    },
    sectionTitle: {
      fontSize: isSmall ? '8px' : '14px',
      fontWeight: '700',
      letterSpacing: '0.8px',
      textTransform: 'uppercase' as const
    },
    text: {
      fontSize: isSmall ? '7px' : '11px',
      lineHeight: isSmall ? 1.4 : 1.6
    },
    spacing: {
      section: isSmall ? '12px' : '24px',
      item: isSmall ? '6px' : '12px',
      micro: isSmall ? '3px' : '6px'
    },
    padding: {
      container: isSmall ? '12px' : '24px',
      section: isSmall ? '8px' : '16px'
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
        minHeight: isSmall ? 'auto' : 'auto',
        width: isSmall ? 'auto' : '210mm',
        margin: '0 auto',
        boxShadow: isSmall ? 'none' : '0 0 20px rgba(0,0,0,0.1)',
        padding: styles.padding.container
      }}
    >
      {/* Header */}
      <div 
        className="text-center border-b pb-6 mb-8"
        style={{ 
          paddingBottom: styles.spacing.section, 
          marginBottom: styles.spacing.section,
          borderBottomWidth: '2px',
          borderBottomColor: theme.primary,
          borderBottomStyle: 'solid'
        }}
      >
        <h1 
          className="font-bold mb-3"
          style={{ 
            fontSize: styles.name.fontSize,
            fontWeight: styles.name.fontWeight,
            color: theme.primary,
            letterSpacing: styles.name.letterSpacing
          }}
        >
          {userData.name || "Your Name"}
        </h1>
        {hasContent(userData.job_title) && (
          <p 
            className="font-medium mb-4"
            style={{ 
              fontSize: styles.jobTitle.fontSize,
              fontWeight: styles.jobTitle.fontWeight,
              color: theme.secondary,
              letterSpacing: styles.jobTitle.letterSpacing
            }}
          >
            {userData.job_title}
          </p>
        )}
        <div 
          className="flex flex-wrap justify-center gap-4" 
          style={{ 
            fontSize: styles.text.fontSize,
            gap: isSmall ? '8px' : '16px'
          }}
        >
          {hasContent(userData.email) && (
            <div className="flex items-center gap-2">
              <Mail style={{ 
                width: isSmall ? '10px' : '16px', 
                height: isSmall ? '10px' : '16px',
                color: theme.accent
              }} />
              <span>{userData.email}</span>
            </div>
          )}
          {hasContent(userData.phone) && (
            <div className="flex items-center gap-2">
              <Phone style={{ 
                width: isSmall ? '10px' : '16px', 
                height: isSmall ? '10px' : '16px',
                color: theme.accent
              }} />
              <span>{userData.phone}</span>
            </div>
          )}
          {hasContent(userData.address) && (
            <div className="flex items-center gap-2">
              <MapPin style={{ 
                width: isSmall ? '10px' : '16px', 
                height: isSmall ? '10px' : '16px',
                color: theme.accent
              }} />
              <span>{userData.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-6">
        {/* Left Column */}
        <div 
          className="w-1/3 bg-gray-50 rounded-xl"
          style={{ 
            padding: styles.padding.section,
            backgroundColor: '#f8fafc'
          }}
        >
          {/* Skills */}
          {hasContent(userData.skills) && (
            <div style={{ 
              marginBottom: styles.spacing.section,
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-4"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item,
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid'
                }}
              >
                Skills
              </h3>
              <div className="space-y-3">
                {(userData.skills || []).slice(0, isSmall ? 8 : 12).map((skill, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.micro }}>
                    <div className="flex justify-between items-center mb-2">
                      <span style={{ 
                        fontSize: styles.text.fontSize, 
                        fontWeight: '600',
                        color: theme.text
                      }}>
                        {skill.name}
                      </span>
                      <span style={{ 
                        fontSize: styles.text.fontSize, 
                        color: theme.secondary,
                        fontWeight: '500'
                      }}>
                        {skill.rating}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-full rounded-full transition-all duration-300"
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
            <div style={{ 
              marginBottom: styles.spacing.section,
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-4"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid'
                }}
              >
                Education
              </h3>
              <div className="space-y-3">
                {(userData.education || []).slice(0, isSmall ? 3 : 4).map((edu, i) => (
                  <div key={i} className="education-item" style={{ marginBottom: styles.spacing.micro }}>
                    <p className="font-semibold" style={{ 
                      fontSize: styles.text.fontSize,
                      fontWeight: '600',
                      color: theme.text
                    }}>
                      {edu.degree || 'Degree'}
                    </p>
                    <p style={{ 
                      fontSize: styles.text.fontSize, 
                      color: theme.secondary,
                      marginTop: '2px'
                    }}>
                      {edu.institution || edu.school || 'Institution'}
                    </p>
                    {edu.year && (
                      <p style={{ 
                        fontSize: styles.text.fontSize, 
                        color: theme.secondary,
                        opacity: 0.8,
                        marginTop: '1px'
                      }}>
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
                className="font-bold uppercase tracking-wide mb-4"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {(userData.languages || []).slice(0, isSmall ? 4 : 6).map((lang, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 rounded-full text-white font-medium"
                    style={{ 
                      fontSize: styles.text.fontSize,
                      backgroundColor: theme.secondary,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    {typeof lang === 'string' ? lang : lang.name || 'Language'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Professional Links */}
          {userData.social_links && userData.social_links.length > 0 && (
            <div>
              <h3 
                className="font-bold uppercase tracking-wide mb-4"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Links
              </h3>
              <div className="space-y-2">
                {userData.social_links.map((link, index) => {
                  const getSocialIcon = (label: string) => {
                    const lowerLabel = label.toLowerCase();
                    if (lowerLabel.includes('linkedin')) return Linkedin;
                    if (lowerLabel.includes('github')) return Github;
                    return Globe;
                  };
                  
                  const IconComponent = getSocialIcon(link.label);
                  const displayText = link.username || link.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
                  
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <IconComponent style={{ 
                        width: isSmall ? '10px' : '16px', 
                        height: isSmall ? '10px' : '16px',
                        color: theme.accent
                      }} />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          fontSize: styles.text.fontSize,
                          fontWeight: '500',
                          color: theme.text,
                          textDecoration: 'none'
                        }}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {displayText}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1" style={{ paddingLeft: styles.padding.section }}>
          {/* Summary */}
          {hasContent(userData.summary) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-4"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Professional Summary
              </h3>
              <p style={{ 
                fontSize: styles.text.fontSize, 
                lineHeight: styles.text.lineHeight,
                color: theme.text,
                textAlign: 'justify'
              }}>
                {userData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {hasContent(userData.experience) && (
            <div style={{ 
              marginBottom: styles.spacing.section,
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-4"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid'
                }}
              >
                Work Experience
              </h3>
              <div className="space-y-6">
                {(userData.experience || []).map((exp, i) => (
                  <div key={i} className="experience-item" style={{ 
                    marginBottom: styles.spacing.section,
                    paddingBottom: styles.spacing.item,
                    borderBottom: i < (userData.experience || []).length - 1 ? `1px solid ${theme.accent}20` : 'none',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid'
                  }}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold" style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '700',
                        color: theme.text
                      }}>
                        {exp.title || exp.jobTitle || 'Position'}
                      </h4>
                      <span 
                        style={{ 
                          fontSize: styles.text.fontSize, 
                          color: theme.accent,
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          marginLeft: '12px'
                        }}
                      >
                        {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}
                      </span>
                    </div>
                    <p 
                      className="font-medium mb-2"
                      style={{ 
                        fontSize: styles.text.fontSize, 
                        color: theme.secondary,
                        fontWeight: '600'
                      }}
                    >
                      {exp.company || exp.employer || 'Company'}
                    </p>
                    {exp.description && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize, 
                          marginTop: styles.spacing.micro,
                          lineHeight: styles.text.lineHeight,
                          color: theme.text,
                          textAlign: 'justify'
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
            </div>
          )}

          {/* Projects */}
          {hasContent(userData.projects) && (
            <div style={{ 
              marginBottom: styles.spacing.section,
              pageBreakInside: 'avoid',
              breakInside: 'avoid'
            }}>
              <h3 
                className="font-bold uppercase tracking-wide mb-4"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid'
                }}
              >
                Projects
              </h3>
              <div className="space-y-4">
                {(userData.projects || []).slice(0, isSmall ? 2 : 3).map((project, i) => (
                  <div key={i} className="project-item" style={{ 
                    marginBottom: styles.spacing.item,
                    paddingBottom: styles.spacing.micro,
                    borderBottom: i < (userData.projects || []).length - 1 ? `1px solid ${theme.accent}15` : 'none',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid'
                  }}>
                    <h4 className="font-bold" style={{ 
                      fontSize: styles.text.fontSize,
                      fontWeight: '700',
                      color: theme.text,
                      marginBottom: styles.spacing.micro
                    }}>
                      {project.name || 'Project Name'}
                    </h4>
                    {project.description && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize, 
                          marginTop: styles.spacing.micro,
                          lineHeight: styles.text.lineHeight,
                          color: theme.text,
                          textAlign: 'justify'
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
            <div>
              <h3 
                className="font-bold uppercase tracking-wide mb-4"
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  color: theme.primary,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Certifications
              </h3>
              <div className="space-y-2">
                {(userData.certifications || []).slice(0, isSmall ? 3 : 5).map((cert, i) => (
                  <div key={i} className="flex items-start gap-3 mb-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <div>
                      <p className="font-medium" style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '600',
                        color: theme.text
                      }}>
                        {cert.name || cert.title || 'Certification'}
                      </p>
                      {(cert.issuer || cert.year) && (
                        <p style={{ 
                          fontSize: styles.text.fontSize, 
                          color: theme.secondary,
                          marginTop: '2px'
                        }}>
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
