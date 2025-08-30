import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseService';
import Button from './common/Button';
import Modal from './common/Modal';

interface ProfileModalProps {
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
    const { user } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onClose();
    };

    if (!user) {
        return null;
    }

    return (
        <Modal title="Tu Perfil" onClose={onClose}>
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-sky-600">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-500 mb-6">{user.location}</p>
                <Button onClick={handleLogout} variant="secondary" className="w-full">
                    Cerrar Sesión
                </Button>
            </div>
        </Modal>
    );
};

export default ProfileModal;