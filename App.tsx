
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Feed from './components/Feed';
import Modal from './components/common/Modal';
import AuthForm from './components/AuthForm';
import PostItemForm from './components/PostItemForm';
import ItemDetail from './components/ItemDetail';
import { Post, Profile, PostType, PostTypeFilter } from './types';
import { supabase } from './services/supabaseService';
import Button from './components/common/Button';
import EmailConfirmationBanner from './components/EmailConfirmationBanner';
import WelcomePopup from './components/WelcomePopup';
import BottomNavBar from './components/BottomNavBar';
import ProfileModal from './components/ProfileModal';
import CreateOptionsModal from './components/CreateOptionsModal';
import PostJobForm from './components/PostJobForm';
import PostRentalForm from './components/PostRentalForm';
import VerificationModal from './components/VerificationModal';
import ProfilePage from './pages/ProfilePage';
import EditProfileModal from './components/EditProfileModal';


const AppContent: React.FC = () => {
    const { session, user } = useAuth();
    const [view, setView] = useState<{page: 'feed' | 'profile', profileId?: string}>({ page: 'feed' });

    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [isCreateOptionsModalOpen, setCreateOptionsModalOpen] = useState(false);
    const [isPostItemModalOpen, setPostItemModalOpen] = useState(false);
    const [isPostJobModalOpen, setPostJobModalOpen] = useState(false);
    const [isPostRentalModalOpen, setPostRentalModalOpen] = useState(false);
    const [isWelcomeModalOpen, setWelcomeModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
    const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);

    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<Post | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<'posts' | 'users'>('posts');
    const [filter, setFilter] = useState<PostTypeFilter>(null);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedMarketplace');
        if (!hasVisited) {
            setWelcomeModalOpen(true);
            localStorage.setItem('hasVisitedMarketplace', 'true');
        }
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        if (searchType === 'posts') {
            let query = supabase
                .from('items')
                .select('*, profiles(*)')
                .order('createdAt', { ascending: false });

            if (searchTerm) {
                query = query.or(`description.ilike.%${searchTerm}%,jobTitle.ilike.%${searchTerm}%`);
            }

            if (filter) {
                query = query.eq('postType', filter);
            }

            const { data, error: dbError } = await query;
            if (dbError) {
                handleFetchError(dbError);
            } else {
                setPosts(data as Post[] || []);
            }
        } else { // searchType === 'users'
            let query = supabase
                .from('profiles')
                .select('*')
                .order('name', { ascending: true });

            if (searchTerm) {
                query = query.ilike('name', `%${searchTerm}%`);
            }
            const { data, error: dbError } = await query;
            if (dbError) {
                handleFetchError(dbError);
            } else {
                setUsers(data || []);
            }
        }
        setLoading(false);
    };

    const handleFetchError = (dbError: any) => {
        console.error("Error fetching data:", dbError);
        let errorMessage = "No se pudieron cargar los datos. Por favor, revisa tu conexión e inténtalo de nuevo.";
        if (dbError.message.includes('relation "public.items" does not exist') || dbError.message.includes('relation "public.profiles" does not exist')) {
            errorMessage = "Una tabla requerida no existe. Por favor, asegúrate de haber ejecutado las migraciones de la base de datos en tu proyecto de Supabase.";
        } else if (dbError.message.includes("violates row-level security policy")) {
            errorMessage = "No se pudo cargar debido a políticas de seguridad. Por favor, revisa las políticas de Seguridad a Nivel de Fila (RLS) de Supabase.";
        }
        setError(errorMessage);
    }


    useEffect(() => {
        if(view.page === 'feed') {
            fetchData();
        }
    }, [searchTerm, filter, searchType, view]);
    
    useEffect(() => {
        if(view.page === 'feed') {
            // Reset filters when switching search type
            setFilter(null);
        }
    }, [searchType]);

    const handlePostSuccess = (newItem: Post) => {
        setPostItemModalOpen(false);
        setPostJobModalOpen(false);
        setPostRentalModalOpen(false);
        fetchData(); // Refetch all to get latest
    };
    
    const handleCrearClick = () => {
        if (user?.is_verified) { // Updated to check new profile property
            setCreateOptionsModalOpen(true);
        } else if (!user) {
            setAuthModalOpen(true);
        } else {
             // If user is logged in but not verified, maybe show a message
            setProfileModalOpen(true); // Or open profile modal to encourage verification
        }
    };
    
    const openPostForm = (type: PostType) => {
        setCreateOptionsModalOpen(false);
        if (type === 'item') setPostItemModalOpen(true);
        if (type === 'job') setPostJobModalOpen(true);
        if (type === 'rental') setPostRentalModalOpen(true);
    };

    const handleSearch = (query: string) => {
        setView({ page: 'feed' });
        setSearchTerm(query);
    };
    
    const handleNavigateToProfile = (profileId: string) => {
        setSelectedItem(null); // Close item detail if open
        setView({ page: 'profile', profileId });
    }

    const handleProfileClick = () => {
        if (session) {
            setProfileModalOpen(true);
        } else {
            setAuthModalOpen(true);
        }
    };
    
    const handleVerificationSuccess = () => {
        setVerificationModalOpen(false);
    };

    const renderContent = () => {
        if (view.page === 'profile' && view.profileId) {
            return <ProfilePage userId={view.profileId} onBack={() => setView({ page: 'feed'})} onNavigateToProfile={handleNavigateToProfile}/>;
        }

        return (
            <>
                 <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {searchType === 'posts' ? 'Publicado Recientemente' : `Resultados para "${searchTerm}"`}
                 </h2>
                 {error ? (
                    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold text-red-700">¡Ups! Algo salió mal.</h2>
                        <p className="mt-2 text-red-600">{error}</p>
                        <Button onClick={fetchData} className="mt-6">
                            Intentar de Nuevo
                        </Button>
                    </div>
                ) : (
                    <Feed 
                        posts={posts} 
                        users={users}
                        loading={loading} 
                        onItemClick={setSelectedItem} 
                        searchType={searchType}
                        onUserClick={(userId) => setView({ page: 'profile', profileId: userId })}
                    />
                )}
            </>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header 
                onLoginClick={() => setAuthModalOpen(true)} 
                onPostItemClick={handleCrearClick}
                onSearch={handleSearch}
                activeFilter={filter}
                onFilterChange={setFilter}
                searchType={searchType}
                onSearchTypeChange={setSearchType}
                onProfileClick={handleProfileClick}
                onLogoClick={() => setView({ page: 'feed' })}
            />
            <EmailConfirmationBanner />
            <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
                 {renderContent()}
            </main>

            <BottomNavBar 
                onComprarClick={() => setView({ page: 'feed' })}
                onCrearClick={handleCrearClick}
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
            
            {isCreateOptionsModalOpen && (
                <CreateOptionsModal 
                    onClose={() => setCreateOptionsModalOpen(false)} 
                    onSelectOption={openPostForm}
                />
            )}

            {isPostItemModalOpen && session && (
                <Modal title="Vender un Artículo" onClose={() => setPostItemModalOpen(false)}>
                    <PostItemForm onPostSuccess={handlePostSuccess} />
                </Modal>
            )}
            
            {isPostJobModalOpen && session && (
                <Modal title="Publicar un Empleo" onClose={() => setPostJobModalOpen(false)}>
                    <PostJobForm onPostSuccess={handlePostSuccess} />
                </Modal>
            )}

            {isPostRentalModalOpen && session && (
                <Modal title="Rentar una Propiedad" onClose={() => setPostRentalModalOpen(false)}>
                    <PostRentalForm onPostSuccess={handlePostSuccess} />
                </Modal>
            )}

            {selectedItem && (
                <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} onNavigateToProfile={handleNavigateToProfile}/>
            )}

            {isProfileModalOpen && session && user && (
                <ProfileModal 
                    onClose={() => setProfileModalOpen(false)}
                    onVerifyClick={() => {
                        setProfileModalOpen(false);
                        setVerificationModalOpen(true);
                    }}
                    onEditProfileClick={() => {
                        setProfileModalOpen(false);
                        setEditProfileModalOpen(true);
                    }}
                    onViewProfileClick={() => {
                        setProfileModalOpen(false);
                        handleNavigateToProfile(user.id);
                    }}
                />
            )}

            {isVerificationModalOpen && session && (
                <VerificationModal
                    onClose={() => setVerificationModalOpen(false)}
                    onSuccess={handleVerificationSuccess}
                />
            )}
            
            {isEditProfileModalOpen && session && (
                <EditProfileModal 
                    onClose={() => setEditProfileModalOpen(false)}
                />
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