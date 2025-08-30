
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<InputProps> = (props) => {
    return (
        <input
            {...props}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-shadow duration-200 outline-none"
        />
    );
};

export default Input;
