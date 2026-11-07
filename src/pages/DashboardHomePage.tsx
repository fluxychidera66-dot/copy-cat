import React, { useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { VIDEOS_DATA } from '../config';
import { useApp } from '../context/AppContext';
import { buildHiggsfieldPrompt } from '../utils/promptBuilder';
import { UpgradeModal } from '../components/common/Modals';
import { VideoMetadata } from '../types';
import {
  Eye,
  Heart,
  MessageCircle,
  Flame,
  Clock,
  Sparkles,
  ArrowUpDown,
  Search,
  Check
} from 'lucide-react';

export const DashboardHomePage: React.FC = () => {
  const { user, plan, coins, follows, followCreator, onboarding } = useApp();
  const navigate = useNavigate();

  // Active viral window filter: '2h' | '6h' | '12h' | '24h'
  const [selectedWindow, setSelectedWindow] = useState<'2h' | '6h' | '12h' | '24h'>('24h');
  const [sortBy, setSortBy] = useState<'velocity' | 'views' | 'likes'>('velocity');
  const [searchQuery, setSearchQuery] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTouchId, setActiveTouchId] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');

  // 14 real TikTok product videos
  const feedVideos = useMemo(() => {
    return VIDEOS_DATA.filter(v => !v.isFounderVideo);
  }, []);

  // Filter videos based on selected window
  const filteredVideos = useMemo(() => {
    return feedVideos.filter(video => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          video.title.toLowerCase().includes(q) ||
          video.caption.toLowerCase().includes(q) ||
          video.creator.toLowerCase().includes(q) ||
          video.niche.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Time window filtering
      if (selectedWindow === '2h') {
        return video.windowTrending === '2h';
      }
      if (selectedWindow === '6h') {
        return video.windowTrending === '2h' || video.windowTrending === '6h';
      }
      if (selectedWindow === '12h') {
        return video.windowTrending === '2h' || video.windowTrending === '6h' || video.windowTrending === '12h';
      }
      // 24h shows all videos from the day
      return true;
    }).sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'likes') return b.likes - a.likes;
      // velocity / most viral
      return b.views - a.views;
    });
  }, [feedVideos, selectedWindow, searchQuery, sortBy]);

  const topVideo = filteredVideos[0] || feedVideos[0];

  const handleCopyHiggsfield = (e: React.MouseEvent, video: VideoMetadata) => {
    e.stopPropagation();
    const promptText = buildHiggsfieldPrompt(video, onboarding);
    navigator.clipboard.writeText(promptText);
    setCopiedId(video.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleRecreateHere = (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    navigate(`/concepts?video=${videoId}&auto=1`);
  };

  const handleFollow = (e: React.MouseEvent, creator: string) => {
    e.stopPropagation();
    const result = followCreator(creator);
    if (!result.ok && result.limitReached) {
      setUpgradeMessage(result.error || 'Trial limit reached.');
      setUpgradeModalOpen(true);
    }
  };

  const planSubline = (() => {
    if (plan?.plan === 'trial') return 'left · Trial';
    if (plan?.plan) return `left · ${plan.plan.charAt(0).toUpperCase() + plan.plan.slice(1)}`;
    return 'no plan';
  })();

  return (
    <DashboardShell>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        {/* Clean, Modern Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
                Viral Videos
              </h1>
              <span className="inline-flex items-center gap-1 bg-[#ffb110]/20 text-black text-xs font-semibold px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3 text-[#f64932]" />
                <span>Live Velocity</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#757575] mt-1">
              Find what took off on TikTok right now. Recreate directly or copy an exact prompt for Higgsfield.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/videos"
              className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate video</span>
            </Link>
          </div>
        </div>

        {/* 4 Clean Minimal Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-black/8 shadow-2xs">
            <div className="text-[11px] font-medium text-[#757575]">Trending in window</div>
            <div className="text-2xl font-bold text-black mt-1 tabular-nums">{filteredVideos.length}</div>
            <div className="text-[10px] text-[#0075de] mt-0.5 font-medium">Last {selectedWindow} snapshot</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-black/8 shadow-2xs">
            <div className="text-[11px] font-medium text-[#757575]">Top video velocity</div>
            <div className="text-2xl font-bold text-black mt-1 tabular-nums">{topVideo.viewsFormatted}</div>
            <div className="text-[10px] text-[#757575] mt-0.5 truncate">{topVideo.creator}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-black/8 shadow-2xs">
            <div className="text-[11px] font-medium text-[#757575]">Your seconds</div>
            <div className="text-2xl font-bold text-black mt-1 tabular-nums">{coins}s</div>
            <div className="text-[10px] text-[#757575] mt-0.5">{planSubline}</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-black/8 shadow-2xs">
            <div className="text-[11px] font-medium text-[#757575]">Creators followed</div>
            <div className="text-2xl font-bold text-black mt-1 tabular-nums">{follows.length}</div>
            <div className="text-[10px] text-[#757575] mt-0.5">Tracking product alerts</div>
          </div>
        </div>

        {/* Filter Bar: 2hrs, 6hrs, 12hrs, 24hrs & Search */}
        <div className="bg-white p-3.5 rounded-xl border border-black/8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Viral Time Window Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <div className="text-xs font-semibold text-[#757575] flex items-center gap-1 mr-2 shrink-0">
              <Clock className="w-3.5 h-3.5 text-[#0075de]" />
              <span>Timeframe:</span>
            </div>
            {(['2h', '6h', '12h', '24h'] as const).map((w) => {
              const label = w === '2h' ? 'Last 2 hours' : w === '6h' ? 'Last 6 hours' : w === '12h' ? 'Last 12 hours' : 'Last 24 hours';
              const isActive = selectedWindow === w;
              return (
                <button
                  key={w}
                  onClick={() => setSelectedWindow(w)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-black text-white shadow-2xs font-semibold'
                      : 'bg-[#f6f5f4] text-[#615d59] hover:text-black hover:bg-black/5'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Quick Search & Sort */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#757575] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search viral keyword…"
                className="w-full bg-[#f6f5f4] text-xs text-black pl-8 pr-3 py-1.5 rounded-lg border border-black/8 focus:outline-none focus:ring-1 focus:ring-[#0075de]"
              />
            </div>

            <div className="flex items-center gap-1 shrink-0 text-xs text-[#757575]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#f6f5f4] text-black border border-black/8 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none"
              >
                <option value="velocity">Most Viral</option>
                <option value="views">Most Views</option>
                <option value="likes">Most Likes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feed: 4 clean video cards across on desktop */}
        {filteredVideos.length === 0 ? (
          <div className="bg-white rounded-xl border border-black/8 p-12 text-center shadow-2xs space-y-2">
            <p className="text-sm font-semibold text-black">No videos match this filter</p>
            <p className="text-xs text-[#757575]">
              Try selecting a wider timeframe like 12h or 24h, or clearing the search keyword.
            </p>
            <button
              onClick={() => {
                setSelectedWindow('24h');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-semibold text-[#0075de] hover:underline"
            >
              Reset to 24 hours
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredVideos.map((video) => {
              const isFollowing = follows.includes(video.creator);
              const isTouchActive = activeTouchId === video.id;

              return (
                <CleanVideoCard
                  key={video.id}
                  video={video}
                  isFollowing={isFollowing}
                  isCopied={copiedId === video.id}
                  isTouchActive={isTouchActive}
                  onTouchToggle={() => setActiveTouchId(prev => prev === video.id ? null : video.id)}
                  onCopyHiggsfield={(e) => handleCopyHiggsfield(e, video)}
                  onRecreateHere={(e) => handleRecreateHere(e, video.id)}
                  onFollow={(e) => handleFollow(e, video.creator)}
                />
              );
            })}
          </div>
        )}

        {/* Clean footer line */}
        <div className="text-center text-xs text-[#757575] pt-2">
          {filteredVideos.length} videos · Ranked by velocity from {selectedWindow}
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        message={upgradeMessage}
      />
    </DashboardShell>
  );
};

interface CleanVideoCardProps {
  video: VideoMetadata;
  isFollowing: boolean;
  isCopied: boolean;
  isTouchActive: boolean;
  onTouchToggle: () => void;
  onCopyHiggsfield: (e: React.MouseEvent) => void;
  onRecreateHere: (e: React.MouseEvent) => void;
  onFollow: (e: React.MouseEvent) => void;
}

const CleanVideoCard: React.FC<CleanVideoCardProps> = ({
  video,
  isFollowing,
  isCopied,
  isTouchActive,
  onTouchToggle,
  onCopyHiggsfield,
  onRecreateHere,
  onFollow
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const showOverlay = isHovered || isTouchActive;

  return (
    <div
      className="group relative rounded-2xl overflow-hidden bg-black aspect-[9/16] cursor-pointer shadow-xs border border-black/10 select-none transition-transform duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onTouchToggle}
    >
      {/* 9:16 Video Player */}
      <video
        ref={videoRef}
        src={`/videos/${video.filename}.mp4`}
        poster={`/videos/${video.filename}-poster.jpg`}
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />

      {/* Top Floating Badge: Window Tag & Creator Handle */}
      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between text-white pointer-events-none z-10">
        <span className="bg-black/60 backdrop-blur-md text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10">
          {video.creator}
        </span>
        <span className="bg-[#ffb110] text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-2xs">
          {video.windowTrending || '24h'}
        </span>
      </div>

      {/* Rest State: Clean Engagement Bar (Views, Likes, Comments) */}
      {!showOverlay && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8 text-white pointer-events-none transition-opacity duration-200 space-y-1">
          <div className="text-xs font-semibold line-clamp-1 drop-shadow-xs">
            {video.title}
          </div>

          {/* Views, Likes, Comments displayed clearly on every video */}
          <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-white/90 pt-0.5">
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#62aef0]" />
              <span>{video.viewsFormatted}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="w-3 h-3 text-[#f64932] fill-[#f64932]" />
              <span>{video.likesFormatted}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="w-3 h-3 text-white/80" />
              <span>{video.commentsFormatted}</span>
            </span>
          </div>
        </div>
      )}

      {/* Hover / Tap Reveal Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xs p-3.5 flex flex-col justify-between text-white transition-opacity duration-200 z-20">
          {/* Top metadata & full engagement metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-white/70">
              <span className="font-semibold text-white">{video.creator}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                {video.niche}
              </span>
            </div>

            <div className="text-xs font-bold text-white line-clamp-1">
              {video.title}
            </div>

            <p className="text-[11px] text-white/80 line-clamp-2 leading-snug italic">
              &quot;{video.caption}&quot;
            </p>

            {/* Engagement metrics: Views, Likes, Comments */}
            <div className="grid grid-cols-3 gap-1 bg-white/10 rounded-lg p-2 text-center text-xs">
              <div>
                <div className="text-[10px] text-white/60">Views</div>
                <div className="font-mono font-bold text-white tabular-nums text-[11px]">
                  {video.viewsFormatted}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-white/60">Likes</div>
                <div className="font-mono font-bold text-[#ffb110] tabular-nums text-[11px]">
                  {video.likesFormatted}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-white/60">Comments</div>
                <div className="font-mono font-bold text-[#62aef0] tabular-nums text-[11px]">
                  {video.commentsFormatted}
                </div>
              </div>
            </div>

            {video.ctaKeyword && (
              <div className="inline-block bg-[#ffb110] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                {video.ctaKeyword}
              </div>
            )}
          </div>

          {/* Bottom actions: Recreate here + Higgsfield prompt with logo on same line */}
          <div className="space-y-2 pt-2">
            <button
              onClick={onRecreateHere}
              className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors text-center shadow-xs cursor-pointer"
            >
              Recreate here
            </button>

            {/* Higgsfield prompt button: Logo on the SAME LINE right beside the name */}
            <button
              onClick={onCopyHiggsfield}
              className="w-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium py-2 px-3 rounded-xl transition-colors border border-white/20 cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <span>{isCopied ? 'Copied ✓' : 'Copy'}</span>
              <img
                src="/images/higgsfield.png"
                alt="Higgsfield"
                className="inline-block h-3.5 w-3.5 rounded-xs object-contain shrink-0"
              />
              <span>Higgsfield prompt</span>
            </button>

            <div className="text-center pt-0.5">
              <button
                onClick={onFollow}
                className="text-[11px] text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                {isFollowing ? '✓ Following creator' : `+ Follow ${video.creator}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
