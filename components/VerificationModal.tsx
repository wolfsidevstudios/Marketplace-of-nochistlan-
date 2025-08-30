
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import Modal from './common/Modal';
import Button from './common/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseService';

interface VerificationModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

// Helper function to convert a file to a base64 string
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            }
        };
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};


const VerificationModal: React.FC<VerificationModalProps> = ({ onClose, onSuccess }) => {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreview(previewUrl);
        }
    };

    const handleSubmit = async () => {
        if (!file || !user) return;

        setLoading(true);
        setError(null);
        setStatusMessage('Subiendo imagen...');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const imagePart = await fileToGenerativePart(file);
            
            setStatusMessage('Analizando ID con IA...');
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: {
                    parts: [
                        imagePart,
                        { text: "Analiza esta imagen. ¿Es una credencial para votar mexicana (INE/IFE) válida? Extrae el nombre completo que aparece en el campo 'NOMBRE'. Responde únicamente con un objeto JSON con dos claves: `isIdValid` (booleano) y `extractedName` (string, o null si no se encuentra o no es válida)." }
                    ]
                },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            isIdValid: { type: Type.BOOLEAN },
                            extractedName: { type: Type.STRING }
                        }
                    }
                }
            });

            const jsonString = response.text;
            const result = JSON.parse(jsonString);

            if (!result.isIdValid || !result.extractedName) {
                throw new Error("No se pudo reconocer una credencial válida. Por favor, sube una foto clara y bien iluminada.");
            }
            
            setStatusMessage('Comparando nombres...');
            const extractedName = result.extractedName.trim().toLowerCase();
            const userName = user.name.trim().toLowerCase();

            // A simple normalization for comparison
            const normalize = (str: string) => str.replace(/\s+/g, ' ');

            if (normalize(extractedName) !== normalize(userName)) {
                throw new Error(`El nombre en la credencial ("${result.extractedName}") no coincide con tu nombre de perfil ("${user.name}").`);
            }
            
            setStatusMessage('Actualizando perfil...');
            const { error: updateError } = await supabase.auth.updateUser({
                data: { isVerified: true }
            });

            if (updateError) {
                throw new Error(`Error al actualizar tu perfil: ${updateError.message}`);
            }

            setStatusMessage('¡Verificación exitosa!');
            setTimeout(() => {
                onSuccess();
            }, 1500);

        } catch (err: any) {
            console.error("Verification error:", err);
            setError(err.message || "Ocurrió un error inesperado durante la verificación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal title="Verificar Identidad" onClose={onClose}>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Sube una foto clara de tu credencial para votar (INE) para verificar tu identidad. Nuestro sistema de IA confirmará que el nombre en la credencial coincide con tu nombre de perfil.
                </p>

                {preview && (
                    <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center">
                        <img src={preview} alt="Vista previa de la credencial" className="max-h-full max-w-full" />
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Foto de tu Credencial</label>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                        disabled={loading}
                    />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                {loading && (
                    <div className="text-center text-sky-600 font-semibold">
                        <p>{statusMessage}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-sky-500 h-2.5 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                )}
                
                <Button 
                    onClick={handleSubmit} 
                    disabled={!file || loading} 
                    className="w-full"
                >
                    {loading ? 'Verificando...' : 'Verificar Ahora'}
                </Button>
            </div>
        </Modal>
    );
};

export default VerificationModal;