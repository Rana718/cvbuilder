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

interface EssentialResumeProps {
    userData: UserData;
    size?: 'small' | 'normal';
}

const EssentialResume: React.FC<EssentialResumeProps> = ({ userData: data, size = 'normal' }) => {
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
                fontFamily: 'Calibri, Arial, sans-serif',
                padding: '35px',
                lineHeight: '1.5',
                color: '#1a1a1a'
            }}
        >
            {/* Header Section */}
            <div className="mb-5">
                <h1 className="text-3xl font-bold mb-1" style={{ color: '#1a1a1a' }}>
                    {data.name}
                </h1>
                <p className="text-base mb-3" style={{ color: '#4a4a4a' }}>
                    {data.job_title}
                </p>
                <div className="text-sm flex gap-3 flex-wrap" style={{ color: '#666666' }}>
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>|</span>}
                    {data.phone && <span>{data.phone}</span>}
                    {data.address && <span>|</span>}
                    {data.address && <span>{data.address}</span>}
                </div>
            </div>

            <hr className="mb-5" style={{ border: '1px solid #666666' }} />

            {/* Summary */}
            {data.summary && (
                <div className="mb-5">
                    <h2 className="text-lg font-bold mb-2" style={{ color: '#1a1a1a' }}>
                        SUMMARY
                    </h2>
                    <p className="text-sm" style={{ color: '#4a4a4a' }}>
                        {data.summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a1a' }}>
                        PROFESSIONAL EXPERIENCE
                    </h2>
                    {data.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="mb-4">
                            <div className="mb-1">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-base font-bold" style={{ color: '#1a1a1a' }}>
                                        {exp.title}
                                    </h3>
                                    <span className="text-sm" style={{ color: '#666666' }}>
                                        {exp.duration}
                                    </span>
                                </div>
                                <p className="text-sm italic" style={{ color: '#4a4a4a' }}>
                                    {exp.company}
                                    {exp.location && ` - ${exp.location}`}
                                </p>
                            </div>
                            {exp.description && (
                                <p className="text-sm" style={{ color: '#4a4a4a' }}>
                                    {exp.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a1a' }}>
                        EDUCATION
                    </h2>
                    {data.education.map((edu: any, idx: number) => (
                        <div key={idx} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="text-base font-bold" style={{ color: '#1a1a1a' }}>
                                    {edu.degree}
                                </h3>
                                <span className="text-sm" style={{ color: '#666666' }}>
                                    {edu.year}
                                </span>
                            </div>
                            <p className="text-sm" style={{ color: '#4a4a4a' }}>
                                {edu.school}
                                {edu.field && ` - ${edu.field}`}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a1a' }}>
                        SKILLS
                    </h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {data.skills.map((skill: any, idx: number) => (
                            <span key={idx} className="text-sm" style={{ color: '#4a4a4a' }}>
                                • {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-lg font-bold mb-3" style={{ color: '#1a1a1a' }}>
                        PROJECTS
                    </h2>
                    {data.projects.map((project: any, idx: number) => (
                        <div key={idx} className="mb-3">
                            <h3 className="text-base font-bold" style={{ color: '#1a1a1a' }}>
                                {project.name}
                            </h3>
                            {project.description && (
                                <p className="text-sm" style={{ color: '#4a4a4a' }}>
                                    {project.description}
                                </p>
                            )}
                            {project.url && (
                                <p className="text-sm" style={{ color: '#666666' }}>
                                    {project.url}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EssentialResume;
