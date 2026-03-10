import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tent, Flame, Wifi, Utensils, Waves, Map } from 'lucide-react';

const features = [
    {
        icon: <Tent className="h-8 w-8 text-emerald-600" />,
        title: "Premium Tents",
        description: "Spacious, waterproof tents equipped with comfortable memory foam mattresses and fresh linens."
    },
    {
        icon: <Flame className="h-8 w-8 text-orange-500" />,
        title: "Bonfire Pits",
        description: "Designated bonfire areas perfect for roasting marshmallows and sharing stories under the stars."
    },
    {
        icon: <Waves className="h-8 w-8 text-blue-500" />,
        title: "Lake Activities",
        description: "Complimentary access to kayaks, paddleboards, and secure swimming areas."
    },
    {
        icon: <Utensils className="h-8 w-8 text-slate-600" />,
        title: "Camp Kitchen",
        description: "Fully equipped communal kitchen with grills, stoves, and clean running water."
    },
    {
        icon: <Wifi className="h-8 w-8 text-emerald-500" />,
        title: "Free Wi-Fi",
        description: "Stay connected with high-speed internet available near the main lodge and reception."
    },
    {
        icon: <Map className="h-8 w-8 text-amber-600" />,
        title: "Hiking Trails",
        description: "Direct access to miles of scenic nature trails suitable for all skill levels."
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export const FeaturesSection = () => {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Everything You Need</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">We provide the perfect balance of roughing it and comfort. All the amenities you need for a memorable outdoor experience.</p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, idx) => (
                        <motion.div key={idx} variants={item}>
                            <Card className="h-full border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-slate-50/50">
                                <CardHeader>
                                    <div className="mb-4 bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-slate-600 text-base leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
