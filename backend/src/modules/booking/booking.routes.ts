import { Router } from 'express';

const router = Router();

// GET /api/bookings
router.get('/', (_req, res) => {
    res.json({ message: 'Bookings route placeholder' });
});

export default router;
