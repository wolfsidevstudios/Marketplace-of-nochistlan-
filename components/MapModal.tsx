import React from 'react';
import Modal from './common/Modal';

interface MapModalProps {
    locationName: string;
    onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ locationName, onClose }) => {
    // Construct a general query for Nochistlán, since we don't have specific coordinates.
    // This provides general context without revealing the exact address.
    const mapQuery = `Nochistlán de Mejía, Zacatecas, Mexico`;
    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

    return (
        <Modal title={`Ubicación Aproximada: ${locationName}`} onClose={onClose}>
            <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden shadow-inner">
                <iframe
                    src={mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa de ${locationName}`}
                ></iframe>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
                El mapa muestra la ubicación general en Nochistlán y no la dirección exacta del vendedor.
            </p>
        </Modal>
    );
};

export default MapModal;
