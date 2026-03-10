import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const images = [
    {
        url: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        caption: "Lakefront Tent Area"
    },
    {
        url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        caption: "Premium Glamping Setup"
    },
    {
        url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        caption: "Cozy Bonfire Night"
    },
    {
        url: "https://images.unsplash.com/photo-1627916568853-90d297ff0a59?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        caption: "Kayaking by the Lake"
    }
];

export const ImageCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Discover the Grounds</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">Explore our premium facilities and breathtaking views before you arrive.</p>
                </div>

                <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden rounded-2xl shadow-xl group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <img
                                src={images[currentIndex].url}
                                alt={images[currentIndex].caption}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                <p className="text-white text-xl md:text-2xl font-medium p-8">
                                    {images[currentIndex].caption}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="icon" onClick={prevSlide} className="rounded-full bg-white/80 hover:bg-white text-slate-800">
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button variant="secondary" size="icon" onClick={nextSlide} className="rounded-full bg-white/80 hover:bg-white text-slate-800">
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
