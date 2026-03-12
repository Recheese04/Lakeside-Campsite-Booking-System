import { Request, Response } from 'express';
import prisma from '../../config/prisma';

/** GET /api/admin/users */
export const getAll = async (req: Request, res: Response) => {
    try {
        const { role, search } = req.query;
        const where: any = {};
        if (role) where.role = role;
        if (search) {
            where.OR = [
                { firstName: { contains: search as string, mode: 'insensitive' } },
                { lastName: { contains: search as string, mode: 'insensitive' } },
                { email: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        const users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, email: true, firstName: true, lastName: true,
                phone: true, role: true, isVerified: true, isBanned: true,
                createdAt: true,
                _count: { select: { bookings: true, reviews: true } },
            },
        });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch users: ' + error.message });
    }
};

/** PUT /api/admin/users/:id/role */
export const updateRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { role },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
        });
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update role: ' + error.message });
    }
};

/** PUT /api/admin/users/:id/status */
export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { isBanned } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { isBanned },
            select: { id: true, email: true, firstName: true, lastName: true, isBanned: true },
        });
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update user status: ' + error.message });
    }
};
