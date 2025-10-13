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

interface ExecutiveEliteProps {
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

export default function ExecutiveElite({ userData, colors, size = 'normal', mode = 'default' }: ExecutiveEliteProps) {
  const theme = colors || {
    primary: '#1a365d',
    secondary: '#2d3748',
    accent: '#3182ce',
    text: '#2d3748',
    background: '#ffffff'
  };

  const isSmall = size === 'small';

  // Executive-level styling with enhanced proportions  
  const styles = {
    container: {
      fontSize: isSmall ? '7px' : '12px',
      lineHeight: isSmall ? 1.3 : 1.5,
      fontFamily: "'Playfair Display', 'Georgia', serif"
    },
    name: {
      fontSize: isSmall ? '16px' : '30px',
      fontWeight: '700',
      letterSpacing: '0.5px'
    },
    jobTitle: {
      fontSize: isSmall ? '8px' : '14px',
      opacity: 0.9,
      letterSpacing: '0.3px'
    },
    sectionTitle: {
      fontSize: isSmall ? '8px' : '14px',
      fontWeight: '700',
      letterSpacing: '1.2px',
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
      sidebar: isSmall ? '8px' : '20px'
    }
  };

  // Helper function to check if section has content
  const hasContent = (data: any) => {
    if (Array.isArray(data)) return data && data.length > 0;
    return data && data.trim && data.trim().length > 0;
  };

  return (
    <div
      className="w-full h-full flex bg-white"
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
      {/* Left Sidebar */}
      <div 
        className="w-1/3" 
        style={{ 
          backgroundColor: theme.primary, 
          color: 'white', 
          padding: styles.padding.sidebar 
        }}
      >
        {/* Profile */}
        <div className="text-center" style={{ marginBottom: styles.spacing.section }}>
          {hasContent(userData.image_url) ? (
            <img
              src={userData.image_url}
              alt={userData.name}
              className="rounded-full mx-auto object-cover"
              style={{ 
                width: isSmall ? '2.5rem' : '5rem', 
                height: isSmall ? '2.5rem' : '5rem',
                marginBottom: styles.spacing.item 
              }}
            />
          ) : (
            <div 
              className="bg-white/20 rounded-full mx-auto"
              style={{ 
                width: isSmall ? '2.5rem' : '5rem', 
                height: isSmall ? '2.5rem' : '5rem',
                marginBottom: styles.spacing.item 
              }}
            />
          )}
          <h1 
            className="font-bold text-white"
            style={{ 
              fontSize: styles.name.fontSize,
              fontWeight: styles.name.fontWeight,
              marginBottom: styles.spacing.item
            }}
          >
            {userData.name || "Your Name"}
          </h1>
          {hasContent(userData.job_title) && (
            <p style={{ fontSize: styles.jobTitle.fontSize, opacity: styles.jobTitle.opacity }}>
              {userData.job_title}
            </p>
          )}
        </div>

        {/* Contact */}
        {(hasContent(userData.email) || hasContent(userData.phone) || hasContent(userData.address)) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <h3 
              className="font-bold uppercase text-white tracking-wide mb-2"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing
              }}
            >
              Contact
            </h3>
            <div style={{ fontSize: styles.text.fontSize }}>
              {hasContent(userData.email) && (
                <div className="flex items-center gap-1 mb-1">
                  <Mail style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                  <span className="break-all">{userData.email}</span>
                </div>
              )}
              {hasContent(userData.phone) && (
                <div className="flex items-center gap-1 mb-1">
                  <Phone style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                  <span>{userData.phone}</span>
                </div>
              )}
              {hasContent(userData.address) && (
                <div className="flex items-center gap-1 mb-1">
                  <MapPin style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                  <span>{userData.address}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {hasContent(userData.skills) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <h3 
              className="font-bold uppercase text-white tracking-wide mb-2"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing
              }}
            >
              Expertise
            </h3>
            <div>
              {(userData.skills || []).slice(0, isSmall ? 6 : 8).map((skill, i) => (
                <div key={i} style={{ marginBottom: styles.spacing.item }}>
                  <div className="flex justify-between items-center mb-1">
                    <span style={{ fontSize: styles.text.fontSize, fontWeight: '500' }}>{skill.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-1 h-1 rounded-full ${star <= skill.rating ? 'bg-white' : 'bg-white/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-0.5">
                    <div 
                      className="bg-white h-full rounded-full"
                      style={{ width: `${(skill.rating / 5) * 100}%` }}
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
              className="font-bold text-white uppercase tracking-wide mb-2"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing
              }}
            >
              Education
            </h3>
            <div>
              {(userData.education || []).slice(0, isSmall ? 2 : 3).map((edu, i) => (
                <div key={i} style={{ marginBottom: styles.spacing.item }}>
                  <p className="font-medium" style={{ fontSize: styles.text.fontSize }}>
                    {edu.degree || edu.institution}
                  </p>
                  <p style={{ fontSize: styles.text.fontSize, opacity: 0.8 }}>
                    {edu.institution || edu.degree}
                  </p>
                  {edu.year && (
                    <p style={{ fontSize: styles.text.fontSize, opacity: 0.7 }}>
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
            <h3 
              className="font-bold uppercase tracking-wide mb-2"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
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
                  className="px-2 py-1 bg-white/20 rounded text-xs"
                  style={{ fontSize: styles.text.fontSize }}
                >
                  {typeof lang === 'string' ? lang : lang.name || 'Language'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1" style={{ padding: styles.padding.container }}>
        {/* Summary */}
        {hasContent(userData.summary) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <h2 
              className="font-bold mb-2"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                color: theme.primary,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing
              }}
            >
              EXECUTIVE SUMMARY
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
              className="font-bold mb-3"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                color: theme.primary,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing,
                pageBreakAfter: 'avoid',
                breakAfter: 'avoid'
              }}
            >
              PROFESSIONAL EXPERIENCE
            </h2>
            <div>
              {(userData.experience || []).map((exp, i) => (
                <div key={i} className="experience-item" style={{ 
                  marginBottom: styles.spacing.section,
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold" style={{ fontSize: styles.text.fontSize }}>
                      {exp.title || exp.jobTitle || 'Position'}
                    </h3>
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
                        lineHeight: styles.text.lineHeight, 
                        color: '#4a5568' 
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
          <div style={{ marginBottom: styles.spacing.section }}>
            <h2 
              className="font-bold mb-3"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                color: theme.primary,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing
              }}
            >
              KEY PROJECTS
            </h2>
            <div>
              {(userData.projects || []).slice(0, isSmall ? 2 : 3).map((project, i) => (
                <div key={i} style={{ marginBottom: styles.spacing.item }}>
                  <h3 className="font-bold" style={{ fontSize: styles.text.fontSize }}>
                    {project.name || 'Project Name'}
                  </h3>
                  {project.description && (
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize, 
                        marginTop: styles.spacing.item, 
                        lineHeight: styles.text.lineHeight, 
                        color: '#4a5568' 
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
            <h2 
              className="font-bold mb-3"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                color: theme.primary,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing
              }}
            >
              CERTIFICATIONS
            </h2>
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

        {/* Professional Links */}
        {userData.social_links && userData.social_links.length > 0 && (
          <div>
            <h2 
              className="font-bold mb-3"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                color: theme.primary,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing
              }}
            >
              PROFESSIONAL LINKS
            </h2>
            <div className="flex gap-3 flex-wrap" style={{ fontSize: styles.text.fontSize }}>
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
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    style={{
                      color: theme.text,
                      textDecoration: 'none'
                    }}
                  >
                    <IconComponent style={{ width: isSmall ? '10px' : '14px', height: isSmall ? '10px' : '14px' }} />
                    <span>{displayText}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
