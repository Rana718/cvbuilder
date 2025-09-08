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
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
    image_url?: string;
}

interface CleanSimpleProps {
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

export default function CleanSimple({ userData, colors, size = 'normal', mode = 'default' }: CleanSimpleProps) {
    const theme = colors || {
        primary: '#4a5568',
        secondary: '#718096',
        accent: '#2d3748',
        text: '#2d3748',
        background: '#ffffff'
    };

    const isSmall = size === 'small';

    // Clean simple styling
    const styles = {
        container: {
            fontSize: isSmall ? '6px' : '11px',
            lineHeight: isSmall ? 1.4 : 1.5,
            fontFamily: "'Arial', sans-serif"
        },
        name: {
            fontSize: isSmall ? '18px' : '32px',
            fontWeight: '600',
            letterSpacing: '0.5px'
        },
        jobTitle: {
            fontSize: isSmall ? '8px' : '14px',
            fontWeight: '400'
        },
        sectionTitle: {
            fontSize: isSmall ? '8px' : '13px',
            fontWeight: '700',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px'
        },
        text: {
            fontSize: isSmall ? '6px' : '10px',
            lineHeight: isSmall ? 1.4 : 1.5
        },
        spacing: {
            section: isSmall ? '10px' : '20px',
            item: isSmall ? '5px' : '10px'
        },
        padding: {
            container: isSmall ? '10px' : '20px'
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
            {/* Clean header */}
            <div style={{ marginBottom: styles.spacing.section }}>
                <h1
                    style={{
                        fontSize: styles.name.fontSize,
                        fontWeight: styles.name.fontWeight,
                        letterSpacing: styles.name.letterSpacing,
                        color: theme.primary,
                        marginBottom: '6px'
                    }}
                >
                    {userData.name || "Your Name"}
                </h1>

                {hasContent(userData.job_title) && (
                    <p
                        style={{
                            fontSize: styles.jobTitle.fontSize,
                            fontWeight: styles.jobTitle.fontWeight,
                            color: theme.secondary,
                            marginBottom: '12px'
                        }}
                    >
                        {userData.job_title}
                    </p>
                )}

                {/* Simple contact row */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        fontSize: styles.text.fontSize,
                        color: theme.text,
                        borderTop: `1px solid ${theme.accent}20`,
                        paddingTop: '8px'
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

            {/* Summary */}
            {hasContent(userData.summary) && (
                <div style={{ marginBottom: styles.spacing.section }}>
                    <h2
                        style={{
                            fontSize: styles.sectionTitle.fontSize,
                            fontWeight: styles.sectionTitle.fontWeight,
                            color: theme.primary,
                            letterSpacing: styles.sectionTitle.letterSpacing,
                            marginBottom: styles.spacing.item
                        }}
                    >
                        Summary
                    </h2>
                    <p
                        style={{
                            fontSize: styles.text.fontSize,
                            lineHeight: styles.text.lineHeight
                        }}
                    >
                        {userData.summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {hasContent(userData.experience) && (
                <div style={{ marginBottom: styles.spacing.section }}>
                    <h2
                        style={{
                            fontSize: styles.sectionTitle.fontSize,
                            fontWeight: styles.sectionTitle.fontWeight,
                            color: theme.primary,
                            letterSpacing: styles.sectionTitle.letterSpacing,
                            marginBottom: styles.spacing.item
                        }}
                    >
                        Experience
                    </h2>
                    {(userData.experience || []).slice(0, isSmall ? 3 : 5).map((exp, i) => (
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
                                        {exp.title || exp.jobTitle || 'Position'} • {exp.company || exp.employer || 'Company'}
                                    </h3>
                                </div>
                                <span
                                    style={{
                                        fontSize: styles.text.fontSize,
                                        color: theme.secondary,
                                        fontWeight: '500'
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
                                        marginLeft: '8px'
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

            {/* Two-column layout */}
            <div className="flex gap-5">
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
                                    marginBottom: styles.spacing.item
                                }}
                            >
                                Education
                            </h2>
                            {(userData.education || []).map((edu, i) => (
                                <div key={i} style={{ marginBottom: '6px' }}>
                                    <p
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '700',
                                            color: theme.text
                                        }}
                                    >
                                        {edu.degree || 'Degree'} • {edu.institution || edu.school || 'Institution'}
                                    </p>
                                    {edu.year && (
                                        <p
                                            style={{
                                                fontSize: styles.text.fontSize,
                                                color: theme.secondary,
                                                marginLeft: '8px'
                                            }}
                                        >
                                            {edu.year}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skills */}
                    {hasContent(userData.skills) && (
                        <div>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    marginBottom: styles.spacing.item
                                }}
                            >
                                Skills
                            </h2>
                            <div
                                style={{
                                    fontSize: styles.text.fontSize,
                                    lineHeight: '1.8'
                                }}
                            >
                                {(userData.skills || []).map((skill, i) => (
                                    <span key={i}>
                                        {skill.name}
                                        {i < (userData.skills || []).length - 1 && ' • '}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div style={{ flex: '0 0 45%' }}>
                    {/* Projects */}
                    {hasContent(userData.projects) && (
                        <div style={{ marginBottom: styles.spacing.section }}>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    marginBottom: styles.spacing.item
                                }}
                            >
                                Projects
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
                                                marginLeft: '8px'
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

                    {/* Languages */}
                    {hasContent(userData.languages) && (
                        <div style={{ marginBottom: styles.spacing.section }}>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    marginBottom: styles.spacing.item
                                }}
                            >
                                Languages
                            </h2>
                            <div
                                style={{
                                    fontSize: styles.text.fontSize,
                                    lineHeight: '1.8'
                                }}
                            >
                                {(userData.languages || []).map((lang, i) => (
                                    <span key={i}>
                                        {typeof lang === 'string' ? lang : lang.name || 'Language'}
                                        {i < (userData.languages || []).length - 1 && ' • '}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Certifications */}
                    {hasContent(userData.certifications) && (
                        <div>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    marginBottom: styles.spacing.item
                                }}
                            >
                                Certifications
                            </h2>
                            {(userData.certifications || []).map((cert, i) => (
                                <div key={i} style={{ marginBottom: '4px' }}>
                                    <p
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '600',
                                            color: theme.text
                                        }}
                                    >
                                        {cert.name || cert.title || 'Certification'}
                                    </p>
                                    {(cert.issuer || cert.year) && (
                                        <p
                                            style={{
                                                fontSize: styles.text.fontSize,
                                                color: theme.secondary,
                                                marginLeft: '8px'
                                            }}
                                        >
                                            {cert.issuer && cert.year ? `${cert.issuer}, ${cert.year}` : cert.issuer || cert.year}
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
