import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Dashboard Summary ───
export const getDashboard = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: { campsite: true, payment: true },
            orderBy: { checkIn: 'desc' },
        });

        const now = new Date();
        const upcoming = bookings.filter(b => new Date(b.checkIn) > now && b.status !== 'CANCELLED');
        const totalNights = bookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, b) => {
                const nights = Math.ceil((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / (1000 * 60 * 60 * 24));
                return sum + nights;
            }, 0);
        const totalSpent = bookings
            .filter(b => b.paymentStatus === 'PAID')
            .reduce((sum, b) => sum + Number(b.totalPrice), 0);

        const campsites = await prisma.campsite.findMany({ where: { status: 'AVAILABLE' } });
        const availability = await Promise.all(campsites.map(async (c) => {
            const activeBookings = await prisma.booking.count({
                where: { campsiteId: c.id, status: { in: ['PENDING', 'CONFIRMED'] }, checkOut: { gte: now } },
            });
            return { id: c.id, name: c.name, location: c.location, pricePerNight: c.pricePerNight, images: c.images, total: c.capacity, booked: activeBookings, available: c.capacity - activeBookings };
        }));

        const unreadNotifs = await prisma.notification.count({
            where: { OR: [{ recipientId: userId }, { recipientId: null }], isRead: false },
        });

        res.json({
            stats: {
                upcomingBookings: upcoming.length,
                totalNights,
                totalSpent,
                unreadNotifications: unreadNotifs,
            },
            upcomingBookings: upcoming.slice(0, 4).map(b => ({
                id: b.id,
                campsite: b.campsite.name,
                location: b.campsite.location,
                images: b.campsite.images,
                checkIn: b.checkIn,
                checkOut: b.checkOut,
                guestCount: b.guestCount,
                status: b.status,
                totalPrice: b.totalPrice,
                daysUntil: Math.ceil((new Date(b.checkIn).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
            })),
            campsiteAvailability: availability,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load dashboard' });
    }
};

// ─── Campsites ───
export const getCampsites = async (_req: Request, res: Response) => {
    try {
        const campsites = await prisma.campsite.findMany({
            where: { status: 'AVAILABLE' },
            orderBy: { name: 'asc' },
        });
        res.json(campsites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load campsites' });
    }
};

// ─── Bookings ───
export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: req.user!.id },
            include: { campsite: true, payment: true, equipments: { include: { equipment: true } } },
            orderBy: { checkIn: 'desc' },
        });
        res.json(bookings.map(b => ({
            id: b.id,
            campsite: b.campsite.name,
            campsiteId: b.campsiteId,
            location: b.campsite.location,
            images: b.campsite.images,
            description: b.campsite.description,
            amenities: b.campsite.amenities,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            nights: Math.ceil((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
            guestCount: b.guestCount,
            status: b.status,
            totalPrice: b.totalPrice,
            paymentStatus: b.paymentStatus,
            paymentMethod: b.payment?.method || null,
            specialNotes: b.specialNotes,
            equipments: b.equipments.map(e => ({ name: e.equipment.name, quantity: e.quantity, pricePerDay: e.equipment.pricePerDay })),
            createdAt: b.createdAt,
        })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load bookings' });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { campsiteId, checkIn, checkOut, guestCount, specialNotes, equipments } = req.body;
        const campsite = await prisma.campsite.findUnique({ where: { id: campsiteId } });
        if (!campsite) return res.status(404).json({ error: 'Campsite not found' });

        const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
        let total = Number(campsite.pricePerNight) * nights;

        // Add equipment costs
        let equipmentData: { equipmentId: string; quantity: number }[] = [];
        if (equipments && equipments.length > 0) {
            for (const eq of equipments) {
                const equip = await prisma.equipment.findUnique({ where: { id: eq.equipmentId } });
                if (equip) {
                    total += Number(equip.pricePerDay) * eq.quantity * nights;
                    equipmentData.push({ equipmentId: eq.equipmentId, quantity: eq.quantity });
                }
            }
        }

        const booking = await prisma.booking.create({
            data: {
                userId: req.user!.id,
                campsiteId,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                guestCount,
                totalPrice: total,
                specialNotes,
                equipments: equipmentData.length > 0 ? { create: equipmentData } : undefined,
            },
            include: { campsite: true },
        });
        res.status(201).json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const booking = await prisma.booking.findFirst({
            where: { id: req.params.id, userId: req.user!.id },
        });
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (booking.status === 'CANCELLED') return res.status(400).json({ error: 'Already cancelled' });

        const updated = await prisma.booking.update({
            where: { id: req.params.id },
            data: { status: 'CANCELLED' },
        });
        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};

// ─── Meals ───
export const getMenu = async (_req: Request, res: Response) => {
    try {
        const items = await prisma.mealItem.findMany({ orderBy: { name: 'asc' } });
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load menu' });
    }
};

export const placeOrder = async (req: Request, res: Response) => {
    try {
        const { items, notes, deliveryTime } = req.body;
        // items = [{ mealItemId, quantity }]
        let totalPrice = 0;
        const orderItems: any[] = [];
        for (const item of items) {
            const meal = await prisma.mealItem.findUnique({ where: { id: item.mealItemId } });
            if (!meal) continue;
            totalPrice += Number(meal.price) * item.quantity;
            orderItems.push({ mealItemId: meal.id, name: meal.name, quantity: item.quantity, price: Number(meal.price) });
        }

        const order = await prisma.mealOrder.create({
            data: {
                userId: req.user!.id,
                items: orderItems,
                totalPrice,
                notes,
                deliveryTime: deliveryTime ? new Date(deliveryTime) : null,
            },
        });
        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to place order' });
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.mealOrder.findMany({
            where: { userId: req.user!.id },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load orders' });
    }
};

// ─── Equipment & Activities ───
export const getEquipment = async (_req: Request, res: Response) => {
    try {
        const equipment = await prisma.equipment.findMany({
            where: { stock: { gt: 0 } },
            orderBy: { name: 'asc' },
        });
        res.json(equipment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load equipment' });
    }
};

export const getActivities = async (_req: Request, res: Response) => {
    try {
        const activities = await prisma.activity.findMany({
            where: { available: true },
            orderBy: { name: 'asc' },
        });
        res.json(activities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load activities' });
    }
};

// ─── Notifications ───
export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { OR: [{ recipientId: req.user!.id }, { recipientId: null }] },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load notifications' });
    }
};

export const markNotificationRead = async (req: Request, res: Response) => {
    try {
        await prisma.notification.update({
            where: { id: req.params.id },
            data: { isRead: true },
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to mark as read' });
    }
};

export const markAllNotificationsRead = async (req: Request, res: Response) => {
    try {
        await prisma.notification.updateMany({
            where: { OR: [{ recipientId: req.user!.id }, { recipientId: null }], isRead: false },
            data: { isRead: true },
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
};

// ─── Profile ───
export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true, role: true, createdAt: true },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const bookingCount = await prisma.booking.count({ where: { userId: req.user!.id } });
        const reviewCount = await prisma.review.count({ where: { userId: req.user!.id } });

        res.json({ ...user, bookingCount, reviewCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load profile' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, phone } = req.body;
        const user = await prisma.user.update({
            where: { id: req.user!.id },
            data: { firstName, lastName, phone },
            select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatarUrl: true, role: true },
        });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id: req.user!.id }, data: { password: hashed } });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

// ─── Reviews ───
export const submitReview = async (req: Request, res: Response) => {
    try {
        const { campsiteId, rating, comment } = req.body;

        // Check user has a completed booking for this campsite
        const completedBooking = await prisma.booking.findFirst({
            where: { userId: req.user!.id, campsiteId, status: 'COMPLETED' },
        });
        if (!completedBooking) return res.status(400).json({ error: 'You can only review campsites you have visited' });

        const review = await prisma.review.upsert({
            where: { userId_campsiteId: { userId: req.user!.id, campsiteId } },
            update: { rating, comment },
            create: { userId: req.user!.id, campsiteId, rating, comment },
        });
        res.status(201).json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit review' });
    }
};

export const getMyReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { userId: req.user!.id },
            include: { campsite: { select: { name: true, images: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load reviews' });
    }
};
