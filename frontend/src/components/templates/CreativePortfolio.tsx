"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe, Star, Award, Briefcase, GraduationCap, Camera, Palette, Lightbulb } from 'lucide-react'

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

interface CreativePortfolioProps {
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

export default function CreativePortfolio({ userData, colors, size = 'normal', mode = 'default' }: CreativePortfolioProps) {
  const theme = colors || {
    primary: '#8b5cf6',
    secondary: '#ec4899',
    accent: '#f59e0b',
    text: '#1e293b',
    background: '#fefce8'
  };

  const isSmall = size === 'small';

  // Creative portfolio styling
  const styles = {
    container: {
      fontSize: isSmall ? '6px' : '11px',
      lineHeight: isSmall ? 1.3 : 1.5,
      fontFamily: "'Poppins', 'Inter', sans-serif"
    },
    name: {
      fontSize: isSmall ? '18px' : '36px',
      fontWeight: '800',
      letterSpacing: '-2px'
    },
    jobTitle: {
      fontSize: isSmall ? '8px' : '16px',
      fontWeight: '300',
      letterSpacing: '1px'
    },
    sectionTitle: {
      fontSize: isSmall ? '8px' : '14px',
      fontWeight: '700',
      letterSpacing: '0.5px'
    },
    text: {
      fontSize: isSmall ? '6px' : '10px',
      lineHeight: isSmall ? 1.4 : 1.6
    },
    spacing: {
      section: isSmall ? '12px' : '24px',
      item: isSmall ? '6px' : '12px'
    },
    padding: {
      container: isSmall ? '12px' : '24px'
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
        padding: styles.padding.container,
        background: `linear-gradient(135deg, ${theme.background} 0%, #fef3c7 50%, ${theme.background} 100%)`
      }}
    >
      {/* Creative header with artistic elements */}
      <div style={{ marginBottom: styles.spacing.section }}>
        <div className="flex items-center gap-4 mb-4">
          {/* Profile image with creative frame */}
          {hasContent(userData.image_url) && (
            <div 
              style={{ 
                width: isSmall ? '60px' : '120px',
                height: isSmall ? '60px' : '120px',
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`,
                padding: '3px',
                flexShrink: 0
              }}
            >
              <img
                src={userData.image_url}
                alt={userData.name}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid white'
                }}
              />
            </div>
          )}
          
          <div className="flex-1">
            {/* Artistic name styling */}
            <div style={{ position: 'relative' }}>
              <h1 
                style={{ 
                  fontSize: styles.name.fontSize,
                  fontWeight: styles.name.fontWeight,
                  letterSpacing: styles.name.letterSpacing,
                  background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '4px'
                }}
              >
                {userData.name || "Creative Professional"}
              </h1>
              
              {/* Artistic underline */}
              <div 
                style={{
                  width: '60%',
                  height: '3px',
                  background: `linear-gradient(90deg, ${theme.accent}, ${theme.primary})`,
                  borderRadius: '2px',
                  marginBottom: '8px'
                }}
              />
            </div>
            
            {hasContent(userData.job_title) && (
              <p 
                style={{ 
                  fontSize: styles.jobTitle.fontSize,
                  fontWeight: styles.jobTitle.fontWeight,
                  letterSpacing: styles.jobTitle.letterSpacing,
                  color: theme.secondary,
                  textTransform: 'uppercase'
                }}
              >
                {userData.job_title}
              </p>
            )}
          </div>
        </div>

        {/* Floating contact cards */}
        <div className="flex flex-wrap gap-2">
          {hasContent(userData.email) && (
            <div 
              style={{
                backgroundColor: 'white',
                padding: '6px 10px',
                borderRadius: '20px',
                border: `2px solid ${theme.primary}30`,
                fontSize: styles.text.fontSize,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Mail style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.primary }} />
              {userData.email}
            </div>
          )}
          {hasContent(userData.phone) && (
            <div 
              style={{
                backgroundColor: 'white',
                padding: '6px 10px',
                borderRadius: '20px',
                border: `2px solid ${theme.secondary}30`,
                fontSize: styles.text.fontSize,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Phone style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
              {userData.phone}
            </div>
          )}
          {hasContent(userData.address) && (
            <div 
              style={{
                backgroundColor: 'white',
                padding: '6px 10px',
                borderRadius: '20px',
                border: `2px solid ${theme.accent}30`,
                fontSize: styles.text.fontSize,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <MapPin style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.accent }} />
              {userData.address}
            </div>
          )}
        </div>
      </div>

      {/* Main content with creative layout */}
      <div className="flex gap-6">
        {/* Left column - 65% */}
        <div className="flex-1" style={{ flex: '0 0 65%' }}>
          {/* Creative summary */}
          {hasContent(userData.summary) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <div 
                className="flex items-center gap-3 mb-3"
                style={{ position: 'relative' }}
              >
                <div 
                  style={{
                    width: isSmall ? '30px' : '40px',
                    height: isSmall ? '30px' : '40px',
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Lightbulb style={{ width: isSmall ? '12px' : '20px', height: isSmall ? '12px' : '20px', color: 'white' }} />
                </div>
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    color: theme.primary,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  Creative Vision
                </h2>
              </div>
              <div 
                style={{ 
                  backgroundColor: 'white',
                  padding: '16px',
                  borderRadius: '16px',
                  border: `3px solid transparent`,
                  background: `linear-gradient(white, white) padding-box, linear-gradient(45deg, ${theme.primary}, ${theme.secondary}) border-box`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                }}
              >
                <p style={{ fontSize: styles.text.fontSize, lineHeight: styles.text.lineHeight }}>
                  {userData.summary}
                </p>
              </div>
            </div>
          )}

          {/* Creative experience */}
          {hasContent(userData.experience) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <div 
                className="flex items-center gap-3 mb-4"
                style={{ position: 'relative' }}
              >
                <div 
                  style={{
                    width: isSmall ? '30px' : '40px',
                    height: isSmall ? '30px' : '40px',
                    background: `linear-gradient(135deg, ${theme.secondary}, ${theme.accent})`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Briefcase style={{ width: isSmall ? '12px' : '20px', height: isSmall ? '12px' : '20px', color: 'white' }} />
                </div>
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    color: theme.secondary,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  Professional Journey
                </h2>
              </div>
              
              <div style={{ position: 'relative' }}>
                {/* Creative timeline line */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '20px',
                    bottom: '20px',
                    width: '3px',
                    background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`,
                    borderRadius: '2px'
                  }}
                />
                
                {(userData.experience || []).slice(0, isSmall ? 3 : 5).map((exp, i) => (
                  <div 
                    key={i}
                    style={{ 
                      backgroundColor: 'white',
                      padding: '16px',
                      borderRadius: '16px',
                      marginBottom: styles.spacing.item,
                      marginLeft: '40px',
                      border: `2px solid ${theme.primary}20`,
                      position: 'relative',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* Timeline dot */}
                    <div 
                      style={{
                        position: 'absolute',
                        left: '-28px',
                        top: '16px',
                        width: '12px',
                        height: '12px',
                        backgroundColor: i % 3 === 0 ? theme.primary : i % 3 === 1 ? theme.secondary : theme.accent,
                        borderRadius: '50%',
                        border: '3px solid white',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    />
                    
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          fontWeight: '700',
                          color: theme.text
                        }}
                      >
                        {exp.title || exp.jobTitle || 'Position'}
                      </h3>
                      <span 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: 'white',
                          backgroundColor: theme.accent,
                          padding: '3px 8px',
                          borderRadius: '10px',
                          fontWeight: '600'
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
                        marginBottom: '6px'
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
            </div>
          )}

          {/* Creative projects showcase */}
          {hasContent(userData.projects) && (
            <div>
              <div 
                className="flex items-center gap-3 mb-4"
                style={{ position: 'relative' }}
              >
                <div 
                  style={{
                    width: isSmall ? '30px' : '40px',
                    height: isSmall ? '30px' : '40px',
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Palette style={{ width: isSmall ? '12px' : '20px', height: isSmall ? '12px' : '20px', color: 'white' }} />
                </div>
                <h2 
                  style={{ 
                    fontSize: styles.sectionTitle.fontSize,
                    fontWeight: styles.sectionTitle.fontWeight,
                    color: theme.accent,
                    letterSpacing: styles.sectionTitle.letterSpacing
                  }}
                >
                  Creative Portfolio
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {(userData.projects || []).slice(0, isSmall ? 2 : 4).map((project, i) => (
                  <div 
                    key={i}
                    style={{ 
                      backgroundColor: 'white',
                      padding: '14px',
                      borderRadius: '16px',
                      border: `2px solid transparent`,
                      background: `linear-gradient(white, white) padding-box, linear-gradient(45deg, ${theme.primary}40, ${theme.secondary}40) border-box`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Decorative corner */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '40px',
                        height: '40px',
                        background: `linear-gradient(135deg, ${theme.accent}20, ${theme.primary}20)`,
                        borderBottomLeftRadius: '20px'
                      }}
                    />
                    
                    <h3 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '700',
                        color: theme.text,
                        marginBottom: '6px'
                      }}
                    >
                      {project.name || 'Creative Project'}
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

        {/* Right sidebar - 35% */}
        <div className="w-1/3">
          {/* Creative skills with artistic bars */}
          {hasContent(userData.skills) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.primary,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item,
                  textAlign: 'center'
                }}
              >
                Creative Skills
              </h2>
              <div 
                style={{ 
                  backgroundColor: 'white',
                  padding: '14px',
                  borderRadius: '16px',
                  border: `2px solid ${theme.primary}20`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {(userData.skills || []).slice(0, isSmall ? 6 : 10).map((skill, i) => (
                  <div key={i} style={{ marginBottom: '8px' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          fontWeight: '600',
                          color: theme.text
                        }}
                      >
                        {skill.name}
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            style={{
                              width: isSmall ? '6px' : '10px',
                              height: isSmall ? '6px' : '10px',
                              fill: star <= skill.rating ? theme.accent : '#e2e8f0',
                              color: star <= skill.rating ? theme.accent : '#e2e8f0'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div 
                      style={{ 
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${(skill.rating / 5) * 100}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`,
                          borderRadius: '10px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education with creative styling */}
          {hasContent(userData.education) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.secondary,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item,
                  textAlign: 'center'
                }}
              >
                Education
              </h2>
              {(userData.education || []).slice(0, isSmall ? 2 : 3).map((edu, i) => (
                <div 
                  key={i}
                  style={{ 
                    backgroundColor: 'white',
                    padding: '12px',
                    borderRadius: '12px',
                    border: `2px solid transparent`,
                    background: `linear-gradient(white, white) padding-box, linear-gradient(45deg, ${theme.secondary}30, ${theme.accent}30) border-box`,
                    marginBottom: '8px',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="flex items-start gap-2">
                    <GraduationCap 
                      style={{ 
                        width: isSmall ? '10px' : '16px', 
                        height: isSmall ? '10px' : '16px', 
                        color: theme.secondary,
                        marginTop: '2px',
                        flexShrink: 0
                      }} 
                    />
                    <div>
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          fontWeight: '700',
                          color: theme.text,
                          marginBottom: '2px'
                        }}
                      >
                        {edu.degree || 'Degree'}
                      </p>
                      <p 
                        style={{ 
                          fontSize: styles.text.fontSize,
                          color: theme.secondary,
                          marginBottom: '2px'
                        }}
                      >
                        {edu.institution || edu.school || 'Institution'}
                      </p>
                      {edu.year && (
                        <p 
                          style={{ 
                            fontSize: styles.text.fontSize,
                            color: theme.accent,
                            fontWeight: '600'
                          }}
                        >
                          {edu.year}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications with badges */}
          {hasContent(userData.certifications) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.accent,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item,
                  textAlign: 'center'
                }}
              >
                Achievements
              </h2>
              {(userData.certifications || []).slice(0, isSmall ? 3 : 4).map((cert, i) => (
                <div 
                  key={i}
                  style={{ 
                    backgroundColor: theme.accent,
                    color: 'white',
                    padding: '8px',
                    borderRadius: '20px',
                    marginBottom: '6px',
                    textAlign: 'center',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Award style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px' }} />
                    <span 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        fontWeight: '600'
                      }}
                    >
                      {cert.name || cert.title || 'Certification'}
                    </span>
                  </div>
                  {(cert.issuer || cert.year) && (
                    <p 
                      style={{ 
                        fontSize: styles.text.fontSize,
                        opacity: 0.9,
                        marginTop: '2px'
                      }}
                    >
                      {cert.issuer && cert.year ? `${cert.issuer} • ${cert.year}` : cert.issuer || cert.year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Languages with creative bubbles */}
          {hasContent(userData.languages) && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.primary,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item,
                  textAlign: 'center'
                }}
              >
                Languages
              </h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {(userData.languages || []).slice(0, isSmall ? 4 : 6).map((lang, i) => (
                  <span 
                    key={i}
                    style={{ 
                      fontSize: styles.text.fontSize,
                      backgroundColor: i % 3 === 0 ? theme.primary : i % 3 === 1 ? theme.secondary : theme.accent,
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '15px',
                      fontWeight: '600',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    {typeof lang === 'string' ? lang : lang.name || 'Language'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Creative links */}
          {(hasContent(userData.linkedin_url) || hasContent(userData.github_url) || hasContent(userData.portfolio_url)) && (
            <div>
              <h2 
                style={{ 
                  fontSize: styles.sectionTitle.fontSize,
                  fontWeight: styles.sectionTitle.fontWeight,
                  color: theme.secondary,
                  letterSpacing: styles.sectionTitle.letterSpacing,
                  marginBottom: styles.spacing.item,
                  textAlign: 'center'
                }}
              >
                Connect
              </h2>
              <div className="flex flex-col gap-2">
                {hasContent(userData.linkedin_url) && (
                  <div 
                    style={{
                      backgroundColor: 'white',
                      padding: '8px',
                      borderRadius: '12px',
                      border: `2px solid ${theme.primary}30`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: styles.text.fontSize,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Linkedin style={{ width: isSmall ? '10px' : '14px', height: isSmall ? '10px' : '14px', color: theme.primary }} />
                    <span>LinkedIn</span>
                  </div>
                )}
                {hasContent(userData.github_url) && (
                  <div 
                    style={{
                      backgroundColor: 'white',
                      padding: '8px',
                      borderRadius: '12px',
                      border: `2px solid ${theme.secondary}30`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: styles.text.fontSize,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Github style={{ width: isSmall ? '10px' : '14px', height: isSmall ? '10px' : '14px', color: theme.secondary }} />
                    <span>GitHub</span>
                  </div>
                )}
                {hasContent(userData.portfolio_url) && (
                  <div 
                    style={{
                      backgroundColor: 'white',
                      padding: '8px',
                      borderRadius: '12px',
                      border: `2px solid ${theme.accent}30`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: styles.text.fontSize,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Globe style={{ width: isSmall ? '10px' : '14px', height: isSmall ? '10px' : '14px', color: theme.accent }} />
                    <span>Portfolio</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
