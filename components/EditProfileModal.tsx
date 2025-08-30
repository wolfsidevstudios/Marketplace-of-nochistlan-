import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseService';
import Modal from './common/Modal';
import Button from './common/Button';
import Input from './common/Input';
import Avatar from './common/Avatar';

interface EditProfileModalProps {
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [location, setLocation] = useState(user?.location || '');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(user?.banner_url || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: true });

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            let avatarUrl = user.avatar_url;
            if (avatarFile) {
                const filePath = `public/${user.id}-avatar.png`;
                avatarUrl = await uploadFile(avatarFile, 'avatars', filePath);
            }

            let bannerUrl = user.banner_url;
            if (bannerFile) {
                const filePath = `public/${user.id}-banner.png`;
                bannerUrl = await uploadFile(bannerFile, 'banners', filePath);
            }
            
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    name,
                    location,
                    avatar_url: avatarUrl,
                    banner_url: bannerUrl,
                })
                .eq('id', user.id);
            
            if (updateError) throw updateError;

            refreshUser();
            onClose();

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocurrió un error al actualizar el perfil.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Editar Perfil" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                    <div className="flex items-center gap-4">
                        <Avatar src={avatarPreview} name={name} size="lg"/>
                        <input type="file" id="avatar-upload" onChange={handleAvatarChange} accept="image/*" className="hidden"/>
                        <label htmlFor="avatar-upload" className="cursor-pointer text-sm font-semibold text-sky-600 hover:text-sky-500">
                           Cambiar Foto
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Banner del Perfil</label>
                    <div className="w-full aspect-[3/1] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                        {bannerPreview ? (
                            <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover"/>
                        ) : (
                            <span className="text-gray-500 text-sm">Sin banner</span>
                        )}
                    </div>
                     <input type="file" id="banner-upload" onChange={handleBannerChange} accept="image/*" className="hidden"/>
                     <label htmlFor="banner-upload" className="cursor-pointer text-sm font-semibold text-sky-600 hover:text-sky-500 mt-2 inline-block">
                        Cambiar Banner
                    </label>
                </div>

                {/* FIX: Replaced invalid `label` prop on Input with standard <label> elements. */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <Input id="profile-name" type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="profile-location" className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                        <Input id="profile-location" type="text" value={location} onChange={e => setLocation(e.target.value)} required />
                    </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                     <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditProfileModal;