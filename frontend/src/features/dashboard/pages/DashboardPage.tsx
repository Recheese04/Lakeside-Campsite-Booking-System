import {
    LayoutDashboard, CalendarDays, User, CreditCard, LifeBuoy,
    UtensilsCrossed, TreePine, Bell, Star
} from 'lucide-react';
import CamperLayout from '../../../components/CamperLayout';
import DashboardOverview from '../components/DashboardOverview';
import MyBookings from '../components/MyBookings';
import ProfileSection from '../components/ProfileSection';
import PaymentSection from '../components/PaymentSection';
import SupportSection from '../components/SupportSection';
import FoodOrdersSection from '../components/FoodOrdersSection';
import ActivitiesSection from '../components/ActivitiesSection';
import NotificationsSection from '../components/NotificationsSection';
import FeedbackSection from '../components/FeedbackSection';

const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Campsite Booking', icon: CalendarDays },
    { id: 'food', label: 'Food Orders', icon: UtensilsCrossed },
    { id: 'activities', label: 'Activities & Rentals', icon: TreePine },
    { id: 'payment', label: 'Payments', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'feedback', label: 'Feedback', icon: Star },
    { id: 'support', label: 'Help / Support', icon: LifeBuoy },
];

const sectionComponents: Record<string, JSX.Element> = {
    overview: <DashboardOverview />,
    bookings: <MyBookings />,
    food: <FoodOrdersSection />,
    activities: <ActivitiesSection />,
    profile: <ProfileSection />,
    payment: <PaymentSection />,
    support: <SupportSection />,
    notifications: <NotificationsSection />,
    feedback: <FeedbackSection />,
};

export default function DashboardPage() {
    return <CamperLayout navItems={navItems} sectionComponents={sectionComponents} variant="user" />;
}
