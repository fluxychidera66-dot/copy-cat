import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { useApp } from '../context/AppContext';
import { VIDEOS_DATA } from '../config';
import { UpgradeModal } from '../components/common/Modals';
import { Bell, Search, ExternalLink } from 'lucide-react';

export const FollowingPage: React.FC = () => {
  const { follows, followCreator, unfollowCreator, isTrial } = useApp();
  const navigate = useNavigate();

  const [inputHandle, setInputHandle] = useState('');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const [alertToggles, setAlertToggles] = useState<Record<string, boolean>>({
    '@wingwolt.us': true,
    '@jmj_gelblaster': true
  });

  const handleFollowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputHandle.trim()) return;

    let handle = inputHandle.trim();
    if (handle.includes('tiktok.com/@')) {
      const match = handle.match(/@([a-zA-Z0-9._]+)/);
      if (match) handle = `@${match[1]}`;
    }
    if (!handle.startsWith('@')) handle = `@${handle}`;

    const res = followCreator(handle);
    if (!res.ok && res.limitReached) {
      setUpgradeMessage(res.error || 'Trial limit: follow 1 creator only.');
      setUpgradeModalOpen(true);
      return;
    }
    setInputHandle('');
  };

  const toggleAlert = (handle: string) => {
    setAlertToggles(prev => ({
      ...prev,
      [handle]: prev[handle] === undefined ? false : !prev[handle]
    }));
  };

  // Group followed creators' videos
  const creatorDetails = follows.map((handle) => {
    const creatorVideos = VIDEOS_DATA.filter(v => v.creator.toLowerCase() === handle.toLowerCase());
    // Fallback if user typed another handle: synthesize or pull matching sample
    const primaryVideo = creatorVideos[0] || VIDEOS_DATA[0];
    const videosList = creatorVideos.length >= 3 ? creatorVideos : [
      primaryVideo,
      VIDEOS_DATA[1],
      VIDEOS_DATA[2],
      VIDEOS_DATA[3],
      VIDEOS_DATA[4]
    ].slice(0, 5);

    return {
      handle,
      product: primaryVideo.niche + ' — ' + primaryVideo.title.split(' ')[0],
      avatarPoster: `/videos/${primaryVideo.filename}-poster.jpg`,
      lastPostTime: primaryVideo.postedAgo || 'posted 2h ago',
      videos: videosList,
      bestVideo: videosList[0]
    };
  });

  return (
    <DashboardShell>
      <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
        {/* Header with Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
              Creators you follow ({follows.length})
            </h1>
            <p className="text-sm text-[#757575] mt-1">
              One account = one product. Track when products take off and get immediate post alerts.
            </p>
          </div>

          <form onSubmit={handleFollowSubmit} className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#757575] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputHandle}
                onChange={(e) => setInputHandle(e.target.value)}
                placeholder="Follow handle e.g. @wingwolt.us"
                className="w-full bg-white text-xs text-black pl-9 pr-3 py-2 rounded-lg border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0075de]/30"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Follow
            </button>
          </form>
        </div>

        {/* New posts alert feed section at the top */}
        {follows.length > 0 && (
          <div className="bg-white rounded-xl border border-black/8 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f64932] animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                  New Posts Alert Feed
                </h3>
              </div>
              <span className="text-xs text-[#757575]">Alerts active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#f6f5f4] p-3 rounded-lg border border-black/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/videos/led-wings-1-poster.jpg"
                    alt="@wingwolt.us"
                    className="w-12 h-16 rounded object-cover bg-black shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-black truncate">@wingwolt.us</span>
                      <span className="bg-[#ffb110] text-black text-[9px] font-bold px-1.5 py-0.2 rounded">
                        NEW
                      </span>
                    </div>
                    <div className="text-xs text-[#615d59] truncate">LED bike wings · velocity rising</div>
                    <div className="text-[10px] text-[#757575]">12 min ago</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/concepts?video=led-wings-1&auto=1')}
                  className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium px-3 py-1.5 rounded-lg shrink-0 transition-colors"
                >
                  Recreate
                </button>
              </div>

              <div className="bg-[#f6f5f4] p-3 rounded-lg border border-black/5 flex items-center justify-between gap-3 opacity-75">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/videos/toy-blaster-1-poster.jpg"
                    alt="@jmj_gelblaster"
                    className="w-12 h-16 rounded object-cover bg-black shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-black truncate">@jmj_gelblaster</span>
                      <span className="bg-black/10 text-black text-[9px] font-medium px-1.5 py-0.2 rounded">
                        NEW
                      </span>
                    </div>
                    <div className="text-xs text-[#615d59] truncate">Toy blaster · velocity rising</div>
                    <div className="text-[10px] text-[#757575]">26 min ago</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/concepts?video=toy-blaster-1&auto=1')}
                  className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium px-3 py-1.5 rounded-lg shrink-0 transition-colors"
                >
                  Recreate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {follows.length === 0 ? (
          <div className="bg-white rounded-xl border border-black/8 p-12 text-center max-w-lg mx-auto shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-black">No creators followed yet</h3>
            <p className="text-xs text-[#615d59] leading-relaxed">
              You&apos;re not following anyone yet — follow creators from the leaderboard. One account = one product, so following a creator means following their product.
            </p>
            <button
              onClick={() => navigate('/leaderboard')}
              className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Browse trending
            </button>
          </div>
        ) : (
          /* Cards list: one card per creator */
          <div className="space-y-6">
            {creatorDetails.map((c) => {
              const isAlertOn = alertToggles[c.handle] ?? true;

              return (
                <div
                  key={c.handle}
                  className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs relative space-y-4"
                >
                  {/* Top Creator Info & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatarPoster}
                        alt={c.handle}
                        className="w-12 h-12 rounded-full object-cover bg-black border border-black/10"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-black">{c.handle}</h3>
                          <span className="bg-[#f6f5f4] text-black text-[11px] font-medium px-2 py-0.5 rounded border border-black/5">
                            {c.product}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#757575] mt-0.5">
                          {c.lastPostTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Alert toggle */}
                      <label className="flex items-center gap-2 text-xs text-[#615d59] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAlertOn}
                          onChange={() => toggleAlert(c.handle)}
                          className="rounded text-[#0075de] focus:ring-0"
                        />
                        <span>Alert on new post</span>
                      </label>

                      {/* Unfollow button */}
                      <button
                        onClick={() => unfollowCreator(c.handle)}
                        className="text-xs text-[#757575] hover:text-[#f64932] transition-colors"
                      >
                        Unfollow
                      </button>
                    </div>
                  </div>

                  {/* Creator's last 5 videos in a row */}
                  <div>
                    <div className="text-xs font-semibold text-[#757575] mb-2">
                      Recent Videos & Trajectory
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {c.videos.map((vid, idx) => {
                        const isBest = idx === 0;

                        return (
                          <div
                            key={`${vid.id}-${idx}`}
                            className={`p-2 rounded-lg border flex flex-col justify-between ${
                              isBest ? 'border-[#0075de] bg-[#e6f3fe]/30' : 'border-black/8 bg-[#f6f5f4]'
                            }`}
                          >
                            <div className="relative aspect-[9/16] rounded overflow-hidden bg-black mb-1.5">
                              <img
                                src={`/videos/${vid.filename}-poster.jpg`}
                                alt={vid.title}
                                className="w-full h-full object-cover"
                              />
                              {isBest && (
                                <span className="absolute top-1 left-1 bg-[#ffb110] text-black text-[9px] font-bold px-1.5 py-0.2 rounded shadow-xs">
                                  Best
                                </span>
                              )}
                              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1 rounded">
                                {vid.viewsFormatted}
                              </span>
                            </div>

                            <div className="text-[11px] font-medium text-black truncate mb-1">
                              {vid.title}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-[#757575] mb-2">
                              <span>Took off</span>
                            </div>

                            {isBest && (
                              <button
                                onClick={() => navigate(`/concepts?video=${vid.id}&auto=1`)}
                                className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-[11px] font-medium py-1 rounded transition-colors text-center"
                              >
                                Recreate here
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        message={upgradeMessage}
      />
    </DashboardShell>
  );
};
