"use client";

import { Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase, GraduationCap, Award, User } from 'lucide-react'

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
    social_links?: Array<{
        label: string;
        url: string;
        username?: string;
    }>;
    image_url?: string;
}

interface ClassicTraditionalProps {
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

export default function ClassicTraditional({ userData, colors, size = 'normal', mode = 'default' }: ClassicTraditionalProps) {
    const theme = colors || {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#3498db',
        text: '#2c3e50',
        background: '#ffffff'
    };

    const isSmall = size === 'small';

    // Classic professional styling with improved spacing
    const styles = {
        container: {
            fontSize: isSmall ? '7px' : '12px',
            lineHeight: isSmall ? 1.5 : 1.7,
            fontFamily: "'Times New Roman', Times, serif"
        },
        name: {
            fontSize: isSmall ? '18px' : '32px',
            fontWeight: '700',
            letterSpacing: '1px'
        },
        jobTitle: {
            fontSize: isSmall ? '9px' : '15px',
            fontWeight: '400',
            letterSpacing: '0.5px'
        },
        sectionTitle: {
            fontSize: isSmall ? '8px' : '14px',
            fontWeight: '700',
            textTransform: 'uppercase' as const,
            letterSpacing: '1px'
        },
        text: {
            fontSize: isSmall ? '7px' : '11px',
            lineHeight: isSmall ? 1.6 : 1.7
        },
        spacing: {
            section: isSmall ? '16px' : '32px',
            item: isSmall ? '8px' : '16px',
            micro: isSmall ? '4px' : '8px'
        },
        padding: {
            container: isSmall ? '16px' : '32px'
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
                padding: styles.padding.container
            }}
        >
            {/* Classic header */}
            <div
                style={{
                    textAlign: 'center',
                    borderBottom: `3px solid ${theme.primary}`,
                    paddingBottom: styles.spacing.section,
                    marginBottom: styles.spacing.section
                }}
            >
                <h1
                    style={{
                        fontSize: styles.name.fontSize,
                        fontWeight: styles.name.fontWeight,
                        letterSpacing: styles.name.letterSpacing,
                        color: theme.primary,
                        marginBottom: styles.spacing.item
                    }}
                >
                    {userData.name || "Professional Name"}
                </h1>

                {hasContent(userData.job_title) && (
                    <p
                        style={{
                            fontSize: styles.jobTitle.fontSize,
                            fontWeight: styles.jobTitle.fontWeight,
                            letterSpacing: styles.jobTitle.letterSpacing,
                            color: theme.secondary,
                            marginBottom: styles.spacing.item
                        }}
                    >
                        {userData.job_title}
                    </p>
                )}

                {/* Contact line */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: isSmall ? '12px' : '20px',
                        fontSize: styles.text.fontSize,
                        color: theme.text
                    }}
                >
                    {hasContent(userData.email) && (
                        <span>{userData.email}</span>
                    )}
                    {hasContent(userData.phone) && (
                        <span>{userData.phone}</span>
                    )}
                    {hasContent(userData.address) && (
                        <span>{userData.address}</span>
                    )}
                </div>
            </div>

            {/* Professional summary */}
            {hasContent(userData.summary) && (
                <div style={{ marginBottom: styles.spacing.section }}>
                    <h2
                        style={{
                            fontSize: styles.sectionTitle.fontSize,
                            fontWeight: styles.sectionTitle.fontWeight,
                            color: theme.primary,
                            letterSpacing: styles.sectionTitle.letterSpacing,
                            marginBottom: styles.spacing.item,
                            borderBottom: `1px solid ${theme.primary}30`,
                            paddingBottom: '4px'
                        }}
                    >
                        Professional Summary
                    </h2>
                    <p
                        style={{
                            fontSize: styles.text.fontSize,
                            lineHeight: styles.text.lineHeight,
                            textAlign: 'justify'
                        }}
                    >
                        {userData.summary}
                    </p>
                </div>
            )}

