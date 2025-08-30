import React, { useState, useEffect } from 'react';
import { Item } from '../types';
import Button from './common/Button';

interface ItemDetailProps {
    item: Item;
    onClose: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item, onClose }) => {
    const [activeImageUrl, setActiveImageUrl] = useState<string | undefined>(item.mediaUrls?.[0]?.url);

    useEffect(() => {
        setActiveImageUrl(item.mediaUrls?.[0]?.url);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [item]);

    const handleCall = () => {
        if (item.contactInfo) {
            window.location.href = `tel:${item.contactInfo.replace(/\D/g, '')}`;
        }
    };
    
    const handleMessage = () => {
        if (item.contactInfo) {
            window.location.href = `sms:${item.contactInfo.replace(/\D/g, '')}`;
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-50 animate-fade-in" aria-modal="true" role="dialog">
            <div className="container mx-auto px-4 py-8 h-full">
                <div className="relative h-full flex flex-col">
                    <button 
                        onClick={onClose} 
                        className="absolute top-0 -left-2 md:top-4 md:-left-4 z-20 p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-md hover:bg-gray-100 transition"
                        aria-label="Volver al inicio"
                    >
                        <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
                    </button>

                    <div className="flex-grow overflow-y-auto pb-24 md:pb-0">
                        <div className="md:grid md:grid-cols-2 md:gap-12 pt-12 md:pt-4">
                            {/* Image Gallery */}
                            <div className="flex flex-col gap-4 sticky top-0">
                                <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                                    {activeImageUrl ? (
                                        <img src={activeImageUrl} alt={item.description} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">Sin Imagen</div>
                                    )}
                                </div>
                                {item.mediaUrls.length > 1 && (
                                    <div className="grid grid-cols-5 gap-2">
                                        {item.mediaUrls.map(media => (
                                            <button key={media.url} onClick={() => setActiveImageUrl(media.url)} className={`aspect-square w-full rounded-md overflow-hidden ring-2 transition ${activeImageUrl === media.url ? 'ring-sky-500' : 'ring-transparent hover:ring-sky-300'}`}>
                                                <img src={media.url} alt="thumbnail" className="w-full h-full object-cover"/>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Item Details */}
                            <div className="mt-8 md:mt-0 flex flex-col">
                                <p className="text-4xl md:text-5xl font-extrabold text-gray-900">${item.price.toLocaleString('es-MX')}</p>
                                <p className="mt-4 text-gray-700 text-lg whitespace-pre-wrap">{item.description}</p>
                                
                                {item.acceptsDigitalPayment && (
                                    <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full w-fit">
                                        <CreditCardIcon className="w-5 h-5 mr-1.5" />
                                        Acepta Pagos Digitales
                                    </div>
                                )}

                                <div className="mt-8 pt-6 border-t">
                                    <h3 className="text-lg font-semibold text-gray-800">Información del Vendedor</h3>
                                    <p className="text-gray-600 mt-2 flex items-center"><UserIcon className="w-5 h-5 mr-2 text-gray-500" /> {item.userName}</p>
                                    <p className="text-gray-600 mt-1 flex items-center"><LocationMarkerIcon className="w-5 h-5 mr-2 text-gray-500" /> {item.userLocation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action buttons footer for mobile */}
                    <div className="absolute bottom-0 left-0 right-0 md:static md:mt-auto md:pt-8 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 md:p-0 md:border-none">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={handleCall} className="w-full" disabled={!item.contactInfo}>
                                <PhoneIcon className="w-5 h-5 mr-2"/> Llamar al Vendedor
                            </Button>
                            <Button onClick={handleMessage} variant="secondary" className="w-full" disabled={!item.contactInfo}>
                                <MessageIcon className="w-5 h-5 mr-2"/> Enviar Mensaje
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ArrowLeftIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const PhoneIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const MessageIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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

export default ItemDetail;