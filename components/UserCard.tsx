
import React from 'react';
import { Profile } from '../types';
import VerifiedBadge from './common/VerifiedBadge';
import Avatar from './common/Avatar';

interface UserCardProps {
    user: Profile;
    onUserClick: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onUserClick }) => {
    return (
        <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group flex flex-col items-center text-center p-6"
            onClick={() => onUserClick(user.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onUserClick(user.id)}
            aria-label={`Ver perfil de ${user.name}`}
        >
            <Avatar src={user.avatar_url} name={user.name} size="xl" className="mb-4"/>
            <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-gray-800 truncate">{user.name}</p>
                {user.is_verified && <VerifiedBadge />}
            </div>
            <p className="text-sm text-gray-500 flex items-center mt-1">
                <LocationMarkerIcon className="w-4 h-4 mr-1" />
                {user.location}
            </p>
        </div>
    );
};

const LocationMarkerIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export default UserCard;
