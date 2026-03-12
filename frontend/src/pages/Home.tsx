import { Navbar } from '../components/Navbar';
import { HeroSection } from '../features/campsite/components/HeroSection';
import { ImageCarousel } from '../features/campsite/components/ImageCarousel';
import { FeaturesSection } from '../features/campsite/components/FeaturesSection';
import { TestimonialsSection } from '../features/campsite/components/TestimonialsSection';
import { CtaSection } from '../features/booking/components/CtaSection';
import { Footer } from '../components/Footer';
import { ParallaxDivider } from '../features/campsite/components/ParallaxDivider';
import { WaveDivider } from '../components/WaveDivider';

/* ─────────────────────────────────────────────────────────────
   Fresh White, Green, and Dark Green theme
───────────────────────────────────────────────────────────── */
const C = {
    // Pure white for crisp contrast
    WHITE: '#ffffff',
    // Very soft mint/green tint for alternating sections
    SOFT_GREEN: '#f0fdf4', // tailwind green-50
    // Slightly deeper off-white green
    MINT: '#dcfce7',       // tailwind green-100
    // Deep forest green for dark contrasting sections (like testimonials or footer intro)
    FOREST: '#064e3b',     // tailwind emerald-900
    FOREST_LIGHT: '#022c22', // tailwind emerald-950
};

export const Home = () => {
    return (
        <div
            className="min-h-screen font-sans flex flex-col text-slate-900 selection:bg-emerald-200 selection:text-emerald-900"
            style={{ background: C.WHITE }}
        >
            <Navbar />

            <main className="flex-grow">

                {/* ── 1. Hero — full-screen video with CTA ── */}
                <HeroSection />

                {/* Wave: Hero bottom → Gallery */}
                <WaveDivider
                    fromColor="transparent"
                    toColor={C.SOFT_GREEN}
                    variant={2}
                    height={90}
                />

                {/* ── 2. Gallery carousel ── */}
                <div style={{
                    background: `linear-gradient(180deg, ${C.SOFT_GREEN} 0%, ${C.WHITE} 60%, ${C.SOFT_GREEN} 100%)`,
                }}>
                    <ImageCarousel />
                </div>

                {/* Wave: Gallery → Parallax 1 */}
                <WaveDivider
                    fromColor={C.SOFT_GREEN}
                    toColor="transparent"
                    variant={3}
                    height={70}
                    flip
                />

                {/* ── Parallax divider 1 ── */}
                <ParallaxDivider
                    variant="first"
                    height="350px"
                    overlayText="Disconnect to Reconnect"
                    overlaySubtext="Step away from the screens and immerse yourself in the great outdoors."
                />

                {/* Wave: Parallax 1 → Features */}
                <WaveDivider
                    fromColor="transparent"
                    toColor={C.WHITE}
                    variant={1}
                    height={85}
                />

                {/* ── 3. Amenities & Features ── */}
                <div style={{
                    background: `linear-gradient(160deg, ${C.WHITE} 0%, ${C.SOFT_GREEN} 40%, ${C.MINT} 100%)`,
                }}>
                    <FeaturesSection />
                </div>

                {/* Wave: Features → Parallax 2 */}
                <WaveDivider
                    fromColor={C.MINT}
                    toColor="transparent"
                    variant={4}
                    height={70}
                    flip
                />

                {/* ── Parallax divider 2 ── */}
                <ParallaxDivider
                    variant="second"
                    height="350px"
                    overlayText="Starlit Nights"
                    overlaySubtext="Experience evenings wrapped in nature's quiet embrace."
                />

                {/* Wave: Parallax 2 → Testimonials */}
                <WaveDivider
                    fromColor="transparent"
                    toColor={C.SOFT_GREEN}
                    variant={2}
                    height={85}
                />

                {/* ── 4. Testimonials ── */}
                <div style={{
                    background: `linear-gradient(180deg, ${C.SOFT_GREEN} 0%, ${C.WHITE} 50%, ${C.MINT} 100%)`,
                }}>
                    <TestimonialsSection />
                </div>

                {/* Wave: Testimonials → CTA */}
                <WaveDivider
                    fromColor={C.MINT}
                    toColor="transparent"
                    variant={3}
                    height={80}
                    flip
                />

                {/* ── 5. Final CTA (has its own bg image) ── */}
                <CtaSection />

            </main>

            {/* Wave: CTA → Footer */}
            <WaveDivider
                fromColor="transparent"
                toColor="#04050a"
                variant={1}
                height={70}
            />

            {/* ── 6. Footer ── */}
            <Footer />
        </div>
    );
};