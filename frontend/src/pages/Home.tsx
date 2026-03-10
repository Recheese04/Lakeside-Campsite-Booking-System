import { HeroSection } from '../features/campsite/components/HeroSection';
import { ImageCarousel } from '../features/campsite/components/ImageCarousel';
import { FeaturesSection } from '../features/campsite/components/FeaturesSection';
import { TestimonialsSection } from '../features/campsite/components/TestimonialsSection';
import { CtaSection } from '../features/booking/components/CtaSection';
import { Footer } from '../components/Footer';

export const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <main className="flex-grow">
                <HeroSection />
                <ImageCarousel />
                <FeaturesSection />
                <TestimonialsSection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    );
};
