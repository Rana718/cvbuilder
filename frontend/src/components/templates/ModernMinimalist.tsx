"use client";

import { Mail, Phone, MapPin, Globe, Linkedin, Github, Calendar, Star } from "lucide-react";

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

interface ModernMinimalistProps {
  userData: UserData;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export default function ModernMinimalist({ userData, colors }: ModernMinimalistProps) {
  const theme = colors || {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#06b6d4',
    text: '#334155',
    background: '#ffffff'
  };

  return (
    <div
      className="max-w-4xl mx-auto shadow-lg"
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: theme.background,
        color: theme.text
      }}
    >
      {/* Header */}
      <div className="border-b p-8" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ color: theme.text }}>
            {userData.name || 'Your Name'}
          </h1>
          <p className="text-xl mb-4 font-medium" style={{ color: theme.primary }}>
            {userData.job_title || 'Professional Title'}
          </p>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: theme.secondary }}>
            {userData.summary || 'A passionate professional dedicated to creating innovative solutions and driving meaningful impact through technology and collaboration.'}
          </p>
        </div>

        {/* Contact Bar */}
        <div className="flex justify-center flex-wrap gap-6 mt-6 pt-6" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <div className="flex items-center gap-2" style={{ color: theme.secondary }}>
            <Mail className="h-4 w-4" style={{ color: theme.primary }} />
            <span className="text-sm">{userData.email || 'your.email@example.com'}</span>
          </div>
          {userData.phone && (
            <div className="flex items-center gap-2" style={{ color: theme.secondary }}>
              <Phone className="h-4 w-4" style={{ color: theme.primary }} />
              <span className="text-sm">{userData.phone}</span>
            </div>
          )}
          {userData.address && (
            <div className="flex items-center gap-2" style={{ color: theme.secondary }}>
              <MapPin className="h-4 w-4" style={{ color: theme.primary }} />
              <span className="text-sm">{userData.address}</span>
            </div>
          )}
          {userData.linkedin_url && (
            <div className="flex items-center gap-2" style={{ color: theme.secondary }}>
              <Linkedin className="h-4 w-4" style={{ color: theme.primary }} />
              <span className="text-sm">LinkedIn</span>
            </div>
          )}
          {userData.portfolio_url && (
            <div className="flex items-center gap-2" style={{ color: theme.secondary }}>
              <Globe className="h-4 w-4" style={{ color: theme.primary }} />
              <span className="text-sm">Portfolio</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Skills Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 relative" style={{ color: theme.text }}>
            Skills & Expertise
            <div
              className="absolute bottom-0 left-0 w-12 h-1 rounded"
              style={{ backgroundColor: theme.primary }}
            ></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData.skills?.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: `${theme.primary}10` }}
              >
                <span className="font-medium text-sm" style={{ color: theme.text }}>
                  {skill.name}
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= skill.rating
                          ? 'fill-current'
                          : 'stroke-current fill-transparent'
                      }`}
                      style={{ 
                        color: star <= skill.rating ? theme.primary : theme.secondary 
                      }}
                    />
                  ))}
                </div>
              </div>
            )) || (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${theme.primary}10` }}>
                    <span className="font-medium text-sm" style={{ color: theme.text }}>React</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= 5 ? 'fill-current' : 'stroke-current fill-transparent'}`} style={{ color: star <= 5 ? theme.primary : theme.secondary }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${theme.primary}10` }}>
                    <span className="font-medium text-sm" style={{ color: theme.text }}>TypeScript</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'fill-current' : 'stroke-current fill-transparent'}`} style={{ color: star <= 4 ? theme.primary : theme.secondary }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${theme.primary}10` }}>
                    <span className="font-medium text-sm" style={{ color: theme.text }}>Node.js</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'fill-current' : 'stroke-current fill-transparent'}`} style={{ color: star <= 4 ? theme.primary : theme.secondary }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `${theme.primary}10` }}>
                    <span className="font-medium text-sm" style={{ color: theme.text }}>Python</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= 3 ? 'fill-current' : 'stroke-current fill-transparent'}`} style={{ color: star <= 3 ? theme.primary : theme.secondary }} />
                      ))}
                    </div>
                  </div>
                </>
              )}
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 relative" style={{ color: theme.text }}>
            Professional Experience
            <div
              className="absolute bottom-0 left-0 w-12 h-1 rounded"
              style={{ backgroundColor: theme.primary }}
            ></div>
          </h2>
          <div className="space-y-8">
            {userData.experience?.map((exp, index) => (
              <div key={index} className="relative pl-8" style={{ borderLeft: '2px solid rgba(0,0,0,0.1)' }}>
                <div
                  className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: theme.text }}>{exp.title}</h3>
                      <p className="font-medium" style={{ color: theme.primary }}>{exp.company}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm" style={{ color: theme.secondary }}>
                      <Calendar className="h-4 w-4" />
                      <span>{exp.duration}</span>
                    </div>
                  </div>
                  <p className="leading-relaxed" style={{ color: theme.text }}>{exp.description}</p>
                </div>
              </div>
            )) || (
                <div className="relative pl-8" style={{ borderLeft: '2px solid rgba(0,0,0,0.1)' }}>
                  <div
                    className="absolute -left-2 top-0 w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                  <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Senior Software Engineer</h3>
                        <p className="font-medium" style={{ color: theme.primary }}>Tech Innovation Inc.</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm" style={{ color: theme.secondary }}>
                        <Calendar className="h-4 w-4" />
                        <span>2022 - Present</span>
                      </div>
                    </div>
                    <p className="leading-relaxed" style={{ color: theme.text }}>
                      Led development of scalable web applications serving 100K+ users. Implemented modern React architecture and improved application performance by 40%.
                    </p>
                  </div>
                </div>
              )}
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 relative" style={{ color: theme.text }}>
            Education
            <div
              className="absolute bottom-0 left-0 w-12 h-1 rounded"
              style={{ backgroundColor: theme.primary }}
            ></div>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {userData.education?.map((edu, index) => (
              <div key={index} className="rounded-lg p-6" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>{edu.degree}</h3>
                <p className="font-medium mb-1" style={{ color: theme.primary }}>{edu.institution}</p>
                <p className="text-sm" style={{ color: theme.secondary }}>{edu.year}</p>
              </div>
            )) || (
                <>
                  <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Bachelor of Computer Science</h3>
                    <p className="font-medium mb-1" style={{ color: theme.primary }}>University of Technology</p>
                    <p className="text-sm" style={{ color: theme.secondary }}>2020</p>
                  </div>
                  <div className="rounded-lg p-6" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>AWS Certified Solutions Architect</h3>
                    <p className="font-medium mb-1" style={{ color: theme.primary }}>Amazon Web Services</p>
                    <p className="text-sm" style={{ color: theme.secondary }}>2023</p>
                  </div>
                </>
              )}
          </div>
        </section>
      </div>
    </div>
  );
}
