"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, Calendar, Briefcase, Star, User } from 'lucide-react'

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

interface ProfileSidebarProps {
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

export default function ProfileSidebar({ userData, colors, size = 'normal', mode = 'default' }: ProfileSidebarProps) {
  const theme = colors || {
    primary: '#059669',
    secondary: '#047857',
    accent: '#10b981',
    text: '#1f2937',
    background: '#ffffff'
  };

  const isSmall = size === 'small';

  const styles = {
    container: {
      fontSize: isSmall ? '7px' : '12px',
      lineHeight: isSmall ? 1.4 : 1.6,
      fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    name: {
      fontSize: isSmall ? '16px' : '32px',
      fontWeight: '700',
      letterSpacing: '-0.5px'
    },
    jobTitle: {
      fontSize: isSmall ? '9px' : '16px',
      fontWeight: '500',
      letterSpacing: '0.3px'
    },
    sectionTitle: {
      fontSize: isSmall ? '8px' : '14px',
      fontWeight: '600',
      letterSpacing: '0.8px',
      textTransform: 'uppercase' as const
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
      section: isSmall ? '12px' : '24px',
      item: isSmall ? '6px' : '12px',
      micro: isSmall ? '3px' : '6px'
    },
    padding: {
      container: isSmall ? '0' : '0',
      sidebar: isSmall ? '12px' : '24px',
      main: isSmall ? '12px' : '24px'
    }
  };

  const hasContent = (data: any) => {
    if (Array.isArray(data)) return data && data.length > 0;
    return data && data.trim && data.trim().length > 0;
  };

  return (
    <div
      className="w-full h-full flex"
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
        {/* Profile Photo */}
        <div className="text-center" style={{ marginBottom: styles.spacing.section }}>
          <div 
            className="rounded-full mx-auto overflow-hidden border-4 border-white/20"
            style={{ 
              width: isSmall ? '50px' : '100px', 
              height: isSmall ? '50px' : '100px',
              marginBottom: styles.spacing.item,
              background: userData.image_url ? 'transparent' : 'rgba(255,255,255,0.2)'
            }}
          >
            {userData.image_url ? (
              <img 
                src={userData.image_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User style={{ width: isSmall ? '20px' : '40px', height: isSmall ? '20px' : '40px', color: 'white' }} />
              </div>
            )}
          </div>

          <h1 
            className="font-bold text-white text-center"
            style={{ 
              fontSize: styles.name.fontSize,
              fontWeight: styles.name.fontWeight,
              letterSpacing: styles.name.letterSpacing,
              marginBottom: styles.spacing.micro
            }}
          >
            {userData.name || "Your Name"}
          </h1>
          {hasContent(userData.job_title) && (
            <p 
              className="text-center"
              style={{ 
                fontSize: styles.jobTitle.fontSize,
                fontWeight: styles.jobTitle.fontWeight,
                letterSpacing: styles.jobTitle.letterSpacing,
                opacity: 0.9
              }}
            >
              {userData.job_title}
            </p>
          )}
        </div>

        {/* Contact Information */}
        <div style={{ marginBottom: styles.spacing.section }}>
          <h2 
            className="text-white"
            style={{ 
              fontSize: styles.sectionTitle.fontSize,
              fontWeight: styles.sectionTitle.fontWeight,
              letterSpacing: styles.sectionTitle.letterSpacing,
              marginBottom: styles.spacing.item,
              borderBottom: '2px solid rgba(255,255,255,0.3)',
              paddingBottom: styles.spacing.micro
            }}
          >
            CONTACT
          </h2>
          <div className="space-y-2">
            {hasContent(userData.email) && (
              <div className="flex items-center gap-2">
                <Mail style={{ width: isSmall ? '8px' : '14px', height: isSmall ? '8px' : '14px', color: 'white', flexShrink: 0 }} />
                <span 
                  className="text-white break-all"
                  style={{ fontSize: styles.contact.fontSize }}
                >
                  {userData.email}
                </span>
              </div>
            )}
            {hasContent(userData.phone) && (
              <div className="flex items-center gap-2">
                <Phone style={{ width: isSmall ? '8px' : '14px', height: isSmall ? '8px' : '14px', color: 'white', flexShrink: 0 }} />
                <span 
                  className="text-white"
                  style={{ fontSize: styles.contact.fontSize }}
                >
                  {userData.phone}
                </span>
              </div>
            )}
            {hasContent(userData.address) && (
              <div className="flex items-start gap-2">
                <MapPin style={{ width: isSmall ? '8px' : '14px', height: isSmall ? '8px' : '14px', color: 'white', flexShrink: 0, marginTop: '1px' }} />
                <span 
                  className="text-white"
                  style={{ fontSize: styles.contact.fontSize }}
                >
                  {userData.address}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {hasContent(userData.skills) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <h2 
              className="text-white"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing,
                marginBottom: styles.spacing.item,
                borderBottom: '2px solid rgba(255,255,255,0.3)',
                paddingBottom: styles.spacing.micro
              }}
            >
              SKILLS
            </h2>
            <div className="space-y-2">
              {userData.skills?.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '2px' }}>
                    <span 
                      className="text-white font-medium"
                      style={{ fontSize: styles.subtext.fontSize }}
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
                            fill: i < skill.rating ? 'white' : 'none',
                            stroke: 'white',
                            strokeWidth: 1,
                            opacity: i < skill.rating ? 1 : 0.3
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div 
                    className="w-full rounded-full"
                    style={{ 
                      height: isSmall ? '2px' : '3px',
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }}
                  >
                    <div 
                      className="bg-white rounded-full"
                      style={{ 
                        height: '100%',
                        width: `${(skill.rating / 5) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {hasContent(userData.social_links) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <h2 
              className="text-white"
              style={{ 
                fontSize: styles.sectionTitle.fontSize,
                fontWeight: styles.sectionTitle.fontWeight,
                letterSpacing: styles.sectionTitle.letterSpacing,
                marginBottom: styles.spacing.item,
                borderBottom: '2px solid rgba(255,255,255,0.3)',
                paddingBottom: styles.spacing.micro
              }}
            >
              CONNECT
            </h2>
            <div className="space-y-2">
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
                    className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity"
                    style={{ textDecoration: 'none' }}
                  >
                    <IconComponent style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', flexShrink: 0 }} />
                    <span 
                      style={{ 
                        fontSize: styles.contact.fontSize,
                        fontWeight: '500',
                        wordBreak: 'break-all'
                      }}
                    >
                      {displayText}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1"
        style={{ padding: styles.padding.main }}
      >
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
                borderBottom: `2px solid ${theme.primary}`,
                paddingBottom: styles.spacing.micro
              }}
            >
              PROFESSIONAL SUMMARY
            </h2>
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
              PROFESSIONAL EXPERIENCE
            </h2>
            {userData.experience?.map((exp, index) => (
              <div key={index} style={{ marginBottom: styles.spacing.item }}>
                <div className="flex items-start gap-3">
                  <div 
                    className="rounded-full flex-shrink-0"
                    style={{ 
                      width: isSmall ? '6px' : '10px',
                      height: isSmall ? '6px' : '10px',
                      backgroundColor: theme.primary,
                      marginTop: isSmall ? '4px' : '6px'
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start" style={{ marginBottom: styles.spacing.micro }}>
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
                        className="flex items-center gap-1 text-right"
                        style={{ 
                          fontSize: styles.subtext.fontSize,
                          color: theme.secondary
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
                <div className="flex items-start gap-3">
                  <Award 
                    style={{ 
                      width: isSmall ? '8px' : '14px', 
                      height: isSmall ? '8px' : '14px',
                      color: theme.secondary,
                      marginTop: '2px',
                      flexShrink: 0
                    }} 
                  />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h3 
                          className="font-bold"
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
                            color: theme.secondary
                          }}
                        >
                          {edu.institution}
                        </p>
                      </div>
                      <p 
                        style={{ 
                          fontSize: styles.subtext.fontSize,
                          color: theme.secondary,
                          fontWeight: '500'
                        }}
                      >
                        {edu.year}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                  className="font-bold"
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
      </div>
    </div>
  );
}