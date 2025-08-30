
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseService';
import Button from './common/Button';
import Modal from './common/Modal';
import VerifiedBadge from './common/VerifiedBadge';
import Avatar from './common/Avatar';

interface ProfileModalProps {
    onClose: () => void;
    onVerifyClick: () => void;
    onEditProfileClick: () => void;
    onViewProfileClick: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onVerifyClick, onEditProfileClick, onViewProfileClick }) => {
    const { user, session } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onClose();
    };

    if (!user) {
        return null;
    }

    // Check confirmation status from the session object, as profile doesn't have it.
    const isConfirmed = !!session?.user?.email_confirmed_at;

    return (
        <Modal title="Tu Perfil" onClose={onClose}>
            <div className="flex flex-col items-center text-center">
                <Avatar src={user.avatar_url} name={user.name} size="xl" className="mb-4"/>
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                    {user.is_verified && <VerifiedBadge />}
                </div>

                <p className="text-gray-500 mb-6">{user.location}</p>
                
                <div className="w-full space-y-3">
                    <Button onClick={onViewProfileClick} className="w-full">
                        Ver Perfil Público
                    </Button>
                    <Button onClick={onEditProfileClick} variant="secondary" className="w-full">
                        Editar Perfil
                    </Button>
                     {!user.is_verified && isConfirmed && (
                         <Button onClick={onVerifyClick} className="w-full bg-green-500 hover:bg-green-600 focus:ring-green-500">
                            Verificar Identidad
                        </Button>
                    )}
                    <Button onClick={handleLogout} variant="secondary" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                        Cerrar Sesión
                    </Button>
                </div>

            </div>
        </Modal>
    );
};

export default ProfileModal;