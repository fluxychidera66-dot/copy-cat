import React, { useState } from 'react';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { useApp } from '../context/AppContext';
import { Copy, Check } from 'lucide-react';

export const AffiliatePage: React.FC = () => {
  const { user, plan } = useApp();
  const [copied, setCopied] = useState(false);

  // Link activates after paying for 30 days
  const isEligible = Boolean(plan && plan.plan && plan.plan !== 'trial');
  const referralLink = user ? `https://copycat.app/?ref=${encodeURIComponent(user.split('@')[0])}` : '';

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardShell>
      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
            Affiliate Program
          </h1>
          <p className="text-sm text-[#757575] mt-1">
            $20 flat bounty per paying subscriber. No caps.
          </p>
        </div>

        {/* Top Referral Link Box */}
        <div className="bg-white rounded-2xl border border-black/8 p-6 shadow-xs space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-black">
            Referral Link Activation
          </div>
          <p className="text-xs text-[#615d59]">
            Your link activates after you&apos;ve been paying for 30 days.
          </p>

          {isEligible ? (
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-[#f6f5f4] text-xs font-mono text-black border border-black/10 rounded-lg px-3 py-2.5 select-all"
              />
              <button
                onClick={handleCopy}
                className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy link'}</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#f6f5f4] p-4 rounded-xl border border-black/5 text-xs text-[#757575] leading-relaxed">
              Referral links are available for paying subscribers after 30 days of active subscription to prevent self-referral abuse. Once eligible, your personalized link will appear here.
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-black/8 shadow-2xs">
            <div className="text-xs text-[#757575]">Referrals</div>
            <div className="text-2xl font-bold text-black mt-1 tabular-nums">—</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-black/8 shadow-2xs">
            <div className="text-xs text-[#757575]">Paying subscribers</div>
            <div className="text-2xl font-bold text-black mt-1 tabular-nums">—</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-black/8 shadow-2xs">
            <div className="text-xs text-[#757575]">Earned</div>
            <div className="text-2xl font-bold text-black mt-1 tabular-nums">—</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-black/8 shadow-2xs">
            <div className="text-xs text-[#757575]">Paid out</div>
            <div className="text-2xl font-bold text-black mt-1 tabular-nums">—</div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-black">How it works</h3>
          <p className="text-xs text-[#615d59] leading-relaxed">
            $20 flat, one time, per paying subscriber, any plan. 90-day cookie, last click. Paid only on the first paid month, after a 30-day hold. $50 minimum payout, paid monthly via PayPal or Stripe Connect. No self-referrals.
          </p>
        </div>

        {/* Referral List */}
        <div className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-black">Referrals</h3>
          <div className="text-xs text-[#757575] italic py-2">
            No referrals yet. Share your link to start earning $20 per subscriber.
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};
