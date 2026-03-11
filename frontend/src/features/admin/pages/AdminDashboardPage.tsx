import {
    LayoutDashboard, Tent, UtensilsCrossed, Package, CalendarDays,
    Users, Bell, MessageSquare, TrendingUp
} from 'lucide-react';
import CamperLayout from '../../../components/CamperLayout';
import AdminOverview from '../components/AdminOverview';
import CampsiteManagement from '../components/CampsiteManagement';
import MealManagement from '../components/MealManagement';
import EquipmentManagement from '../components/EquipmentManagement';
import BookingManagement from '../components/BookingManagement';
import UserManagement from '../components/UserManagement';
import AdminNotifications from '../components/AdminNotifications';
import AdminFeedback from '../components/AdminFeedback';
import AdminReports from '../components/AdminReports';

const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campsites', label: 'Campsites', icon: Tent },
    { id: 'meals', label: 'Meal Management', icon: UtensilsCrossed },
    { id: 'equipment', label: 'Equipment & Activities', icon: Package },
    { id: 'bookings', label: 'Bookings & Payments', icon: CalendarDays },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
];

const sectionComponents: Record<string, JSX.Element> = {
    overview: <AdminOverview />,
    campsites: <CampsiteManagement />,
    meals: <MealManagement />,
    equipment: <EquipmentManagement />,
    bookings: <BookingManagement />,
    users: <UserManagement />,
    notifications: <AdminNotifications />,
    feedback: <AdminFeedback />,
    reports: <AdminReports />,
};

export default function AdminDashboardPage() {
    return <CamperLayout navItems={navItems} sectionComponents={sectionComponents} variant="admin" />;
}
