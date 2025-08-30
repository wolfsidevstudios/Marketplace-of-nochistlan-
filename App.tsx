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
import WelcomePopup from './components/WelcomePopup';
import BottomNavBar from './components/BottomNavBar';
import ProfileModal from './components/ProfileModal';


const AppContent: React.FC = () => {
    const { session, user } = useAuth();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isPostModalOpen, setPostModalOpen] = useState(false);
    const [isWelcomeModalOpen, setWelcomeModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const searchTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedMarketplace');
        if (!hasVisited) {
            setWelcomeModalOpen(true);
            localStorage.setItem('hasVisitedMarketplace', 'true');
        }
    }, []);

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
            let errorMessage = "No se pudieron cargar los artículos. Por favor, revisa tu conexión e inténtalo de nuevo.";
            if (dbError.message.includes('relation "public.items" does not exist')) {
                errorMessage = "No se encontró la tabla 'items'. Por favor, asegúrate de haber ejecutado las migraciones de la base de datos en tu proyecto de Supabase.";
            } else if (dbError.message.includes("violates row-level security policy")) {
                errorMessage = "No se pudieron cargar los artículos debido a políticas de seguridad. Por favor, revisa las políticas de Seguridad a Nivel de Fila (RLS) de Supabase para la tabla 'items' y asegúrate de que el acceso 'SELECT' esté habilitado para usuarios o roles anónimos.";
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
        } else if (!user) {
            setAuthModalOpen(true);
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

    const handleProfileClick = () => {
        if (session) {
            setProfileModalOpen(true);
        } else {
            setAuthModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <Header 
                onLoginClick={() => setAuthModalOpen(true)} 
                onPostItemClick={handlePostItemClick}
                onSearch={handleSearch}
            />
            <EmailConfirmationBanner />
            <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
                 {error ? (
                    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold text-red-700">¡Ups! Algo salió mal.</h2>
                        <p className="mt-2 text-red-600">{error}</p>
                        <Button onClick={fetchItems} className="mt-6">
                            Intentar de Nuevo
                        </Button>
                    </div>
                ) : (
                    <Feed items={items} loading={loading} onItemClick={setSelectedItem} />
                )}
            </main>

            <BottomNavBar 
                onComprarClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onCrearClick={handlePostItemClick}
                onProfileClick={handleProfileClick}
            />

            {isWelcomeModalOpen && (
                <Modal title="¡Bienvenido!" onClose={() => setWelcomeModalOpen(false)}>
                    <WelcomePopup onClose={() => setWelcomeModalOpen(false)} />
                </Modal>
            )}

            {isAuthModalOpen && !session && (
                <Modal title="Únete o Inicia Sesión" onClose={() => setAuthModalOpen(false)}>
                    <AuthForm onAuthSuccess={() => setAuthModalOpen(false)} />
                </Modal>
            )}

            {isPostModalOpen && session && (
                <Modal title="Publicar un Nuevo Artículo" onClose={() => setPostModalOpen(false)}>
                    <PostItemForm onPostSuccess={handlePostSuccess} />
                </Modal>
            )}

            {selectedItem && (
                <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}

            {isProfileModalOpen && session && (
                <ProfileModal onClose={() => setProfileModalOpen(false)} />
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