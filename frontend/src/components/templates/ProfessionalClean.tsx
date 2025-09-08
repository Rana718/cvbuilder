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

interface ProfessionalCleanProps {
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

export default function ProfessionalClean({ userData, colors, size = 'normal', mode = 'default' }: ProfessionalCleanProps) {
    const theme = colors || {
        primary: '#374151',
        secondary: '#6b7280',
        accent: '#9ca3af',
        text: '#111827',
        background: '#ffffff'
    };

    const isSmall = size === 'small';

    // Professional clean styling
    const styles = {
        container: {
            fontSize: isSmall ? '6px' : '11px',
            lineHeight: isSmall ? 1.4 : 1.5,
            fontFamily: "'Calibri', 'Arial', sans-serif"
        },
        name: {
            fontSize: isSmall ? '16px' : '30px',
            fontWeight: '600',
            letterSpacing: '0.5px'
        },
        jobTitle: {
            fontSize: isSmall ? '8px' : '13px',
            fontWeight: '400'
        },
        sectionTitle: {
            fontSize: isSmall ? '7px' : '12px',
            fontWeight: '700',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px'
        },
        text: {
            fontSize: isSmall ? '6px' : '10px',
            lineHeight: isSmall ? 1.4 : 1.5
        },
        spacing: {
            section: isSmall ? '10px' : '18px',
            item: isSmall ? '5px' : '8px'
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
            {/* Clean professional header */}
            <div
                style={{
                    marginBottom: styles.spacing.section,
                    paddingBottom: styles.spacing.section,
                    borderBottom: `2px solid ${theme.accent}40`
                }}
            >
                <h1
                    style={{
                        fontSize: styles.name.fontSize,
                        fontWeight: styles.name.fontWeight,
                        letterSpacing: styles.name.letterSpacing,
                        color: theme.primary,
                        marginBottom: '4px'
                    }}
                >
                    {userData.name || "Professional Name"}
                </h1>

                {hasContent(userData.job_title) && (
                    <p
                        style={{
                            fontSize: styles.jobTitle.fontSize,
                            fontWeight: styles.jobTitle.fontWeight,
                            color: theme.secondary,
                            marginBottom: '10px'
                        }}
                    >
                        {userData.job_title}
                    </p>
                )}

                {/* Clean contact layout */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        fontSize: styles.text.fontSize,
                        color: theme.text
                    }}
                >
                    {hasContent(userData.email) && (
                        <div className="flex items-center gap-1">
                            <Mail style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
                            {userData.email}
                        </div>
                    )}
                    {hasContent(userData.phone) && (
                        <div className="flex items-center gap-1">
                            <Phone style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
                            {userData.phone}
                        </div>
                    )}
                    {hasContent(userData.address) && (
                        <div className="flex items-center gap-1">
                            <MapPin style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
                            {userData.address}
                        </div>
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
                            paddingBottom: '2px',
                            borderBottom: `1px solid ${theme.accent}50`
                        }}
                    >
                        Professional Summary
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
                            paddingBottom: '2px',
                            borderBottom: `1px solid ${theme.accent}50`
                        }}
                    >
                        Professional Experience
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
                                        fontWeight: '500',
                                        backgroundColor: `${theme.accent}20`,
                                        padding: '2px 6px',
                                        borderRadius: '3px'
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
                                        marginLeft: '8px',
                                        paddingLeft: '8px',
                                        borderLeft: `2px solid ${theme.accent}30`
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
                                    paddingBottom: '2px',
                                    borderBottom: `1px solid ${theme.accent}50`
                                }}
                            >
                                Education
                            </h2>
                            {(userData.education || []).map((edu, i) => (
                                <div key={i} style={{ marginBottom: '6px' }}>
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
                                    paddingBottom: '2px',
                                    borderBottom: `1px solid ${theme.accent}50`
                                }}
                            >
                                Core Skills
                            </h2>
                            <div className="grid grid-cols-2 gap-1">
                                {(userData.skills || []).map((skill, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            marginBottom: '3px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: '4px',
                                                height: '4px',
                                                backgroundColor: theme.secondary,
                                                borderRadius: '50%'
                                            }}
                                        />
                                        {skill.name}
                                    </div>
                                ))}
                            </div>
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
                                    paddingBottom: '2px',
                                    borderBottom: `1px solid ${theme.accent}50`
                                }}
                            >
                                Key Projects
                            </h2>
                            {(userData.projects || []).slice(0, isSmall ? 2 : 3).map((project, i) => (
                                <div key={i} style={{ marginBottom: '6px' }}>
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
                                    paddingBottom: '2px',
                                    borderBottom: `1px solid ${theme.accent}50`
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
                                    paddingBottom: '2px',
                                    borderBottom: `1px solid ${theme.accent}50`
                                }}
                            >
                                Languages
                            </h2>
                            {(userData.languages || []).map((lang, i) => (
                                <div
                                    key={i}
                                    style={{
                                        marginBottom: '3px',
                                        fontSize: styles.text.fontSize,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '4px',
                                            height: '4px',
                                            backgroundColor: theme.secondary,
                                            borderRadius: '50%'
                                        }}
                                    />
                                    {typeof lang === 'string' ? lang : lang.name || 'Language'}
                                    {typeof lang === 'object' && lang.level && (
                                        <span style={{ color: theme.secondary, marginLeft: '4px' }}>
                                            ({lang.level})
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Professional links */}
                    {(hasContent(userData.linkedin_url) || hasContent(userData.github_url) || hasContent(userData.portfolio_url)) && (
                        <div>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    marginBottom: styles.spacing.item,
                                    paddingBottom: '2px',
                                    borderBottom: `1px solid ${theme.accent}50`
                                }}
                            >
                                Professional Links
                            </h2>
                            <div style={{ fontSize: styles.text.fontSize }}>
                                {hasContent(userData.linkedin_url) && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <Linkedin style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
                                        <span>LinkedIn Profile</span>
                                    </div>
                                )}
                                {hasContent(userData.github_url) && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <Github style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
                                        <span>GitHub Profile</span>
                                    </div>
                                )}
                                {hasContent(userData.portfolio_url) && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe style={{ width: isSmall ? '8px' : '12px', height: isSmall ? '8px' : '12px', color: theme.secondary }} />
                                        <span>Portfolio Website</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
