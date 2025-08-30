
export interface User {
    id: string;
    name: string;
    location: string;
    createdAt: string;
    isConfirmed: boolean;
}

export interface Session {
    user: User;
    token: string;
}

export interface Item {
    id: string;

    price: number;
    description: string;
    contactInfo: string;
    acceptsDigitalPayment: boolean;
    mediaUrls: { url: string; type: 'image' | 'video' }[];
    userId: string;
    userName: string;
    userLocation: string;
    createdAt: string;
}

export type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT';