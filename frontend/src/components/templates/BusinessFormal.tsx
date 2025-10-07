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

interface BusinessFormalProps {
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

export default function BusinessFormal({ userData, colors, size = 'normal', mode = 'default' }: BusinessFormalProps) {
    const theme = colors || {
        primary: '#1a202c',
        secondary: '#2d3748',
        accent: '#4a5568',
        text: '#1a202c',
        background: '#ffffff'
    };

    const isSmall = size === 'small';

    // Business formal styling with enhanced spacing
    const styles = {
        container: {
            fontSize: isSmall ? '7px' : '12px',
            lineHeight: isSmall ? 1.6 : 1.7,
            fontFamily: "'Georgia', 'Times New Roman', serif"
        },
        name: {
            fontSize: isSmall ? '18px' : '34px',
            fontWeight: '700',
            letterSpacing: '1.2px'
        },
        jobTitle: {
            fontSize: isSmall ? '9px' : '16px',
            fontWeight: '400',
            fontStyle: 'italic',
            letterSpacing: '0.3px'
        },
        sectionTitle: {
            fontSize: isSmall ? '8px' : '14px',
            fontWeight: '700',
            letterSpacing: '1.2px',
            textTransform: 'uppercase' as const
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
            {/* Formal header with lines */}
            <div
                style={{
                    textAlign: 'center',
                    marginBottom: styles.spacing.section,
                    position: 'relative'
                }}
            >
                {/* Top line */}
                <div
                    style={{
                        width: '100%',
                        height: '3px',
                        backgroundColor: theme.primary,
                        marginBottom: '16px'
                    }}
                />

                <h1
                    style={{
                        fontSize: styles.name.fontSize,
                        fontWeight: styles.name.fontWeight,
                        letterSpacing: styles.name.letterSpacing,
                        color: theme.primary,
                        marginBottom: '6px'
                    }}
                >
                    {userData.name || "PROFESSIONAL NAME"}
                </h1>

                {hasContent(userData.job_title) && (
                    <p
                        style={{
                            fontSize: styles.jobTitle.fontSize,
                            fontWeight: styles.jobTitle.fontWeight,
                            fontStyle: styles.jobTitle.fontStyle,
                            color: theme.secondary,
                            marginBottom: '12px'
                        }}
                    >
                        {userData.job_title}
                    </p>
                )}

                {/* Contact information in formal layout */}
                <div
                    style={{
                        fontSize: styles.text.fontSize,
                        color: theme.text,
                        marginBottom: '16px'
                    }}
                >
                    <div style={{ marginBottom: '3px' }}>
                        {hasContent(userData.address) && userData.address}
                    </div>
                    <div>
                        {hasContent(userData.phone) && (
                            <span>{userData.phone}</span>
                        )}
                        {hasContent(userData.phone) && hasContent(userData.email) && (
                            <span style={{ margin: '0 8px' }}>•</span>
                        )}
                        {hasContent(userData.email) && (
                            <span>{userData.email}</span>
                        )}
                    </div>
                </div>

                {/* Bottom line */}
                <div
                    style={{
                        width: '100%',
                        height: '1px',
                        backgroundColor: theme.accent,
                        marginTop: '16px'
                    }}
                />
            </div>

            {/* Professional objective */}
            {hasContent(userData.summary) && (
                <div style={{ marginBottom: styles.spacing.section }}>
                    <h2
                        style={{
                            fontSize: styles.sectionTitle.fontSize,
                            fontWeight: styles.sectionTitle.fontWeight,
                            color: theme.primary,
                            letterSpacing: styles.sectionTitle.letterSpacing,
                            textAlign: 'center',
                            marginBottom: styles.spacing.item
                        }}
                    >
                        PROFESSIONAL OBJECTIVE
                    </h2>
                    <div
                        style={{
                            width: '60px',
                            height: '1px',
                            backgroundColor: theme.accent,
                            margin: '0 auto 12px'
                        }}
                    />
                    <p
                        style={{
                            fontSize: styles.text.fontSize,
                            lineHeight: styles.text.lineHeight,
                            textAlign: 'justify',
                            textIndent: '2em'
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
                            textAlign: 'center',
                            marginBottom: styles.spacing.item
                        }}
                    >
                        PROFESSIONAL EXPERIENCE
                    </h2>
                    <div
                        style={{
                            width: '60px',
                            height: '1px',
                            backgroundColor: theme.accent,
                            margin: '0 auto 16px'
                        }}
                    />
                    {(userData.experience || []).map((exp, i) => (
                        <div key={i} style={{ marginBottom: styles.spacing.item }}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '700',
                                            color: theme.text,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {exp.title || exp.jobTitle || 'Position'}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            color: theme.secondary,
                                            fontWeight: '600',
                                            fontStyle: 'italic'
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
                                        textAlign: 'justify',
                                        marginLeft: '16px'
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
            <div className="flex gap-8">
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
                                    textAlign: 'center',
                                    marginBottom: styles.spacing.item
                                }}
                            >
                                EDUCATION
                            </h2>
                            <div
                                style={{
                                    width: '40px',
                                    height: '1px',
                                    backgroundColor: theme.accent,
                                    margin: '0 auto 12px'
                                }}
                            />
                            {(userData.education || []).map((edu, i) => (
                                <div key={i} style={{ marginBottom: '8px', textAlign: 'center' }}>
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
                                            color: theme.secondary,
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        {edu.institution || edu.school || 'Institution'}
                                    </p>
                                    {edu.year && (
                                        <p
                                            style={{
                                                fontSize: styles.text.fontSize,
                                                color: theme.accent
                                            }}
                                        >
                                            {edu.year}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Core competencies */}
                    {hasContent(userData.skills) && (
                        <div>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    textAlign: 'center',
                                    marginBottom: styles.spacing.item
                                }}
                            >
                                CORE COMPETENCIES
                            </h2>
                            <div
                                style={{
                                    width: '40px',
                                    height: '1px',
                                    backgroundColor: theme.accent,
                                    margin: '0 auto 12px'
                                }}
                            />
                            <div style={{ columns: isSmall ? 1 : 2, columnGap: '16px' }}>
                                {(userData.skills || []).map((skill, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            breakInside: 'avoid',
                                            marginBottom: '4px',
                                            fontSize: styles.text.fontSize,
                                            textAlign: 'center'
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
                <div style={{ flex: '0 0 45%' }}>
                    {/* Professional certifications */}
                    {hasContent(userData.certifications) && (
                        <div style={{ marginBottom: styles.spacing.section }}>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    textAlign: 'center',
                                    marginBottom: styles.spacing.item
                                }}
                            >
                                CERTIFICATIONS
                            </h2>
                            <div
                                style={{
                                    width: '40px',
                                    height: '1px',
                                    backgroundColor: theme.accent,
                                    margin: '0 auto 12px'
                                }}
                            />
                            {(userData.certifications || []).map((cert, i) => (
                                <div key={i} style={{ marginBottom: '6px', textAlign: 'center' }}>
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
                                                color: theme.secondary,
                                                fontStyle: 'italic'
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
                                    textAlign: 'center',
                                    marginBottom: styles.spacing.item
                                }}
                            >
                                LANGUAGES
                            </h2>
                            <div
                                style={{
                                    width: '40px',
                                    height: '1px',
                                    backgroundColor: theme.accent,
                                    margin: '0 auto 12px'
                                }}
                            />
                            {(userData.languages || []).map((lang, i) => (
                                <div
                                    key={i}
                                    style={{
                                        marginBottom: '3px',
                                        fontSize: styles.text.fontSize,
                                        textAlign: 'center'
                                    }}
                                >
                                    {typeof lang === 'string' ? lang : lang.name || 'Language'}
                                    {typeof lang === 'object' && lang.level && (
                                        <span style={{ color: theme.secondary, marginLeft: '6px', fontStyle: 'italic' }}>
                                            ({lang.level})
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Notable projects */}
                    {hasContent(userData.projects) && (
                        <div>
                            <h2
                                style={{
                                    fontSize: styles.sectionTitle.fontSize,
                                    fontWeight: styles.sectionTitle.fontWeight,
                                    color: theme.primary,
                                    letterSpacing: styles.sectionTitle.letterSpacing,
                                    textAlign: 'center',
                                    marginBottom: styles.spacing.item
                                }}
                            >
                                NOTABLE PROJECTS
                            </h2>
                            <div
                                style={{
                                    width: '40px',
                                    height: '1px',
                                    backgroundColor: theme.accent,
                                    margin: '0 auto 12px'
                                }}
                            />
                            {(userData.projects || []).slice(0, isSmall ? 2 : 3).map((project, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}>
                                    <h3
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '700',
                                            color: theme.text,
                                            textAlign: 'center'
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
