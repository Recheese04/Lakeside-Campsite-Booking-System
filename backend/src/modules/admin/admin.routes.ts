import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware';

// Controllers
import * as dashboard from './admin.dashboard.controller';
import * as campsites from './admin.campsites.controller';
import * as meals from './admin.meals.controller';
import * as equipment from './admin.equipment.controller';
import * as bookings from './admin.bookings.controller';
import * as users from './admin.users.controller';
import * as notifications from './admin.notifications.controller';
import * as feedback from './admin.feedback.controller';
import * as reports from './admin.reports.controller';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// ─── Dashboard ───
router.get('/dashboard/stats', dashboard.getStats);
router.get('/dashboard/recent-bookings', dashboard.getRecentBookings);
router.get('/dashboard/pending-meals', dashboard.getPendingMeals);

// ─── Campsites ───
router.get('/campsites', campsites.getAll);
router.post('/campsites', campsites.create);
router.put('/campsites/:id', campsites.update);
router.delete('/campsites/:id', campsites.remove);

// ─── Meals ───
router.get('/meals/items', meals.getMenuItems);
router.post('/meals/items', meals.createMenuItem);
router.put('/meals/items/:id', meals.updateMenuItem);
router.delete('/meals/items/:id', meals.deleteMenuItem);
router.get('/meals/orders', meals.getOrders);
router.put('/meals/orders/:id/status', meals.updateOrderStatus);

// ─── Equipment & Activities ───
router.get('/equipment', equipment.getAll);
router.post('/equipment', equipment.create);
router.put('/equipment/:id', equipment.update);
router.delete('/equipment/:id', equipment.remove);
router.get('/equipment/reservations', equipment.getReservations);
router.get('/activities', equipment.getActivities);
router.post('/activities', equipment.createActivity);
router.put('/activities/:id', equipment.updateActivity);
router.delete('/activities/:id', equipment.deleteActivity);

// ─── Bookings ───
router.get('/bookings', bookings.getAll);
router.put('/bookings/:id/status', bookings.updateStatus);
router.get('/bookings/revenue', bookings.getRevenue);

// ─── Users ───
router.get('/users', users.getAll);
router.put('/users/:id/role', users.updateRole);
router.put('/users/:id/status', users.updateStatus);

// ─── Notifications ───
router.get('/notifications', notifications.getAll);
router.post('/notifications', notifications.send);

// ─── Feedback ───
router.get('/feedback', feedback.getAll);
router.post('/feedback/:id/respond', feedback.respond);

// ─── Reports ───
router.get('/reports/revenue', reports.getRevenue);
router.get('/reports/occupancy', reports.getOccupancy);
router.get('/reports/top-campsites', reports.getTopCampsites);
router.get('/reports/users', reports.getUserAnalytics);

export default router;