            {/* Professional experience */}
            {hasContent(userData.experience) && (
                <div style={{ marginBottom: styles.spacing.section }}>
                    <h2
                        style={{
                            fontSize: styles.sectionTitle.fontSize,
                            fontWeight: styles.sectionTitle.fontWeight,
                            color: theme.primary,
                            letterSpacing: styles.sectionTitle.letterSpacing,
                            marginBottom: styles.spacing.item,
                            borderBottom: `1px solid ${theme.primary}30`,
                            paddingBottom: '4px'
                        }}
                    >
                        Professional Experience
                    </h2>
                    {(userData.experience || []).map((exp, i) => (
                        <div key={i} style={{ marginBottom: styles.spacing.item }}>
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h3
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '700',
                                            color: theme.text
                                        }}
                                    >
                                        {exp.title || exp.jobTitle || 'Position'}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            color: theme.secondary,
                                            fontWeight: '600'
                                        }}
                                    >
                                        {exp.company || exp.employer || 'Company'}
                                    </p>
                                </div>
                                <span
                                    style={{
                                        fontSize: styles.text.fontSize,
                                        color: theme.primary,
                                        fontWeight: '600'
                                    }}
                                >
                                    {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'present'}`}
                                </span>
                            </div>
                            {exp.description && (
                                <p
                                    style={{
                                        fontSize: styles.text.fontSize,
                                        lineHeight: styles.text.lineHeight,
                                        marginLeft: '12px',
                                        textAlign: 'justify'
                                    }}
                                >
                                    {isSmall && exp.description.length > 150
                                        ? exp.description.substring(0, 150) + '...'
                                        : exp.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Two-column layout for remaining sections */}
            <div className="flex gap-6">
                {/* Left column */}
                <div className="flex-1">
                    {/* Education */}
                    {hasContent(userData.education) && (
                        <div style={{ marginBottom: styles.spacing.section }}>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    marginBottom: styles.spacing.item,
                                    borderBottom: `1px solid ${theme.primary}30`,
                                    paddingBottom: '4px'
                                }}
                            >
                                Education
                            </h2>
                            {(userData.education || []).map((edu, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}>
                                    <h3
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '700',
                                            color: theme.text
                                        }}
                                    >
                                        {edu.degree || 'Degree'}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            color: theme.secondary
                                        }}
                                    >
                                        {edu.institution || edu.school || 'Institution'}
                                        {edu.year && ` • ${edu.year}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skills */}
                    {hasContent(userData.skills) && (
                        <div style={{ marginBottom: styles.spacing.section }}>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    marginBottom: styles.spacing.item,
                                    borderBottom: `1px solid ${theme.primary}30`,
                                    paddingBottom: '4px'
                                }}
                            >
                                Core Competencies
                            </h2>
                            <div style={{ columns: isSmall ? 1 : 2, columnGap: '16px' }}>
                                {(userData.skills || []).map((skill, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            breakInside: 'avoid',
                                            marginBottom: '4px',
                                            fontSize: styles.text.fontSize
                                        }}
                                    >
                                        • {skill.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div style={{ flex: '0 0 40%' }}>
                    {/* Certifications */}
                    {hasContent(userData.certifications) && (
                        <div style={{ marginBottom: styles.spacing.section }}>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    marginBottom: styles.spacing.item,
                                    borderBottom: `1px solid ${theme.primary}30`,
                                    paddingBottom: '4px'
                                }}
                            >
                                Certifications
                            </h2>
                            {(userData.certifications || []).map((cert, i) => (
                                <div key={i} style={{ marginBottom: '6px' }}>
                                    <h3
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '700',
                                            color: theme.text
                                        }}
                                    >
                                        {cert.name || cert.title || 'Certification'}
                                    </h3>
                                    {(cert.issuer || cert.year) && (
                                        <p
                                            style={{
                                                fontSize: styles.text.fontSize,
                                                color: theme.secondary
                                            }}
                                        >
                                            {cert.issuer && cert.year ? `${cert.issuer}, ${cert.year}` : cert.issuer || cert.year}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Languages */}
                    {hasContent(userData.languages) && (
                        <div style={{ marginBottom: styles.spacing.section }}>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    marginBottom: styles.spacing.item,
                                    borderBottom: `1px solid ${theme.primary}30`,
                                    paddingBottom: '4px'
                                }}
                            >
                                Languages
                            </h2>
                            {(userData.languages || []).map((lang, i) => (
                                <div
                                    key={i}
                                    style={{
                                        marginBottom: '3px',
                                        fontSize: styles.text.fontSize
                                    }}
                                >
                                    {typeof lang === 'string' ? lang : lang.name || 'Language'}
                                    {typeof lang === 'object' && lang.level && (
                                        <span style={{ color: theme.secondary, marginLeft: '6px' }}>
                                            ({lang.level})
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects */}
                    {hasContent(userData.projects) && (
                        <div>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    marginBottom: styles.spacing.item,
                                    borderBottom: `1px solid ${theme.primary}30`,
                                    paddingBottom: '4px'
                                }}
                            >
                                Key Projects
                            </h2>
                            {(userData.projects || []).slice(0, isSmall ? 2 : 3).map((project, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}>
                                    <h3
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '700',
                                            color: theme.text
                                        }}
                                    >
                                        {project.name || 'Project'}
                                    </h3>
                                    {project.description && (
                                        <p
                                            style={{
                                                fontSize: styles.text.fontSize,
                                                lineHeight: styles.text.lineHeight,
                                                textAlign: 'justify'
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
                    )}
                </div>
            </div>
        </div>
    );
}
