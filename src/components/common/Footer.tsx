import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_VERSION } from '../../config';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f6f5f4] border-t border-black/8 pt-16 pb-12 mt-20 text-[#615d59]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
          {/* Brand column */}
          <div className="space-y-3">
            <Link to="/" className="text-xl font-bold tracking-tight text-black flex items-center gap-0.5">
              <span>{APP_NAME}</span>
              <span className="text-[#0075de]">◆</span>
            </Link>
            <p className="text-sm font-medium text-black">
              Find the viral video. Clone the format. Post it.
            </p>
            <p className="text-xs leading-relaxed text-[#757575]">
              For people doing organic AI dropshipping on TikTok — no ad spend, no TikTok Shop.
            </p>
          </div>

          {/* Product column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-black mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/#formats" className="hover:text-black transition-colors">Formats</a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-black transition-colors">How it works</a>
              </li>
              <li>
                <Link to="/formats" className="hover:text-black transition-colors">Format Library</Link>
              </li>
            </ul>
          </div>

          {/* Plans column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-black mb-4">Plans</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/pricing" className="hover:text-black transition-colors">Pricing</Link>
              </li>
              <li>
                <Link to="/coins" className="hover:text-black transition-colors">Coin packs</Link>
              </li>
              <li>
                <Link to="/affiliate" className="hover:text-black transition-colors">Affiliate — $20 per referral</Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-black mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-black transition-colors">Privacy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-black transition-colors">Terms</Link>
              </li>
              <li>
                <a href="mailto:hello@copycat.app" className="hover:text-black transition-colors">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar under a hairline rule */}
        <div className="pt-8 border-t border-black/8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#757575] gap-3">
          <div>© 2026 {APP_NAME}. Working name — it will change.</div>
          <div>{APP_NAME} {APP_VERSION} · 7-day free trial · no card required</div>
        </div>
      </div>
    </footer>
  );
};
