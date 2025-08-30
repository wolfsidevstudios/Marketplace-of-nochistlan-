
import React from 'react';
import { Item } from '../types';

interface ItemCardProps {
    item: Item;
    onItemClick: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onItemClick }) => {
    return (
        <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
            onClick={() => onItemClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onItemClick(item)}
            aria-label={`View details for ${item.description}`}
        >
            {item.mediaUrls.length > 0 && (
                 <img src={item.mediaUrls[0].url} alt={item.description} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
                <p className="text-xl font-bold text-gray-800">${item.price.toLocaleString('en-US')}</p>
                <p className="mt-2 text-gray-600 truncate group-hover:text-blue-600 transition-colors">{item.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 flex items-center">
                        <UserIcon className="w-4 h-4 mr-2" />
                        {item.userName}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                        <LocationMarkerIcon className="w-4 h-4 mr-2" />
                        {item.userLocation}
                    </p>
                    {item.acceptsDigitalPayment && (
                         <div className="mt-2 inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            <CreditCardIcon className="w-4 h-4 mr-1" />
                            Accepts Digital Payment
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LocationMarkerIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CreditCardIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);


export default ItemCard;
