import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// ─── EQUIPMENT ───

/** GET /api/admin/equipment */
export const getAll = async (_req: Request, res: Response) => {
    try {
        const equipment = await prisma.equipment.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { bookings: true } } },
        });
        res.json(equipment);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch equipment: ' + error.message });
    }
};

/** POST /api/admin/equipment */
export const create = async (req: Request, res: Response) => {
    try {
        const item = await prisma.equipment.create({ data: req.body });
        res.status(201).json(item);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create equipment: ' + error.message });
    }
};

/** PUT /api/admin/equipment/:id */
export const update = async (req: Request, res: Response) => {
    try {
        const item = await prisma.equipment.update({ where: { id: req.params.id }, data: req.body });
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update equipment: ' + error.message });
    }
};

/** DELETE /api/admin/equipment/:id */
export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.equipment.delete({ where: { id: req.params.id } });
        res.json({ message: 'Equipment deleted' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete equipment: ' + error.message });
    }
};

/** GET /api/admin/equipment/reservations */
export const getReservations = async (_req: Request, res: Response) => {
    try {
        const reservations = await prisma.bookingEquipment.findMany({
            orderBy: { booking: { checkIn: 'desc' } },
            include: {
                equipment: { select: { name: true, pricePerDay: true } },
                booking: {
                    select: {
                        checkIn: true, checkOut: true, status: true,
                        user: { select: { firstName: true, lastName: true } },
                    },
                },
            },
        });
        res.json(reservations);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch reservations: ' + error.message });
    }
};

// ─── ACTIVITIES ───

/** GET /api/admin/activities */
export const getActivities = async (_req: Request, res: Response) => {
    try {
        const activities = await prisma.activity.findMany({ orderBy: { name: 'asc' } });
        res.json(activities);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch activities: ' + error.message });
    }
};

/** POST /api/admin/activities */
export const createActivity = async (req: Request, res: Response) => {
    try {
        const activity = await prisma.activity.create({ data: req.body });
        res.status(201).json(activity);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create activity: ' + error.message });
    }
};

/** PUT /api/admin/activities/:id */
export const updateActivity = async (req: Request, res: Response) => {
    try {
        const activity = await prisma.activity.update({ where: { id: req.params.id }, data: req.body });
        res.json(activity);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update activity: ' + error.message });
    }
};

/** DELETE /api/admin/activities/:id */
export const deleteActivity = async (req: Request, res: Response) => {
    try {
        await prisma.activity.delete({ where: { id: req.params.id } });
        res.json({ message: 'Activity deleted' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete activity: ' + error.message });
    }
};
