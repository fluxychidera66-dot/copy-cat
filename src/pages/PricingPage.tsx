import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { StripeNoticeModal } from '../components/common/Modals';
import { useApp } from '../context/AppContext';
import { APP_NAME } from '../config';
import { Check } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [stripeNoticeOpen, setStripeNoticeOpen] = useState(false);
  const [chosenPlan, setChosenPlan] = useState<string>('');
  const [coinPackNotice, setCoinPackNotice] = useState<string | null>(null);

  const { user } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleChoosePlan = (planName: string) => {
    if (!user) {
      navigate(`/auth?next=/pricing/?choose=${planName.toLowerCase()}`);
      return;
    }
    setChosenPlan(planName);
    setStripeNoticeOpen(true);
  };

  const handleBuyCoinPack = () => {
    setCoinPackNotice("Checkout is wired, waiting on Stripe Price IDs. No charge was made.");
  };

  const coinPacks = [
    { name: "Starter Pack", price: "$4.99", coins: 50 },
    { name: "Creator Pack", price: "$17.99", coins: 200 },
    { name: "Pro Pack", price: "$39.99", coins: 500 },
    { name: "Studio Pack", price: "$69.99", coins: 1000 },
    { name: "Whale Pack", price: "$149.99", coins: 2500 }
  ];

  return (
    <div className="min-h-screen bg-[#f6f5f4] text-[#000000]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        {/* H1 & Top Comparison Strip */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black mb-4">
            Pricing
          </h1>
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-[#615d59] bg-white border border-black/8 py-2 px-4 rounded-full">
            <span>One app instead of two subscriptions. {APP_NAME} Starter $49/mo vs</span>
            <img src="/images/minea.png" alt="Minea" className="inline-block h-4 w-4 rounded-xs" />
            <span className="font-medium text-black">Minea $49</span>
            <span>+</span>
            <img src="/images/higgsfield.png" alt="Higgsfield" className="inline-block h-4 w-4 rounded-xs" />
            <span className="font-medium text-black">Higgsfield Plus $59</span>
            <span>= $108/mo. You save $59/mo.</span>
          </div>
        </div>

        {/* Trial banner FIRST, above the cards */}
        <div className="mb-6 bg-white border border-black/10 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <div className="text-sm font-bold text-black mb-0.5">Try it free for 7 days.</div>
            <div className="text-xs text-[#615d59]">
              24h leaderboard · follow 1 creator · 3 concept lists · 2 videos at 480p · no card required.
            </div>
          </div>
          <Link
            to="/auth/?trial=1"
            className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap text-center shrink-0"
          >
            Start free trial
          </Link>
        </div>

        {/* Stripe notice under the banner */}
        <div className="mb-10 bg-[#e6f3fe]/60 border border-[#0075de]/20 rounded-xl p-4 text-xs text-[#0075de] leading-relaxed">
          <strong>Stripe checkout:</strong> Price IDs not created yet. Checkout is wired and ready — it needs real Stripe Price IDs for Starter, Growth, and Scale before it can charge anyone. Choosing a plan now just shows this notice. No payment is taken and no charge is faked.
        </div>

        {/* Monthly / Annual toggle */}
        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex items-center gap-1.5 p-1 bg-white rounded-lg border border-black/8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                billingCycle === 'monthly' ? 'bg-[#0075de] text-white' : 'text-[#615d59] hover:text-black'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                billingCycle === 'annual' ? 'bg-[#0075de] text-white' : 'text-[#615d59] hover:text-black'
              }`}
            >
              Annual — save up to 20%
            </button>
          </div>
        </div>

        {/* 3 Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Starter */}
          <div className="bg-white rounded-xl border border-black/8 p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <h3 className="text-lg font-bold text-black mb-1">Starter</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-black">
                  ${billingCycle === 'monthly' ? '49' : '39'}
                </span>
                <span className="text-xs text-[#757575]">/mo</span>
              </div>
              {billingCycle === 'annual' && (
                <div className="text-xs font-medium text-[#0075de] mb-4">
                  Save $120 a year vs monthly
                </div>
              )}

              {/* Seconds hero block */}
              <div className="bg-[#f6f5f4] p-4 rounded-lg my-6">
                <div className="text-2xl font-bold text-black">100</div>
                <div className="text-xs font-medium text-black">seconds of video / month</div>
                <div className="text-[11px] text-[#757575] mt-1">
                  10 × 10s videos at 480p · 5 × 10s at 720p
                </div>
              </div>

              {/* Features list verbatim */}
              <ul className="space-y-2.5 text-xs text-[#615d59] mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>unlimited leaderboard viewing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>follow 10 creators</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>unlimited Claude concepts</span>
                </li>
                <li className="text-[#757575] pl-6">No clones — add $3 per 10s</li>
                <li className="text-[#757575] pl-6">No heroes — add $7 per 15s</li>
              </ul>
            </div>

            <button
              onClick={() => handleChoosePlan('Starter')}
              className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium py-2.5 rounded-lg transition-colors text-center"
            >
              Choose Starter
            </button>
          </div>

          {/* Growth */}
          <div className="bg-white rounded-xl border-2 border-[#0075de] p-8 flex flex-col justify-between relative shadow-sm">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffb110] text-black text-[11px] font-bold px-3 py-0.5 rounded-full">
              Best value
            </span>
            <div>
              <h3 className="text-lg font-bold text-black mb-1">Growth</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-black">
                  ${billingCycle === 'monthly' ? '99' : '79'}
                </span>
                <span className="text-xs text-[#757575]">/mo</span>
              </div>
              {billingCycle === 'annual' && (
                <div className="text-xs font-medium text-[#0075de] mb-4">
                  Save $240 a year vs monthly
                </div>
              )}

              {/* Seconds hero block */}
              <div className="bg-[#f6f5f4] p-4 rounded-lg my-6">
                <div className="text-2xl font-bold text-black">240</div>
                <div className="text-xs font-medium text-black">seconds of video / month</div>
                <div className="text-[11px] text-[#757575] mt-1">
                  24 × 10s videos at 480p · 12 × 10s at 720p
                </div>
              </div>

              {/* Features list verbatim */}
              <ul className="space-y-2.5 text-xs text-[#615d59] mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>everything in Starter</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>follow 30 creators</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>Instagram Reels leaderboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>TikTok + Meta ad library</span>
                </li>
                <li className="flex items-center gap-2 text-black font-medium">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>2 Kling clones included</span>
                </li>
                <li className="text-[#757575] pl-6">No heroes — add $7 per 15s</li>
              </ul>
            </div>

            <button
              onClick={() => handleChoosePlan('Growth')}
              className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium py-2.5 rounded-lg transition-colors text-center"
            >
              Choose Growth
            </button>
          </div>

          {/* Scale */}
          <div className="bg-white rounded-xl border border-black/8 p-8 flex flex-col justify-between shadow-2xs">
            <div>
              <h3 className="text-lg font-bold text-black mb-1">Scale</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-black">
                  ${billingCycle === 'monthly' ? '199' : '159'}
                </span>
                <span className="text-xs text-[#757575]">/mo</span>
              </div>
              {billingCycle === 'annual' && (
                <div className="text-xs font-medium text-[#0075de] mb-4">
                  Save $480 a year vs monthly
                </div>
              )}

              {/* Seconds hero block */}
              <div className="bg-[#f6f5f4] p-4 rounded-lg my-6">
                <div className="text-2xl font-bold text-black">500</div>
                <div className="text-xs font-medium text-black">seconds of video / month</div>
                <div className="text-[11px] text-[#757575] mt-1">
                  50 × 10s videos at 480p · 25 × 10s at 720p
                </div>
              </div>

              {/* Features list verbatim */}
              <ul className="space-y-2.5 text-xs text-[#615d59] mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>everything in Growth</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>unlimited follows</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>priority render queue</span>
                </li>
                <li className="flex items-center gap-2 text-black font-medium">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>5 Kling clones included</span>
                </li>
                <li className="flex items-center gap-2 text-black font-medium">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>2 Seedance heroes included</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoosePlan('Scale')}
              className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium py-2.5 rounded-lg transition-colors text-center"
            >
              Choose Scale
            </button>
          </div>
        </div>

        {/* Footnote under the cards */}
        <p className="text-xs text-[#757575] text-center max-w-3xl mx-auto mb-10 leading-relaxed">
          Annual prices are per month, billed annually. Add-ons: extra seconds $0.20/sec · extra clone $3 per 10s · extra hero $7 per 15s. 1 free retake, rest cost seconds. No rollover. Failed generation = 0 coins.
        </p>

        {/* Coin packs — collapsed, NOT the signup story */}
        <details className="bg-white border border-black/8 rounded-xl p-5 mb-8 shadow-2xs group">
          <summary className="text-sm font-bold text-black cursor-pointer select-none flex items-center justify-between">
            <span>Coin packs — top up seconds without a subscription</span>
            <span className="text-xs text-[#757575] font-normal group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="pt-4 border-t border-black/8 mt-4 space-y-4">
            <p className="text-xs text-[#615d59]">
              1 coin = 1 second of video at 480p. 720p = 2 coins/s, 1080p = 5, clone = 4, hero = 6. Packs last 12 months, no subscription required, subscribers get 20% off.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {coinPacks.map((pack) => (
                <div key={pack.name} className="bg-[#f6f5f4] p-3 rounded-lg border border-black/5 text-center flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-black">{pack.name}</div>
                    <div className="text-lg font-extrabold text-black mt-1">{pack.price}</div>
                    <div className="text-[11px] text-[#0075de] font-semibold">{pack.coins} coins</div>
                    <div className="text-[10px] text-[#757575] mt-1">12-month expiry · subscribers get 20% off</div>
                  </div>
                  <button
                    onClick={handleBuyCoinPack}
                    className="mt-3 w-full bg-white hover:bg-black/5 text-xs font-medium text-black border border-black/10 py-1.5 rounded transition-colors"
                  >
                    Buy pack
                  </button>
                </div>
              ))}
            </div>

            <div className="text-xs text-[#757575] italic pt-1">
              Coin packs are paid through Stripe Checkout. Stripe Price IDs for packs are not created yet, so buying is not live — the packs above come straight from the backend.
            </div>

            {coinPackNotice && (
              <div className="text-xs text-[#0075de] bg-[#e6f3fe] p-3 rounded-lg border border-[#0075de]/20">
                {coinPackNotice}
              </div>
            )}
          </div>
        </details>

        {/* Affiliate section under that */}
        <div className="bg-white border border-black/8 rounded-xl p-6 text-center text-xs text-[#615d59] shadow-2xs">
          <span className="font-semibold text-black">Affiliate:</span> $20 flat bounty per paying subscriber — 90-day cookie, 30-day hold, $50 minimum payout.{' '}
          <Link to="/affiliate" className="text-[#0075de] hover:underline font-medium">
            Learn more →
          </Link>
        </div>
      </main>

      <Footer />

      {/* Stripe Notice Modal */}
      <StripeNoticeModal
        isOpen={stripeNoticeOpen}
        onClose={() => setStripeNoticeOpen(false)}
        planName={chosenPlan}
      />
    </div>
  );
};
