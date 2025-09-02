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
  
  // Size-based styling
  const styles = {
    container: {
      fontSize: isSmall ? '0.35rem' : '0.875rem',
      lineHeight: isSmall ? '1.1' : '1.4',
      padding: isSmall ? '0.25rem' : '1rem'
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
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col bg-white"
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: theme.background,
        color: theme.text,
        fontSize: styles.container.fontSize,
        lineHeight: styles.container.lineHeight,
        padding: styles.container.padding
      }}
    >
      {/* Header */}
      <div className="text-center border-b border-gray-200" style={{ paddingBottom: styles.spacing.item, marginBottom: styles.spacing.section }}>
        <h1 className="font-bold" style={{ ...styles.heading, color: theme.primary }}>
          {userData.name || "Your Name"}
        </h1>
        {userData.job_title && (
          <p className="font-medium" style={{ ...styles.subheading, color: theme.secondary }}>
            {userData.job_title}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-1" style={{ fontSize: styles.text.fontSize }}>
          {userData.email && (
            <div className="flex items-center gap-0.5">
              <Mail className="h-2 w-2" />
              <span>{userData.email}</span>
            </div>
          )}
          {userData.phone && (
            <div className="flex items-center gap-0.5">
              <Phone className="h-2 w-2" />
              <span>{userData.phone}</span>
            </div>
          )}
          {userData.address && (
            <div className="flex items-center gap-0.5">
              <MapPin className="h-2 w-2" />
              <span>{userData.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Left Column */}
        <div className="w-1/3 bg-gray-50" style={{ padding: styles.spacing.item }}>
          {/* Skills */}
          {userData.skills && userData.skills.length > 0 && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 className="font-bold uppercase tracking-wide" style={{ ...styles.sectionTitle, color: theme.primary }}>
                Skills
              </h3>
              <div>
                {userData.skills.slice(0, isSmall ? 8 : 12).map((skill, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.item }}>
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: styles.text.fontSize }}>{skill.name}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-1 h-1 rounded-full ${star <= skill.rating ? 'bg-blue-500' : 'bg-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {userData.education && userData.education.length > 0 && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 className="font-bold uppercase tracking-wide" style={{ ...styles.sectionTitle, color: theme.primary }}>
                Education
              </h3>
              <div>
                {userData.education.slice(0, isSmall ? 2 : 4).map((edu, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.item }}>
                    <p className="font-medium" style={{ fontSize: styles.text.fontSize }}>
                      {edu.degree || 'Degree'}
                    </p>
                    <p style={{ fontSize: styles.text.fontSize, color: theme.secondary }}>
                      {edu.institution || edu.school || 'Institution'}
                    </p>
                    {edu.year && (
                      <p style={{ fontSize: styles.text.fontSize, color: theme.secondary }}>
                        {edu.year}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div>
            <h3 className="font-bold uppercase tracking-wide" style={{ ...styles.sectionTitle, color: theme.primary }}>
              Links
            </h3>
            <div>
              {userData.linkedin_url && (
                <div className="flex items-center gap-0.5" style={{ marginBottom: styles.spacing.item }}>
                  <Linkedin className="h-2 w-2" />
                  <span style={{ fontSize: styles.text.fontSize }}>LinkedIn</span>
                </div>
              )}
              {userData.github_url && (
                <div className="flex items-center gap-0.5" style={{ marginBottom: styles.spacing.item }}>
                  <Github className="h-2 w-2" />
                  <span style={{ fontSize: styles.text.fontSize }}>GitHub</span>
                </div>
              )}
              {userData.portfolio_url && (
                <div className="flex items-center gap-0.5" style={{ marginBottom: styles.spacing.item }}>
                  <Globe className="h-2 w-2" />
                  <span style={{ fontSize: styles.text.fontSize }}>Portfolio</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1" style={{ padding: styles.spacing.item }}>
          {/* Summary */}
          {userData.summary && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 className="font-bold uppercase tracking-wide" style={{ ...styles.sectionTitle, color: theme.primary }}>
                Professional Summary
              </h3>
              <p style={{ fontSize: styles.text.fontSize, lineHeight: '1.4' }}>
                {userData.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {userData.experience && userData.experience.length > 0 && (
            <div style={{ marginBottom: styles.spacing.section }}>
              <h3 className="font-bold uppercase tracking-wide" style={{ ...styles.sectionTitle, color: theme.primary }}>
                Work Experience
              </h3>
              <div>
                {userData.experience.slice(0, isSmall ? 2 : 4).map((exp, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.section }}>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold" style={{ fontSize: styles.text.fontSize }}>
                        {exp.title || exp.jobTitle || 'Position'}
                      </h4>
                      <span style={{ fontSize: styles.text.fontSize, color: theme.secondary }}>
                        {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}
                      </span>
                    </div>
                    <p className="font-medium" style={{ fontSize: styles.text.fontSize, color: theme.secondary }}>
                      {exp.company || exp.employer || 'Company'}
                    </p>
                    {exp.description && (
                      <p style={{ fontSize: styles.text.fontSize, marginTop: styles.spacing.item }}>
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
            <div>
              <h3 className="font-bold uppercase tracking-wide" style={{ ...styles.sectionTitle, color: theme.primary }}>
                Projects
              </h3>
              <div>
                {userData.projects.slice(0, isSmall ? 2 : 3).map((project, i) => (
                  <div key={i} style={{ marginBottom: styles.spacing.section }}>
                    <h4 className="font-bold" style={{ fontSize: styles.text.fontSize }}>
                      {project.name || 'Project Name'}
                    </h4>
                    {project.description && (
                      <p style={{ fontSize: styles.text.fontSize, marginTop: styles.spacing.item }}>
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
        </div>
      </div>
    </div>
  );
}
