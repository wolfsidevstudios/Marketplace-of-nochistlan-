
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';
import { Post, Profile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Avatar from '../components/common/Avatar';
import Feed from '../components/Feed';
import Button from '../components/common/Button';
import VerifiedBadge from '../components/common/VerifiedBadge';

interface ProfilePageProps {
    userId: string;
    onBack: () => void;
    onNavigateToProfile: (userId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId, onBack, onNavigateToProfile }) => {
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    const isOwnProfile = currentUser?.id === userId;

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);

            // Fetch profile details
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError || !profileData) {
                setError('No se pudo encontrar el perfil.');
                setLoading(false);
                return;
            }
            setProfile(profileData);

            // Fetch user's posts
            const { data: postData, error: postError } = await supabase
                .from('items')
                .select('*, profiles(*)')
                .eq('userId', userId)
                .order('createdAt', { ascending: false });

            if (!postError) {
                setPosts(postData as Post[] || []);
            }
            
            // Fetch follower/following counts
             const { count: followerCount } = await supabase.from('followers').select('*', { count: 'exact' }).eq('following_id', userId);
             setFollowers(followerCount ?? 0);

             const { count: followingCount } = await supabase.from('followers').select('*', { count: 'exact' }).eq('follower_id', userId);
             setFollowing(followingCount ?? 0);

            // Check if current user is following this profile
            if (currentUser && !isOwnProfile) {
                const { data: followData, error: followError } = await supabase
                    .from('followers')
                    .select('*')
                    .eq('follower_id', currentUser.id)
                    .eq('following_id', userId)
                    .maybeSingle();
                
                setIsFollowing(!!followData);
            }

            setLoading(false);
        };

        fetchProfileData();
    }, [userId, currentUser, isOwnProfile]);
    
    const handleFollowToggle = async () => {
        if (!currentUser || isOwnProfile || isFollowLoading) return;
        
        setIsFollowLoading(true);

        if (isFollowing) {
            // Unfollow
            const { error } = await supabase.from('followers')
                .delete()
                .eq('follower_id', currentUser.id)
                .eq('following_id', userId);
            
            if (!error) {
                setIsFollowing(false);
                setFollowers(f => f - 1);
            }
        } else {
            // Follow
            const { error } = await supabase.from('followers')
                .insert({ follower_id: currentUser.id, following_id: userId });
            
            if (!error) {
                setIsFollowing(true);
                setFollowers(f => f + 1);
            }
        }
        setIsFollowLoading(false);
    }


    if (loading) {
        return <div className="text-center py-20">Cargando perfil...</div>;
    }

    if (error || !profile) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    return (
        <div>
            <button onClick={onBack} className="flex items-center gap-2 font-semibold text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeftIcon className="w-5 h-5"/>
                Volver
            </button>
            
            {/* Banner and Profile Header */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                    <div className="h-48 bg-gray-200">
                        {profile.banner_url && (
                            <img src={profile.banner_url} alt={`${profile.name}'s banner`} className="w-full h-full object-cover"/>
                        )}
                    </div>
                    <div className="absolute top-full left-6 -translate-y-1/2">
                         <Avatar src={profile.avatar_url} name={profile.name} size="xl" className="border-4 border-white"/>
                    </div>
                </div>

                <div className="pt-16 pb-6 px-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                                {profile.is_verified && <VerifiedBadge />}
                            </div>
                            <p className="text-gray-500 flex items-center mt-1">
                                <LocationMarkerIcon className="w-4 h-4 mr-1"/>
                                {profile.location}
                            </p>
                             <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span><strong className="text-gray-800">{followers}</strong> Seguidores</span>
                                <span><strong className="text-gray-800">{following}</strong> Siguiendo</span>
                            </div>
                        </div>
                        
                        {!isOwnProfile && currentUser && (
                            <Button onClick={handleFollowToggle} disabled={isFollowLoading} variant={isFollowing ? 'secondary' : 'primary'}>
                                {isFollowing ? 'Siguiendo' : 'Seguir'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* User's Posts */}
            <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Publicaciones de {profile.name.split(' ')[0]}</h3>
                <Feed
                    posts={posts}
                    users={[]}
                    loading={false}
                    searchType="posts"
                    onItemClick={() => { /* ItemDetail will be opened by App.tsx */}}
                    onUserClick={onNavigateToProfile}
                />
            </div>

        </div>
    );
};


const ArrowLeftIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const LocationMarkerIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


export default ProfilePage;