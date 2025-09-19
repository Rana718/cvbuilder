"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, Calendar, Briefcase, Star } from 'lucide-react'

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

interface PhotoCentricProps {
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

export default function PhotoCentric({ userData, colors, size = 'normal', mode = 'default' }: PhotoCentricProps) {
  const theme = colors || {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    text: '#1f2937',
    background: '#ffffff'
  };

  const isSmall = size === 'small';

  const styles = {
    container: {
      fontSize: isSmall ? '7px' : '12px',
      lineHeight: isSmall ? 1.4 : 1.6,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    name: {
      fontSize: isSmall ? '18px' : '36px',
      fontWeight: '700',
      letterSpacing: '-0.5px'
    },
    jobTitle: {
      fontSize: isSmall ? '10px' : '18px',
      fontWeight: '500',
      letterSpacing: '0.3px'
    },
    sectionTitle: {
      fontSize: isSmall ? '9px' : '16px',
      fontWeight: '600',
      letterSpacing: '0.5px'
    },
    text: {
      fontSize: isSmall ? '7px' : '12px',
      lineHeight: isSmall ? 1.4 : 1.6
    },
    subtext: {
      fontSize: isSmall ? '6px' : '11px',
      lineHeight: isSmall ? 1.3 : 1.5
    },
    contact: {
      fontSize: isSmall ? '6px' : '11px'
    },
    spacing: {
      section: isSmall ? '15px' : '30px',
      item: isSmall ? '8px' : '16px',
      micro: isSmall ? '4px' : '8px'
    },
    padding: {
      container: isSmall ? '15px' : '30px',
      section: isSmall ? '10px' : '20px'
    }
  };

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
      <div style={{ padding: styles.padding.container }}>
        {/* Header with Large Photo */}
        <div className="text-center" style={{ marginBottom: styles.spacing.section }}>
          {/* Profile Photo */}
          <div className="relative inline-block" style={{ marginBottom: styles.spacing.item }}>
            <div 
              className="rounded-full mx-auto border-4 overflow-hidden relative"
              style={{ 
                width: isSmall ? '60px' : '120px', 
                height: isSmall ? '60px' : '120px',
                borderColor: theme.primary,
                background: userData.image_url ? 'transparent' : `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
              }}
            >
              {userData.image_url ? (
                <img 
                  src={userData.image_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <svg style={{ width: isSmall ? '24px' : '48px', height: isSmall ? '24px' : '48px' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
            {/* Decorative ring */}
            <div 
              className="absolute inset-0 rounded-full border-2 opacity-30"
              style={{ 
                borderColor: theme.accent,
                transform: 'scale(1.1)'
              }}
            />
          </div>

          {/* Name and Title */}
          <h1 
            className="font-bold"
            style={{ 
              fontSize: styles.name.fontSize,
              fontWeight: styles.name.fontWeight,
              letterSpacing: styles.name.letterSpacing,
              color: theme.primary,
              marginBottom: styles.spacing.micro
            }}
          >
            {userData.name || "Your Name"}
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
              {userData.job_title}
            </p>
          )}

          {/* Contact Information */}
          <div className="flex flex-wrap justify-center gap-2" style={{ marginBottom: styles.spacing.item }}>
            {hasContent(userData.email) && (
              <div 
                className="flex items-center gap-1 px-3 py-1 rounded-full"
                style={{ 
                  fontSize: styles.contact.fontSize,
                  backgroundColor: `${theme.primary}10`,
                  color: theme.primary
                }}
              >
                <Mail style={{ width: isSmall ? '8px' : '14px', height: isSmall ? '8px' : '14px' }} />
                <span>{userData.email}</span>
              </div>
            )}
            {hasContent(userData.phone) && (
              <div 
                className="flex items-center gap-1 px-3 py-1 rounded-full"
                style={{ 
                  fontSize: styles.contact.fontSize,
                  backgroundColor: `${theme.primary}10`,
                  color: theme.primary
                }}
              >
                <Phone style={{ width: isSmall ? '8px' : '14px', height: isSmall ? '8px' : '14px' }} />
                <span>{userData.phone}</span>
              </div>
            )}
            {hasContent(userData.address) && (
              <div 
                className="flex items-center gap-1 px-3 py-1 rounded-full"
                style={{ 
                  fontSize: styles.contact.fontSize,
                  backgroundColor: `${theme.primary}10`,
                  color: theme.primary
                }}
              >
                <MapPin style={{ width: isSmall ? '8px' : '14px', height: isSmall ? '8px' : '14px' }} />
                <span>{userData.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {hasContent(userData.summary) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <h2 
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing,
                color: theme.primary,
                marginBottom: styles.spacing.item,
                textAlign: 'center'
              }}
            >
              PROFESSIONAL SUMMARY
            </h2>
            <div 
              className="text-center mx-auto"
              style={{ 
                fontSize: styles.text.fontSize,
                lineHeight: styles.text.lineHeight,
                maxWidth: isSmall ? '100%' : '80%'
              }}
            >
              {userData.summary}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            {/* Experience */}
            {hasContent(userData.experience) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing,
                    color: theme.primary,
                    marginBottom: styles.spacing.item,
                    borderBottom: `2px solid ${theme.primary}`,
                    paddingBottom: styles.spacing.micro
                  }}
                >
                  EXPERIENCE
                </h2>
                {userData.experience?.map((exp, index) => (
                  <div key={index} style={{ marginBottom: styles.spacing.item }}>
                    <div className="flex items-start gap-2" style={{ marginBottom: styles.spacing.micro }}>
                      <Briefcase 
                        style={{ 
                          width: isSmall ? '8px' : '16px', 
                          height: isSmall ? '8px' : '16px',
                          color: theme.secondary,
                          marginTop: '2px',
                          flexShrink: 0
                        }} 
                      />
                      <div className="flex-1">
                        <h3 
                          className="font-semibold"
                          style={{ 
                            fontSize: styles.text.fontSize,
                            color: theme.text,
                            marginBottom: styles.spacing.micro
                          }}
                        >
                          {exp.title}
                        </h3>
                        <p 
                          className="font-medium"
                          style={{ 
                            fontSize: styles.subtext.fontSize,
                            color: theme.secondary,
                            marginBottom: styles.spacing.micro
                          }}
                        >
                          {exp.company}
                        </p>
                        <p 
                          style={{ 
                            fontSize: styles.subtext.fontSize,
                            color: theme.secondary,
                            marginBottom: styles.spacing.micro
                          }}
                        >
                          {exp.duration}
                        </p>
                        {hasContent(exp.description) && (
                          <p style={{ fontSize: styles.subtext.fontSize, lineHeight: styles.subtext.lineHeight }}>
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                    marginBottom: styles.spacing.item,
                    borderBottom: `2px solid ${theme.primary}`,
                    paddingBottom: styles.spacing.micro
                  }}
                >
                  EDUCATION
                </h2>
                {userData.education?.map((edu, index) => (
                  <div key={index} style={{ marginBottom: styles.spacing.item }}>
                    <div className="flex items-start gap-2">
                      <Award 
                        style={{ 
                          width: isSmall ? '8px' : '16px', 
                          height: isSmall ? '8px' : '16px',
                          color: theme.secondary,
                          marginTop: '2px',
                          flexShrink: 0
                        }} 
                      />
                      <div>
                        <h3 
                          className="font-semibold"
                          style={{ 
                            fontSize: styles.text.fontSize,
                            color: theme.text,
                            marginBottom: styles.spacing.micro
                          }}
                        >
                          {edu.degree}
                        </h3>
                        <p 
                          style={{ 
                            fontSize: styles.subtext.fontSize,
                            color: theme.secondary,
                            marginBottom: styles.spacing.micro
                          }}
                        >
                          {edu.institution}
                        </p>
                        <p style={{ fontSize: styles.subtext.fontSize, color: theme.secondary }}>
                          {edu.year}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Skills */}
            {hasContent(userData.skills) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing,
                    color: theme.primary,
                    marginBottom: styles.spacing.item,
                    borderBottom: `2px solid ${theme.primary}`,
                    paddingBottom: styles.spacing.micro
                  }}
                >
                  SKILLS
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {userData.skills?.map((skill, index) => (
                    <div key={index} style={{ marginBottom: styles.spacing.micro }}>
                      <div className="flex justify-between items-center" style={{ marginBottom: '2px' }}>
                        <span 
                          className="font-medium"
                          style={{ 
                            fontSize: styles.subtext.fontSize,
                            color: theme.text
                          }}
                        >
                          {skill.name}
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              style={{ 
                                width: isSmall ? '6px' : '10px', 
                                height: isSmall ? '6px' : '10px',
                                fill: i < skill.rating ? theme.accent : 'none',
                                stroke: i < skill.rating ? theme.accent : theme.secondary,
                                strokeWidth: 1
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      <div 
                        className="w-full rounded-full"
                        style={{ 
                          height: isSmall ? '2px' : '4px',
                          backgroundColor: `${theme.primary}20`
                        }}
                      >
                        <div 
                          className="rounded-full"
                          style={{ 
                            height: '100%',
                            width: `${(skill.rating / 5) * 100}%`,
                            background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {hasContent(userData.projects) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing,
                    color: theme.primary,
                    marginBottom: styles.spacing.item,
                    borderBottom: `2px solid ${theme.primary}`,
                    paddingBottom: styles.spacing.micro
                  }}
                >
                  PROJECTS
                </h2>
                {userData.projects?.map((project, index) => (
                  <div key={index} style={{ marginBottom: styles.spacing.item }}>
                    <h3 
                      className="font-semibold"
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.text,
                        marginBottom: styles.spacing.micro
                      }}
                    >
                      {project.title}
                    </h3>
                    {hasContent(project.description) && (
                      <p 
                        style={{ 
                          fontSize: styles.subtext.fontSize,
                          lineHeight: styles.subtext.lineHeight,
                          color: theme.text
                        }}
                      >
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Social Links */}
            {hasContent(userData.social_links) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    letterSpacing: styles.sectionTitle.letterSpacing,
                    color: theme.primary,
                    marginBottom: styles.spacing.item,
                    borderBottom: `2px solid ${theme.primary}`,
                    paddingBottom: styles.spacing.micro
                  }}
                >
                  CONNECT
                </h2>
                <div className="space-y-1">
                  {userData.social_links?.map((link, index) => {
                    const IconComponent = link.label.toLowerCase().includes('linkedin') ? Linkedin :
                                        link.label.toLowerCase().includes('github') ? Github :
                                        Globe;
                    
                    const displayText = link.username || link.url;
                    
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                        style={{
                          color: theme.text,
                          textDecoration: 'none'
                        }}
                      >
                        <IconComponent style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
                        <span style={{ fontSize: styles.subtext.fontSize, fontWeight: '500' }}>{displayText}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}