import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { FORMAT_RECIPES, MISSING_VIDEOS, VIDEOS_DATA } from '../config';
import { ArrowRight, Info, Upload } from 'lucide-react';

export const FormatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedNiche, setSelectedNiche] = useState<string>('All');

  const niches = ["All", "Gift", "Fandom", "Automotive", "Cycling / Moto", "Toys", "Beauty", "Home"];

  const filteredFormats = selectedNiche === 'All'
    ? FORMAT_RECIPES
    : FORMAT_RECIPES.filter(f => f.niche.toLowerCase() === selectedNiche.toLowerCase());

  return (
    <DashboardShell>
      <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
            Formats that are working
          </h1>
          <p className="text-sm text-[#757575] mt-1">
            Browse proven viral formats like a cookbook — see the dish, read the recipe, cook it.
          </p>

          {/* Niche filter chips */}
          <div className="flex items-center gap-1.5 flex-wrap mt-6">
            {niches.map((niche) => (
              <button
                key={niche}
                onClick={() => setSelectedNiche(niche)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedNiche === niche
                    ? 'bg-black text-white'
                    : 'bg-white text-[#615d59] border border-black/8 hover:text-black'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        {/* Formats Grid: One card per format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredFormats.map((format) => {
            const videoMeta = VIDEOS_DATA.find(v => v.id === format.videoId) || VIDEOS_DATA[0];

            return (
              <div
                key={format.name}
                className="bg-white rounded-xl border border-black/8 p-5 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0075de]">
                      {format.niche}
                    </span>
                    <span className="text-[11px] text-[#757575] font-mono">
                      {videoMeta.creator}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-black mb-1.5">
                    {format.name}
                  </h3>
                  <div className="text-xs text-[#615d59] bg-[#f6f5f4] p-2.5 rounded-lg border border-black/5 mb-4">
                    <strong>Hook:</strong> {format.hook}
                  </div>

                  {/* Video preview player */}
                  <div className="w-full aspect-video sm:aspect-[16/10] rounded-lg overflow-hidden bg-black mb-4">
                    <video
                      src={`/videos/${videoMeta.filename}.mp4`}
                      poster={`/videos/${videoMeta.filename}-poster.jpg`}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 5 shots list */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-[#757575]">Shot Breakdown (Recipe):</div>
                    {format.shots.map((shot, idx) => (
                      <div key={idx} className="flex items-baseline gap-2 text-xs">
                        <span className="font-mono text-[10px] text-[#0075de] font-semibold shrink-0 w-12">
                          {shot.time}
                        </span>
                        <span className="font-medium text-black shrink-0">{shot.label}:</span>
                        <span className="text-[#615d59] line-clamp-1">{shot.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/concepts?video=${videoMeta.id}&auto=1`)}
                  className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Use this format</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* "Still to come — 6 videos we need" Section */}
        <div className="bg-white rounded-2xl border border-black/8 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/8 pb-4">
            <div>
              <h2 className="text-lg font-bold text-black">
                Still to come — 6 videos we need
              </h2>
              <p className="text-xs text-[#757575] mt-0.5">
                Each under 100 MB, 9:16, 10–30 seconds, MP4, with audio (except #6).
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0075de] bg-[#e6f3fe] px-3 py-1 rounded-full">
              Community uploads target
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MISSING_VIDEOS.map((item) => (
              <div
                key={item.num}
                className="bg-[#f6f5f4] rounded-xl p-4 border border-black/5 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[#0075de] font-bold">#{item.num}</span>
                    <span className="text-[#757575]">{item.specs}</span>
                  </div>
                  <h4 className="text-sm font-bold text-black">{item.title}</h4>
                  <p className="text-xs text-[#615d59] mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <div className="text-[11px] text-[#757575] italic pt-2 border-t border-black/5">
                  Placement: {item.placement}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};
