
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
    const baseClasses = "flex items-center justify-center font-bold py-2 px-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: 'bg-sky-400 hover:bg-sky-500 text-white focus:ring-sky-500',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400'
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
