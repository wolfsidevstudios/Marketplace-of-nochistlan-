
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseService';
import Button from './common/Button';

interface HeaderProps {
    onLoginClick: () => void;
    onPostItemClick: () => void;
    onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onPostItemClick, onSearch }) => {
    const { session, user } = useAuth();
    const [localSearchTerm, setLocalSearchTerm] = useState('');
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="h-48 md:h-64 bg-gradient-to-r from-sky-400 to-blue-600 flex items-center justify-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Marketplace Nochistlán
                </h1>
            </div>
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center gap-4">
                <div className="flex-shrink-0">
                    {user ? (
                         <span className="text-gray-700 hidden sm:inline">Welcome, <span className="font-semibold">{user.name}!</span></span>
                    ) : <div className="w-24"></div>}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon className="w-5 h-5 text-gray-400" />
                        </span>
                        <input
                            type="search"
                            placeholder="Search for items..."
                            value={localSearchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-shadow duration-200 outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                    {session ? (
                        <>
                            <Button onClick={onPostItemClick}>
                                <PlusIcon className="w-5 h-5 mr-0 sm:mr-2" />
                                <span className="hidden sm:inline">Post Item</span>
                            </Button>
                            <Button onClick={handleLogout} variant="secondary">
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <Button onClick={onLoginClick}>
                            Login / Sign Up
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    );
};


const PlusIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const SearchIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export default Header;