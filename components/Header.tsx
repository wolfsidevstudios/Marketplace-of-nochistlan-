import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseService';
import Button from './common/Button';
import { PostTypeFilter } from '../types';

interface HeaderProps {
    onLoginClick: () => void;
    onPostItemClick: () => void;
    onSearch: (query: string) => void;
    activeFilter: PostTypeFilter;
    onFilterChange: (filter: PostTypeFilter) => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onPostItemClick, onSearch, activeFilter, onFilterChange }) => {
    const { session, user } = useAuth();
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(localSearchTerm);
    };

    return (
        <header>
            <nav className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 flex justify-between items-center h-16">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">Marketplace Nochistlán</h1>
                    <div className="flex items-center space-x-3">
                        {session && user ? (
                            <>
                                <Button 
                                    onClick={onPostItemClick}
                                    disabled={!user.isConfirmed}
                                    title={!user.isConfirmed ? "Por favor, confirma tu correo para publicar" : "Publicar algo nuevo"}
                                    className="hidden sm:flex"
                                >
                                    Vender Artículo
                                </Button>
                                <Button onClick={handleLogout} variant="secondary">
                                    Cerrar Sesión
                                </Button>
                            </>
                        ) : (
                            <Button onClick={onLoginClick}>
                                Iniciar Sesión / Registrarse
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            <div 
                className="relative bg-cover bg-center" 
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop')"}}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40" aria-hidden="true"></div>
                <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32 flex flex-col justify-center items-center text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                        Renueva tu espacio.
                    </h2>
                    <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-2xl">
                        Encuentra artículos, empleos y rentas en tu comunidad.
                    </p>

                    <form onSubmit={handleSearchSubmit} className="mt-8 w-full max-w-2xl">
                        <div className="relative flex items-center bg-white rounded-full shadow-lg overflow-hidden group focus-within:ring-2 focus-within:ring-sky-400 focus-within:ring-offset-2 focus-within:ring-offset-transparent transition-shadow">
                            <span className="pl-5 pr-2" aria-hidden="true">
                                <SearchIcon className="w-5 h-5 text-gray-500" />
                            </span>
                            <input
                                type="search"
                                placeholder="Buscar artículos, empleos o rentas..."
                                value={localSearchTerm}
                                onChange={handleSearchChange}
                                className="w-full h-14 pr-4 text-gray-800 placeholder-gray-500 focus:outline-none bg-transparent"
                            />
                            <button type="submit" className="bg-sky-500 hover:bg-sky-600 h-14 px-5 transition-colors" aria-label="Buscar">
                                <ArrowRightIcon className="w-6 h-6 text-white"/>
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <FilterButton label="Todos" isActive={activeFilter === null} onClick={() => onFilterChange(null)} />
                        <FilterButton label="Artículos" isActive={activeFilter === 'item'} onClick={() => onFilterChange('item')} />
                        <FilterButton label="Empleos" isActive={activeFilter === 'job'} onClick={() => onFilterChange('job')} />
                        <FilterButton label="Rentas" isActive={activeFilter === 'rental'} onClick={() => onFilterChange('rental')} />
                    </div>
                </div>
            </div>
        </header>
    );
};

interface FilterButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, isActive, onClick }) => {
    const baseClasses = "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/30 focus:ring-white whitespace-nowrap backdrop-blur-sm";
    const activeClasses = "bg-sky-500/90 text-white shadow-md";
    const inactiveClasses = "bg-white/20 text-white hover:bg-white/40";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
            {label}
        </button>
    );
};

const SearchIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ArrowRightIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);

export default Header;