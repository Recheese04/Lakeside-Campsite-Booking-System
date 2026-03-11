import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes';
import bookingRoutes from './modules/booking/booking.routes';
import campsiteRoutes from './modules/campsite/campsite.routes';
import adminRoutes from './modules/admin/admin.routes';
import { errorHandler } from './middleware/error.handler';

const app = express();

app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/campsites', campsiteRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;
