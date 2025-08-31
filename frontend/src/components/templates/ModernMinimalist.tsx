"use client";

import { Mail, Phone, MapPin, Globe, Linkedin, Github, Star } from "lucide-react";

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
  scale?: number;
  mode?: 'default' | 'live';
}

export default function ModernMinimalist({ userData, colors, scale = 1, mode = 'default' }: ModernMinimalistProps) {
  const theme = colors || {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#06b6d4',
    text: '#334155',
    background: '#ffffff'
  };

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: theme.background,
        color: theme.text,
        fontSize: '0.55rem',
        lineHeight: '1.0'
      }}
    >
      {/* Header */}
      <div className="text-center py-1 px-1 border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <h1 className="text-sm font-bold mb-0.5" style={{ color: theme.primary }}>
          {userData.name || "Your Name"}
        </h1>
        {userData.job_title && (
          <p className="text-xs font-medium mb-0.5" style={{ color: theme.secondary }}>
            {userData.job_title}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-1 text-xs">
          {userData.email && (
            <div className="flex items-center gap-0.5">
              <Mail className="h-1.5 w-1.5" />
              <span>{userData.email}</span>
            </div>
          )}
          {userData.phone && (
            <div className="flex items-center gap-0.5">
              <Phone className="h-1.5 w-1.5" />
              <span>{userData.phone}</span>
            </div>
          )}
          {userData.address && (
            <div className="flex items-center gap-0.5">
              <MapPin className="h-1.5 w-1.5" />
              <span>{userData.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column */}
        <div className="w-1/3 p-1 bg-gray-50">
          {/* Skills */}
          {userData.skills && userData.skills.length > 0 && (
            <div className="mb-1">
              <h3 className="text-xs font-bold mb-0.5" style={{ color: theme.primary }}>
                SKILLS
              </h3>
              <div className="space-y-0.5">
                {userData.skills.slice(0, 10).map((skill, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs">{skill.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="h-1 w-1"
                          fill={j < skill.rating ? theme.accent : 'none'}
                          color={j < skill.rating ? theme.accent : '#e5e7eb'}
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
            <div className="mb-1">
              <h3 className="text-xs font-bold mb-0.5" style={{ color: theme.primary }}>
                EDUCATION
              </h3>
              <div className="space-y-0.5">
                {userData.education.slice(0, 4).map((edu, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium">{edu.degree || edu.institution}</p>
                    <p className="text-xs text-gray-600">{edu.institution || edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.year}</p>
                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {userData.certifications && userData.certifications.length > 0 && (
            <div className="mb-1">
              <h3 className="text-xs font-bold mb-0.5" style={{ color: theme.primary }}>
                CERTIFICATIONS
              </h3>
              <div className="space-y-0.5">
                {userData.certifications.slice(0, 3).map((cert, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium">{cert.name}</p>
                    <p className="text-xs text-gray-600">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {userData.languages && userData.languages.length > 0 && (
            <div className="mb-1">
              <h3 className="text-xs font-bold mb-0.5" style={{ color: theme.primary }}>
                LANGUAGES
              </h3>
              <div className="space-y-0.5">
                {userData.languages.slice(0, 4).map((lang, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-xs">{lang.name}</span>
                    <span className="text-xs text-gray-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div>
            <h3 className="text-xs font-bold mb-0.5" style={{ color: theme.primary }}>
              LINKS
            </h3>
            <div className="space-y-0.5">
              {userData.linkedin_url && (
                <div className="flex items-center gap-0.5">
                  <Linkedin className="h-1.5 w-1.5" />
                  <span className="text-xs">LinkedIn</span>
                </div>
              )}
              {userData.github_url && (
                <div className="flex items-center gap-0.5">
                  <Github className="h-1.5 w-1.5" />
                  <span className="text-xs">GitHub</span>
                </div>
              )}
              {userData.portfolio_url && (
                <div className="flex items-center gap-0.5">
                  <Globe className="h-1.5 w-1.5" />
                  <span className="text-xs">Portfolio</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 p-1">
          {/* Summary */}
          {userData.summary && (
            <div className="mb-1">
              <h3 className="text-xs font-bold mb-0.5" style={{ color: theme.primary }}>
                PROFESSIONAL SUMMARY
              </h3>
              <p className="text-xs leading-tight">{userData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {userData.experience && userData.experience.length > 0 && (
            <div className="mb-1">
              <h3 className="text-xs font-bold mb-0.5" style={{ color: theme.primary }}>
                WORK EXPERIENCE
              </h3>
              <div className="space-y-1">
                {userData.experience.slice(0, 5).map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-xs font-semibold">{exp.title || exp.jobTitle}</h4>
                      <span className="text-xs text-gray-500">{exp.duration || `${exp.startDate} - ${exp.endDate}`}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-600 mb-0.5">{exp.company || exp.employer}</p>
                    {(exp.location || exp.isRemote) && (
                      <p className="text-xs text-gray-500 mb-0.5">
                        {exp.location} {exp.isRemote && "(Remote)"}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-xs text-gray-700 leading-tight">
                        {exp.description.length > 80 ? exp.description.substring(0, 80) + '...' : exp.description}
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
              <h3 className="text-xs font-bold mb-0.5" style={{ color: theme.primary }}>
                PROJECTS
              </h3>
              <div className="space-y-1">
                {userData.projects.slice(0, 3).map((project, i) => (
                  <div key={i}>
                    <h4 className="text-xs font-semibold">{project.name}</h4>
                    <p className="text-xs text-gray-700 leading-tight">
                      {project.description.length > 60 ? project.description.substring(0, 60) + '...' : project.description}
                    </p>
                    {project.technologies && (
                      <p className="text-xs text-gray-500">
                        {project.technologies.slice(0, 3).join(', ')}
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
