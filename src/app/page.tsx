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
        <section className="py-24 bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-sidebar)]">
           <div className="container mx-auto px-6 text-center">
              <div className="max-w-4xl mx-auto p-12 rounded-[2.5rem] bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/10 border border-[var(--border-medium)] backdrop-blur-3xl relative overflow-hidden group">
                {/* Decorative particles */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--primary)] blur-[60px] opacity-20 -translate-x-12 -translate-y-12"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--accent)] blur-[60px] opacity-20 translate-x-12 translate-y-12"></div>
                
                <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">Stop Wandering. <br/><span className="text-[var(--primary-light)]">Start Your Quest.</span></h2>
                <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto relative z-10 uppercase tracking-widest font-bold text-sm">Join thousands level-up their lives every day</p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                    <button className="w-full sm:w-auto px-10 py-5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[var(--primary)]/40">
                        Create Account
                    </button>
                    <button className="w-full sm:w-auto px-10 py-5 bg-transparent border border-[var(--border-medium)] text-white font-black rounded-2xl hover:bg-white/5 transition-all active:scale-95">
                        Read Patch Notes
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
