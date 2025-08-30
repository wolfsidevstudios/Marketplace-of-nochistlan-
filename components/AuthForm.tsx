
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isSignUp) {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        location,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
            } else {
                // onAuthStateChange will handle the session update
                onAuthSuccess();
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setError(error.message);
            } else {
                onAuthSuccess();
            }
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
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
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
        </form>
    );
};

export default AuthForm;