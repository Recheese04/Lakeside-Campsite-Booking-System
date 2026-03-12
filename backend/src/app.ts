import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes';
import bookingRoutes from './modules/booking/booking.routes';
import campsiteRoutes from './modules/campsite/campsite.routes';
import adminRoutes from './modules/admin/admin.routes';
import { errorHandler } from './middleware/error.handler';

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
}));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

import uploadRoutes from './modules/upload/upload.routes';
import customerRoutes from './modules/customer/customer.routes';
import path from 'path';

// Health Check for UptimeRobot (Keeps Render instance awake)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// TEMPORARY: Debug routes for Render Free Tier (No Shell)
// Visit: /api/debug/test-db to check connectivity
app.get('/api/debug/test-db', async (req, res) => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    try {
        await prisma.$connect();
        const count = await prisma.user.count();
        res.json({ status: '✅ Connected', users: count });
    } catch (err: any) {
        res.status(500).json({ status: '❌ Failed', error: err.message, code: err.code });
    } finally {
        await prisma.$disconnect();
    }
});

// Visit: /api/debug/seed-admin to create admin@example.com / admin123
app.get('/api/debug/seed-admin', async (req, res) => {
    const { PrismaClient } = await import('@prisma/client');
    const bcrypt = await import('bcryptjs');
    const prisma = new PrismaClient();
    try {
        const hashedPassword = await bcrypt.default.hash('admin123', 12);
        const admin = await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: { password: hashedPassword, role: 'ADMIN' },
            create: {
                email: 'admin@example.com',
                password: hashedPassword,
                firstName: 'System',
                lastName: 'Admin',
                role: 'ADMIN',
                isVerified: true
            },
        });
        res.json({ status: '✅ Admin Ready', email: admin.email });
    } catch (err: any) {
        res.status(500).json({ status: '❌ Seed Failed', error: err.message });
    } finally {
        await prisma.$disconnect();
    }
});

// ... (existing routes)
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/campsites', campsiteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/customer', customerRoutes);

// Serve uploads folder statically so frontend can display images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(errorHandler);

export default app;
