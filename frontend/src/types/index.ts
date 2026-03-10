export interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
    name: string;
}

export interface Campsite {
    id: string;
    name: string;
    price: number;
}
