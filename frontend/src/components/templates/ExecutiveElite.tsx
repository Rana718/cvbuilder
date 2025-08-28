"use client";

import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  job_title?: string;
  summary?: string;
  skills?: string[];
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
}

export default function ExecutiveElite({ userData, colors }: ExecutiveEliteProps) {
  const theme = colors || {
    primary: '#1a365d',
    secondary: '#2d3748',
    accent: '#3182ce',
    text: '#2d3748',
    background: '#ffffff'
  };

  return (
    <div 
      className="max-w-4xl mx-auto shadow-2xl"
      style={{ 
        fontFamily: 'Source Sans Pro, sans-serif',
        backgroundColor: theme.background,
        color: theme.text
      }}
    >
      {/* Header Section */}
      <div 
        className="text-white p-8"
        style={{ 
          background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {userData.name || 'Your Name'}
            </h1>
            <p className="text-xl mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {userData.job_title || 'Professional Title'}
            </p>
          </div>
          <div 
            className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <span className="text-3xl font-bold">
              {userData.name?.split(' ').map(n => n[0]).join('') || 'YN'}
            </span>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-wrap gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{userData.email || 'your.email@example.com'}</span>
          </div>
          {userData.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{userData.phone}</span>
            </div>
          )}
          {userData.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{userData.address}</span>
            </div>
          )}
          {userData.linkedin_url && (
            <div className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Executive Summary */}
          <section className="mb-8">
            <h2 
              className="text-2xl font-bold mb-4 pb-2"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: theme.text,
                borderBottom: `2px solid ${theme.accent}`
              }}
            >
              Executive Summary
            </h2>
            <p className="leading-relaxed" style={{ color: theme.text }}>
              {userData.summary || 'A results-driven executive with extensive experience in strategic leadership, operational excellence, and organizational transformation. Proven track record of driving growth, optimizing performance, and delivering exceptional results in competitive markets.'}
            </p>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h2 
              className="text-2xl font-bold mb-4 pb-2"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: theme.text,
                borderBottom: `2px solid ${theme.accent}`
              }}
            >
              Professional Experience
            </h2>
            <div className="space-y-6">
              {userData.experience?.map((exp, index) => (
                <div key={index} className="pl-4" style={{ borderLeft: `4px solid ${theme.accent}` }}>
                  <h3 className="text-lg font-semibold" style={{ color: theme.text }}>{exp.title}</h3>
                  <p className="font-medium" style={{ color: theme.accent }}>{exp.company}</p>
                  <p className="text-sm mb-2" style={{ color: theme.secondary }}>{exp.duration}</p>
                  <p style={{ color: theme.text }}>{exp.description}</p>
                </div>
              )) || (
                <div className="pl-4" style={{ borderLeft: `4px solid ${theme.accent}` }}>
                  <h3 className="text-lg font-semibold" style={{ color: theme.text }}>Chief Executive Officer</h3>
                  <p className="font-medium" style={{ color: theme.accent }}>Fortune 500 Company</p>
                  <p className="text-sm mb-2" style={{ color: theme.secondary }}>2020 - Present</p>
                  <p style={{ color: theme.text }}>Led organizational transformation initiatives resulting in 40% revenue growth and improved operational efficiency across all business units.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-6" style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}>
          {/* Core Competencies */}
          <section className="mb-8">
            <h3 
              className="text-lg font-bold mb-4"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: theme.text
              }}
            >
              Core Competencies
            </h3>
            <div className="space-y-2">
              {userData.skills?.map((skill, index) => (
                <div 
                  key={index} 
                  className="p-2 rounded"
                  style={{ 
                    backgroundColor: theme.background,
                    borderLeft: `4px solid ${theme.accent}`
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: theme.text }}>{skill}</span>
                </div>
              )) || (
                <>
                  <div 
                    className="p-2 rounded"
                    style={{ 
                      backgroundColor: theme.background,
                      borderLeft: `4px solid ${theme.accent}`
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: theme.text }}>Strategic Leadership</span>
                  </div>
                  <div 
                    className="p-2 rounded"
                    style={{ 
                      backgroundColor: theme.background,
                      borderLeft: `4px solid ${theme.accent}`
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: theme.text }}>P&L Management</span>
                  </div>
                  <div 
                    className="p-2 rounded"
                    style={{ 
                      backgroundColor: theme.background,
                      borderLeft: `4px solid ${theme.accent}`
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: theme.text }}>Digital Transformation</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h3 
              className="text-lg font-bold mb-4"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: theme.text
              }}
            >
              Education
            </h3>
            <div className="space-y-4">
              {userData.education?.map((edu, index) => (
                <div key={index} className="p-3 rounded shadow-sm" style={{ backgroundColor: theme.background }}>
                  <h4 className="font-semibold" style={{ color: theme.text }}>{edu.degree}</h4>
                  <p className="text-sm" style={{ color: theme.accent }}>{edu.institution}</p>
                  <p className="text-xs" style={{ color: theme.secondary }}>{edu.year}</p>
                </div>
              )) || (
                <div className="p-3 rounded shadow-sm" style={{ backgroundColor: theme.background }}>
                  <h4 className="font-semibold" style={{ color: theme.text }}>MBA</h4>
                  <p className="text-sm" style={{ color: theme.accent }}>Harvard Business School</p>
                  <p className="text-xs" style={{ color: theme.secondary }}>2015</p>
                </div>
              )}
            </div>
          </section>

          {/* Key Achievements */}
          <section>
            <h3 
              className="text-lg font-bold mb-4"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: theme.text
              }}
            >
              Key Achievements
            </h3>
            <div className="space-y-3">
              <div 
                className="p-3 rounded"
                style={{ backgroundColor: `${theme.accent}20` }}
              >
                <p className="text-sm" style={{ color: theme.text }}>40% Revenue Growth</p>
              </div>
              <div 
                className="p-3 rounded"
                style={{ backgroundColor: `${theme.accent}20` }}
              >
                <p className="text-sm" style={{ color: theme.text }}>$50M Cost Reduction</p>
              </div>
              <div 
                className="p-3 rounded"
                style={{ backgroundColor: `${theme.accent}20` }}
              >
                <p className="text-sm" style={{ color: theme.text }}>Team of 500+ Professionals</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
