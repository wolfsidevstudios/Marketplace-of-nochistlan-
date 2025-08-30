
import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import Button from './common/Button';
import Input from './common/Input';
import { Post } from '../types';

interface PostJobFormProps {
    onPostSuccess: (newPost: Post) => void;
}

const PostJobForm: React.FC<PostJobFormProps> = ({ onPostSuccess }) => {
    const { user } = useAuth();
    const [jobTitle, setJobTitle] = useState('');
    const [salary, setSalary] = useState('');
    const [jobType, setJobType] = useState<'Tiempo Completo' | 'Medio Tiempo' | 'Contrato' | 'Temporal'>('Tiempo Completo');
    const [description, setDescription] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);
            previews.forEach(url => URL.revokeObjectURL(url));
            const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setError(null);

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
                uploadedMediaUrls.push({ url: urlData.publicUrl, type: file.type.startsWith('image/') ? 'image' : 'video' });
            }
        }

        const newPostData = {
            postType: 'job',
            jobTitle,
            salary,
            jobType,
            description,
            contactInfo,
            mediaUrls: uploadedMediaUrls,
            userId: user.id,
            createdAt: new Date().toISOString(),
        };

        const { data, error: insertError } = await supabase
            .from('items')
            .insert([newPostData])
            .select('*, profiles(*)')
            .single();


        if (insertError || !data) {
            setError(insertError?.message || "Error al publicar el empleo.");
        } else {
            onPostSuccess(data as Post);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Input type="text" placeholder="Título del Puesto" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
            <Input type="text" placeholder="Salario (ej. $10,000/mes, a tratar)" value={salary} onChange={e => setSalary(e.target.value)} />
            
            <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">Tipo de Empleo</label>
                <select id="jobType" value={jobType} onChange={e => setJobType(e.target.value as any)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md">
                    <option>Tiempo Completo</option>
                    <option>Medio Tiempo</option>
                    <option>Contrato</option>
                    <option>Temporal</option>
                </select>
            </div>

            <textarea placeholder="Descripción del Puesto" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent transition" rows={4} />
            <Input type="text" placeholder="Información de Contacto" value={contactInfo} onChange={e => setContactInfo(e.target.value)} required />
            
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Logo o Imágenes (Opcional)</label>
                 <input type="file" multiple onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {previews.map((src, index) => <img key={index} src={src} alt="preview" className="rounded-lg object-cover h-24 w-full" />)}
                </div>
            )}
            
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Publicando...' : 'Publicar Empleo'}
            </Button>
        </form>
    );
};

export default PostJobForm;