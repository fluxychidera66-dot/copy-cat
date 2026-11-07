import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface StripeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
}

export const StripeNoticeModal: React.FC<StripeModalProps> = ({ isOpen, onClose, planName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-md w-full p-6 border border-black/10 shadow-lg relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#757575] hover:text-black transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#0075de] mb-1">
          Checkout Notice
        </div>
        <h3 className="text-lg font-bold text-black mb-3">
          {planName ? `Subscribing to ${planName}` : 'Paid Checkout'}
        </h3>
        <p className="text-sm text-[#615d59] leading-relaxed mb-5">
          Paid checkout isn&apos;t live yet. Stripe Price IDs for the plans aren&apos;t created, so subscribing can&apos;t take a payment right now. Start the 7-day free trial (no card) instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            to="/auth/?trial=1"
            onClick={onClose}
            className="flex-1 bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium py-2.5 px-4 rounded-lg text-center transition-colors"
          >
            Start 7-day free trial
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#615d59] hover:text-black border border-black/10 rounded-lg hover:bg-black/5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  title = "Upgrade Plan",
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-md w-full p-6 border border-black/10 shadow-lg relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#757575] hover:text-black transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-xs font-semibold uppercase tracking-wider text-[#ffb110] mb-1">
          Plan Limit
        </div>
        <h3 className="text-lg font-bold text-black mb-3">{title}</h3>
        <p className="text-sm text-[#615d59] leading-relaxed mb-5">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            to="/pricing"
            onClick={onClose}
            className="flex-1 bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium py-2.5 px-4 rounded-lg text-center transition-colors"
          >
            See Plans & Upgrades
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#615d59] hover:text-black border border-black/10 rounded-lg hover:bg-black/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
