"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, Calendar, Briefcase, Star, User, Zap } from 'lucide-react'

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

interface ModernPortraitProps {
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

export default function ModernPortrait({ userData, colors, size = 'normal', mode = 'default' }: ModernPortraitProps) {
  const theme = colors || {
    primary: '#8b5cf6',
    secondary: '#a855f7',
    accent: '#ec4899',
    text: '#1f2937',
    background: '#ffffff'
  };

  const isSmall = size === 'small';

  const styles = {
    container: {
      fontSize: isSmall ? '7px' : '12px',
      lineHeight: isSmall ? 1.4 : 1.6,
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    name: {
      fontSize: isSmall ? '18px' : '36px',
      fontWeight: '700',
      letterSpacing: '-0.8px'
    },
    jobTitle: {
      fontSize: isSmall ? '10px' : '18px',
      fontWeight: '500',
      letterSpacing: '0.5px'
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
      fontSize: isSmall ? '6px' : '10px'
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
      className="w-full h-full bg-white relative overflow-hidden"
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
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-1/2 h-full opacity-5"
          style={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`
          }}
        />
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
          style={{
            background: theme.accent,
            transform: 'translate(25%, -25%)'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-5"
          style={{
            background: theme.primary,
            transform: 'translate(-25%, 25%)'
          }}
        />
      </div>

      <div className="relative z-10" style={{ padding: styles.padding.container }}>
        {/* Header Section with Photo and Name */}
        <div className="flex items-start gap-6" style={{ marginBottom: styles.spacing.section }}>
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div 
              className="relative overflow-hidden"
              style={{ 
                width: isSmall ? '70px' : '140px', 
                height: isSmall ? '70px' : '140px',
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                background: userData.image_url ? 'transparent' : `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
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
                  <User style={{ width: isSmall ? '28px' : '56px', height: isSmall ? '28px' : '56px' }} />
                </div>
              )}
              {/* Decorative border */}
              <div 
                className="absolute inset-0 border-4 border-opacity-30"
                style={{ 
                  borderColor: theme.accent,
                  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
                }}
              />
            </div>
          </div>

          {/* Name and Title */}
          <div className="flex-1">
            <h1 
              className="font-bold"
              style={{ 
                fontSize: styles.name.fontSize,
                fontWeight: styles.name.fontWeight,
                letterSpacing: styles.name.letterSpacing,
                backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
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

            {/* Contact Pills */}
            <div className="flex flex-wrap gap-2">
              {hasContent(userData.email) && (
                <div 
                  className="flex items-center gap-1 px-3 py-1 rounded-full border-2"
                  style={{ 
                    fontSize: styles.contact.fontSize,
                    borderColor: `${theme.primary}30`,
                    backgroundColor: `${theme.primary}10`,
                    color: theme.primary
                  }}
                >
                  <Mail style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                  <span>{userData.email}</span>
                </div>
              )}
              {hasContent(userData.phone) && (
                <div 
                  className="flex items-center gap-1 px-3 py-1 rounded-full border-2"
                  style={{ 
                    fontSize: styles.contact.fontSize,
                    borderColor: `${theme.primary}30`,
                    backgroundColor: `${theme.primary}10`,
                    color: theme.primary
                  }}
                >
                  <Phone style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                  <span>{userData.phone}</span>
                </div>
              )}
              {hasContent(userData.address) && (
                <div 
                  className="flex items-center gap-1 px-3 py-1 rounded-full border-2"
                  style={{ 
                    fontSize: styles.contact.fontSize,
                    borderColor: `${theme.primary}30`,
                    backgroundColor: `${theme.primary}10`,
                    color: theme.primary
                  }}
                >
                  <MapPin style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                  <span>{userData.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {hasContent(userData.summary) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <div className="flex items-center gap-2" style={{ marginBottom: styles.spacing.item }}>
              <div 
                className="w-1 rounded-full"
                style={{ 
                  height: isSmall ? '16px' : '24px',
                  background: `linear-gradient(to bottom, ${theme.primary}, ${theme.accent})`
                }}
              />
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary
                }}
              >
                Professional Summary
              </h2>
            </div>
            <div 
              className="relative pl-4"
              style={{ 
                fontSize: styles.text.fontSize,
                lineHeight: styles.text.lineHeight,
                borderLeft: `2px solid ${theme.primary}20`,
                marginLeft: '2px'
              }}
            >
              {userData.summary}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {hasContent(userData.skills) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <div className="flex items-center gap-2" style={{ marginBottom: styles.spacing.item }}>
              <div 
                className="w-1 rounded-full"
                style={{ 
                  height: isSmall ? '16px' : '24px',
                  background: `linear-gradient(to bottom, ${theme.primary}, ${theme.accent})`
                }}
              />
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary
                }}
              >
                Core Skills
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-4">
              {userData.skills?.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap 
                      style={{ 
                        width: isSmall ? '8px' : '12px', 
                        height: isSmall ? '8px' : '12px',
                        color: theme.accent
                      }} 
                    />
                    <span 
                      className="font-medium"
                      style={{ 
                        fontSize: styles.subtext.fontSize,
                        color: theme.text
                      }}
                    >
                      {skill.name}
                    </span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="rounded-full ml-1"
                        style={{ 
                          width: isSmall ? '4px' : '6px',
                          height: isSmall ? '4px' : '6px',
                          backgroundColor: i < skill.rating ? theme.accent : `${theme.primary}20`
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {hasContent(userData.experience) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <div className="flex items-center gap-2" style={{ marginBottom: styles.spacing.item }}>
              <div 
                className="w-1 rounded-full"
                style={{ 
                  height: isSmall ? '16px' : '24px',
                  background: `linear-gradient(to bottom, ${theme.primary}, ${theme.accent})`
                }}
              />
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary
                }}
              >
                Professional Experience
              </h2>
            </div>
            <div className="space-y-4 pl-4">
              {userData.experience?.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-3">
                    <div 
                      className="rounded-full flex-shrink-0 border-2"
                      style={{ 
                        width: isSmall ? '8px' : '12px',
                        height: isSmall ? '8px' : '12px',
                        backgroundColor: theme.accent,
                        borderColor: theme.primary,
                        marginTop: isSmall ? '2px' : '4px'
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start" style={{ marginBottom: styles.spacing.micro }}>
                        <div>
                          <h3 
                            className="font-bold"
                            style={{ 
                              fontSize: styles.text.fontSize,
                              color: theme.text,
                              marginBottom: styles.spacing.micro
                            }}
                          >
                            {exp.title}
                          </h3>
                          <p 
                            className="font-semibold"
                            style={{ 
                              fontSize: styles.subtext.fontSize,
                              color: theme.secondary,
                              marginBottom: styles.spacing.micro
                            }}
                          >
                            {exp.company}
                          </p>
                        </div>
                        <div 
                          className="flex items-center gap-1 px-2 py-1 rounded-full"
                          style={{ 
                            fontSize: styles.contact.fontSize,
                            backgroundColor: `${theme.accent}20`,
                            color: theme.accent
                          }}
                        >
                          <Calendar style={{ width: isSmall ? '6px' : '10px', height: isSmall ? '6px' : '10px' }} />
                          <span>{exp.duration}</span>
                        </div>
                      </div>
                      {hasContent(exp.description) && (
                        <p 
                          style={{ 
                            fontSize: styles.subtext.fontSize,
                            lineHeight: styles.subtext.lineHeight,
                            color: theme.text
                          }}
                        >
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Connection line */}
                  {index < (userData.experience?.length || 0) - 1 && (
                    <div 
                      className="absolute left-1"
                      style={{ 
                        top: isSmall ? '20px' : '30px',
                        bottom: isSmall ? '-12px' : '-16px',
                        width: '2px',
                        background: `linear-gradient(to bottom, ${theme.primary}40, transparent)`,
                        marginLeft: isSmall ? '2px' : '4px'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {hasContent(userData.education) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <div className="flex items-center gap-2" style={{ marginBottom: styles.spacing.item }}>
              <div 
                className="w-1 rounded-full"
                style={{ 
                  height: isSmall ? '16px' : '24px',
                  background: `linear-gradient(to bottom, ${theme.primary}, ${theme.accent})`
                }}
              />
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  color: theme.primary
                }}
              >
                Education
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-4">
              {userData.education?.map((edu, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Award 
                    style={{ 
                      width: isSmall ? '8px' : '14px', 
                      height: isSmall ? '8px' : '14px',
                      color: theme.accent,
                      marginTop: '2px',
                      flexShrink: 0
                    }} 
                  />
                  <div>
                    <h3 
                      className="font-bold"
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: '#1f2937', // Darker text for better contrast
                        marginBottom: styles.spacing.micro
                      }}
                    >
                      {edu.degree}
                    </h3>
                    <p 
                      style={{ 
                        fontSize: styles.subtext.fontSize,
                        color: '#374151', // Better contrast than theme.secondary
                        marginBottom: styles.spacing.micro
                      }}
                    >
                      {edu.institution}
                    </p>
                    <p 
                      style={{ 
                        fontSize: styles.subtext.fontSize,
                        color: theme.primary, // Use primary instead of accent for better readability
                        fontWeight: '600'
                      }}
                    >
                      {edu.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout for Projects and Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Projects */}
          <div>
            {hasContent(userData.projects) ? (
              <div style={{ marginBottom: styles.spacing.section }}>
                <div className="flex items-center gap-2" style={{ marginBottom: styles.spacing.item }}>
                  <div 
                    className="w-1 rounded-full"
                    style={{ 
                      height: isSmall ? '16px' : '24px',
                      background: `linear-gradient(to bottom, ${theme.primary}, ${theme.accent})`
                    }}
                  />
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      letterSpacing: styles.sectionTitle.letterSpacing,
                      color: theme.primary
                    }}
                  >
                    Key Projects
                  </h2>
                </div>
                <div className="space-y-3 pl-4">
                  {userData.projects?.map((project, index) => (
                    <div key={index}>
                      <h3 
                        className="font-bold"
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: '#1f2937', // Darker text for better contrast
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
                            color: '#374151' // Better contrast than theme.text
                          }}
                        >
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Show Certifications if no projects
              hasContent(userData.certifications) && (
                <div style={{ marginBottom: styles.spacing.section }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: styles.spacing.item }}>
                    <div 
                      className="w-1 rounded-full"
                      style={{ 
                        height: isSmall ? '16px' : '24px',
                        background: `linear-gradient(to bottom, ${theme.primary}, ${theme.accent})`
                      }}
                    />
                    <h2 
                      style={{ 
                        fontSize: styles.sectionTitle.fontSize,
                        fontWeight: styles.sectionTitle.fontWeight,
                        letterSpacing: styles.sectionTitle.letterSpacing,
                        color: theme.primary
                      }}
                    >
                      Certifications
                    </h2>
                  </div>
                  <div className="space-y-3 pl-4">
                    {userData.certifications?.map((cert, index) => (
                      <div key={index}>
                        <h3 
                          className="font-bold"
                          style={{ 
                            fontSize: styles.text.fontSize,
                            color: '#1f2937',
                            marginBottom: styles.spacing.micro
                          }}
                        >
                          {cert.name || cert.title}
                        </h3>
                        {cert.issuer && (
                          <p 
                            style={{ 
                              fontSize: styles.subtext.fontSize,
                              color: '#374151',
                              marginBottom: styles.spacing.micro
                            }}
                          >
                            {cert.issuer}
                          </p>
                        )}
                        {cert.date && (
                          <p 
                            style={{ 
                              fontSize: styles.subtext.fontSize,
                              color: theme.primary,
                              fontWeight: '500'
                            }}
                          >
                            {cert.date}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Right Column - Social Links and Languages */}
          <div>
            {/* Social Links */}
            {hasContent(userData.social_links) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <div className="flex items-center gap-2" style={{ marginBottom: styles.spacing.item }}>
                  <div 
                    className="w-1 rounded-full"
                    style={{ 
                      height: isSmall ? '16px' : '24px',
                      background: `linear-gradient(to bottom, ${theme.primary}, ${theme.accent})`
                    }}
                  />
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      letterSpacing: styles.sectionTitle.letterSpacing,
                      color: theme.primary
                    }}
                  >
                    Connect
                  </h2>
                </div>
                <div className="space-y-2 pl-4">
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
                          color: '#1f2937', // Better contrast
                          textDecoration: 'none'
                        }}
                      >
                        <IconComponent style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.accent }} />
                        <span style={{ fontSize: styles.subtext.fontSize, fontWeight: '500' }}>{displayText}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Languages */}
            {hasContent(userData.languages) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <div className="flex items-center gap-2" style={{ marginBottom: styles.spacing.item }}>
                  <div 
                    className="w-1 rounded-full"
                    style={{ 
                      height: isSmall ? '16px' : '24px',
                      background: `linear-gradient(to bottom, ${theme.primary}, ${theme.accent})`
                    }}
                  />
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      letterSpacing: styles.sectionTitle.letterSpacing,
                      color: theme.primary
                    }}
                  >
                    Languages
                  </h2>
                </div>
                <div className="space-y-2 pl-4">
                  {userData.languages?.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span 
                        className="font-medium"
                        style={{ 
                          fontSize: styles.subtext.fontSize,
                          color: '#1f2937'
                        }}
                      >
                        {lang.name || lang.language}
                      </span>
                      <span 
                        style={{ 
                          fontSize: styles.contact.fontSize,
                          color: theme.primary,
                          fontWeight: '500',
                          backgroundColor: `${theme.primary}10`,
                          padding: '2px 8px',
                          borderRadius: '12px'
                        }}
                      >
                        {lang.level || lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Projects if both columns have content */}
            {hasContent(userData.projects) && hasContent(userData.social_links) && userData.projects && userData.projects.length > 3 && (
              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: styles.spacing.item }}>
                  <div 
                    className="w-1 rounded-full"
                    style={{ 
                      height: isSmall ? '16px' : '24px',
                      background: `linear-gradient(to bottom, ${theme.primary}, ${theme.accent})`
                    }}
                  />
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      letterSpacing: styles.sectionTitle.letterSpacing,
                      color: theme.primary
                    }}
                  >
                    Additional Projects
                  </h2>
                </div>
                <div className="space-y-2 pl-4">
                  {userData.projects.slice(3).map((project, index) => (
                    <div key={index + 3}>
                      <h3 
                        className="font-bold"
                        style={{ 
                          fontSize: styles.subtext.fontSize,
                          color: '#1f2937',
                          marginBottom: styles.spacing.micro
                        }}
                      >
                        {project.title}
                      </h3>
                      {hasContent(project.description) && (
                        <p 
                          style={{ 
                            fontSize: styles.contact.fontSize,
                            lineHeight: styles.subtext.lineHeight,
                            color: '#374151'
                          }}
                        >
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}