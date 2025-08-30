
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../services/supabaseService';
import { Session, User } from '../types';
import { Session as SupabaseSession } from '@supabase/supabase-js';


interface AuthContextType {
    session: SupabaseSession | null;
    user: User | null;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<SupabaseSession | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                const appUser: User = {
                    id: session.user.id,
                    createdAt: session.user.created_at,
                    name: session.user.user_metadata?.name || session.user.email,
                    location: session.user.user_metadata?.location || '',
                    isConfirmed: !!session.user.email_confirmed_at,
                    isVerified: session.user.user_metadata?.isVerified || false,
                };
                setUser(appUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const value = {
        session,
        user,
        loading,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};