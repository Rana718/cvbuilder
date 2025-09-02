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
    primary: '#7c3aed',
    secondary: '#a855f7',
    accent: '#ec4899',
    text: '#374151',
    background: '#fafafa'
  };

  const isSmall = size === 'small';

  // Size-based styling
  const styles = {
    container: {
      fontSize: isSmall ? '0.35rem' : '0.875rem',
      lineHeight: isSmall ? '1.1' : '1.4'
    },
    heading: {
      fontSize: isSmall ? '0.5rem' : '1.25rem',
      marginBottom: isSmall ? '0.125rem' : '0.5rem'
    },
    subheading: {
      fontSize: isSmall ? '0.4rem' : '1rem',
      marginBottom: isSmall ? '0.125rem' : '0.375rem'
    },
    sectionTitle: {
      fontSize: isSmall ? '0.4rem' : '0.875rem',
      marginBottom: isSmall ? '0.125rem' : '0.25rem'
    },
    text: {
      fontSize: isSmall ? '0.35rem' : '0.75rem',
      marginBottom: isSmall ? '0.125rem' : '0.25rem'
    },
    spacing: {
      section: isSmall ? '0.25rem' : '1rem',
      item: isSmall ? '0.125rem' : '0.5rem'
    },
    padding: {
      container: isSmall ? '0.25rem' : '1rem',
      section: isSmall ? '0.125rem' : '0.5rem'
    }
  };

  return (
    <div
      className="w-full h-full"
      style={{
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: theme.background,
        color: theme.text,
        fontSize: styles.container.fontSize,
        lineHeight: styles.container.lineHeight
      }}
    >
      {/* Header */}
      <div 
        className="relative"
        style={{ 
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, 
          color: 'white',
          padding: styles.padding.container
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="bg-white/20 rounded-full flex-shrink-0"
            style={{ 
              width: isSmall ? '2rem' : '3rem', 
              height: isSmall ? '2rem' : '3rem' 
            }}
          />
          <div className="flex-1">
            <h1 className="font-bold" style={{ ...styles.heading }}>
              {userData.name || "Your Name"}
            </h1>
            {userData.job_title && (
              <p style={{ fontSize: styles.subheading.fontSize, opacity: 0.9 }}>
                {userData.job_title}
              </p>
            )}
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-wrap gap-2 mt-2" style={{ fontSize: styles.text.fontSize }}>
          {userData.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-2 w-2" />
              <span>{userData.email}</span>
            </div>
          )}
          {userData.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-2 w-2" />
              <span>{userData.phone}</span>
            </div>
          )}
          {userData.address && (
            <div className="flex items-center gap-1">
              <MapPin className="h-2 w-2" />
              <span>{userData.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex h-full">
        {/* Left Column */}
        <div className="w-2/5 bg-white" style={{ padding: styles.padding.section }}>
          {/* Summary */}
          {userData.summary && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 className="font-bold" style={{ ...styles.sectionTitle, color: theme.primary, marginBottom: styles.spacing.item }}>
                ABOUT ME
              </h3>
              <p style={{ fontSize: styles.text.fontSize, lineHeight: '1.5' }}>
                {userData.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {userData.skills && userData.skills.length > 0 && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 className="font-bold" style={{ ...styles.sectionTitle, color: theme.primary, marginBottom: styles.spacing.item }}>
                SKILLS
              </h3>
              <div>
                {userData.skills.slice(0, isSmall ? 4 : 6).map((skill, i) => (
                  <div key={i} className="flex items-center justify-between" style={{ marginBottom: styles.spacing.item }}>
                    <span style={{ fontSize: styles.text.fontSize }}>{skill.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-1 h-1 rounded-full ${star <= skill.rating ? 'bg-purple-500' : 'bg-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {userData.education && userData.education.length > 0 && (
            <div>
              <h3 className="font-bold" style={{ ...styles.sectionTitle, color: theme.primary, marginBottom: styles.spacing.item }}>
                EDUCATION
              </h3>
              <div>
                {userData.education.slice(0, isSmall ? 1 : 2).map((edu, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.section }}>
                    <p className="font-medium" style={{ fontSize: styles.text.fontSize }}>
                      {edu.degree || edu.institution}
                    </p>
                    <p style={{ fontSize: styles.text.fontSize, color: '#6b7280' }}>
                      {edu.institution || edu.degree}
                    </p>
                    <p style={{ fontSize: styles.text.fontSize, color: '#9ca3af' }}>
                      {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1" style={{ padding: styles.padding.section }}>
          {/* Experience */}
          {userData.experience && userData.experience.length > 0 && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 className="font-bold" style={{ ...styles.sectionTitle, color: theme.primary, marginBottom: styles.spacing.item }}>
                EXPERIENCE
              </h3>
              <div>
                {userData.experience.slice(0, isSmall ? 2 : 3).map((exp, i) => (
                  <div key={i} className="relative pl-3" style={{ marginBottom: styles.spacing.section }}>
                    <div 
                      className="absolute left-0 top-1 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold" style={{ fontSize: styles.text.fontSize }}>
                        {exp.title || exp.jobTitle || 'Position'}
                      </h4>
                      <span style={{ fontSize: styles.text.fontSize, color: '#6b7280' }}>
                        {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}
                      </span>
                    </div>
                    <p className="font-medium" style={{ fontSize: styles.text.fontSize, color: theme.secondary }}>
                      {exp.company || exp.employer || 'Company'}
                    </p>
                    {exp.description && (
                      <p style={{ fontSize: styles.text.fontSize, marginTop: styles.spacing.item, lineHeight: '1.4' }}>
                        {isSmall && exp.description.length > 100 
                          ? exp.description.substring(0, 100) + '...' 
                          : exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {userData.projects && userData.projects.length > 0 && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 className="font-bold" style={{ ...styles.sectionTitle, color: theme.primary, marginBottom: styles.spacing.item }}>
                PROJECTS
              </h3>
              <div>
                {userData.projects.slice(0, isSmall ? 1 : 2).map((project, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.section }}>
                    <h4 className="font-bold" style={{ fontSize: styles.text.fontSize }}>
                      {project.name || 'Project Name'}
                    </h4>
                    {project.description && (
                      <p style={{ fontSize: styles.text.fontSize, marginTop: styles.spacing.item, lineHeight: '1.4' }}>
                        {isSmall && project.description.length > 80 
                          ? project.description.substring(0, 80) + '...' 
                          : project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div>
            <h3 className="font-bold" style={{ ...styles.sectionTitle, color: theme.primary, marginBottom: styles.spacing.item }}>
              PORTFOLIO
            </h3>
            <div className="flex gap-2" style={{ fontSize: styles.text.fontSize }}>
              {userData.linkedin_url && (
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded" 
                  style={{ backgroundColor: theme.primary, color: 'white' }}
                >
                  <Linkedin className="h-2 w-2" />
                  <span>LinkedIn</span>
                </div>
              )}
              {userData.github_url && (
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded" 
                  style={{ backgroundColor: theme.secondary, color: 'white' }}
                >
                  <Github className="h-2 w-2" />
                  <span>GitHub</span>
                </div>
              )}
              {userData.portfolio_url && (
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded" 
                  style={{ backgroundColor: theme.accent, color: 'white' }}
                >
                  <Globe className="h-2 w-2" />
                  <span>Portfolio</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
