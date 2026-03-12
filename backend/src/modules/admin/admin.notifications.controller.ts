import { Request, Response } from 'express';
import prisma from '../../config/prisma';

/** POST /api/admin/notifications */
export const send = async (req: Request, res: Response) => {
    try {
        const { title, message, type, recipientIds } = req.body;
        const sentById = req.user?.id;

        if (recipientIds && Array.isArray(recipientIds) && recipientIds.length > 0) {
            // Send to specific users
            const notifications = await prisma.notification.createMany({
                data: recipientIds.map((recipientId: string) => ({
                    title, message, type: type || 'General', recipientId, sentById,
                })),
            });
            res.status(201).json({ message: `Sent to ${notifications.count} user(s)`, count: notifications.count });
        } else {
            // Broadcast to all
            const notification = await prisma.notification.create({
                data: { title, message, type: type || 'General', sentById },
            });
            res.status(201).json(notification);
        }
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to send notification: ' + error.message });
    }
};

/** GET /api/admin/notifications */
export const getAll = async (_req: Request, res: Response) => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        res.json(notifications);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch notifications: ' + error.message });
    }
};
