
export interface User {
    id: string;
    name: string;
    location: string;
    createdAt: string;
    isConfirmed: boolean;
    isVerified?: boolean;
}

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
    userName: string;
    userLocation: string;
    createdAt: string;
    userIsVerified?: boolean;

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