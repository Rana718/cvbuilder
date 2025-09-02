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
      className="w-full h-full flex"
      style={{
        fontFamily: 'Playfair Display, serif',
        backgroundColor: theme.background,
        color: theme.text,
        fontSize: styles.container.fontSize,
        lineHeight: styles.container.lineHeight
      }}
    >
      {/* Left Sidebar */}
      <div className="w-1/3" style={{ backgroundColor: theme.primary, color: 'white', padding: styles.spacing.item }}>
        {/* Profile */}
        <div className="text-center" style={{ marginBottom: styles.spacing.section }}>
          <div 
            className="bg-white/20 rounded-full mx-auto"
            style={{ 
              width: isSmall ? '2rem' : '4rem', 
              height: isSmall ? '2rem' : '4rem',
              marginBottom: styles.spacing.item 
            }}
          />
          <h1 className="font-bold" style={{ ...styles.heading, marginBottom: styles.spacing.item }}>
            {userData.name || "Your Name"}
          </h1>
          {userData.job_title && (
            <p style={{ fontSize: styles.text.fontSize, opacity: 0.9 }}>
              {userData.job_title}
            </p>
          )}
        </div>

        {/* Contact */}
        <div style={{ marginBottom: styles.spacing.section }}>
          <h3 className="font-bold uppercase tracking-wide" style={{ ...styles.sectionTitle, marginBottom: styles.spacing.item }}>
            Contact
          </h3>
          <div style={{ fontSize: styles.text.fontSize }}>
            {userData.email && (
              <div className="flex items-center gap-1" style={{ marginBottom: styles.spacing.item }}>
                <Mail className="h-2 w-2" />
                <span className="break-all">{userData.email}</span>
              </div>
            )}
            {userData.phone && (
              <div className="flex items-center gap-1" style={{ marginBottom: styles.spacing.item }}>
                <Phone className="h-2 w-2" />
                <span>{userData.phone}</span>
              </div>
            )}
            {userData.address && (
              <div className="flex items-center gap-1" style={{ marginBottom: styles.spacing.item }}>
                <MapPin className="h-2 w-2" />
                <span>{userData.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {userData.skills && userData.skills.length > 0 && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <h3 className="font-bold uppercase tracking-wide" style={{ ...styles.sectionTitle, marginBottom: styles.spacing.item }}>
              Skills
            </h3>
            <div>
              {userData.skills.slice(0, isSmall ? 6 : 8).map((skill, i) => (
                <div key={i} style={{ marginBottom: styles.spacing.item }}>
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: styles.text.fontSize }}>{skill.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-1 h-1 rounded-full ${star <= skill.rating ? 'bg-white' : 'bg-white/30'}`}
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
          <div>
            <h3 className="font-bold uppercase tracking-wide" style={{ ...styles.sectionTitle, marginBottom: styles.spacing.item }}>
              Education
            </h3>
            <div>
              {userData.education.slice(0, isSmall ? 1 : 2).map((edu, i) => (
                <div key={i} style={{ marginBottom: styles.spacing.section }}>
                  <p className="font-medium" style={{ fontSize: styles.text.fontSize }}>
                    {edu.degree || edu.institution}
                  </p>
                  <p style={{ fontSize: styles.text.fontSize, opacity: 0.8 }}>
                    {edu.institution || edu.degree}
                  </p>
                  <p style={{ fontSize: styles.text.fontSize, opacity: 0.7 }}>
                    {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1" style={{ padding: styles.spacing.section }}>
        {/* Summary */}
        {userData.summary && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <h2 className="font-bold" style={{ ...styles.sectionTitle, color: theme.primary, marginBottom: styles.spacing.item }}>
              EXECUTIVE SUMMARY
            </h2>
            <p style={{ fontSize: styles.text.fontSize, lineHeight: '1.5' }}>
              {userData.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {userData.experience && userData.experience.length > 0 && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <h2 className="font-bold" style={{ ...styles.sectionTitle, color: theme.primary, marginBottom: styles.spacing.item }}>
              PROFESSIONAL EXPERIENCE
            </h2>
            <div>
              {userData.experience.slice(0, isSmall ? 2 : 3).map((exp, i) => (
                <div key={i} style={{ marginBottom: styles.spacing.section }}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold" style={{ fontSize: styles.text.fontSize }}>
                      {exp.title || exp.jobTitle || 'Position'}
                    </h3>
                    <span style={{ fontSize: styles.text.fontSize, color: theme.secondary }}>
                      {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}
                    </span>
                  </div>
                  <p className="font-medium" style={{ fontSize: styles.text.fontSize, color: theme.secondary, marginBottom: styles.spacing.item }}>
                    {exp.company || exp.employer || 'Company'}
                  </p>
                  {exp.description && (
                    <p style={{ fontSize: styles.text.fontSize, lineHeight: '1.5', color: '#4a5568' }}>
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
        {userData.projects && userData.projects.length > 0 && (
          <div style={{ marginBottom: styles.spacing.section }}>
            <h2 className="font-bold" style={{ ...styles.sectionTitle, color: theme.primary, marginBottom: styles.spacing.item }}>
              KEY PROJECTS
            </h2>
            <div>
              {userData.projects.slice(0, isSmall ? 1 : 2).map((project, i) => (
                <div key={i} style={{ marginBottom: styles.spacing.section }}>
                  <h3 className="font-bold" style={{ fontSize: styles.text.fontSize }}>
                    {project.name || 'Project Name'}
                  </h3>
                  {project.description && (
                    <p style={{ fontSize: styles.text.fontSize, marginTop: styles.spacing.item, lineHeight: '1.5', color: '#4a5568' }}>
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

        {/* Links */}
        <div>
          <h2 className="font-bold" style={{ ...styles.sectionTitle, color: theme.primary, marginBottom: styles.spacing.item }}>
            PROFESSIONAL LINKS
          </h2>
          <div className="flex gap-3" style={{ fontSize: styles.text.fontSize }}>
            {userData.linkedin_url && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-3 w-3" />
                <span>LinkedIn</span>
              </div>
            )}
            {userData.github_url && (
              <div className="flex items-center gap-1">
                <Github className="h-3 w-3" />
                <span>GitHub</span>
              </div>
            )}
            {userData.portfolio_url && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>Portfolio</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
