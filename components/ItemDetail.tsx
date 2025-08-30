
import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import Button from './common/Button';
import MapModal from './MapModal';
import Modal from './common/Modal';
import VerifiedBadge from './common/VerifiedBadge';

interface ItemDetailProps {
    item: Post;
    onClose: () => void;
}

const SafetyWarningModal: React.FC<{
    onConfirm: () => void;
    onClose: () => void;
    actionType: 'call' | 'message';
}> = ({ onConfirm, onClose, actionType }) => {
    const actionText = actionType === 'call' ? 'Llamar' : 'Contactar';
    
    return (
        <Modal title="¡Advertencia de Seguridad!" onClose={onClose}>
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                    <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Procede con Precaución</h3>
                <div className="mt-2 px-4 py-3">
                    <p className="text-sm text-gray-600">
                        Antes de contactar o reunirte con alguien, por tu seguridad, te recomendamos 
                        <strong> compartir tu ubicación en tiempo real con amigos o familiares.</strong>
                    </p>
                </div>
                <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
                    <Button
                        type="button"
                        className="w-full"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Entendido, Continuar para {actionText}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const DetailContent: React.FC<{ item: Post }> = ({ item }) => {
    switch(item.postType) {
        case 'job':
            return (
                <>
                    <p className="text-sm font-bold text-sky-600 flex items-center mb-2">
                        <BriefcaseIcon className="w-5 h-5 mr-2"/> Oportunidad de Empleo
                    </p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{item.jobTitle}</h1>
                    <p className="mt-2 text-2xl font-semibold text-gray-700">{item.salary || 'Salario no especificado'}</p>
                    {item.jobType && <p className="mt-1 text-gray-500">{item.jobType}</p>}
                    <p className="mt-4 text-gray-700 text-lg whitespace-pre-wrap">{item.description}</p>
                </>
            );
        case 'rental':
            return (
                <>
                    <p className="text-sm font-bold text-indigo-600 flex items-center mb-2">
                        <HomeIcon className="w-5 h-5 mr-2"/> {item.propertyType} en Renta
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">${(item.rentalPrice ?? 0).toLocaleString('es-MX')}
                        <span className="text-2xl font-medium text-gray-500">/mes</span>
                    </h1>
                     <div className="mt-4 flex items-center gap-4 text-gray-600">
                        {item.bedrooms && <span><BedIcon className="w-5 h-5 mr-1 inline"/> {item.bedrooms} rec.</span>}
                        {item.bathrooms && <span><BathIcon className="w-5 h-5 mr-1 inline"/> {item.bathrooms} bañ.</span>}
                    </div>
                    <p className="mt-4 text-gray-700 text-lg whitespace-pre-wrap">{item.description}</p>
                </>
            );
        case 'item':
        default:
            return (
                 <>
                    <p className="text-4xl md:text-5xl font-extrabold text-gray-900">${(item.price ?? 0).toLocaleString('es-MX')}</p>
                    <p className="mt-4 text-gray-700 text-lg whitespace-pre-wrap">{item.description}</p>
                    {item.acceptsDigitalPayment && (
                        <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full w-fit">
                            <CreditCardIcon className="w-5 h-5 mr-1.5" />
                            Acepta Pagos Digitales
                        </div>
                    )}
                 </>
            );
    }
}


const ItemDetail: React.FC<ItemDetailProps> = ({ item, onClose }) => {
    const [activeImageUrl, setActiveImageUrl] = useState<string | undefined>(item.mediaUrls?.[0]?.url);
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const [isWarningModalOpen, setWarningModalOpen] = useState(false);
    const [contactAction, setContactAction] = useState<'call' | 'message' | null>(null);

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
            // A more universal approach for messaging apps
            const number = item.contactInfo.replace(/\D/g, '');
            window.location.href = `https://wa.me/${number}`; // Defaults to WhatsApp
        }
    };
    
    const openWarningModal = (action: 'call' | 'message') => {
        setContactAction(action);
        setWarningModalOpen(true);
    };

    const handleConfirmContact = () => {
        if (contactAction === 'call') {
            handleCall();
        } else if (contactAction === 'message') {
            handleMessage();
        }
        setWarningModalOpen(false);
        setContactAction(null);
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
                                {item.mediaUrls && item.mediaUrls.length > 1 && (
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
                               <DetailContent item={item} />

                                <div className="mt-8 pt-6 border-t">
                                    <h3 className="text-lg font-semibold text-gray-800">Información del Publicante</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <UserIcon className="w-5 h-5 text-gray-500" />
                                        <p className="text-gray-600">{item.userName}</p>
                                        {item.userIsVerified && <VerifiedBadge />}
                                    </div>
                                    <div className="text-gray-600 mt-1 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <LocationMarkerIcon className="w-5 h-5 mr-2 text-gray-500" /> {item.userLocation}
                                        </span>
                                        <button
                                            onClick={() => setMapModalOpen(true)}
                                            className="text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors flex items-center gap-1"
                                            aria-label={`Ver ubicación aproximada en el mapa para ${item.userLocation}`}
                                        >
                                            <MapIcon className="w-4 h-4" />
                                            Ver en mapa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action buttons footer for mobile */}
                    <div className="absolute bottom-0 left-0 right-0 md:static md:mt-auto md:pt-8 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 md:p-0 md:border-none">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={() => openWarningModal('call')} className="w-full" disabled={!item.contactInfo}>
                                <PhoneIcon className="w-5 h-5 mr-2"/> Llamar
                            </Button>
                            <Button onClick={() => openWarningModal('message')} variant="secondary" className="w-full" disabled={!item.contactInfo}>
                                <MessageIcon className="w-5 h-5 mr-2"/> Enviar Mensaje
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
             {isMapModalOpen && (
                <MapModal
                    locationName={item.userLocation}
                    onClose={() => setMapModalOpen(false)}
                />
            )}
            {isWarningModalOpen && contactAction && (
                <SafetyWarningModal
                    actionType={contactAction}
                    onConfirm={handleConfirmContact}
                    onClose={() => setWarningModalOpen(false)}
                />
            )}
        </div>
    );
};

// --- ICONS ---

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

const BedIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18V3m0 18h8M4 18h8" />
    </svg>
);


const BathIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11h14M2 11h1M21 11h1M4 11V6a2 2 0 012-2h12a2 2 0 012 2v5M4 11v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
    </svg>
);


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

const MapIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 13l6-3m0 10V7" />
    </svg>
);

export default ItemDetail;