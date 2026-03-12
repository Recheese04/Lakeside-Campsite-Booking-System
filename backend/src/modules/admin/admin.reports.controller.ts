import { Request, Response } from 'express';
import prisma from '../../config/prisma';

/** GET /api/admin/reports/revenue */
export const getRevenue = async (req: Request, res: Response) => {
    try {
        const { period } = req.query; // 'daily' | 'weekly' | 'monthly'

        const totalRevenue = await prisma.payment.aggregate({ _sum: { amount: true } });

        // Revenue by booking creation date (past 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentPayments = await prisma.payment.findMany({
            where: { paidAt: { gte: thirtyDaysAgo } },
            select: { amount: true, paidAt: true },
            orderBy: { paidAt: 'asc' },
        });

        res.json({
            totalRevenue: totalRevenue._sum.amount || 0,
            period: period || 'daily',
            recentPayments,
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch revenue: ' + error.message });
    }
};

/** GET /api/admin/reports/occupancy */
export const getOccupancy = async (_req: Request, res: Response) => {
    try {
        const totalCampsites = await prisma.campsite.count();
        const activeBookings = await prisma.booking.count({
            where: { status: 'CONFIRMED', checkOut: { gte: new Date() } },
        });

        const campsiteBookings = await prisma.campsite.findMany({
            select: {
                id: true, name: true, capacity: true,
                _count: { select: { bookings: true } },
            },
        });

        res.json({
            totalCampsites,
            activeBookings,
            occupancyRate: totalCampsites > 0 ? Math.round((activeBookings / totalCampsites) * 100) : 0,
            campsiteBookings,
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch occupancy: ' + error.message });
    }
};

/** GET /api/admin/reports/top-campsites */
export const getTopCampsites = async (_req: Request, res: Response) => {
    try {
        const campsites = await prisma.campsite.findMany({
            select: {
                id: true, name: true, pricePerNight: true,
                _count: { select: { bookings: true, reviews: true } },
                reviews: { select: { rating: true } },
            },
            orderBy: { bookings: { _count: 'desc' } },
            take: 10,
        });

        const result = campsites.map(c => ({
            id: c.id,
            name: c.name,
            pricePerNight: c.pricePerNight,
            totalBookings: c._count.bookings,
            totalReviews: c._count.reviews,
            avgRating: c.reviews.length ? (c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length).toFixed(1) : null,
        }));

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch top campsites: ' + error.message });
    }
};

/** GET /api/admin/reports/users */
export const getUserAnalytics = async (_req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();
        const usersByRole = await prisma.user.groupBy({ by: ['role'], _count: true });

        // New registrations in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsers = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });

        const bannedUsers = await prisma.user.count({ where: { isBanned: true } });

        res.json({ totalUsers, usersByRole, newUsers, bannedUsers });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch user analytics: ' + error.message });
    }
};
