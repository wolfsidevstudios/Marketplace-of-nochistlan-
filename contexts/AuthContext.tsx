
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../services/supabaseService';
import { User, Profile } from '../types';
import { Session as SupabaseSession } from '@supabase/supabase-js';


interface AuthContextType {
    session: SupabaseSession | null;
    user: User | null;
    loading: boolean;
    refreshUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    refreshUser: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<SupabaseSession | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            console.error("Error fetching profile:", error);
            setUser(null);
        } else {
            setUser(data);
        }
        setLoading(false);
    };

    const refreshUser = () => {
        if(session?.user) {
            setLoading(true);
            fetchProfile(session.user.id);
        }
    }

    useEffect(() => {
        setLoading(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
                setUser(null);
            }
        });


        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setUser(null);
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const value = {
        session,
        user,
        loading,
        refreshUser,
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