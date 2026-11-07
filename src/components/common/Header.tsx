import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_NAME } from '../../config';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { user, plan, trialDaysLeft, hasActivePlanOrTrial } = useApp();
  const location = useLocation();

  const isAuthPage = location.pathname === '/auth';

  return (
    <>
      {/* 2.1 Promo banner (top of the page, full width) */}
      <div className="w-full bg-[#ffb110] text-black px-4 py-2.5 text-sm font-medium flex items-center justify-between border-b border-black/10">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <span className="font-semibold">7-day free trial — no card required.</span>
          <Link
            to="/auth/?trial=1"
            className="font-semibold text-black hover:underline inline-flex items-center gap-1 shrink-0 ml-4"
          >
            Start free trial →
          </Link>
        </div>
      </div>

      {/* 2.2 Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#f6f5f4]/95 backdrop-blur-md border-b border-black/8 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          {/* Left: wordmark only */}
          <Link to="/" className="text-xl font-bold tracking-tight text-black flex items-center gap-0.5 shrink-0">
            <span>{APP_NAME}</span>
            <span className="text-[#0075de]">◆</span>
          </Link>

          {/* Middle links: ONLY Formats, How it works, Pricing */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#615d59]">
            <a href="/#formats" className="hover:text-black transition-colors">Formats</a>
            <a href="/#how-it-works" className="hover:text-black transition-colors">How it works</a>
            <Link to="/pricing" className="hover:text-black transition-colors">Pricing</Link>
          </nav>

          {/* Right: user chip, Log in, Start free trial / Dashboard */}
          <div className="flex items-center gap-3 shrink-0">
            {/* User chip */}
            {user && (
              <div className="text-xs font-medium text-[#615d59] bg-white border border-black/8 px-3 py-1.5 rounded-md hidden sm:inline-block">
                {plan?.plan === 'trial' ? (
                  <span>{user} · Trial · {trialDaysLeft}d left</span>
                ) : plan?.plan ? (
                  <span className="capitalize">{user} · {plan.plan}</span>
                ) : (
                  <span>{user}</span>
                )}
              </div>
            )}

            {/* Log in button: HIDDEN once user is signed in */}
            {!user && !isAuthPage && (
              <Link
                to="/auth"
                className="text-sm font-medium text-[#615d59] hover:text-black px-3 py-1.5 transition-colors"
              >
                Log in
              </Link>
            )}

            {/* Primary Action Button */}
            {hasActivePlanOrTrial ? (
              <Link
                to="/dashboard"
                className="bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/auth/?trial=1"
                className="bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Start free trial
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
