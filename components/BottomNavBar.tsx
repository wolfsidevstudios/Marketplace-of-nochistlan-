import React from 'react';

interface BottomNavBarProps {
    onComprarClick: () => void;
    onCrearClick: () => void;
    onProfileClick: () => void;
}

const HomeIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const PlusIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const UserIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onComprarClick, onCrearClick, onProfileClick }) => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-lg md:hidden z-30">
            <nav className="flex justify-around items-center h-16 max-w-lg mx-auto">
                <button
                    onClick={onComprarClick}
                    className="flex-1 flex flex-col items-center justify-center text-gray-700 hover:text-sky-600 transition-colors pt-1 space-y-1"
                    aria-label="Comprar"
                >
                    <HomeIcon className="w-6 h-6" />
                    <span className="text-xs font-semibold">Comprar</span>
                </button>

                <div className="flex-1 flex justify-center">
                    <button
                        onClick={onCrearClick}
                        className="-mt-6 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                        aria-label="Crear nueva publicación"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Crear
                    </button>
                </div>

                <button
                    onClick={onProfileClick}
                    className="flex-1 flex flex-col items-center justify-center text-gray-700 hover:text-sky-600 transition-colors pt-1 space-y-1"
                    aria-label="Ver perfil"
                >
                    <UserIcon className="w-6 h-6" />
                    <span className="text-xs font-semibold">Perfil</span>
                </button>
            </nav>
        </footer>
    );
};

export default BottomNavBar;