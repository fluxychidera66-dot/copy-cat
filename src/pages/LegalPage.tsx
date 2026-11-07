import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { APP_NAME } from '../config';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  return (
    <div className="min-h-screen bg-[#f6f5f4] text-black">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-black mb-6">
          {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
        </h1>
        <div className="text-xs text-[#757575] mb-8">
          Last updated: November 6, 2026 · {APP_NAME}
        </div>

        {isPrivacy ? (
          <div className="prose prose-sm text-[#615d59] space-y-6 text-sm leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-black">1. Information We Collect</h2>
              <p>
                We collect your email address and authentication credentials to provide access to the {APP_NAME} dashboard. When you generate concepts or videos, we process your product descriptions and creative references to deliver AI generation services.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-black">2. How We Use Data</h2>
              <p>
                Your data is used solely to generate tailored video concepts, route generation requests to video engines (e.g. Wan 3.0, Kling O3, Seedance 2.5), and calculate account coin balances. We never sell your personal information or dropship product ideas to third parties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-black">3. Cookies & Local Preview</h2>
              <p>
                During the preview phase, account state is securely stored locally in your browser session. When cloud synchronization is connected via Supabase, standard secure session cookies are utilized.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-black">4. Contact Us</h2>
              <p>
                For questions regarding privacy and data retention, reach out directly to the founders at{' '}
                <a href="mailto:hello@copycat.app" className="text-[#0075de] underline">hello@copycat.app</a>.
              </p>
            </section>
          </div>
        ) : (
          <div className="prose prose-sm text-[#615d59] space-y-6 text-sm leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-black">1. Nature of Service</h2>
              <p>
                {APP_NAME} provides organic TikTok velocity discovery, AI video concept structuring, and video rendering utilities for creators and dropshippers. {APP_NAME} is not affiliated with TikTok, ByteDance, Minea, or Higgsfield.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-black">2. 7-Day Free Trial Terms</h2>
              <p>
                The 7-day free trial requires no payment card. Trial limits: 24h leaderboard only, follow 1 creator, 3 concept lists, 2 × 10s videos at 480p with a watermark. No automatic charges occur upon trial completion.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-black">3. Intellectual Property & Formats</h2>
              <p>
                Formats and narrative structures are intended for adaptation and recreation for custom products. Users remain responsible for the physical products, claims, and media they publish on third-party social platforms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-black">4. Contact</h2>
              <p>
                Questions regarding our terms can be addressed to{' '}
                <a href="mailto:hello@copycat.app" className="text-[#0075de] underline">hello@copycat.app</a>.
              </p>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
