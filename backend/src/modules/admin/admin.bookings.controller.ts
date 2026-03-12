import { Request, Response } from 'express';
import prisma from '../../config/prisma';

/** GET /api/admin/bookings */
export const getAll = async (req: Request, res: Response) => {
    try {
        const { status, paymentStatus, search } = req.query;
        const where: any = {};
        if (status) where.status = status;
        if (paymentStatus) where.paymentStatus = paymentStatus;
        if (search) {
            where.OR = [
                { user: { firstName: { contains: search as string, mode: 'insensitive' } } },
                { user: { lastName: { contains: search as string, mode: 'insensitive' } } },
                { campsite: { name: { contains: search as string, mode: 'insensitive' } } },
            ];
        }

        const bookings = await prisma.booking.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                campsite: { select: { name: true } },
                payment: true,
            },
        });
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch bookings: ' + error.message });
    }
};

/** PUT /api/admin/bookings/:id/status */
export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const booking = await prisma.booking.update({
            where: { id: req.params.id },
            data: { status },
        });
        res.json(booking);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update booking: ' + error.message });
    }
};

/** GET /api/admin/bookings/revenue */
export const getRevenue = async (_req: Request, res: Response) => {
    try {
        const totalRevenue = await prisma.payment.aggregate({ _sum: { amount: true } });
        const monthlyRevenue = await prisma.payment.groupBy({
            by: ['paidAt'],
            _sum: { amount: true },
            where: { paidAt: { not: null } },
            orderBy: { paidAt: 'desc' },
        });

        const bookingsByStatus = await prisma.booking.groupBy({
            by: ['status'],
            _count: true,
        });

        res.json({
            totalRevenue: totalRevenue._sum.amount || 0,
            monthlyRevenue,
            bookingsByStatus,
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch revenue: ' + error.message });
    }
};
