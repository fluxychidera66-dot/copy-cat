import React, { useState } from 'react';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { useApp } from '../context/AppContext';

export const CoinsPage: React.FC = () => {
  const { coins, plan, transactions } = useApp();
  const [purchaseNotice, setPurchaseNotice] = useState<string | null>(null);

  // Maximum seconds for plan
  const planTotal = plan?.plan === 'scale' ? 500 : plan?.plan === 'growth' ? 240 : plan?.plan === 'starter' ? 100 : 20;
  const usedSeconds = Math.max(0, planTotal - coins);
  const usedPercent = Math.min(100, Math.round((usedSeconds / planTotal) * 100));

  const packs = [
    { name: "Starter Pack", price: "$4.99", coins: 50 },
    { name: "Creator Pack", price: "$17.99", coins: 200 },
    { name: "Pro Pack", price: "$39.99", coins: 500 },
    { name: "Studio Pack", price: "$69.99", coins: 1000 },
    { name: "Whale Pack", price: "$149.99", coins: 2500 }
  ];

  const handleBuy = () => {
    setPurchaseNotice("Checkout is wired, waiting on Stripe Price IDs. No charge was made.");
  };

  return (
    <DashboardShell>
      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-10">
        {/* Top: Balance & Usage Bar */}
        <div className="bg-white rounded-2xl border border-black/8 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#757575]">
                Account Balance
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black mt-1">
                You have {coins} seconds left this month
              </h1>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-[#757575]">Coin balance:</span>
              <div className="text-xl font-mono font-bold text-[#0075de] tabular-nums">
                {coins} coins
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-[#615d59] mb-1.5 font-medium">
              <span>Used {usedSeconds} of {planTotal} seconds</span>
              <span>{usedPercent}%</span>
            </div>
            <div className="w-full bg-[#f6f5f4] rounded-full h-2.5 overflow-hidden border border-black/5">
              <div
                className="bg-[#0075de] h-full rounded-full transition-all duration-300"
                style={{ width: `${usedPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Buy Coins: 5 Packs */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-black">Buy coins</h2>
            <p className="text-xs text-[#757575] mt-0.5">
              Top up seconds without a subscription. Packs last 12 months, subscribers get 20% off.
            </p>
          </div>

          {purchaseNotice && (
            <div className="bg-[#e6f3fe] border border-[#0075de]/20 p-3 rounded-xl text-xs text-[#0075de]">
              {purchaseNotice}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {packs.map((pack) => (
              <div
                key={pack.name}
                className="bg-white rounded-xl border border-black/8 p-4 shadow-2xs text-center flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-black">{pack.name}</div>
                  <div className="text-xl font-extrabold text-black mt-1.5">{pack.price}</div>
                  <div className="text-xs font-semibold text-[#0075de] mt-0.5">{pack.coins} coins</div>
                  <div className="text-[10px] text-[#757575] mt-2">
                    12-month expiry · subscribers get 20% off
                  </div>
                </div>
                <button
                  onClick={handleBuy}
                  className="mt-4 w-full bg-[#f6f5f4] hover:bg-black/5 text-xs font-medium text-black border border-black/10 py-1.5 rounded-lg transition-colors"
                >
                  Buy pack
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* How coins work */}
        <div className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-2">
          <h3 className="text-sm font-bold text-black">How coins work</h3>
          <p className="text-xs text-[#615d59] leading-relaxed">
            1 coin = 1 second at 480p. 720p = 2 coins/s, 1080p = 5, clone = 4, hero = 6. Failed generation = 0 coins.
          </p>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-black">Transaction history</h3>

          {transactions.length === 0 ? (
            <p className="text-xs text-[#757575] italic py-2">
              No transactions yet
            </p>
          ) : (
            <div className="divide-y divide-black/8 text-xs">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-black">{tx.description}</div>
                    <div className="text-[10px] text-[#757575] mt-0.5">
                      {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold ${tx.coins > 0 ? 'text-[#16A34A]' : 'text-black'}`}>
                      {tx.coins > 0 ? `+${tx.coins}` : tx.coins} coins
                    </span>
                    <div className="text-[10px] text-[#757575]">Balance: {tx.balanceAfter}s</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};
