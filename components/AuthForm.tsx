
import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';
import Button from './common/Button';
import Input from './common/Input';

interface AuthFormProps {
    onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [requiresConfirmation, setRequiresConfirmation] = useState(false);
    const [showResend, setShowResend] = useState(false);

    const handleResendConfirmation = async () => {
        setLoading(true);
        setError(null);
        const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: 'https://marketplacepofnochistlan.netlify.app/',
            },
        });
        if (resendError) {
            setError(resendError.message);
        } else {
            setError("Se ha enviado un nuevo enlace de confirmación a tu correo.");
            setShowResend(false);
        }
        setLoading(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShowResend(false);

        if (isSignUp) {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: 'https://marketplacepofnochistlan.netlify.app/',
                    data: {
                        name, // This is temporary, will be moved to profile
                        location,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            } 
            
            if (data.user) {
                // After user is created in auth, create their public profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        name: name,
                        location: location,
                        is_verified: false,
                    });

                if (profileError) {
                    setError(`Cuenta creada, pero no se pudo crear el perfil: ${profileError.message}`);
                } else {
                    if (!data.session) {
                        setRequiresConfirmation(true);
                    } else {
                        onAuthSuccess();
                    }
                }
            }


        } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) {
                if (signInError.message.toLowerCase().includes("email not confirmed")) {
                    setError("Tu correo no está confirmado. Por favor, revisa tu bandeja de entrada para ver el enlace de confirmación.");
                    setShowResend(true);
                } else {
                    setError(signInError.message);
                }
            } else {
                onAuthSuccess();
            }
        }
        setLoading(false);
    };

    if (requiresConfirmation) {
        return (
            <div className="text-center p-4">
                <h3 className="text-xl font-semibold text-green-700">¡Revisa tu correo!</h3>
                <p className="mt-2 text-gray-600">
                    Hemos enviado un enlace de confirmación a <strong className="font-medium">{email}</strong>. Por favor, haz clic en el enlace para completar tu registro.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
             {showResend && !loading && (
                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResendConfirmation}
                        className="font-medium text-sm text-blue-600 hover:text-blue-500"
                    >
                        Reenviar Correo de Confirmación
                    </button>
                </div>
            )}
            
            {isSignUp && (
                 <Input
                    type="text"
                    placeholder="Tu Nombre Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            )}
            <Input
                type="email"
                placeholder="Tu Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Input
                type="password"
                placeholder="Contraseña Segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
            />
            {isSignUp && (
                <Input
                    type="text"
                    placeholder="Tu Ubicación (ej. Centro)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
            )}
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? (isSignUp ? 'Registrando...' : 'Iniciando sesión...') : (isSignUp ? 'Registrarse' : 'Iniciar Sesión')}
            </Button>
            <p className="text-center text-sm text-gray-600">
                {isSignUp ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{' '}
                <button
                    type="button"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                        setShowResend(false);
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    {isSignUp ? 'Iniciar Sesión' : 'Registrarse'}
                </button>
            </p>
        </form>
    );
};

export default AuthForm;