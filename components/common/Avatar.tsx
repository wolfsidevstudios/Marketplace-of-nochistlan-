
import React from 'react';

interface AvatarProps {
    src: string | null | undefined;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl',
    };

    const initial = name ? name.charAt(0).toUpperCase() : '?';

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={`rounded-full object-cover bg-gray-200 ${sizeClasses[size]} ${className}`}
            />
        );
    }

    // Simple hashing for a consistent background color
    const hashCode = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
           hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    } 

    const intToRGB = (i: number) => {
        const c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "00000".substring(0, 6 - c.length) + c;
    }

    const bgColor = `bg-[#${intToRGB(hashCode(name))}]`;
    
    return (
        <div
            className={`rounded-full flex items-center justify-center font-bold text-white ${sizeClasses[size]} ${bgColor} ${className}`}
            title={name}
        >
            {initial}
        </div>
    );
};

export default Avatar;