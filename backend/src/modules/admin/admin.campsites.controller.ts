import { Request, Response } from 'express';
import prisma from '../../config/prisma';

/** GET /api/admin/campsites */
export const getAll = async (req: Request, res: Response) => {
    try {
        const { status, search } = req.query;
        const where: any = {};
        if (status) where.status = status;
        if (search) where.name = { contains: search as string, mode: 'insensitive' };

        const campsites = await prisma.campsite.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { bookings: true, reviews: true } } },
        });
        res.json(campsites);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch campsites: ' + error.message });
    }
};

/** POST /api/admin/campsites */
export const create = async (req: Request, res: Response) => {
    try {
        const { name, description, pricePerNight, capacity, location, amenities, images } = req.body;
        const campsite = await prisma.campsite.create({
            data: { name, description, pricePerNight, capacity, location, amenities: amenities || [], images: images || [] },
        });
        res.status(201).json(campsite);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create campsite: ' + error.message });
    }
};

/** PUT /api/admin/campsites/:id */
export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const campsite = await prisma.campsite.update({
            where: { id },
            data: req.body,
        });
        res.json(campsite);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update campsite: ' + error.message });
    }
};

/** DELETE /api/admin/campsites/:id */
export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.campsite.delete({ where: { id } });
        res.json({ message: 'Campsite deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete campsite: ' + error.message });
    }
};
