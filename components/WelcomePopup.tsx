import React from 'react';
import Button from './common/Button';

interface WelcomePopupProps {
    onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Bienvenido al Marketplace de Nochistlán!</h2>
            <p className="text-gray-600 mb-6">
                Este es un espacio comunitario para que la gente de Nochistlán, Zacatecas, compre y venda productos con sus vecinos.
            </p>
            <Button onClick={onClose} className="w-full">
                Comenzar
            </Button>
        </div>
    );
};

export default WelcomePopup;