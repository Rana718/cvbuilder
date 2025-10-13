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

interface BasicWhiteProps {
    userData: UserData;
    size?: 'small' | 'normal';
}

const BasicWhite: React.FC<BasicWhiteProps> = ({ userData: data, size = 'normal' }) => {
    const scale = size === 'small' ? 0.6 : 1;
    const isSmall = size === 'small';

    return (
        <div
            className="bg-white text-black"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                width: isSmall ? `${100 / scale}%` : '100%',
                height: isSmall ? `${100 / scale}%` : '100%',
                fontFamily: 'Arial, sans-serif',
                padding: '40px',
                lineHeight: '1.6'
            }}
        >
            {/* Header Section */}
            <div className="text-center mb-6 pb-4 border-b-2 border-black">
                <h1 className="text-4xl font-bold mb-2" style={{ color: '#000000' }}>
                    {data.name}
                </h1>
                <p className="text-lg mb-1" style={{ color: '#333333' }}>
                    {data.job_title}
                </p>
                <div className="text-sm flex justify-center gap-4 flex-wrap" style={{ color: '#555555' }}>
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>•</span>}
                    {data.phone && <span>{data.phone}</span>}
                    {data.address && <span>•</span>}
                    {data.address && <span>{data.address}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2 uppercase" style={{ color: '#000000' }}>
                        Professional Summary
                    </h2>
                    <p className="text-sm" style={{ color: '#333333' }}>
                        {data.summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3 uppercase" style={{ color: '#000000' }}>
                        Work Experience
                    </h2>
                    {data.experience.map((exp, idx) => (
                        <div key={idx} className="mb-4">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="text-base font-bold" style={{ color: '#000000' }}>
                                    {exp.title}
                                </h3>
                                <span className="text-sm" style={{ color: '#555555' }}>
                                    {exp.duration}
                                </span>
                            </div>
                            <p className="text-sm font-semibold mb-1" style={{ color: '#333333' }}>
                                {exp.company} {exp.location && `• ${exp.location}`}
                            </p>
                            {exp.description && (
                                <p className="text-sm" style={{ color: '#333333' }}>
                                    {exp.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3 uppercase" style={{ color: '#000000' }}>
                        Education
                    </h2>
                    {data.education.map((edu, idx) => (
                        <div key={idx} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-base font-bold" style={{ color: '#000000' }}>
                                    {edu.degree}
                                </h3>
                                <span className="text-sm" style={{ color: '#555555' }}>
                                    {edu.year}
                                </span>
                            </div>
                            <p className="text-sm" style={{ color: '#333333' }}>
                                {edu.school} {edu.field && `• ${edu.field}`}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3 uppercase" style={{ color: '#000000' }}>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 text-sm border border-black"
                                style={{ color: '#000000' }}
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3 uppercase" style={{ color: '#000000' }}>
                        Projects
                    </h2>
                    {data.projects.map((project, idx) => (
                        <div key={idx} className="mb-3">
                            <h3 className="text-base font-bold" style={{ color: '#000000' }}>
                                {project.name}
                            </h3>
                            {project.description && (
                                <p className="text-sm" style={{ color: '#333333' }}>
                                    {project.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BasicWhite;
