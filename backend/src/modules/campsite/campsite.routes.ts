import { Router } from 'express';

const router = Router();

// GET /api/campsites
router.get('/', (_req, res) => {
    res.json({ message: 'Campsites route placeholder' });
});

export default router;
