
import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Feed from './components/Feed';
import Modal from './components/common/Modal';
import AuthForm from './components/AuthForm';
import PostItemForm from './components/PostItemForm';
import ItemDetail from './components/ItemDetail';
import { Item } from './types';
import { supabase } from './services/supabaseService';
import Button from './components/common/Button';
import EmailConfirmationBanner from './components/EmailConfirmationBanner';


const AppContent: React.FC = () => {
    const { session, user } = useAuth();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isPostModalOpen, setPostModalOpen] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const searchTimeoutRef = useRef<number | null>(null);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        
        let query = supabase
            .from('items')
            .select('*')
            .order('createdAt', { ascending: false });

        if (searchTerm) {
            query = query.ilike('description', `%${searchTerm}%`);
        }

        const { data: fetchedItems, error: dbError } = await query;

        if (dbError) {
            console.error("Error fetching items:", dbError);
            let errorMessage = "Could not fetch items. Please check your connection and try again.";
            if (dbError.message.includes('relation "public.items" does not exist')) {
                errorMessage = "The 'items' table was not found. Please ensure you have run the database migrations in your Supabase project.";
            } else if (dbError.message.includes("violates row-level security policy")) {
                errorMessage = "Could not fetch items due to security policies. Please check your Supabase Row Level Security (RLS) policies for the 'items' table and ensure 'SELECT' access is enabled for users or anonymous roles.";
            }
            setError(errorMessage);
        } else {
            setItems(fetchedItems || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, [searchTerm]);

    const handlePostSuccess = (newItem: Item) => {
        // If there's a search term, we refetch to ensure consistency,
        // otherwise, we can just prepend the new item for a faster UI update.
        if (searchTerm) {
            fetchItems();
        } else {
            setItems(prevItems => [newItem, ...prevItems]);
        }
        setPostModalOpen(false);
    };
    
    const handlePostItemClick = () => {
        if (user?.isConfirmed) {
            setPostModalOpen(true);
        }
        // If user is not confirmed, the button in Header will be disabled,
        // so this function won't be called. No extra logic needed here.
    };

    const handleSearch = (query: string) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = window.setTimeout(() => {
            setSearchTerm(query);
        }, 300); // 300ms debounce
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <Header 
                onLoginClick={() => setAuthModalOpen(true)} 
                onPostItemClick={handlePostItemClick}
                onSearch={handleSearch}
            />
            <EmailConfirmationBanner />
            <main className="container mx-auto px-4 py-8">
                 {error ? (
                    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold text-red-700">Oops! Something went wrong.</h2>
                        <p className="mt-2 text-red-600">{error}</p>
                        <Button onClick={fetchItems} className="mt-6">
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <Feed items={items} loading={loading} onItemClick={setSelectedItem} />
                )}
            </main>

            {isAuthModalOpen && !session && (
                <Modal title="Join or Sign In" onClose={() => setAuthModalOpen(false)}>
                    <AuthForm onAuthSuccess={() => setAuthModalOpen(false)} />
                </Modal>
            )}

            {isPostModalOpen && session && (
                <Modal title="Post a New Item" onClose={() => setPostModalOpen(false)}>
                    <PostItemForm onPostSuccess={handlePostSuccess} />
                </Modal>
            )}

            {selectedItem && (
                <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;