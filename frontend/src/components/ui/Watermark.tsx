import React from 'react';

interface WatermarkProps {
    text?: string;
    opacity?: number;
    className?: string;
}

const Watermark: React.FC<WatermarkProps> = ({
    text = "AI CV Builder - Free Version",
    opacity = 0.1,
    className = ""
}) => {
    return (
        <div
            className={`absolute inset-0 pointer-events-none flex items-center justify-center ${className}`}
            style={{
                background: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 50px,
          rgba(0, 0, 0, ${opacity}) 50px,
          rgba(0, 0, 0, ${opacity}) 52px
        )`
            }}
        >
            <div
                className="transform -rotate-45 text-gray-600 font-bold text-2xl"
                style={{
                    opacity: opacity * 3,
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                }}
            >
                {text}
            </div>
        </div>
    );
};

export default Watermark;
