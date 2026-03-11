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
        <div className="dark min-h-screen bg-background text-foreground font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow">
                {/* 1. Hero — full-screen video with CTA */}
                <HeroSection />

                {/* 2. Gallery carousel */}
                <ImageCarousel />

                {/* Parallax divider 1 */}
                <ParallaxDivider
                    variant="first"
                    height="350px"
                    overlayText="Disconnect to Reconnect"
                    overlaySubtext="Step away from the screens and immerse yourself in the great outdoors."
                />

                {/* 3. Amenities & features */}
                <FeaturesSection />

                {/* Parallax divider 2 */}
                <ParallaxDivider
                    variant="second"
                    height="350px"
                    overlayText="Starlit Nights"
                    overlaySubtext="Experience evenings wrapped in nature's quiet embrace."
                />

                {/* 4. Testimonials */}
                <TestimonialsSection />

                {/* 5. Final CTA */}
                <CtaSection />
            </main>

            {/* 6. Footer */}
            <Footer />
        </div>
    );
};
