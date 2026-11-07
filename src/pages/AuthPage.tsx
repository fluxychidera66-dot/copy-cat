import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { APP_NAME } from '../config';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, plan, startTrial, signUpWithEmail, signInWithEmail, hasActivePlanOrTrial } = useApp();

  const isTrialParam = searchParams.get('trial') === '1';
  const nextParam = searchParams.get('next');

  // Mode: 'signup' (default) or 'login'
  const [mode, setMode] = useState<'signup' | 'login'>('signup');

  // Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & error state
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already signed in:
  useEffect(() => {
    if (user) {
      if (isTrialParam && !hasActivePlanOrTrial) {
        startTrial();
        navigate('/dashboard', { replace: true });
      } else if (hasActivePlanOrTrial) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, isTrialParam, hasActivePlanOrTrial, navigate, startTrial]);

  const handleGoogleClick = () => {
    // Honest status per Section 3
    setGoogleNotice(
      "Google sign-in needs Supabase Auth connected — add your Supabase project URL and anon key, and enable Google in Supabase Auth. Use email for now — no account was created."
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);
    setGoogleNotice(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setInlineError("Passwords do not match");
        return;
      }
      if (password.length < 8) {
        setInlineError("Password must be at least 8 characters.");
        return;
      }

      setSubmitting(true);
      const res = await signUpWithEmail(email, password, isTrialParam);
      setSubmitting(false);

      if (!res.ok) {
        setInlineError(res.error || "An account with that email already exists here. Log in instead.");
        return;
      }

      if (isTrialParam) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate(nextParam || '/pricing', { replace: true });
      }
    } else {
      // Login
      setSubmitting(true);
      const res = await signInWithEmail(email, password);
      setSubmitting(false);

      if (!res.ok) {
        setInlineError("Email or password did not match an account in this browser.");
        return;
      }

      if (hasActivePlanOrTrial || isTrialParam) {
        if (isTrialParam && !hasActivePlanOrTrial) {
          startTrial();
        }
        navigate('/dashboard', { replace: true });
      } else {
        navigate(nextParam || '/pricing', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-[#f6f5f4] via-[#e6f3fe]/40 to-[#fff8eb]">
      {/* Centered Glass Card */}
      <div className="w-full max-w-md bg-white/75 backdrop-blur-xl rounded-2xl border border-white/60 p-8 shadow-sm">
        {/* 1. H1 */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-3">
          Welcome to {APP_NAME}
        </h1>

        {/* 2. One-line trial summary — ONLY when ?trial=1 */}
        {isTrialParam && (
          <p className="text-xs text-center text-[#0075de] font-medium mb-6 bg-[#e6f3fe] py-2 px-3 rounded-lg border border-[#0075de]/10">
            7-day free trial — 24h leaderboard, follow 1 creator, 3 concept lists, 2 videos at 480p. No card required.
          </p>
        )}

        {/* 3. Google Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          className="w-full bg-white hover:bg-[#f6f5f4] text-black font-medium text-sm py-2.5 px-4 rounded-lg border border-black/10 flex items-center justify-center gap-2.5 transition-colors shadow-2xs mb-4"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>
            {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
          </span>
        </button>

        {googleNotice && (
          <div className="text-xs text-[#615d59] bg-[#f6f5f4] p-3 rounded-lg border border-black/8 mb-4 leading-relaxed">
            {googleNotice}
          </div>
        )}

        {/* 4. Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-black/8"></div>
          <span className="px-3 text-xs text-[#757575] font-medium">or with email</span>
          <div className="flex-1 border-t border-black/8"></div>
        </div>

        {/* 5. ONE form visible at a time */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-black mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-white text-sm text-black border border-black/10 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0075de]/30 focus:border-[#0075de]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-black mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8+ characters"
              className="w-full bg-white text-sm text-black border border-black/10 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0075de]/30 focus:border-[#0075de]"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-black mb-1">Confirm password</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full bg-white text-sm text-black border border-black/10 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0075de]/30 focus:border-[#0075de]"
              />
            </div>
          )}

          {/* 6. Inline Errors */}
          {inlineError && (
            <div className="text-xs text-[#f64932] bg-[#f64932]/10 p-2.5 rounded-lg border border-[#f64932]/20 font-medium">
              {inlineError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-colors shadow-2xs disabled:opacity-50"
          >
            {submitting ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
          </button>

          {/* Switch link */}
          <div className="text-center pt-2">
            {mode === 'signup' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setInlineError(null);
                  setGoogleNotice(null);
                }}
                className="text-xs text-[#615d59] hover:text-black hover:underline"
              >
                Already have an account? Log in
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setInlineError(null);
                  setGoogleNotice(null);
                }}
                className="text-xs text-[#615d59] hover:text-black hover:underline"
              >
                New here? Create an account
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
