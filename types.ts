
export interface Profile {
    id: string; // This is the user ID from auth.users
    name: string;
    location: string;
    avatar_url: string | null;
    banner_url: string | null;
    is_verified: boolean;
    created_at: string;
}

// The user object from useAuth will now be a Profile object
export type User = Profile;

export interface Session {
    user: User;
    token: string;
}

export type PostType = 'item' | 'job' | 'rental';
export type PostTypeFilter = PostType | null;

export interface Post {
    id: string;
    postType: PostType;
    description: string;
    contactInfo: string;
    mediaUrls: { url: string; type: 'image' | 'video' }[];
    userId: string;
    createdAt: string;
    profiles: Profile; // Joined data from the 'profiles' table

    // Item-specific
    price?: number;
    acceptsDigitalPayment?: boolean;

    // Job-specific
    jobTitle?: string;
    salary?: string;
    jobType?: 'Tiempo Completo' | 'Medio Tiempo' | 'Contrato' | 'Temporal';
    
    // Rental-specific
    rentalPrice?: number;
    propertyType?: 'Casa' | 'Departamento' | 'Cuarto';
    bedrooms?: number;
    bathrooms?: number;
}


export type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT';