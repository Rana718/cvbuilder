"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe, User, Award, Briefcase, GraduationCap } from 'lucide-react'

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

interface MinimalistProfessionalProps {
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

export default function MinimalistProfessional({ userData, colors, size = 'normal', mode = 'default' }: MinimalistProfessionalProps) {
  const theme = colors || {
    primary: '#000000',
    secondary: '#333333',
    accent: '#666666',
    text: '#1a1a1a',
    background: '#ffffff'
  };

  const isSmall = size === 'small';

  // Ultra-clean minimalist styling with enhanced spacing
  const styles = {
    container: {
      fontSize: isSmall ? '7px' : '12px',
      lineHeight: isSmall ? 1.4 : 1.6,
      fontFamily: "'Helvetica Neue', -apple-system, Arial, sans-serif"
    },
    name: {
      fontSize: isSmall ? '18px' : '36px',
      fontWeight: '300',
      letterSpacing: '2.5px'
    },
    jobTitle: {
      fontSize: isSmall ? '9px' : '16px',
      fontWeight: '400',
      letterSpacing: '1.2px'
    },
    sectionTitle: {
      fontSize: isSmall ? '8px' : '13px',
      fontWeight: '600',
      letterSpacing: '2.5px',
      textTransform: 'uppercase' as const
    },
    text: {
      fontSize: isSmall ? '7px' : '11px',
      lineHeight: isSmall ? 1.5 : 1.7
    },
    spacing: {
      section: isSmall ? '16px' : '32px',
      item: isSmall ? '8px' : '16px',
      micro: isSmall ? '4px' : '8px'
    },
    padding: {
      container: isSmall ? '16px' : '40px'
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
        boxShadow: isSmall ? 'none' : '0 0 20px rgba(0,0,0,0.05)',
        padding: styles.padding.container
      }}
    >
      {/* Ultra-minimal header */}
      <div style={{ marginBottom: styles.spacing.section }}>
        <h1 
          style={{ 
            fontSize: styles.name.fontSize,
            fontWeight: styles.name.fontWeight,
            letterSpacing: styles.name.letterSpacing,
            color: theme.primary,
            marginBottom: styles.spacing.item
          }}
        >
          {userData.name || "YOUR NAME"}
        </h1>
        {hasContent(userData.job_title) && (
          <p 
            style={{ 
              fontSize: styles.jobTitle.fontSize,
              fontWeight: styles.jobTitle.fontWeight,
              letterSpacing: styles.jobTitle.letterSpacing,
              color: theme.secondary,
              marginBottom: styles.spacing.item
            }}
          >
            {userData.job_title?.toUpperCase()}
          </p>
        )}
        
        {/* Minimal contact line */}
        <div 
          className="flex flex-wrap gap-4"
          style={{ 
            fontSize: styles.text.fontSize,
            color: theme.accent,
            marginTop: styles.spacing.item
          }}
        >
          {hasContent(userData.email) && <span>{userData.email}</span>}
          {hasContent(userData.phone) && <span>{userData.phone}</span>}
          {hasContent(userData.address) && <span>{userData.address}</span>}
        </div>
      </div>

      {/* Thin line separator */}
      <div 
        style={{ 
          height: '1px', 
          backgroundColor: theme.accent, 
          marginBottom: styles.spacing.section,
          opacity: 0.3
        }} 
      />

      {/* Two-column layout */}
      <div className="flex gap-8">
        {/* Left column - 60% */}
        <div className="flex-1" style={{ flex: '0 0 60%' }}>
          {/* Summary */}
          {hasContent(userData.summary) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary,
                  marginBottom: styles.spacing.item
                }}
              >
                Profile
              </h2>
              <p style={{ fontSize: styles.text.fontSize, lineHeight: styles.text.lineHeight }}>
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
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary,
                  marginBottom: styles.spacing.item,
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid'
                }}
              >
                Experience
              </h2>
              {(userData.experience || []).map((exp, i) => (
                <div key={i} className="experience-item" style={{ 
                  marginBottom: styles.spacing.item,
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}>
                  <div 
                    className="flex justify-between items-start"
                    style={{ marginBottom: '2px' }}
                  >
                    <h3 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '600',
                        color: theme.text
                      }}
                    >
                      {exp.title || exp.jobTitle || 'Position'}
                    </h3>
                    <span 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.accent,
                        fontWeight: '400'
                      }}
                    >
                      {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}
                    </span>
                  </div>
                  <p 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      color: theme.secondary,
                      fontWeight: '500',
                      marginBottom: '4px'
                    }}
                  >
                    {exp.company || exp.employer || 'Company'}
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
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary,
                  marginBottom: styles.spacing.item
                }}
              >
                Projects
              </h2>
              {(userData.projects || []).slice(0, isSmall ? 2 : 4).map((project, i) => (
                <div key={i} style={{ marginBottom: styles.spacing.item }}>
                  <h3 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      fontWeight: '600',
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
          )}
        </div>

        {/* Right column - 40% */}
        <div className="w-2/5">
          {/* Skills */}
          {hasContent(userData.skills) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary,
                  marginBottom: styles.spacing.item
                }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {(userData.skills || []).slice(0, isSmall ? 8 : 12).map((skill, i) => (
                  <span 
                    key={i}
                    style={{ 
                      fontSize: styles.text.fontSize,
                      color: theme.text,
                      padding: '2px 0',
                      marginRight: '8px',
                      borderBottom: `1px solid ${theme.accent}`,
                      display: 'inline-block',
                      marginBottom: '4px'
                    }}
                  >
                    {skill.name}
                  </span>
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
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary,
                  marginBottom: styles.spacing.item
                }}
              >
                Education
              </h2>
              {(userData.education || []).slice(0, isSmall ? 2 : 4).map((edu, i) => (
                <div key={i} style={{ marginBottom: styles.spacing.item }}>
                  <p 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      fontWeight: '600',
                      color: theme.text
                    }}
                  >
                    {edu.degree || 'Degree'}
                  </p>
                  <p 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      color: theme.secondary
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
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary,
                  marginBottom: styles.spacing.item
                }}
              >
                Certifications
              </h2>
              {(userData.certifications || []).slice(0, isSmall ? 3 : 5).map((cert, i) => (
                <div key={i} style={{ marginBottom: '6px' }}>
                  <p 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      fontWeight: '500',
                      color: theme.text
                    }}
                  >
                    {cert.name || cert.title || 'Certification'}
                  </p>
                  {(cert.issuer || cert.year) && (
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.accent
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
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary,
                  marginBottom: styles.spacing.item
                }}
              >
                Languages
              </h2>
              <div>
                {(userData.languages || []).slice(0, isSmall ? 4 : 6).map((lang, i) => (
                  <span 
                    key={i}
                    style={{ 
                      fontSize: styles.text.fontSize,
                      color: theme.text,
                      display: 'block',
                      marginBottom: '2px'
                    }}
                  >
                    {typeof lang === 'string' ? lang : lang.name || 'Language'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {userData.social_links && userData.social_links.length > 0 && (
            <div>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary,
                  marginBottom: styles.spacing.item
                }}
              >
                Links
              </h2>
              <div>
                {userData.social_links.map((link, index) => {
                  const displayText = link.username || link.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
                  
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        fontSize: styles.text.fontSize, 
                        marginBottom: '2px',
                        color: theme.text,
                        textDecoration: 'none',
                        display: 'block'
                      }}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {displayText}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
