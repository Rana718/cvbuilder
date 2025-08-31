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
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
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
  scale?: number;
  mode?: 'default' | 'live';
}

export default function CreativeDesigner({ userData, colors, scale = 1, mode = 'default' }: CreativeDesignerProps) {
  const theme = colors || {
    primary: '#7c3aed',
    secondary: '#a855f7',
    accent: '#ec4899',
    text: '#374151',
    background: '#fafafa'
  };

  return (
    <div
      className="w-full h-full"
      style={{
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: theme.background,
        color: theme.text,
        fontSize: '0.7rem',
        lineHeight: '1.1'
      }}
    >
      {/* Header */}
      <div className="relative p-3" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`, color: 'white' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <h1 className="text-lg font-bold mb-0.5">{userData.name || "Your Name"}</h1>
            {userData.job_title && (
              <p className="text-sm opacity-90">{userData.job_title}</p>
            )}
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-wrap gap-2 mt-2 text-xs">
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
        <div className="w-2/5 p-2 bg-white">
          {/* Summary */}
          {userData.summary && (
            <div className="mb-3">
              <h3 className="text-sm font-bold mb-1" style={{ color: theme.primary }}>
                ABOUT ME
              </h3>
              <p className="text-xs leading-relaxed">{userData.summary}</p>
            </div>
          )}

          {/* Skills */}
          {userData.skills && userData.skills.length > 0 && (
            <div className="mb-3">
              <h3 className="text-sm font-bold mb-1" style={{ color: theme.primary }}>
                SKILLS
              </h3>
              <div className="space-y-1">
                {userData.skills.slice(0, 6).map((skill, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs">{skill.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <div
                          key={j}
                          className="w-2 h-1 rounded"
                          style={{
                            backgroundColor: j < skill.rating ? theme.accent : '#e5e7eb'
                          }}
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
              <h3 className="text-sm font-bold mb-1" style={{ color: theme.primary }}>
                EDUCATION
              </h3>
              <div className="space-y-2">
                {userData.education.slice(0, 2).map((edu, i) => (
                  <div key={i}>
                    <p className="text-xs font-medium">{edu.degree || edu.institution}</p>
                    <p className="text-xs text-gray-600">{edu.institution || edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1 p-2">
          {/* Experience */}
          {userData.experience && userData.experience.length > 0 && (
            <div className="mb-3">
              <h3 className="text-sm font-bold mb-1" style={{ color: theme.primary }}>
                EXPERIENCE
              </h3>
              <div className="space-y-2">
                {userData.experience.slice(0, 3).map((exp, i) => (
                  <div key={i} className="relative pl-3">
                    <div 
                      className="absolute left-0 top-1 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="text-xs font-bold">{exp.title || exp.jobTitle}</h4>
                      <span className="text-xs text-gray-500">{exp.duration || `${exp.startDate} - ${exp.endDate}`}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-600 mb-1">{exp.company || exp.employer}</p>
                    {exp.description && (
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {exp.description.length > 100 ? exp.description.substring(0, 100) + '...' : exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: theme.primary }}>
              PORTFOLIO
            </h3>
            <div className="flex gap-2 text-xs">
              {userData.linkedin_url && (
                <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ backgroundColor: theme.primary, color: 'white' }}>
                  <Linkedin className="h-2 w-2" />
                  <span>LinkedIn</span>
                </div>
              )}
              {userData.github_url && (
                <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ backgroundColor: theme.secondary, color: 'white' }}>
                  <Github className="h-2 w-2" />
                  <span>GitHub</span>
                </div>
              )}
              {userData.portfolio_url && (
                <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ backgroundColor: theme.accent, color: 'white' }}>
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
