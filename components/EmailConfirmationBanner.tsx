
import React, { useState } from 'react';
import { supabase } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';

const EmailConfirmationBanner: React.FC = () => {
    const { user, session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!session || !user || user.isConfirmed) {
        return null;
    }
    
    const handleResend = async () => {
        if (!session.user.email) return;
        setLoading(true);
        setMessage('');
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: session.user.email
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('A new confirmation link has been sent to your email.');
        }
        setLoading(false);
    };

    return (
        <div className="bg-yellow-50 border-b border-yellow-200" role="alert">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="font-bold text-yellow-800">Please Confirm Your Email</p>
                        <p className="text-sm text-yellow-700">Check your inbox for a confirmation link to unlock all features.</p>
                        {message && <p className="mt-1 text-sm font-medium text-yellow-800">{message}</p>}
                    </div>
                    <button
                        onClick={handleResend}
                        disabled={loading}
                        className="flex-shrink-0 text-sm font-semibold text-yellow-800 underline hover:text-yellow-900 disabled:opacity-50 disabled:no-underline"
                    >
                        {loading ? 'Sending...' : 'Resend link'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmationBanner;