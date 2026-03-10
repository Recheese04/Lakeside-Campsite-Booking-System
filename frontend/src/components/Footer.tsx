import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Brand Info */}
                    <div className="md:col-span-1">
                        <h3 className="text-white text-xl font-bold mb-4">Lakeside Campsite</h3>
                        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                            Experience the best of Philippine nature. We provide premium outdoor accommodations for families and adventurers alike.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Campsites</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Amenities</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Book Now</a></li>
                            <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                Mabini, Bohol, Philippines
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-emerald-500" />
                                +63 912 345 6789
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-emerald-500" />
                                hello@lakesidecampsite.ph
                            </li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Lakeside Campsite Booking System. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
