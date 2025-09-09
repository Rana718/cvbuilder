"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe, BookOpen, Award, Users, Calendar, FileText, Target } from 'lucide-react'

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

interface AcademicExcellenceProps {
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

export default function AcademicExcellence({ userData, colors, size = 'normal', mode = 'default' }: AcademicExcellenceProps) {
  const theme = colors || {
    primary: '#1e40af',
    secondary: '#064e3b',
    accent: '#dc2626',
    text: '#111827',
    background: '#f9fafb'
  };

  const isSmall = size === 'small';

  // Academic styling with enhanced typography
  const styles = {
    container: {
      fontSize: isSmall ? '7px' : '12px',
      lineHeight: isSmall ? 1.5 : 1.7,
      fontFamily: "'Crimson Text', 'Times New Roman', 'Georgia', serif"
    },
    name: {
      fontSize: isSmall ? '18px' : '36px',
      fontWeight: '700',
      letterSpacing: '0.8px'
    },
    jobTitle: {
      fontSize: isSmall ? '9px' : '16px',
      fontWeight: '400',
      fontStyle: 'italic',
      letterSpacing: '0.3px'
    },
    sectionTitle: {
      fontSize: isSmall ? '8px' : '15px',
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      letterSpacing: '1.2px'
    },
    text: {
      fontSize: isSmall ? '7px' : '11px',
      lineHeight: isSmall ? 1.6 : 1.8
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
      {/* Academic header with formal layout */}
      <div 
        style={{ 
          borderBottom: `3px solid ${theme.primary}`,
          paddingBottom: styles.spacing.section,
          marginBottom: styles.spacing.section,
          textAlign: 'center'
        }}
      >
        <h1 
          style={{ 
            fontSize: styles.name.fontSize,
            fontWeight: styles.name.fontWeight,
            letterSpacing: styles.name.letterSpacing,
            color: theme.primary,
            marginBottom: '8px'
          }}
        >
          {userData.name || "Academic Professional"}
        </h1>
        
        {hasContent(userData.job_title) && (
          <p 
            style={{ 
              fontSize: styles.jobTitle.fontSize,
              fontWeight: styles.jobTitle.fontWeight,
              fontStyle: styles.jobTitle.fontStyle,
              color: theme.secondary,
              marginBottom: '12px'
            }}
          >
            {userData.job_title}
          </p>
        )}

        {/* Formal contact information */}
        <div 
          style={{ 
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: styles.text.fontSize,
            color: theme.text
          }}
        >
          {hasContent(userData.email) && (
            <div className="flex items-center gap-1">
              <Mail style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.primary }} />
              {userData.email}
            </div>
          )}
          {hasContent(userData.phone) && (
            <div className="flex items-center gap-1">
              <Phone style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.primary }} />
              {userData.phone}
            </div>
          )}
          {hasContent(userData.address) && (
            <div className="flex items-center gap-1">
              <MapPin style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.primary }} />
              {userData.address}
            </div>
          )}
        </div>
      </div>

      {/* Main content with formal academic layout */}
      <div>
        {/* Academic summary/objective */}
        {hasContent(userData.summary) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <div 
              className="flex items-center gap-2 mb-3"
              style={{ 
                borderBottom: `2px solid ${theme.primary}20`,
                paddingBottom: '4px'
              }}
            >
              <Target style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.primary,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Objective
              </h2>
            </div>
            <p 
              style={{ 
                fontSize: styles.text.fontSize,
                lineHeight: styles.text.lineHeight,
                textAlign: 'justify',
                textIndent: '1em'
              }}
            >
              {userData.summary}
            </p>
          </div>
        )}

        {/* Education - Priority section for academic CV */}
        {hasContent(userData.education) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <div 
              className="flex items-center gap-2 mb-3"
              style={{ 
                borderBottom: `2px solid ${theme.primary}20`,
                paddingBottom: '4px'
              }}
            >
              <BookOpen style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.primary,
                  letterSpacing: styles.sectionTitle.letterSpacing
                }}
              >
                Education
              </h2>
            </div>
            {(userData.education || []).map((edu, i) => (
              <div 
                key={i}
                style={{ 
                  marginBottom: styles.spacing.item,
                  paddingLeft: '16px',
                  borderLeft: `3px solid ${theme.secondary}30`
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '700',
                        color: theme.text,
                        marginBottom: '2px'
                      }}
                    >
                      {edu.degree || 'Degree'}
                    </h3>
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.secondary,
                        fontWeight: '600',
                        marginBottom: '2px'
                      }}
                    >
                      {edu.institution || edu.school || 'Institution'}
                    </p>
                    {edu.gpa && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: theme.accent,
                          fontWeight: '600'
                        }}
                      >
                        GPA: {edu.gpa}
                      </p>
                    )}
                    {edu.honors && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: theme.accent,
                          fontStyle: 'italic'
                        }}
                      >
                        {edu.honors}
                      </p>
                    )}
                  </div>
                  {edu.year && (
                    <span 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.primary,
                        fontWeight: '600',
                        backgroundColor: `${theme.primary}10`,
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}
                    >
                      {edu.year}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Academic/Professional Experience */}
        {hasContent(userData.experience) && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <div 
              className="flex items-center gap-2 mb-3"
              style={{ 
                borderBottom: `2px solid ${theme.primary}20`,
                paddingBottom: '4px'
              }}
            >
              <Users style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
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
                  paddingLeft: '16px',
                  borderLeft: `3px solid ${theme.secondary}30`
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '700',
                        color: theme.text
                      }}
                    >
                      {exp.title || exp.jobTitle || 'Position'}
                    </h3>
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        color: theme.secondary,
                        fontWeight: '600',
                        fontStyle: 'italic'
                      }}
                    >
                      {exp.company || exp.employer || 'Organization'}
                    </p>
                  </div>
                  <span 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      color: theme.primary,
                      fontWeight: '600',
                      backgroundColor: `${theme.primary}10`,
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}
                  >
                    {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'present'}`}
                  </span>
                </div>
                {exp.description && (
                  <p 
                    style={{ 
                      fontSize: styles.text.fontSize,
                      lineHeight: styles.text.lineHeight,
                      textAlign: 'justify'
                    }}
                  >
                    {isSmall && exp.description.length > 150 
                      ? exp.description.substring(0, 150) + '...' 
                      : exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Two-column layout for remaining sections */}
        <div className="flex gap-6">
          {/* Left column */}
          <div className="flex-1">
            {/* Research Projects/Publications */}
            {hasContent(userData.projects) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <div 
                  className="flex items-center gap-2 mb-3"
                  style={{ 
                    borderBottom: `2px solid ${theme.primary}20`,
                    paddingBottom: '4px'
                  }}
                >
                  <FileText style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      color: theme.primary,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Research & Publications
                  </h2>
                </div>
                {(userData.projects || []).slice(0, isSmall ? 3 : 5).map((project, i) => (
                  <div 
                    key={i}
                    style={{ 
                      marginBottom: styles.spacing.item,
                      paddingLeft: '12px'
                    }}
                  >
                    <h3 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '700',
                        color: theme.text,
                        marginBottom: '2px'
                      }}
                    >
                      {project.name || 'Research Project'}
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

            {/* Academic Skills */}
            {hasContent(userData.skills) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <div 
                  className="flex items-center gap-2 mb-3"
                  style={{ 
                    borderBottom: `2px solid ${theme.primary}20`,
                    paddingBottom: '4px'
                  }}
                >
                  <Award style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      color: theme.primary,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Academic Competencies
                  </h2>
                </div>
                <div style={{ columns: isSmall ? 1 : 2, columnGap: '16px' }}>
                  {(userData.skills || []).map((skill, i) => (
                    <div 
                      key={i}
                      style={{ 
                        breakInside: 'avoid',
                        marginBottom: '4px',
                        fontSize: styles.text.fontSize
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          style={{
                            width: '4px',
                            height: '4px',
                            backgroundColor: theme.secondary,
                            borderRadius: '50%'
                          }}
                        />
                        <span style={{ fontWeight: '600' }}>{skill.name}</span>
                        <div className="flex-1 text-right">
                          <span 
                            style={{
                              fontSize: styles.text.fontSize,
                              color: theme.accent,
                              fontWeight: '600'
                            }}
                          >
                            {skill.rating === 5 ? 'Expert' : 
                             skill.rating === 4 ? 'Advanced' : 
                             skill.rating === 3 ? 'Intermediate' : 
                             skill.rating === 2 ? 'Basic' : 'Novice'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ flex: '0 0 40%' }}>
            {/* Honors & Certifications */}
            {hasContent(userData.certifications) && (
              <div style={{ marginBottom: styles.spacing.section }}>
                <div 
                  className="flex items-center gap-2 mb-3"
                  style={{ 
                    borderBottom: `2px solid ${theme.primary}20`,
                    paddingBottom: '4px'
                  }}
                >
                  <Award style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      color: theme.primary,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Honors & Awards
                  </h2>
                </div>
                {(userData.certifications || []).map((cert, i) => (
                  <div 
                    key={i}
                    style={{ 
                      marginBottom: '6px',
                      paddingLeft: '8px'
                    }}
                  >
                    <h3 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '700',
                        color: theme.text,
                        marginBottom: '1px'
                      }}
                    >
                      {cert.name || cert.title || 'Award'}
                    </h3>
                    {(cert.issuer || cert.year) && (
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: theme.secondary,
                          fontStyle: 'italic'
                        }}
                      >
                        {cert.issuer && cert.year ? `${cert.issuer}, ${cert.year}` : cert.issuer || cert.year}
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
                  className="flex items-center gap-2 mb-3"
                  style={{ 
                    borderBottom: `2px solid ${theme.primary}20`,
                    paddingBottom: '4px'
                  }}
                >
                  <Globe style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      color: theme.primary,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Languages
                  </h2>
                </div>
                {(userData.languages || []).map((lang, i) => (
                  <div 
                    key={i}
                    style={{ 
                      marginBottom: '3px',
                      fontSize: styles.text.fontSize,
                      paddingLeft: '8px'
                    }}
                  >
                    <span style={{ fontWeight: '600' }}>
                      {typeof lang === 'string' ? lang : lang.name || 'Language'}
                    </span>
                    {typeof lang === 'object' && lang.level && (
                      <span style={{ color: theme.secondary, marginLeft: '6px' }}>
                        ({lang.level})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Professional References Note */}
            <div>
              <div 
                className="flex items-center gap-2 mb-3"
                style={{ 
                  borderBottom: `2px solid ${theme.primary}20`,
                  paddingBottom: '4px'
                }}
              >
                <Users style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    color: theme.primary,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  References
                </h2>
              </div>
              <p 
                style={{ 
                  fontSize: styles.text.fontSize,
                  fontStyle: 'italic',
                  color: theme.secondary,
                  paddingLeft: '8px'
                }}
              >
                Available upon request
              </p>
            </div>

            {/* Professional links */}
            {userData.social_links && userData.social_links.length > 0 && (
              <div style={{ marginTop: styles.spacing.section }}>
                <div 
                  className="flex items-center gap-2 mb-3"
                  style={{ 
                    borderBottom: `2px solid ${theme.primary}20`,
                    paddingBottom: '4px'
                  }}
                >
                  <Globe style={{ width: isSmall ? '10px' : '16px', height: isSmall ? '10px' : '16px', color: theme.primary }} />
                  <h2 
                    style={{ 
                      fontSize: styles.sectionTitle.fontSize,
                      fontWeight: styles.sectionTitle.fontWeight,
                      color: theme.primary,
                      letterSpacing: styles.sectionTitle.letterSpacing
                    }}
                  >
                    Professional Profiles
                  </h2>
                </div>
                <div style={{ paddingLeft: '8px' }}>
                  {userData.social_links.map((link, index) => {
                    const displayText = link.username || link.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
                    
                    return (
                      <p key={index} style={{ fontSize: styles.text.fontSize, marginBottom: '2px' }}>
                        <span style={{ fontWeight: '600' }}>{link.label}:</span>{' '}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: theme.secondary,
                            textDecoration: 'none'
                          }}
                          className="hover:underline"
                        >
                          {displayText}
                        </a>
                      </p>
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
