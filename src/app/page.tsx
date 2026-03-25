import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-white selection:bg-[var(--primary)] selection:text-white">
      {/* Navigation */}
      <LandingNavbar />

      <main>
        {/* Hero Section */}
        <LandingHero />

        {/* Features Section */}
        <LandingFeatures />

        {/* Call to Action Section (Mini) */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-sidebar)]">
           <div className="container mx-auto px-6 text-center">
              <div className="max-w-3xl mx-auto p-10 rounded-3xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/5 border border-[var(--border-light)] backdrop-blur-3xl relative overflow-hidden group">
                <h2 className="text-3xl md:text-4xl font-semibold mb-4 relative z-10 text-white">Stop Procrastinating. <br/><span className="bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary-light)] bg-clip-text text-transparent italic">Start Shipping.</span></h2>
                <p className="text-xs text-[var(--text-muted)] mb-8 max-w-md mx-auto relative z-10 uppercase tracking-[0.2em] font-semibold">Join 10,000+ developers leveling up today</p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                    <button className="w-full sm:w-auto px-8 py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[var(--primary)]/20">
                        Create Account
                    </button>
                    <button className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-[var(--border-light)] text-[var(--text-secondary)] text-sm font-semibold rounded-xl hover:bg-white/5 transition-all active:scale-95">
                        Read Features
                    </button>
                </div>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
