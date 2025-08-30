
import React from 'react';
import { Post, Profile } from '../types';
import ItemCard from './ItemCard';
import UserCard from './UserCard';

interface FeedProps {
    posts: Post[];
    users: Profile[];
    loading: boolean;
    searchType: 'posts' | 'users';
    onItemClick: (item: Post) => void;
    onUserClick: (userId: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, users, loading, searchType, onItemClick, onUserClick }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg shadow-md animate-pulse">
                        <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    
    if (searchType === 'posts') {
        if (posts.length === 0) {
            return <div className="text-center py-16 text-gray-500">
                <h2 className="text-2xl font-semibold">Aún no hay publicaciones.</h2>
                <p className="mt-2">¡Sé el primero en publicar algo!</p>
            </div>
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {posts.map(item => (
                    <ItemCard key={item.id} item={item} onItemClick={onItemClick} onUserClick={onUserClick} />
                ))}
            </div>
        );
    }

    if (searchType === 'users') {
        if (users.length === 0) {
             return <div className="text-center py-16 text-gray-500">
                <h2 className="text-2xl font-semibold">No se encontraron usuarios.</h2>
                <p className="mt-2">Intenta con otro término de búsqueda.</p>
            </div>
        }
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map(user => (
                   <UserCard key={user.id} user={user} onUserClick={onUserClick} />
                ))}
            </div>
        )
    }

    return null;
};

export default Feed;