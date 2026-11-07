import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { VIDEOS_DATA } from '../config';
import { useApp } from '../context/AppContext';
import { VideoMetadata } from '../types';
import { buildHiggsfieldPrompt } from '../utils/promptBuilder';
import { UpgradeModal } from '../components/common/Modals';
import { Search, Lock, SlidersHorizontal, ArrowUpDown, X, Check, Eye, Heart, MessageCircle } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { plan, isTrial, onboarding, followCreator, follows } = useApp();
  const navigate = useNavigate();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [platform, setPlatform] = useState<'tiktok' | 'instagram'>('tiktok');
  const [selectedWindow, setSelectedWindow] = useState('24h');
  const [customDate, setCustomDate] = useState('');
  const [sortBy, setSortBy] = useState<'velocity' | 'views' | 'engagement'>('velocity');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Comparison & saved filters
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [savedFilters, setSavedFilters] = useState<string[]>(() => {
    const raw = localStorage.getItem('cc_saved_filters');
    return raw ? JSON.parse(raw) : ['LED wings · 24h', 'Toys · 24h'];
  });

  // Upgrade modal state
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available windows from backend
  const availableWindows = ['2h', '6h', '24h', '3d', 'custom'];

  const handleWindowSelect = (w: string) => {
    if (isTrial && w !== '24h') {
      setUpgradeMessage("Trial limit: trial users see ONLY the 24h window. Upgrade to Starter to unlock 2h, 6h, and 3-day windows.");
      setUpgradeModalOpen(true);
      return;
    }
    setSelectedWindow(w);
  };

  const handlePlatformSelect = (p: 'tiktok' | 'instagram') => {
    if (p === 'instagram') {
      if (isTrial || plan?.plan === 'starter') {
        setUpgradeMessage("Instagram Reels leaderboard is available on Growth and Scale plans. Upgrade to unlock Instagram trends.");
        setUpgradeModalOpen(true);
        return;
      }
    }
    setPlatform(p);
  };

  const handleSaveFilter = () => {
    const tag = `${searchTerm || 'All'} · ${selectedWindow}`;
    if (!savedFilters.includes(tag)) {
      const updated = [...savedFilters, tag];
      setSavedFilters(updated);
      localStorage.setItem('cc_saved_filters', JSON.stringify(updated));
    }
  };

  const handleRemoveSavedFilter = (tag: string) => {
    const updated = savedFilters.filter(f => f !== tag);
    setSavedFilters(updated);
    localStorage.setItem('cc_saved_filters', JSON.stringify(updated));
  };

  const handleApplyFilter = (tag: string) => {
    const parts = tag.split(' · ');
    if (parts[0] !== 'All') {
      setSearchTerm(parts[0]);
    } else {
      setSearchTerm('');
    }
    if (parts[1]) {
      handleWindowSelect(parts[1]);
    }
  };

  const toggleCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  // Filter & sort videos
  const filteredVideos = VIDEOS_DATA.filter((v) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match =
        v.title.toLowerCase().includes(term) ||
        v.caption.toLowerCase().includes(term) ||
        v.creator.toLowerCase().includes(term) ||
        v.niche.toLowerCase().includes(term);
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'views') {
      return b.views - a.views;
    }
    if (sortBy === 'engagement') {
      return b.durationSec - a.durationSec;
    }
    // velocity
    return b.views - a.views;
  });

  const compareVideosData = selectedForCompare
    .map(id => VIDEOS_DATA.find(v => v.id === id))
    .filter(Boolean) as VideoMetadata[];

  return (
    <DashboardShell>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
        {/* Banner across top */}
        <div className="bg-[#ffb110]/20 border border-[#ffb110]/40 rounded-xl px-4 py-2.5 text-xs text-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Demo data — connect Treg for live TikTok data</span>
            <span className="text-[#757575] hidden sm:inline">(Velocity formula: (views now − views last check) / hours since last check)</span>
          </div>
          <span className="bg-[#ffb110] text-black text-[10px] font-bold px-2 py-0.5 rounded">
            DEMO
          </span>
        </div>

        {/* 5.2 Top Discovery Bar: Keyword Search Box */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search LED wings, toy blaster, gift…"
                className="w-full bg-white text-sm text-black pl-10 pr-4 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#0075de]/30 focus:border-[#0075de]"
              />
            </div>
            <button
              onClick={handleSaveFilter}
              className="bg-white hover:bg-black/5 text-[#615d59] hover:text-black text-xs font-medium px-4 py-2.5 rounded-xl border border-black/10 transition-colors whitespace-nowrap"
            >
              Save this filter
            </button>
          </div>

          {/* Saved filters chips */}
          {savedFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#757575]">Saved:</span>
              {savedFilters.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-1 bg-white border border-black/8 rounded-full px-2.5 py-0.5 text-xs text-[#615d59]"
                >
                  <button
                    onClick={() => handleApplyFilter(tag)}
                    className="hover:text-black cursor-pointer"
                  >
                    {tag}
                  </button>
                  <button
                    onClick={() => handleRemoveSavedFilter(tag)}
                    className="hover:text-[#f64932] text-[#757575]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Controls Toolbar: Platform, Windows, Sort, Grid/Table */}
        <div className="bg-white p-4 rounded-xl border border-black/8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Platform Toggle */}
            <div className="inline-flex p-1 bg-[#f6f5f4] rounded-lg border border-black/5 text-xs font-medium">
              <button
                onClick={() => handlePlatformSelect('tiktok')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  platform === 'tiktok' ? 'bg-white text-black shadow-2xs font-semibold' : 'text-[#615d59] hover:text-black'
                }`}
              >
                TikTok
              </button>
              <button
                onClick={() => handlePlatformSelect('instagram')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors ${
                  platform === 'instagram' ? 'bg-white text-black shadow-2xs font-semibold' : 'text-[#615d59] hover:text-black'
                }`}
              >
                <span>Instagram</span>
                {(isTrial || plan?.plan === 'starter') && <Lock className="w-3 h-3 text-[#757575]" />}
              </button>
            </div>

            {/* Window Picker */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#757575] mr-1">Window:</span>
              {availableWindows.map((w) => (
                <button
                  key={w}
                  onClick={() => handleWindowSelect(w)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedWindow === w
                      ? 'bg-black text-white font-medium'
                      : 'bg-[#f6f5f4] text-[#615d59] hover:text-black'
                  }`}
                >
                  {w}
                  {isTrial && w !== '24h' && <Lock className="inline w-2.5 h-2.5 ml-1 opacity-70" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#757575]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#f6f5f4] text-black border border-black/10 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none"
              >
                <option value="velocity">Velocity (views/hr)</option>
                <option value="views">Total Views</option>
                <option value="engagement">Engagement Rate</option>
              </select>
            </div>

            {/* Grid / Table Toggle */}
            <div className="inline-flex p-1 bg-[#f6f5f4] rounded-lg border border-black/5 text-xs font-medium">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-md ${
                  viewMode === 'grid' ? 'bg-white text-black shadow-2xs font-semibold' : 'text-[#615d59]'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md ${
                  viewMode === 'table' ? 'bg-white text-black shadow-2xs font-semibold' : 'text-[#615d59]'
                }`}
              >
                Table
              </button>
            </div>

            {/* Compare Trigger Button */}
            {selectedForCompare.length === 2 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="bg-[#0075de] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#0068c8] transition-colors"
              >
                Compare (2)
              </button>
            )}
          </div>
        </div>

        {/* Content View: Grid or Table */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredVideos.map((video) => {
              const isSelected = selectedForCompare.includes(video.id);

              return (
                <div
                  key={video.id}
                  className="bg-white rounded-xl border border-black/8 p-3 shadow-2xs flex flex-col justify-between relative group"
                >
                  {/* Compare checkbox */}
                  <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-xs rounded p-1 shadow-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-medium text-black">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCompare(video.id)}
                        className="rounded border-gray-300 text-[#0075de] focus:ring-0"
                      />
                      <span>Compare</span>
                    </label>
                  </div>

                  <div className="w-full aspect-[9/16] rounded-lg overflow-hidden bg-black relative mb-3">
                    <video
                      src={`/videos/${video.filename}.mp4`}
                      poster={`/videos/${video.filename}-poster.jpg`}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                      onMouseLeave={(e) => {
                        const v = e.target as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0;
                      }}
                    />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      Demo
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-[#757575] mb-1">
                      <span className="font-semibold text-black">{video.creator}</span>
                      <span className="tabular-nums font-mono">{video.viewsFormatted} views</span>
                    </div>
                    <div className="text-xs font-semibold text-black line-clamp-1 mb-1">
                      {video.title}
                    </div>
                    <p className="text-[11px] text-[#615d59] line-clamp-1 italic mb-2">
                      &quot;{video.caption}&quot;
                    </p>

                    {/* Engagement bar */}
                    <div className="flex items-center justify-between text-[11px] text-[#757575] bg-[#f6f5f4] px-2 py-1 rounded-lg mb-2.5 font-mono tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#0075de]" />
                        <span>{video.viewsFormatted}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#f64932] fill-[#f64932]" />
                        <span>{video.likesFormatted}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-[#615d59]" />
                        <span>{video.commentsFormatted}</span>
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-black/5">
                      <button
                        onClick={() => navigate(`/concepts?video=${video.id}&auto=1`)}
                        className="flex-1 bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium py-1.5 rounded-lg transition-colors text-center"
                      >
                        Recreate
                      </button>
                      <button
                        onClick={() => {
                          const prompt = buildHiggsfieldPrompt(video, onboarding);
                          navigator.clipboard.writeText(prompt);
                          setCopiedId(video.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="px-2.5 bg-[#f6f5f4] hover:bg-black/5 text-[#615d59] text-xs font-medium py-1.5 rounded-lg border border-black/10 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <span>{copiedId === video.id ? 'Copied ✓' : 'Copy'}</span>
                        <img src="/images/higgsfield.png" alt="Higgsfield" className="inline-block h-3.5 w-3.5 rounded-xs object-contain" />
                        <span>Higgsfield</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View for Fast Scanning */
          <div className="bg-white rounded-xl border border-black/8 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f6f5f4] border-b border-black/8 text-[#757575] font-semibold">
                    <th className="py-3 px-4 w-10">Comp</th>
                    <th className="py-3 px-4">Video</th>
                    <th className="py-3 px-4">Creator</th>
                    <th className="py-3 px-4">Niche</th>
                    <th className="py-3 px-4 text-right">Views</th>
                    <th className="py-3 px-4 text-right">Velocity</th>
                    <th className="py-3 px-4">CTA Keyword</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/8">
                  {filteredVideos.map((video) => (
                    <tr key={video.id} className="hover:bg-[#f6f5f4]/50 transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedForCompare.includes(video.id)}
                          onChange={() => toggleCompare(video.id)}
                          className="rounded text-[#0075de]"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`/videos/${video.filename}-poster.jpg`}
                            alt={video.title}
                            className="w-10 h-14 rounded object-cover bg-black shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-semibold text-black truncate">{video.title}</div>
                            <div className="text-[11px] text-[#757575] truncate">&quot;{video.caption}&quot;</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-black">{video.creator}</td>
                      <td className="py-3 px-4 text-[#615d59]">{video.niche}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-black font-semibold">
                        {video.viewsFormatted}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#0075de]">
                        ~48.2k/hr
                      </td>
                      <td className="py-3 px-4 text-[#615d59]">
                        {video.ctaKeyword ? (
                          <span className="bg-[#ffb110]/20 text-black px-1.5 py-0.5 rounded text-[11px] font-semibold">
                            {video.ctaKeyword}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded">
                          Took off
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/concepts?video=${video.id}&auto=1`)}
                          className="bg-[#0075de] hover:bg-[#0068c8] text-white px-2.5 py-1 rounded-lg text-xs transition-colors"
                        >
                          Recreate
                        </button>
                        <button
                          onClick={() => {
                            const prompt = buildHiggsfieldPrompt(video, onboarding);
                            navigator.clipboard.writeText(prompt);
                            setCopiedId(video.id);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="bg-[#f6f5f4] hover:bg-black/5 text-[#615d59] px-2.5 py-1 rounded-lg text-xs border border-black/10 transition-colors inline-flex items-center gap-1 align-middle"
                        >
                          <span>{copiedId === video.id ? 'Copied' : 'Prompt'}</span>
                          <img src="/images/higgsfield.png" alt="Higgsfield" className="inline-block h-3 w-3 rounded-xs object-contain" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Compare Modal */}
      {showCompareModal && compareVideosData.length === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-black/10 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 text-[#757575] hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-black mb-4">Format Comparison</h3>

            <div className="grid grid-cols-2 gap-6 border-t border-black/8 pt-4">
              {compareVideosData.map((v) => (
                <div key={v.id} className="space-y-3">
                  <div className="w-full aspect-[9/16] rounded-xl overflow-hidden bg-black max-h-64">
                    <video
                      src={`/videos/${v.filename}.mp4`}
                      poster={`/videos/${v.filename}-poster.jpg`}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-bold text-black text-sm">{v.title}</div>
                  <div className="text-xs text-[#757575] space-y-1">
                    <div><strong>Creator:</strong> {v.creator}</div>
                    <div><strong>Views:</strong> {v.viewsFormatted} ({v.views.toLocaleString()})</div>
                    <div><strong>Estimated Velocity:</strong> ~48,000 / hr</div>
                    <div><strong>CTA:</strong> {v.ctaKeyword || 'Link in bio'}</div>
                    <div><strong>Caption:</strong> &quot;{v.caption}&quot;</div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCompareModal(false);
                      navigate(`/concepts?video=${v.id}&auto=1`);
                    }}
                    className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium py-2 rounded-lg transition-colors"
                  >
                    Recreate this format
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal for Trial Limits */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        message={upgradeMessage}
      />
    </DashboardShell>
  );
};
