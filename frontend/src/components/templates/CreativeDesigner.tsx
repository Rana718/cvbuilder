"use client";

import { Mail, Phone, MapPin, Palette, Award, Briefcase, GraduationCap, Star } from "lucide-react";

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
}

export default function CreativeDesigner({ userData, colors }: CreativeDesignerProps) {
  const theme = colors || {
    primary: '#7c3aed',
    secondary: '#a855f7',
    accent: '#ec4899',
    text: '#374151',
    background: '#fafafa'
  };

  return (
    <div
      className="max-w-5xl mx-auto shadow-2xl overflow-hidden"
      style={{
        fontFamily: 'Open Sans, sans-serif',
        background: `linear-gradient(to bottom right, ${theme.primary}10, ${theme.accent}10)`
      }}
    >
      {/* Creative Header */}
      <div
        className="relative text-white overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary}, ${theme.accent})`
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-32 translate-x-32"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-24 -translate-x-24"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        ></div>

        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1
                className="text-5xl font-bold mb-3"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {userData.name || 'Your Name'}
              </h1>
              <p className="text-2xl mb-4 font-light" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {userData.job_title || 'Creative Designer'}
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
                <span style={{ color: 'rgba(255,255,255,0.9)' }}>Creating Beautiful Experiences</span>
              </div>
            </div>

            <div
              className="w-40 h-40 rounded-full flex items-center justify-center shadow-2xl"
              style={{
                background: `linear-gradient(to bottom right, ${theme.accent}, ${theme.primary})`
              }}
            >
              <span className="text-4xl font-bold">
                {userData.name?.split(' ').map(n => n[0]).join('') || 'YN'}
              </span>
            </div>
          </div>

          {/* Contact Info with Creative Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div
              className="rounded-lg p-3 text-center backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Mail className="h-5 w-5 mx-auto mb-1" style={{ color: 'rgba(255,255,255,0.8)' }} />
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {userData.email || 'email@example.com'}
              </p>
            </div>
            {userData.phone && (
              <div
                className="rounded-lg p-3 text-center backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Phone className="h-5 w-5 mx-auto mb-1" style={{ color: 'rgba(255,255,255,0.8)' }} />
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.9)' }}>{userData.phone}</p>
              </div>
            )}
            {userData.address && (
              <div
                className="rounded-lg p-3 text-center backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <MapPin className="h-5 w-5 mx-auto mb-1" style={{ color: 'rgba(255,255,255,0.8)' }} />
                <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{userData.address}</p>
              </div>
            )}
            {userData.portfolio_url && (
              <div
                className="rounded-lg p-3 text-center backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Award className="h-5 w-5 mx-auto mb-1" style={{ color: 'rgba(255,255,255,0.8)' }} />
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.9)' }}>Portfolio</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 p-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Creative Summary */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                }}
              >
                <Palette className="h-4 w-4 text-white" />
              </div>
              <h2
                className="text-2xl font-bold"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: theme.text
                }}
              >
                Creative Vision
              </h2>
            </div>
            <div
              className="rounded-xl p-6 shadow-lg"
              style={{
                backgroundColor: theme.background,
                borderLeft: `4px solid ${theme.primary}`
              }}
            >
              <p className="leading-relaxed" style={{ color: theme.text }}>
                {userData.summary || 'A passionate creative designer with a keen eye for aesthetics and user experience. I transform ideas into visually compelling designs that tell stories and create emotional connections with audiences.'}
              </p>
            </div>
          </section>

          {/* Experience with Creative Layout */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                }}
              >
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <h2
                className="text-2xl font-bold"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: theme.text
                }}
              >
                Creative Journey
              </h2>
            </div>

            <div className="space-y-6">
              {userData.experience?.map((exp, index) => (
                <div key={index} className="relative">
                  <div
                    className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                    style={{
                      backgroundColor: theme.background,
                      borderLeft: `4px solid ${theme.primary}`
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold" style={{ color: theme.text }}>{exp.title}</h3>
                        <p className="font-medium text-lg" style={{ color: theme.primary }}>{exp.company}</p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          background: `linear-gradient(to right, ${theme.primary}20, ${theme.accent}20)`,
                          color: theme.primary
                        }}
                      >
                        {exp.duration}
                      </span>
                    </div>
                    <p className="leading-relaxed" style={{ color: theme.text }}>{exp.description}</p>
                  </div>
                </div>
              )) || (
                  <div
                    className="rounded-xl p-6 shadow-lg"
                    style={{
                      backgroundColor: theme.background,
                      borderLeft: `4px solid ${theme.primary}`
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold" style={{ color: theme.text }}>Senior UI/UX Designer</h3>
                        <p className="font-medium text-lg" style={{ color: theme.primary }}>Creative Studio Inc.</p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          background: `linear-gradient(to right, ${theme.primary}20, ${theme.accent}20)`,
                          color: theme.primary
                        }}
                      >
                        2022 - Present
                      </span>
                    </div>
                    <p className="leading-relaxed" style={{ color: theme.text }}>
                      Led design initiatives for mobile and web applications, creating user-centered designs that increased engagement by 60% and improved user satisfaction scores.
                    </p>
                  </div>
                )}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Skills with Creative Bars */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-6 h-6 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                }}
              ></div>
              <h3
                className="text-lg font-bold"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: theme.text
                }}
              >
                Design Skills
              </h3>
            </div>
            <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: theme.background }}>
              <div className="space-y-4">
                {userData.skills?.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium" style={{ color: theme.text }}>
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
                              color: star <= skill.rating ? theme.primary : 'rgba(0,0,0,0.3)' 
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )) || (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium" style={{ color: theme.text }}>Adobe Creative Suite</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-4 h-4 ${star <= 5 ? 'fill-current' : 'stroke-current fill-transparent'}`} style={{ color: star <= 5 ? theme.primary : 'rgba(0,0,0,0.3)' }} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium" style={{ color: theme.text }}>Figma</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'fill-current' : 'stroke-current fill-transparent'}`} style={{ color: star <= 4 ? theme.primary : 'rgba(0,0,0,0.3)' }} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium" style={{ color: theme.text }}>UI/UX Design</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'fill-current' : 'stroke-current fill-transparent'}`} style={{ color: star <= 4 ? theme.primary : 'rgba(0,0,0,0.3)' }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </section>

          {/* Education */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                }}
              >
                <GraduationCap className="h-3 w-3 text-white" />
              </div>
              <h3
                className="text-lg font-bold"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: theme.text
                }}
              >
                Education
              </h3>
            </div>
            <div className="space-y-4">
              {userData.education?.map((edu, index) => (
                <div key={index} className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: theme.background }}>
                  <h4 className="font-semibold" style={{ color: theme.text }}>{edu.degree}</h4>
                  <p className="text-sm" style={{ color: theme.primary }}>{edu.institution}</p>
                  <p className="text-xs" style={{ color: theme.secondary }}>{edu.year}</p>
                </div>
              )) || (
                  <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: theme.background }}>
                    <h4 className="font-semibold" style={{ color: theme.text }}>Bachelor of Fine Arts</h4>
                    <p className="text-sm" style={{ color: theme.primary }}>Design Institute</p>
                    <p className="text-xs" style={{ color: theme.secondary }}>2020</p>
                  </div>
                )}
            </div>
          </section>

          {/* Awards/Recognition */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`
                }}
              >
                <Award className="h-3 w-3 text-white" />
              </div>
              <h3
                className="text-lg font-bold"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  color: theme.text
                }}
              >
                Recognition
              </h3>
            </div>
            <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: theme.background }}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                  <span className="text-sm" style={{ color: theme.text }}>Design Excellence Award 2023</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                  <span className="text-sm" style={{ color: theme.text }}>Best UI Design - Creative Awards</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                  <span className="text-sm" style={{ color: theme.text }}>Featured in Design Magazine</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
