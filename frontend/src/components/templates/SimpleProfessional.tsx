import React from 'react';

export interface UserData {
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

interface SimpleProfessionalProps {
    userData: UserData;
    size?: 'small' | 'normal';
}

const SimpleProfessional: React.FC<SimpleProfessionalProps> = ({ userData: data, size = 'normal' }) => {
    const scale = size === 'small' ? 0.6 : 1;
    const isSmall = size === 'small';

    return (
        <div
            className="bg-white"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: '210mm', 
                height: '297mm',
                fontFamily: 'Arial, sans-serif',
                padding: '30px',
                lineHeight: '1.5',
                display: 'flex',
                gap: '30px'
            }}
        >
            {/* Left Column */}
            <div style={{ width: '35%' }}>
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: '#2c3e50' }}>
                        {data.name}
                    </h1>
                    <p className="text-base mb-4" style={{ color: '#34495e' }}>
                        {data.job_title}
                    </p>
                    <div className="text-sm space-y-1" style={{ color: '#4a5568' }}>
                        {data.email && <div>{data.email}</div>}
                        {data.phone && <div>{data.phone}</div>}
                        {data.address && <div>{data.address}</div>}
                    </div>
                </div>

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3 pb-2" style={{ color: '#2c3e50', borderBottom: '2px solid #2c3e50' }}>
                            SKILLS
                        </h2>
                        <div className="space-y-2">
                            {data.skills.map((skill: any, idx: number) => (
                                <div key={idx} className="text-sm" style={{ color: '#4a5568' }}>
                                    • {skill.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3 pb-2" style={{ color: '#2c3e50', borderBottom: '2px solid #2c3e50' }}>
                            EDUCATION
                        </h2>
                        {data.education.map((edu: any, idx: number) => (
                            <div key={idx} className="mb-4">
                                <div className="text-sm font-bold" style={{ color: '#2c3e50' }}>
                                    {edu.degree}
                                </div>
                                <div className="text-xs" style={{ color: '#34495e' }}>
                                    {edu.school}
                                </div>
                                <div className="text-xs" style={{ color: '#4a5568' }}>
                                    {edu.year}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column */}
            <div style={{ width: '65%' }}>
                {/* Summary */}
                {data.summary && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3 pb-2" style={{ color: '#2c3e50', borderBottom: '2px solid #2c3e50' }}>
                            PROFILE
                        </h2>
                        <p className="text-sm" style={{ color: '#4a5568' }}>
                            {data.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {data.experience && data.experience.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3 pb-2" style={{ color: '#2c3e50', borderBottom: '2px solid #2c3e50' }}>
                            EXPERIENCE
                        </h2>
                        {data.experience.map((exp: any, idx: number) => (
                            <div key={idx} className="mb-4">
                                <div className="flex justify-between mb-1">
                                    <h3 className="text-sm font-bold" style={{ color: '#2c3e50' }}>
                                        {exp.title}
                                    </h3>
                                    <span className="text-xs" style={{ color: '#4a5568' }}>
                                        {exp.duration}
                                    </span>
                                </div>
                                <p className="text-xs font-semibold mb-1" style={{ color: '#34495e' }}>
                                    {exp.company} {exp.location && `• ${exp.location}`}
                                </p>
                                {exp.description && (
                                    <p className="text-xs" style={{ color: '#4a5568' }}>
                                        {exp.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-3 pb-2" style={{ color: '#2c3e50', borderBottom: '2px solid #2c3e50' }}>
                            PROJECTS
                        </h2>
                        {data.projects.map((project: any, idx: number) => (
                            <div key={idx} className="mb-3">
                                <h3 className="text-sm font-bold" style={{ color: '#2c3e50' }}>
                                    {project.name}
                                </h3>
                                {project.description && (
                                    <p className="text-xs" style={{ color: '#4a5568' }}>
                                        {project.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimpleProfessional;
