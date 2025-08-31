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

interface ExecutiveEliteProps {
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

export default function ExecutiveElite({ userData, colors, scale = 1, mode = 'default' }: ExecutiveEliteProps) {
  const theme = colors || {
    primary: '#1a365d',
    secondary: '#2d3748',
    accent: '#3182ce',
    text: '#2d3748',
    background: '#ffffff'
  };

  return (
    <div
      className="w-full h-full flex"
      style={{
        fontFamily: 'Playfair Display, serif',
        backgroundColor: theme.background,
        color: theme.text,
        fontSize: '0.7rem',
        lineHeight: '1.1'
      }}
    >
      {/* Left Sidebar */}
      <div className="w-1/3 p-2" style={{ backgroundColor: theme.primary, color: 'white' }}>
        {/* Profile */}
        <div className="text-center mb-3">
          <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-2"></div>
          <h1 className="text-sm font-bold mb-1">{userData.name || "Your Name"}</h1>
          {userData.job_title && (
            <p className="text-xs opacity-90">{userData.job_title}</p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-3">
          <h3 className="text-xs font-bold mb-1 uppercase tracking-wide">Contact</h3>
          <div className="space-y-1 text-xs">
            {userData.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-2 w-2" />
                <span className="break-all">{userData.email}</span>
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

        {/* Skills */}
        {userData.skills && userData.skills.length > 0 && (
          <div className="mb-3">
            <h3 className="text-xs font-bold mb-1 uppercase tracking-wide">Skills</h3>
            <div className="space-y-1">
              {userData.skills.slice(0, 6).map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs">{skill.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="h-1.5 w-1.5"
                          fill={j < skill.rating ? 'white' : 'none'}
                          color={j < skill.rating ? 'white' : 'rgba(255,255,255,0.3)'}
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
            <h3 className="text-xs font-bold mb-1 uppercase tracking-wide">Education</h3>
            <div className="space-y-2">
              {userData.education.slice(0, 2).map((edu, i) => (
                <div key={i}>
                  <p className="text-xs font-medium">{edu.degree || edu.institution}</p>
                  <p className="text-xs opacity-80">{edu.institution || edu.degree}</p>
                  <p className="text-xs opacity-70">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 p-3">
        {/* Summary */}
        {userData.summary && (
          <div className="mb-3">
            <h2 className="text-sm font-bold mb-1" style={{ color: theme.primary }}>
              EXECUTIVE SUMMARY
            </h2>
            <p className="text-xs leading-relaxed">{userData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {userData.experience && userData.experience.length > 0 && (
          <div className="mb-3">
            <h2 className="text-sm font-bold mb-1" style={{ color: theme.primary }}>
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-2">
              {userData.experience.slice(0, 3).map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="text-xs font-bold">{exp.title || exp.jobTitle}</h3>
                    <span className="text-xs text-gray-500">{exp.duration || `${exp.startDate} - ${exp.endDate}`}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-600 mb-1">{exp.company || exp.employer}</p>
                  {exp.description && (
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {exp.description.length > 120 ? exp.description.substring(0, 120) + '...' : exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div>
          <h2 className="text-sm font-bold mb-1" style={{ color: theme.primary }}>
            PROFESSIONAL LINKS
          </h2>
          <div className="flex gap-3 text-xs">
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
