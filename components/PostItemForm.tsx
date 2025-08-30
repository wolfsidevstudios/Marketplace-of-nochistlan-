import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import Button from './common/Button';
import Input from './common/Input';
import { Item } from '../types';

interface PostItemFormProps {
    onPostSuccess: (newItem: Item) => void;
}

const PostItemForm: React.FC<PostItemFormProps> = ({ onPostSuccess }) => {
    const { user } = useAuth();
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [acceptsDigitalPayment, setAcceptsDigitalPayment] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);

            // Revoke old previews to free memory
            previews.forEach(url => URL.revokeObjectURL(url));

            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("Debes iniciar sesión para publicar un artículo.");
            return;
        }
        setLoading(true);
        setError(null);
        
        // 1. Upload files to Supabase Storage
        const uploadedMediaUrls: { url: string, type: 'image' | 'video' }[] = [];
        for (const file of files) {
            const filePath = `${user.id}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage.from('item-media').upload(filePath, file);

            if (uploadError) {
                setError(`Error al subir ${file.name}: ${uploadError.message}`);
                setLoading(false);
                return;
            }

            const { data: urlData } = supabase.storage.from('item-media').getPublicUrl(filePath);
            if (urlData.publicUrl) {
                uploadedMediaUrls.push({
                    url: urlData.publicUrl,
                    type: file.type.startsWith('image/') ? 'image' : 'video'
                });
            }
        }
        
        // 2. Insert item data into the database
        const newItemData = {
            price: parseFloat(price),
            description,
            contactInfo,
            acceptsDigitalPayment,
            mediaUrls: uploadedMediaUrls,
            userId: user.id,
            userName: user.name,
            userLocation: user.location,
            // Supabase will add `createdAt` automatically, but we can specify it
            createdAt: new Date().toISOString(),
        };

        const { data, error: insertError } = await supabase
            .from('items')
            .insert([newItemData])
            .select();

        if (insertError || !data) {
            setError(insertError?.message || "Error al publicar el artículo.");
        } else {
            onPostSuccess(data[0]);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Input type="number" placeholder="Precio (MXN)" value={price} onChange={e => setPrice(e.target.value)} required step="0.01" />
            <textarea
                placeholder="Descripción del Artículo"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
                rows={4}
            />
            <Input type="text" placeholder="Información de Contacto (Teléfono, WhatsApp, etc.)" value={contactInfo} onChange={e => setContactInfo(e.target.value)} required />
            
             <div className="flex items-center">
                <input
                    id="digitalPayment"
                    type="checkbox"
                    checked={acceptsDigitalPayment}
                    onChange={e => setAcceptsDigitalPayment(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="digitalPayment" className="ml-2 block text-sm text-gray-900">
                    Acepto Pagos Digitales (Tarjeta, Transferencia)
                </label>
            </div>
            
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes o Videos</label>
                 <input type="file" multiple onChange={handleFileChange} accept="image/*,video/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {previews.map((src, index) => (
                        <img key={index} src={src} alt="preview" className="rounded-lg object-cover h-24 w-full" />
                    ))}
                </div>
            )}
            
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Publicando...' : 'Publicar Artículo'}
            </Button>
        </form>
    );
};

export default PostItemForm;