import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { user, plan, coins, trialDaysLeft, onboarding, updateProfile, cancelAccount } = useApp();
  const navigate = useNavigate();

  // Profile fields
  const [product, setProduct] = useState(onboarding.product);
  const [character, setCharacter] = useState(onboarding.character);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Notifications
  const [postAlerts, setPostAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  // Danger zone modal
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ product, character });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleConfirmCancelAccount = () => {
    cancelAccount();
    navigate('/');
  };

  return (
    <DashboardShell>
      <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
            Settings
          </h1>
          <p className="text-sm text-[#757575] mt-1">
            Manage your profile, creative briefs, notifications, and subscription.
          </p>
        </div>

        {/* 1. Profile */}
        <section className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-black border-b border-black/8 pb-3">
            Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#757575] font-medium mb-1">Email</label>
              <input
                type="text"
                readOnly
                value={user || 'preview@copycat.app'}
                className="w-full bg-[#f6f5f4] text-black border border-black/10 rounded-lg p-2.5 font-mono cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[#757575] font-medium mb-1">Local Storage Mode</label>
              <input
                type="text"
                readOnly
                value="Browser Preview (Supabase Auth pending)"
                className="w-full bg-[#f6f5f4] text-[#757575] border border-black/10 rounded-lg p-2.5 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* 2. Product & Character */}
        <section className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-black border-b border-black/8 pb-3">
            Product & Character Defaults
          </h2>
          <p className="text-xs text-[#615d59]">
            These defaults are automatically used on the Concepts page and injected into the Claude recreate prompt.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-black mb-1">Physical Dropship Product</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g. LED bike wings, automatic toy blaster, magnetic phone cooler"
                className="w-full bg-[#f6f5f4] text-xs text-black border border-black/10 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0075de]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black mb-1">Brand Character / Actor</label>
              <input
                type="text"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                placeholder="e.g. a cyclist in a yellow jacket, blonde bob anime dancer, tech reviewer"
                className="w-full bg-[#f6f5f4] text-xs text-black border border-black/10 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#0075de]/30"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Save changes
              </button>
              {saveSuccess && (
                <span className="text-xs text-[#16A34A] font-medium">Saved ✓</span>
              )}
            </div>
          </form>
        </section>

        {/* 3. Notifications */}
        <section className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-black border-b border-black/8 pb-3">
            Notifications
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between text-xs text-black cursor-pointer">
              <span>New-post creator alerts</span>
              <input
                type="checkbox"
                checked={postAlerts}
                onChange={(e) => setPostAlerts(e.target.checked)}
                className="rounded text-[#0075de]"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-black cursor-pointer">
              <span>Daily viral email digest</span>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="rounded text-[#0075de]"
              />
            </label>
          </div>
        </section>

        {/* 4. Plan */}
        <section className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-black border-b border-black/8 pb-3">
            Plan & Usage
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#757575]">Current Tier</div>
              <div className="text-lg font-bold text-black capitalize">
                {plan?.plan === 'trial' ? `7-Day Free Trial (${trialDaysLeft} days remaining)` : (plan?.plan || 'No Active Plan')}
              </div>
              <div className="text-xs text-[#615d59] mt-0.5">
                Remaining seconds balance: <strong>{coins}s</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/pricing"
                className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Billing */}
        <section className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-black border-b border-black/8 pb-3">
            Billing & Invoices
          </h2>
          <p className="text-xs text-[#757575] italic">
            No invoices yet. Paid checkout is awaiting Stripe Price IDs.
          </p>
        </section>

        {/* 6. Danger Zone */}
        <section className="bg-white rounded-xl border border-[#f64932]/20 p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-[#f64932] border-b border-[#f64932]/10 pb-3">
            Danger Zone
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-black">Cancel account</div>
              <p className="text-xs text-[#757575] mt-0.5">
                Permanently clear all local concepts, videos, and subscription data.
              </p>
            </div>
            <button
              onClick={() => setShowCancelModal(true)}
              className="bg-[#f64932]/10 hover:bg-[#f64932]/20 text-[#f64932] text-xs font-semibold px-4 py-2 rounded-lg transition-colors border border-[#f64932]/30"
            >
              Cancel account
            </button>
          </div>
        </section>
      </div>

      {/* Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-black/10 shadow-lg text-center space-y-4">
            <h3 className="text-base font-bold text-black">Are you sure?</h3>
            <p className="text-xs text-[#615d59]">
              This will reset your preview user account and all saved concepts and videos in this browser.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmCancelAccount}
                className="flex-1 bg-[#f64932] hover:bg-[#e03d27] text-white text-xs font-medium py-2 rounded-lg"
              >
                Yes, cancel
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-black/5 hover:bg-black/10 text-black text-xs font-medium py-2 rounded-lg"
              >
                Keep account
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};
