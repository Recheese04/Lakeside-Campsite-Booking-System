import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import * as customer from './customer.controller';

const router = Router();

// All customer routes require authentication
router.use(authenticate);

// ─── Dashboard ───
router.get('/dashboard', customer.getDashboard);

// ─── Campsites ───
router.get('/campsites', customer.getCampsites);

// ─── Bookings ───
router.get('/bookings', customer.getMyBookings);
router.post('/bookings', customer.createBooking);
router.put('/bookings/:id/cancel', customer.cancelBooking);

// ─── Meals ───
router.get('/meals/menu', customer.getMenu);
router.post('/meals/orders', customer.placeOrder);
router.get('/meals/orders', customer.getMyOrders);

// ─── Equipment & Activities ───
router.get('/equipment', customer.getEquipment);
router.get('/activities', customer.getActivities);

// ─── Notifications ───
router.get('/notifications', customer.getMyNotifications);
router.put('/notifications/:id/read', customer.markNotificationRead);
router.put('/notifications/read-all', customer.markAllNotificationsRead);

// ─── Profile ───
router.get('/profile', customer.getProfile);
router.put('/profile', customer.updateProfile);
router.put('/profile/password', customer.changePassword);

// ─── Reviews ───
router.post('/reviews', customer.submitReview);
router.get('/reviews', customer.getMyReviews);

export default router;
