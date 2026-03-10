import { create } from 'zustand';

interface Booking {
    id: string;
    campsiteId: string;
    checkIn: string;
    checkOut: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

interface BookingState {
    bookings: Booking[];
    setBookings: (bookings: Booking[]) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    bookings: [],
    setBookings: (bookings: Booking[]) => set({ bookings }),
}));
