import { Navbar } from '../components/Navbar';
import { HeroSection } from '../features/campsite/components/HeroSection';
import { ImageCarousel } from '../features/campsite/components/ImageCarousel';
import { FeaturesSection } from '../features/campsite/components/FeaturesSection';
import { TestimonialsSection } from '../features/campsite/components/TestimonialsSection';
import { CtaSection } from '../features/booking/components/CtaSection';
import { Footer } from '../components/Footer';
import { ParallaxDivider } from '../features/campsite/components/ParallaxDivider';

export const Home = () => {
    return (
        // Adding 'dark' class here forces the entire homepage into dark mode
        <div className="dark min-h-screen bg-background text-foreground font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow">
                {/* 1. Hero */}
                <HeroSection />

                {/* 2. Gallery / Carousel */}
                <ImageCarousel />

                {/* Parallax Divider 1 */}
                <ParallaxDivider
                    imageUrl="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=1920&q=80"
                    height="350px"
                    overlayText="Disconnect to Reconnect"
                    overlaySubtext="Step away from the screens and immerse yourself in the great outdoors."
                />

                {/* 3. Amenities */}
                <FeaturesSection />

                {/* Parallax Divider 2 */}
                <ParallaxDivider
                    imageUrl="https://images.unsplash.com/photo-1445307399708-84c4fa616b65?auto=format&fit=crop&w=1920&q=80"
                    height="350px"
                    overlayText="Starlit Nights"
                    overlaySubtext="Experience evenings wrapped in nature's quiet embrace."
                />

                {/* 4. Reviews */}
                <TestimonialsSection />

                {/* 5. Final CTA */}
                <CtaSection />
            </main>

            {/* 6. Footer */}
            <Footer />
        </div>
    );
};
