import React from 'react';
import { Post } from '../types';
import ItemCard from './ItemCard';

interface FeedProps {
    items: Post[];
    loading: boolean;
    onItemClick: (item: Post) => void;
}

const Feed: React.FC<FeedProps> = ({ items, loading, onItemClick }) => {
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
    
    if (items.length === 0) {
        return <div className="text-center py-16 text-gray-500">
            <h2 className="text-2xl font-semibold">Aún no hay publicaciones.</h2>
            <p className="mt-2">¡Sé el primero en publicar algo!</p>
        </div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(item => (
                <ItemCard key={item.id} item={item} onItemClick={onItemClick} />
            ))}
        </div>
    );
};

export default Feed;