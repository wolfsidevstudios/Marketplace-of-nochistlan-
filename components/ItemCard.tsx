
import React from 'react';
import { Post } from '../types';
import VerifiedBadge from './common/VerifiedBadge';

interface ItemCardProps {
    item: Post;
    onItemClick: (item: Post) => void;
}

const CardContent: React.FC<{ item: Post }> = ({ item }) => {
    switch (item.postType) {
        case 'job':
            return (
                <>
                    <p className="text-sm font-bold text-sky-600 flex items-center">
                        <BriefcaseIcon className="w-4 h-4 mr-2"/> Oportunidad de Empleo
                    </p>
                    <p className="mt-2 text-xl font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{item.jobTitle}</p>
                    <p className="text-gray-600">{item.salary || 'Salario no especificado'}</p>
                </>
            );
        case 'rental':
             return (
                <>
                    <p className="text-sm font-bold text-indigo-600 flex items-center">
                        <HomeIcon className="w-4 h-4 mr-2" /> {item.propertyType} en Renta
                    </p>
                    <p className="mt-2 text-xl font-bold text-gray-800">${(item.rentalPrice ?? 0).toLocaleString('es-MX')} / mes</p>
                    <p className="text-gray-600 truncate group-hover:text-blue-600 transition-colors">{item.description}</p>
                </>
            );
        case 'item':
        default:
            return (
                <>
                    <p className="text-xl font-bold text-gray-800">${(item.price ?? 0).toLocaleString('es-MX')}</p>
                    <p className="mt-2 text-gray-600 truncate group-hover:text-blue-600 transition-colors">{item.description}</p>
                </>
            );
    }
};


const ItemCard: React.FC<ItemCardProps> = ({ item, onItemClick }) => {
    return (
        <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
            onClick={() => onItemClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onItemClick(item)}
            aria-label={`Ver detalles de ${item.description || item.jobTitle}`}
        >
            {item.mediaUrls && item.mediaUrls.length > 0 ? (
                 <img src={item.mediaUrls[0].url} alt={item.description || item.jobTitle} className="w-full h-48 object-cover" />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
            )}
            <div className="p-4">
                <CardContent item={item} />
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1.5">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                        <p className="text-sm text-gray-500">{item.userName}</p>
                        {item.userIsVerified && <VerifiedBadge />}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                        <LocationMarkerIcon className="w-4 h-4 mr-2" />
                        {item.userLocation}
                    </p>
                    {item.postType === 'item' && item.acceptsDigitalPayment && (
                         <div className="mt-2 inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            <CreditCardIcon className="w-4 h-4 mr-1" />
                            Acepta Pagos Digitales
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- ICONS ---

const ImageIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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