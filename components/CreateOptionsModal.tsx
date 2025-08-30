import React from 'react';
import { PostType } from '../types';

interface CreateOptionsModalProps {
    onClose: () => void;
    onSelectOption: (type: PostType) => void;
}

const CreateOptionsModal: React.FC<CreateOptionsModalProps> = ({ onClose, onSelectOption }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-t-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">¿Qué quieres publicar?</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <OptionButton
                        label="Vender Artículo"
                        description="Publica algo que quieras vender."
                        icon={<TagIcon className="w-8 h-8 text-green-500"/>}
                        onClick={() => onSelectOption('item')}
                    />
                    <OptionButton
                        label="Publicar Empleo"
                        description="Ofrece una oportunidad de trabajo."
                        icon={<BriefcaseIcon className="w-8 h-8 text-sky-500"/>}
                        onClick={() => onSelectOption('job')}
                    />
                    <OptionButton
                        label="Rentar Propiedad"
                        description="Anuncia una casa, depa o cuarto."
                        icon={<HomeIcon className="w-8 h-8 text-indigo-500"/>}
                        onClick={() => onSelectOption('rental')}
                    />
                </div>
            </div>
        </div>
    );
};

interface OptionButtonProps {
    label: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ label, description, icon, onClick}) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
    >
        <div className="flex-shrink-0 mr-4">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ChevronRightIcon className="w-5 h-5 text-gray-400 ml-auto"/>
    </button>
);


// --- ICONS ---
const TagIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM14 11V3m0 18v-8m0 0h8m-8 0H6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7l-7 8-7-8h7z"/>
    </svg>
);

const BriefcaseIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const HomeIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const ChevronRightIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);


export default CreateOptionsModal;