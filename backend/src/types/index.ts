export enum UserRole {
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    CUSTOMER = 'CUSTOMER',
}

export interface User {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
}

export interface Campsite {
    id: string;
    name: string;
    description: string;
    pricePerNight: number;
    capacity: number;
    images: string[];
}

export interface Booking {
    id: string;
    userId: string;
    campsiteId: string;
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}
