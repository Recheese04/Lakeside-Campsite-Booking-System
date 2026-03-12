import { Request, Response } from 'express';
import prisma from '../../config/prisma';

/** GET /api/admin/feedback */
export const getAll = async (req: Request, res: Response) => {
    try {
        const { rating } = req.query;
        const where: any = {};
        if (rating) where.rating = parseInt(rating as string);

        const reviews = await prisma.review.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                campsite: { select: { name: true } },
            },
        });

        // Summary stats
        const stats = await prisma.review.aggregate({
            _avg: { rating: true },
            _count: true,
        });

        res.json({ reviews, stats: { averageRating: stats._avg.rating || 0, total: stats._count } });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch feedback: ' + error.message });
    }
};

/** POST /api/admin/feedback/:id/respond */
export const respond = async (req: Request, res: Response) => {
    try {
        const { response } = req.body;
        const review = await prisma.review.update({
            where: { id: req.params.id },
            data: { adminResponse: response },
        });
        res.json(review);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to respond to feedback: ' + error.message });
    }
};
