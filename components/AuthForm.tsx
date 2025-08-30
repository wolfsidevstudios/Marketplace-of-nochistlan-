
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
            setError("A new confirmation link has been sent to your email.");
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
                        name,
                        location,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
            } else {
                if (data.user && !data.session) {
                    setRequiresConfirmation(true);
                } else {
                    onAuthSuccess();
                }
            }
        } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) {
                if (signInError.message.toLowerCase().includes("email not confirmed")) {
                    setError("Your email is not confirmed. Please check your inbox for the confirmation link.");
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
                <h3 className="text-xl font-semibold text-green-700">Check your inbox!</h3>
                <p className="mt-2 text-gray-600">
                    We've sent a confirmation link to <strong className="font-medium">{email}</strong>. Please click the link to complete your registration.
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
                        Resend Confirmation Email
                    </button>
                </div>
            )}
            
            {isSignUp && (
                 <Input
                    type="text"
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            )}
            <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Input
                type="password"
                placeholder="Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
            />
            {isSignUp && (
                <Input
                    type="text"
                    placeholder="Your Location (e.g., Centro)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
            )}
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
            <p className="text-center text-sm text-gray-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                <button
                    type="button"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                        setShowResend(false);
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
        </form>
    );
};

export default AuthForm;