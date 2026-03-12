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
