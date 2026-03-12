import { Request, Response } from 'express';
import prisma from '../../config/prisma';

/** GET /api/admin/dashboard/stats */
export const getStats = async (_req: Request, res: Response) => {
    try {
        const [totalBookings, totalRevenue, totalUsers, totalCampsites, pendingBookings] = await Promise.all([
            prisma.booking.count(),
            prisma.payment.aggregate({ _sum: { amount: true } }),
            prisma.user.count({ where: { role: 'CUSTOMER' } }),
            prisma.campsite.count(),
            prisma.booking.count({ where: { status: 'PENDING' } }),
        ]);

        const activeBookings = await prisma.booking.count({
            where: { status: 'CONFIRMED', checkOut: { gte: new Date() } },
        });

        const occupancyRate = totalCampsites > 0
            ? Math.round((activeBookings / totalCampsites) * 100)
            : 0;

        res.json({
            totalBookings,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalUsers,
            totalCampsites,
            pendingBookings,
            activeBookings,
            occupancyRate,
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch stats: ' + error.message });
    }
};

/** GET /api/admin/dashboard/recent-bookings */
export const getRecentBookings = async (_req: Request, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                campsite: { select: { name: true } },
            },
        });
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch recent bookings: ' + error.message });
    }
};

/** GET /api/admin/dashboard/pending-meals */
export const getPendingMeals = async (_req: Request, res: Response) => {
    try {
        const orders = await prisma.mealOrder.findMany({
            where: { status: { in: ['PENDING', 'PREPARING'] } },
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true } },
            },
        });
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch pending meals: ' + error.message });
    }
};
