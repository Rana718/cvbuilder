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

interface ClassicElegantProps {
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

export default function ClassicElegant({ userData, colors, size = 'normal', mode = 'default' }: ClassicElegantProps) {
    const theme = colors || {
        primary: '#1a365d',
        secondary: '#2c5282',
        accent: '#3182ce',
        text: '#2d3748',
        background: '#ffffff'
    };

    const isSmall = size === 'small';

    // Classic elegant styling with refined spacing
    const styles = {
        container: {
            fontSize: isSmall ? '7px' : '12px',
            lineHeight: isSmall ? 1.5 : 1.7,
            fontFamily: "'Libre Baskerville', 'Times New Roman', 'Georgia', serif"
        },
        name: {
            fontSize: isSmall ? '20px' : '38px',
            fontWeight: '400',
            letterSpacing: '2.5px'
        },
        jobTitle: {
            fontSize: isSmall ? '9px' : '15px',
            fontWeight: '300',
            letterSpacing: '1.2px'
        },
        sectionTitle: {
            fontSize: isSmall ? '8px' : '14px',
            fontWeight: '600',
            letterSpacing: '1.2px',
            textTransform: 'uppercase' as const
        },
        text: {
            fontSize: isSmall ? '7px' : '11px',
            lineHeight: isSmall ? 1.6 : 1.8
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
            {/* Elegant header with decorative elements */}
            <div
                style={{
                    textAlign: 'center',
                    marginBottom: styles.spacing.section,
                    position: 'relative'
                }}
            >
                {/* Decorative top border */}
                <div
                    style={{
                        width: '120px',
                        height: '2px',
                        backgroundColor: theme.primary,
                        margin: '0 auto 16px',
                        position: 'relative'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '8px',
                            height: '8px',
                            backgroundColor: theme.accent,
                            borderRadius: '50%'
                        }}
                    />
                </div>

                <h1
                    style={{
                        fontSize: styles.name.fontSize,
                        fontWeight: styles.name.fontWeight,
                        letterSpacing: styles.name.letterSpacing,
                        color: theme.primary,
                        marginBottom: '8px'
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
                            marginBottom: '16px',
                            textTransform: 'uppercase'
                        }}
                    >
                        {userData.job_title}
                    </p>
                )}

                {/* Elegant contact section */}
                <div
                    style={{
                        fontSize: styles.text.fontSize,
                        color: theme.text,
                        marginBottom: '16px'
                    }}
                >
                    {hasContent(userData.address) && (
                        <div style={{ marginBottom: '4px' }}>
                            {userData.address}
                        </div>
                    )}
                    <div className="flex justify-center gap-3">
                        {hasContent(userData.phone) && (
                            <span>{userData.phone}</span>
                        )}
                        {hasContent(userData.phone) && hasContent(userData.email) && (
                            <span style={{ color: theme.accent }}>◆</span>
                        )}
                        {hasContent(userData.email) && (
                            <span>{userData.email}</span>
                        )}
                    </div>
                </div>

                {/* Social Links */}
                {userData.social_links && userData.social_links.length > 0 && (
                    <div
                        style={{
                            fontSize: styles.text.fontSize,
                            color: theme.text,
                            marginBottom: '16px',
                            textAlign: 'center'
                        }}
                    >
                        <div className="flex justify-center gap-4 flex-wrap">
                            {userData.social_links.map((link, index) => {
                                const getSocialIcon = (label: string) => {
                                    const lowerLabel = label.toLowerCase();
                                    if (lowerLabel.includes('linkedin')) return Linkedin;
                                    if (lowerLabel.includes('github')) return Github;
                                    return Globe;
                                };
                                
                                const IconComponent = getSocialIcon(link.label);
                                const displayText = link.username || link.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
                                
                                return (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                                        style={{
                                            color: theme.secondary,
                                            textDecoration: 'none',
                                            fontSize: isSmall ? '10px' : '12px'
                                        }}
                                    >
                                        <IconComponent style={{ width: isSmall ? '10px' : '12px', height: isSmall ? '10px' : '12px' }} />
                                        <span>{displayText}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Decorative bottom border */}
                <div
                    style={{
                        width: '120px',
                        height: '2px',
                        backgroundColor: theme.primary,
                        margin: '16px auto 0',
                        position: 'relative'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '8px',
                            height: '8px',
                            backgroundColor: theme.accent,
                            borderRadius: '50%'
                        }}
                    />
                </div>
            </div>

            {/* Professional summary with elegant styling */}
            {hasContent(userData.summary) && (
                <div style={{ marginBottom: styles.spacing.section }}>
                    <div style={{ textAlign: 'center', marginBottom: styles.spacing.item }}>
                        <h2
                            style={{
                                fontSize: styles.sectionTitle.fontSize,
                                fontWeight: styles.sectionTitle.fontWeight,
                                color: theme.primary,
                                letterSpacing: styles.sectionTitle.letterSpacing,
                                textTransform: 'uppercase'
                            }}
                        >
                            Professional Summary
                        </h2>
                        <div
                            style={{
                                width: '50px',
                                height: '1px',
                                backgroundColor: theme.accent,
                                margin: '8px auto'
                            }}
                        />
                    </div>
                    <p
                        style={{
                            fontSize: styles.text.fontSize,
                            lineHeight: styles.text.lineHeight,
                            textAlign: 'justify',
                            fontStyle: 'italic'
                        }}
                    >
                        {userData.summary}
                    </p>
                </div>
            )}

            {/* Professional experience */}
            {hasContent(userData.experience) && (
                <div style={{ marginBottom: styles.spacing.section }}>
                    <div style={{ textAlign: 'center', marginBottom: styles.spacing.item }}>
                        <h2
                            style={{
                                fontSize: styles.sectionTitle.fontSize,
                                fontWeight: styles.sectionTitle.fontWeight,
                                color: theme.primary,
                                letterSpacing: styles.sectionTitle.letterSpacing,
                                textTransform: 'uppercase'
                            }}
                        >
                            Professional Experience
                        </h2>
                        <div
                            style={{
                                width: '50px',
                                height: '1px',
                                backgroundColor: theme.accent,
                                margin: '8px auto'
                            }}
                        />
                    </div>
                    {(userData.experience || []).map((exp, i) => (
                        <div key={i} style={{ marginBottom: styles.spacing.item }}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '700',
                                            color: theme.text,
                                            marginBottom: '2px'
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
                                <div
                                    style={{
                                        fontSize: styles.text.fontSize,
                                        color: theme.primary,
                                        fontWeight: '600',
                                        textAlign: 'right'
                                    }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: `${theme.accent}15`,
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            border: `1px solid ${theme.accent}30`
                                        }}
                                    >
                                        {exp.duration || `${exp.start_date || ''} - ${exp.end_date || 'present'}`}
                                    </div>
                                </div>
                            </div>
                            {exp.description && (
                                <p
                                    style={{
                                        fontSize: styles.text.fontSize,
                                        lineHeight: styles.text.lineHeight,
                                        textAlign: 'justify',
                                        marginLeft: '12px',
                                        paddingLeft: '12px',
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

            {/* Two-column elegant layout */}
            <div className="flex gap-8">
                {/* Left column */}
                <div className="flex-1">
                    {/* Education */}
                    {hasContent(userData.education) && (
                        <div style={{ marginBottom: styles.spacing.section }}>
                            <div style={{ textAlign: 'center', marginBottom: styles.spacing.item }}>
                                <h2
                                    style={{
                                        fontSize: styles.sectionTitle.fontSize,
                                        fontWeight: styles.sectionTitle.fontWeight,
                                        color: theme.primary,
                                        letterSpacing: styles.sectionTitle.letterSpacing,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Education
                                </h2>
                                <div
                                    style={{
                                        width: '30px',
                                        height: '1px',
                                        backgroundColor: theme.accent,
                                        margin: '6px auto'
                                    }}
                                />
                            </div>
                            {(userData.education || []).map((edu, i) => (
                                <div key={i} style={{ marginBottom: '10px' }}>
                                    <h3
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '700',
                                            color: theme.text,
                                            marginBottom: '2px'
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
                                        {edu.year && ` • ${edu.year}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Core competencies */}
                    {hasContent(userData.skills) && (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: styles.spacing.item }}>
                                <h2
                                    style={{
                                        fontSize: styles.sectionTitle.fontSize,
                                        fontWeight: styles.sectionTitle.fontWeight,
                                        color: theme.primary,
                                        letterSpacing: styles.sectionTitle.letterSpacing,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Core Competencies
                                </h2>
                                <div
                                    style={{
                                        width: '30px',
                                        height: '1px',
                                        backgroundColor: theme.accent,
                                        margin: '6px auto'
                                    }}
                                />
                            </div>
                            <div style={{ columns: isSmall ? 1 : 2, columnGap: '16px' }}>
                                {(userData.skills || []).map((skill, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            breakInside: 'avoid',
                                            marginBottom: '4px',
                                            fontSize: styles.text.fontSize,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: theme.accent,
                                                fontSize: '8px'
                                            }}
                                        >
                                            ◆
                                        </span>
                                        {skill.name}
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
                            <div style={{ textAlign: 'center', marginBottom: styles.spacing.item }}>
                                <h2
                                    style={{
                                        fontSize: styles.sectionTitle.fontSize,
                                        fontWeight: styles.sectionTitle.fontWeight,
                                        color: theme.primary,
                                        letterSpacing: styles.sectionTitle.letterSpacing,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Certifications
                                </h2>
                                <div
                                    style={{
                                        width: '30px',
                                        height: '1px',
                                        backgroundColor: theme.accent,
                                        margin: '6px auto'
                                    }}
                                />
                            </div>
                            {(userData.certifications || []).map((cert, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}>
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
                            <div style={{ textAlign: 'center', marginBottom: styles.spacing.item }}>
                                <h2
                                    style={{
                                        fontSize: styles.sectionTitle.fontSize,
                                        fontWeight: styles.sectionTitle.fontWeight,
                                        color: theme.primary,
                                        letterSpacing: styles.sectionTitle.letterSpacing,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Languages
                                </h2>
                                <div
                                    style={{
                                        width: '30px',
                                        height: '1px',
                                        backgroundColor: theme.accent,
                                        margin: '6px auto'
                                    }}
                                />
                            </div>
                            {(userData.languages || []).map((lang, i) => (
                                <div
                                    key={i}
                                    style={{
                                        marginBottom: '4px',
                                        fontSize: styles.text.fontSize,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <span
                                        style={{
                                            color: theme.accent,
                                            fontSize: '8px'
                                        }}
                                    >
                                        ◆
                                    </span>
                                    {typeof lang === 'string' ? lang : lang.name || 'Language'}
                                    {typeof lang === 'object' && lang.level && (
                                        <span style={{ color: theme.secondary, marginLeft: '4px', fontStyle: 'italic' }}>
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
                            <div style={{ textAlign: 'center', marginBottom: styles.spacing.item }}>
                                <h2
                                    style={{
                                        fontSize: styles.sectionTitle.fontSize,
                                        fontWeight: styles.sectionTitle.fontWeight,
                                        color: theme.primary,
                                        letterSpacing: styles.sectionTitle.letterSpacing,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    Notable Projects
                                </h2>
                                <div
                                    style={{
                                        width: '30px',
                                        height: '1px',
                                        backgroundColor: theme.accent,
                                        margin: '6px auto'
                                    }}
                                />
                            </div>
                            {(userData.projects || []).slice(0, isSmall ? 2 : 3).map((project, i) => (
                                <div key={i} style={{ marginBottom: '10px' }}>
                                    <h3
                                        style={{
                                            fontSize: styles.text.fontSize,
                                            fontWeight: '700',
                                            color: theme.text,
                                            marginBottom: '2px'
                                        }}
                                    >
                                        {project.name || 'Project'}
                                    </h3>
                                    {project.description && (
                                        <p
                                            style={{
                                                fontSize: styles.text.fontSize,
                                                lineHeight: styles.text.lineHeight,
                                                textAlign: 'justify',
                                                fontStyle: 'italic'
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
