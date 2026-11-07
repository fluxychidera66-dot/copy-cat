import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { StripeNoticeModal } from '../components/common/Modals';
import { VIDEOS_DATA, FORMAT_TABS_MAPPING, APP_NAME } from '../config';
import { api } from '../api';
import { ArrowRight, Check, ChevronDown, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFormatTab, setSelectedFormatTab] = useState<string>("Cycling / Moto");
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [stripeNoticeOpen, setStripeNoticeOpen] = useState(false);
  const [chosenPlanModal, setChosenPlanModal] = useState<string>('');

  // 2.7 Demo interactive state
  const demoCandidateVideos = VIDEOS_DATA.slice(0, 4);
  const [demoSelectedVideoId, setDemoSelectedVideoId] = useState<string>(demoCandidateVideos[0].id);
  const [demoConcept, setDemoConcept] = useState<{ title: string; hook: string } | null>({
    title: "The 3-Second Night Riding Pattern Interrupt",
    hook: '"Comment WING if you want to be seen from 5 blocks away tonight."'
  });
  const [demoGenerating, setDemoGenerating] = useState<boolean>(false);
  const [demoResult, setDemoResult] = useState<string | null>(null);

  // 12 unique video tiles for the marquee (no repeats)
  const marqueeVideos = [
    VIDEOS_DATA.find(v => v.id === "led-wings-1")!,
    VIDEOS_DATA.find(v => v.id === "toy-blaster-1")!,
    VIDEOS_DATA.find(v => v.id === "made-me-buy-it-1")!,
    VIDEOS_DATA.find(v => v.id === "car-lights-1")!,
    VIDEOS_DATA.find(v => v.id === "christmas-tree")!,
    VIDEOS_DATA.find(v => v.id === "projector")!,
    VIDEOS_DATA.find(v => v.id === "beauty-gloss")!,
    VIDEOS_DATA.find(v => v.id === "dancing-character-hero")!,
    VIDEOS_DATA.find(v => v.id === "led-wings-2")!,
    VIDEOS_DATA.find(v => v.id === "toy-blaster-2")!,
    VIDEOS_DATA.find(v => v.id === "car-lights-2")!,
    VIDEOS_DATA.find(v => v.id === "gift-necklace")!
  ];

  const handleDemoVideoPick = (id: string) => {
    setDemoSelectedVideoId(id);
    setDemoResult(null);
    const matched = VIDEOS_DATA.find(v => v.id === id);
    if (matched) {
      setDemoConcept({
        title: `Tailored Hook for ${matched.niche}: ${matched.title}`,
        hook: `"${matched.caption} — Watch how easy this transforms your routine."`
      });
    }
  };

  const handleDemoGenerate = async () => {
    setDemoGenerating(true);
    setDemoResult(null);

    // Call real backend video generation endpoint
    const res = await api('/api/v1/videos/generate', {
      method: 'POST',
      body: JSON.stringify({
        seconds: 10,
        resolution: '480p',
        mode: 'wan',
        prompt: `Demo organic TikTok clip for ${demoConcept?.title || 'product'}`
      })
    });

    setDemoGenerating(false);
    if (!res.ok) {
      // Show honest one-line sanitized message from backend
      setDemoResult(
        res.error || "ArgoLink / OpenRouter provider keys are pending on dropship-api worker. Generating full video is available in dashboard."
      );
    } else {
      setDemoResult("Video job queued on backend! Full preview rendering in dashboard.");
    }
  };

  const openStripeNotice = (planName: string) => {
    setChosenPlanModal(planName);
    setStripeNoticeOpen(true);
  };

  // 2.9 Format tabs videos
  const activeFormatPair = FORMAT_TABS_MAPPING[selectedFormatTab] || ["led-wings-1", "led-wings-2"];
  const formatVideos = activeFormatPair.map(id => VIDEOS_DATA.find(v => v.id === id)!).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f6f5f4] text-[#000000]">
      <Header />

      {/* 2.3 Hero (centred) */}
      <section className="pt-16 pb-12 px-4 sm:px-8 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-black mb-6 leading-[1.08]">
          Find the viral video. <span className="bg-[#ffb110] text-black px-2 py-0.5 rounded-md">Clone</span> the format. Post it.
        </h1>
        <p className="font-serif-hero text-lg sm:text-xl text-[#615d59] leading-relaxed max-w-3xl mx-auto mb-8">
          Watch the fastest-growing organic TikTok videos while they are still growing, get concepts tailored to your product, and generate the video in one click — no ad spend, no TikTok Shop, no starting from scratch.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
          <Link
            to="/auth/?trial=1"
            className="w-full sm:w-auto bg-[#0075de] hover:bg-[#0068c8] text-white font-medium px-6 py-3 rounded-lg text-base transition-colors text-center"
          >
            Start 7-day free trial
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto bg-white hover:bg-black/5 text-black border border-black/10 font-medium px-6 py-3 rounded-lg text-base transition-colors text-center"
          >
            Try the demo ↓
          </a>
        </div>

        {/* Trustline underneath the buttons, with real logos beside the names */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-[#615d59] bg-white border border-black/8 py-2 px-4 rounded-full mt-2">
          <span>Starter $49/mo — replaces</span>
          <img src="/images/minea.png" alt="Minea logo" className="inline-block h-4 w-4 rounded-xs align-middle" />
          <span className="font-medium text-black">Minea ($49)</span>
          <span>+</span>
          <img src="/images/higgsfield.png" alt="Higgsfield logo" className="inline-block h-4 w-4 rounded-xs align-middle" />
          <span className="font-medium text-black">Higgsfield Plus ($59)</span>
          <span>— $108/mo. You save $59/mo.</span>
        </div>
      </section>

      {/* 2.4 Video-wall marquee: one dense row of 12 unique video tiles, no repeats, pauses on hover */}
      <section className="py-6 overflow-hidden border-y border-black/8 bg-black/2">
        <div className="animate-video-marquee flex gap-4">
          {[...marqueeVideos, ...marqueeVideos].map((video, idx) => (
            <div
              key={`${video.id}-${idx}`}
              className="w-40 sm:w-48 h-72 sm:h-84 shrink-0 rounded-xl overflow-hidden bg-black relative border border-black/10 shadow-xs"
            >
              <video
                src={`/videos/${video.filename}.mp4`}
                poster={`/videos/${video.filename}-poster.jpg`}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 2.5 Ticker (one quiet scrolling line, 10 exact phrases, ONE ✦ marking seam) */}
      <div className="w-full bg-white border-b border-black/8 py-3 overflow-hidden text-xs text-[#757575] select-none">
        <div className="animate-ticker flex items-center gap-4">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <span><strong className="text-black font-semibold">Velocity-ranked</strong> TikTok leaderboard</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Follow creators</strong>, get posting alerts</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Concepts</strong> written for your product</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Clone</strong> the format, not the video</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Wan 3.0</strong> · Seedance 2.5 · Kling O3</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">9:16</strong> · up to 30s · native audio</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">2h · 6h · 24h · 3d</strong> windows</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Post to</strong> TikTok and Reels</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Organic only</strong> — no ad spend</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">One app</strong> instead of two</span>
            <span>✦</span>
          </div>
          <div className="flex items-center gap-6 whitespace-nowrap" aria-hidden="true">
            <span><strong className="text-black font-semibold">Velocity-ranked</strong> TikTok leaderboard</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Follow creators</strong>, get posting alerts</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Concepts</strong> written for your product</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Clone</strong> the format, not the video</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Wan 3.0</strong> · Seedance 2.5 · Kling O3</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">9:16</strong> · up to 30s · native audio</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">2h · 6h · 24h · 3d</strong> windows</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Post to</strong> TikTok and Reels</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">Organic only</strong> — no ad spend</span>
            <span>✦</span>
            <span><strong className="text-black font-semibold">One app</strong> instead of two</span>
            <span>✦</span>
          </div>
        </div>
      </div>

      {/* 2.6 "Create better organic videos with AI" — 3 steps */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mb-4">
            Create better organic videos with AI
          </h2>
          <p className="text-base text-[#615d59] leading-relaxed">
            Forget switching between dozens of tools, complex timelines, and slow production. {APP_NAME} gives you everything you need to find, concept, and generate a video — in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl border border-black/8 p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#0075de] font-semibold mb-2">01</div>
              <h3 className="text-xl font-bold text-black mb-2">Pick the viral format</h3>
              <p className="text-sm text-[#615d59] leading-relaxed mb-6">
                The leaderboard ranks videos by velocity — views per hour — in 2h, 6h, 24h, and 3-day windows. Default is 6h. No month view: by then the wave is gone.
              </p>
            </div>
            <div className="w-full h-64 rounded-lg overflow-hidden bg-black relative">
              <video
                src="/videos/led-wings-1.mp4"
                poster="/videos/led-wings-1-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[11px] p-2 rounded">
                Ranked by velocity: 48.2K views/hour
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl border border-black/8 p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#0075de] font-semibold mb-2">02</div>
              <h3 className="text-xl font-bold text-black mb-2">Get concepts for your product</h3>
              <p className="text-sm text-[#615d59] leading-relaxed mb-6">
                Pick a video and {APP_NAME} gives you concepts already tailored to your product and character. You choose, tweak, or edit one. You do not invent the concept from scratch.
              </p>
            </div>
            <div className="w-full h-64 rounded-lg overflow-hidden bg-black relative">
              <video
                src="/videos/dancing-character-hero.mp4"
                poster="/videos/dancing-character-hero-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[11px] p-2 rounded">
                Hook + 5-shot breakdown tailored to your brand
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl border border-black/8 p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[#0075de] font-semibold mb-2">03</div>
              <h3 className="text-xl font-bold text-black mb-2">Generate the video</h3>
              <p className="text-sm text-[#615d59] leading-relaxed mb-6">
                One click. Wan 3.0, Seedance 2.5, or Kling O3. Download it and post it on TikTok.
              </p>
            </div>
            <div className="w-full h-64 rounded-lg overflow-hidden bg-black relative">
              <video
                src="/videos/car-lights-1.mp4"
                poster="/videos/car-lights-1-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[11px] p-2 rounded">
                Wan 3.0 · 9:16 · Up to 30s · Native audio
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.7 Demo — "Try it right here" */}
      <section id="demo" className="py-16 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-black/8 p-6 sm:p-10 shadow-xs">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Try it right here</h2>
            <p className="text-sm text-[#615d59]">Pick a viral video → get a concept → generate.</p>
          </div>

          <div className="space-y-6">
            {/* Step 1: Pick a viral video */}
            <div className="border-b border-black/8 pb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-black mb-3">
                1. Pick a viral video
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {demoCandidateVideos.map((vid) => (
                  <button
                    key={vid.id}
                    onClick={() => handleDemoVideoPick(vid.id)}
                    className={`relative rounded-lg overflow-hidden border text-left p-1 transition-all ${
                      demoSelectedVideoId === vid.id
                        ? 'border-[#0075de] ring-2 ring-[#0075de]/30'
                        : 'border-black/10 hover:border-black/30'
                    }`}
                  >
                    <div className="w-full h-32 rounded bg-black overflow-hidden relative mb-1.5">
                      <video
                        src={`/videos/${vid.filename}.mp4`}
                        poster={`/videos/${vid.filename}-poster.jpg`}
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="px-1">
                      <div className="text-xs font-semibold text-black truncate">{vid.creator}</div>
                      <div className="text-[11px] text-[#757575]">{vid.viewsFormatted} views</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Get a concept for your product */}
            <div className="border-b border-black/8 pb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-black mb-3">
                2. Get a concept for your product
              </div>
              {demoConcept ? (
                <div className="bg-[#f6f5f4] p-4 rounded-xl border border-black/5">
                  <div className="text-xs font-medium text-[#0075de] mb-1">Tailored Concept</div>
                  <h4 className="text-sm font-bold text-black mb-2">{demoConcept.title}</h4>
                  <div className="text-xs italic text-[#615d59] bg-white p-3 rounded-lg border border-black/5">
                    Hook: {demoConcept.hook}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#757575] italic">Pick a video first.</div>
              )}
            </div>

            {/* Step 3: Generate the video */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-black mb-3">
                3. Generate the video
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f6f5f4] p-4 rounded-xl border border-black/5">
                <div>
                  <div className="text-xs font-semibold text-black">
                    Wan 3.0 · 10s · 480p · 10 coins
                  </div>
                  <div className="text-[11px] text-[#757575] mt-0.5">
                    Full generation lives in the dashboard.
                  </div>
                </div>
                <button
                  onClick={handleDemoGenerate}
                  disabled={demoGenerating}
                  className="bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                >
                  {demoGenerating ? "Generating video…" : "Generate video"}
                </button>
              </div>

              {demoResult && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-black/10 text-xs text-[#615d59]">
                  {demoResult}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2.8 "Going viral right now" — results grid */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-black/8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-black mb-2">Going viral right now</h2>
          <p className="text-sm text-[#615d59]">
            Example videos from TikTok, shown with creator credit. The leaderboard ranks them by views per hour, not total views.
          </p>
        </div>

        {/* Dense grid of 6 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: LED bike wings */}
          <div className="bg-white rounded-xl border border-black/8 p-3 flex flex-col justify-between">
            <div className="w-full h-80 rounded-lg overflow-hidden bg-black relative mb-3">
              <video
                src="/videos/led-wings-1.mp4"
                poster="/videos/led-wings-1-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded">
                Preview
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-black mb-1.5 line-clamp-1">
                Comment &quot;WING&quot; if you need this
              </p>
              <div className="flex items-center justify-between text-xs text-[#757575]">
                <span>Views 1.1M</span>
                <span>@wingwolt.us</span>
              </div>
            </div>
          </div>

          {/* Card 2: Home gadget */}
          <div className="bg-white rounded-xl border border-black/8 p-3 flex flex-col justify-between">
            <div className="w-full h-80 rounded-lg overflow-hidden bg-black relative mb-3">
              <video
                src="/videos/made-me-buy-it-2.mp4"
                poster="/videos/made-me-buy-it-2-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded">
                Preview
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-black mb-1.5 line-clamp-1">
                Home gadget, straight to the point.
              </p>
              <div className="flex items-center justify-between text-xs text-[#757575]">
                <span>Views 14.3M</span>
                <span>@velora8892</span>
              </div>
            </div>
          </div>

          {/* Card 3: Tiny Christmas tree */}
          <div className="bg-white rounded-xl border border-black/8 p-3 flex flex-col justify-between">
            <div className="w-full h-80 rounded-lg overflow-hidden bg-black relative mb-3">
              <video
                src="/videos/christmas-tree.mp4"
                poster="/videos/christmas-tree-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded">
                Preview
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-black mb-1.5 line-clamp-1">
                Stop spending hours decorating.
              </p>
              <div className="flex items-center justify-between text-xs text-[#757575]">
                <span>Views 9.9M</span>
                <span>@baw6v5</span>
              </div>
            </div>
          </div>

          {/* Card 4: LED bike wings, second angle */}
          <div className="bg-white rounded-xl border border-black/8 p-3 flex flex-col justify-between">
            <div className="w-full h-80 rounded-lg overflow-hidden bg-black relative mb-3">
              <video
                src="/videos/led-wings-3.mp4"
                poster="/videos/led-wings-3-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded">
                Preview
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-black mb-1.5 line-clamp-1">
                Comment &quot;WINGS&quot; if you want this
              </p>
              <div className="flex items-center justify-between text-xs text-[#757575]">
                <span>Views 491K</span>
                <span>@ride.flare</span>
              </div>
            </div>
          </div>

          {/* Card 5: Character dance outdoors */}
          <div className="bg-white rounded-xl border border-black/8 p-3 flex flex-col justify-between">
            <div className="w-full h-80 rounded-lg overflow-hidden bg-black relative mb-3">
              <video
                src="/videos/dancing-character-outdoor.mp4"
                poster="/videos/dancing-character-outdoor-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#0075de] text-white text-[10px] font-medium px-2 py-0.5 rounded">
                Generated with CopyCat
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-black mb-1.5 line-clamp-1">
                Same character, new scene.
              </p>
              <div className="flex items-center justify-between text-xs text-[#757575]">
                <span>Format: Character</span>
                <span>Generated with CopyCat</span>
              </div>
            </div>
          </div>

          {/* Card 6: Story format */}
          <div className="bg-white rounded-xl border border-black/8 p-3 flex flex-col justify-between">
            <div className="w-full h-80 rounded-lg overflow-hidden bg-black relative mb-3">
              <video
                src="/videos/barber-story.mp4"
                poster="/videos/barber-story-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-[#0075de] text-white text-[10px] font-medium px-2 py-0.5 rounded">
                Generated with CopyCat
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-black mb-1.5 line-clamp-1">
                &quot;IT&apos;S A DESIGN&quot; — Hook in 3 seconds, payoff at the end.
              </p>
              <div className="flex items-center justify-between text-xs text-[#757575]">
                <span>Format: Story</span>
                <span>Generated with CopyCat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.9 Format tabs — "Every viral format you need, one app" */}
      <section id="formats" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-black/8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-black mb-3">
            Every viral format you need, one app
          </h2>
          <p className="text-sm text-[#615d59]">
            Trends decay fast. These are the formats that are working right now, grouped by what people are actually buying.
          </p>
        </div>

        {/* 7 Tabs by niche: Gift, Fandom, Automotive, Cycling / Moto (default), Toys, Beauty, Home */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap mb-10">
          {["Gift", "Fandom", "Automotive", "Cycling / Moto", "Toys", "Beauty", "Home"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFormatTab(tab)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedFormatTab === tab
                  ? 'bg-black text-white'
                  : 'bg-white text-[#615d59] border border-black/8 hover:text-black hover:border-black/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Panel showing TWO real TikTok example videos playing with creator credit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {formatVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl border border-black/8 p-3 shadow-xs">
              <div className="w-full h-96 rounded-lg overflow-hidden bg-black relative mb-3">
                <video
                  src={`/videos/${video.filename}.mp4`}
                  poster={`/videos/${video.filename}-poster.jpg`}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-1">
                <div className="text-sm font-semibold text-black mb-1">{video.title}</div>
                <div className="flex items-center justify-between text-xs text-[#757575]">
                  <span>{video.creator}</span>
                  <span>{video.isFounderVideo ? "Generated with CopyCat" : `${video.viewsFormatted} real views`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2.10 Feature rows (3 alternating, each with a real visual) */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-black/8 space-y-24">
        {/* Row 1: The most consistent AI characters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="text-xs font-mono font-semibold text-[#0075de] uppercase tracking-wider">Consistency</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black">
              The most consistent AI characters
            </h3>
            <p className="text-sm text-[#615d59] leading-relaxed">
              Your product and character, the same in every clip — up to 10 reference images, held across every generation.
            </p>
            <h4 className="text-lg font-bold text-black pt-2">
              Create your own AI character
            </h4>
            <p className="text-sm text-[#615d59] leading-relaxed">
              Generate a character once — and make them hold your product, wear your clothes, and dance in your scene. Upload your product and character references once, and every video keeps the same character and product, clip after clip.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden bg-white border border-black/8 p-3 shadow-xs">
            <div className="w-full h-96 rounded-lg overflow-hidden bg-black">
              <video
                src="/videos/dancing-character-hero.mp4"
                poster="/videos/dancing-character-hero-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs text-center text-[#757575] mt-2">
              Consistent blonde bob wig, brown suit, and gold accessories across clips
            </div>
          </div>
        </div>

        {/* Row 2: Clone a proven format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden bg-white border border-black/8 p-4 shadow-xs order-2 md:order-1">
            <div className="grid grid-cols-2 gap-3 items-center">
              <div>
                <div className="w-full h-64 rounded bg-black overflow-hidden relative">
                  <video
                    src="/videos/led-wings-1.mp4"
                    poster="/videos/led-wings-1-poster.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Viral video
                  </span>
                </div>
              </div>
              <div>
                <div className="w-full h-64 rounded bg-black overflow-hidden relative">
                  <video
                    src="/videos/dancing-character-outdoor.mp4"
                    poster="/videos/dancing-character-outdoor-poster.jpg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-[#0075de] text-white text-[10px] px-1.5 py-0.5 rounded">
                    Your character
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#757575] mt-3 pt-2 border-t border-black/5">
              <span>Viral motion copy workflow</span>
              <span className="bg-[#efedeb] text-black text-[11px] px-2 py-0.5 rounded font-mono">
                Illustration
              </span>
            </div>
          </div>
          <div className="space-y-4 order-1 md:order-2">
            <div className="text-xs font-mono font-semibold text-[#0075de] uppercase tracking-wider">Format Transfer</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black">
              Clone a proven format
            </h3>
            <p className="text-sm text-[#615d59] leading-relaxed">
              Kling O3 video-to-video copies the motion and format of a viral video, with your product and character in it. Clone wiring is in progress on the backend — the app says so instead of faking it.
            </p>
          </div>
        </div>

        {/* Row 3: Get alerted the second they post */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="text-xs font-mono font-semibold text-[#0075de] uppercase tracking-wider">Alert Feed</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black">
              Get alerted the second they post
            </h3>
            <p className="text-sm text-[#615d59] leading-relaxed">
              Follow a creator and get alerted as soon as they post. One account is one product, so following a creator means following one product — ride the wave while it is still growing, before it goes too viral.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden bg-white border border-black/8 p-6 shadow-xs space-y-4">
            {/* Alert card 1: active with pulsing live dot */}
            <div className="flex items-center gap-3 p-3 bg-[#f6f5f4] rounded-lg border border-black/5">
              <img src="/videos/led-wings-1-poster.jpg" alt="@wingwolt.us" className="w-12 h-12 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-black truncate">@wingwolt.us</span>
                  <span className="bg-[#ffb110] text-black text-[10px] font-semibold px-1.5 py-0.2 rounded">
                    New post
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#f64932] animate-pulse" />
                </div>
                <div className="text-xs text-[#615d59] truncate">LED bike wings · velocity rising</div>
                <div className="text-[10px] text-[#757575]">12 min ago</div>
              </div>
            </div>

            {/* Alert card 2: dimmed */}
            <div className="flex items-center gap-3 p-3 bg-[#f6f5f4]/60 rounded-lg border border-black/5 opacity-60">
              <img src="/videos/toy-blaster-1-poster.jpg" alt="@jmj_gelblaster" className="w-12 h-12 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-black truncate">@jmj_gelblaster</div>
                <div className="text-xs text-[#615d59] truncate">Toy blaster · velocity rising</div>
                <div className="text-[10px] text-[#757575]">26 min ago</div>
              </div>
            </div>

            <div className="text-xs text-center text-[#757575] pt-1">
              Alerted as soon as they post
            </div>
          </div>
        </div>
      </section>

      {/* 2.11 Models strip — "Choose your model" */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto border-t border-black/8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Choose your model</h2>
          <p className="text-sm text-[#615d59]">Pick the model that fits the video. Default is Wan 3.0 — the workhorse.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-black/8">
            <div className="text-sm font-bold text-black mb-1">
              Default — Wan 3.0. Up to 30 seconds in one take, native audio, 9:16. $0.0325/s at 480p, $0.065/s at 720p, $0.13/s at 1080p (ArgoLink).
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-black/8">
            <div className="text-sm font-bold text-black mb-1">
              Hero — Seedance 2.5. Best quality and consistency, for the video that has to land.
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-black/8">
            <div className="text-sm font-bold text-black mb-1">
              Clone — Kling O3. Video-to-video: copy a viral video&apos;s motion with your character.
            </div>
          </div>
        </div>
      </section>

      {/* 2.12 Pricing */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-black/8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-black mb-4">Pricing</h2>
          <div className="inline-flex items-center gap-1.5 p-1 bg-white rounded-lg border border-black/8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                billingCycle === 'monthly' ? 'bg-[#0075de] text-white' : 'text-[#615d59] hover:text-black'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                billingCycle === 'annual' ? 'bg-[#0075de] text-white' : 'text-[#615d59] hover:text-black'
              }`}
            >
              Annual — save up to 20%
            </button>
          </div>
        </div>

        {/* 3 Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Starter */}
          <div className="bg-white rounded-xl border border-black/8 p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-black mb-1">Starter</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-black">
                  ${billingCycle === 'monthly' ? '49' : '39'}
                </span>
                <span className="text-xs text-[#757575]">/mo</span>
              </div>
              {billingCycle === 'annual' && (
                <div className="text-xs font-medium text-[#0075de] mb-4">
                  Save $120 a year vs monthly
                </div>
              )}

              {/* Seconds hero block */}
              <div className="bg-[#f6f5f4] p-4 rounded-lg my-6">
                <div className="text-2xl font-bold text-black">100</div>
                <div className="text-xs font-medium text-black">seconds of video / month</div>
                <div className="text-[11px] text-[#757575] mt-1">
                  10 × 10s videos at 480p · 5 × 10s at 720p
                </div>
              </div>

              {/* Features list verbatim */}
              <ul className="space-y-2.5 text-xs text-[#615d59] mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>unlimited leaderboard viewing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>follow 10 creators</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>unlimited Claude concepts</span>
                </li>
                <li className="text-[#757575] pl-6">No clones — add $3 per 10s</li>
                <li className="text-[#757575] pl-6">No heroes — add $7 per 15s</li>
              </ul>
            </div>

            <button
              onClick={() => openStripeNotice('Starter')}
              className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium py-2.5 rounded-lg transition-colors text-center"
            >
              Choose Starter
            </button>
          </div>

          {/* Growth */}
          <div className="bg-white rounded-xl border-2 border-[#0075de] p-8 flex flex-col justify-between relative shadow-sm">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffb110] text-black text-[11px] font-bold px-3 py-0.5 rounded-full">
              Best value
            </span>
            <div>
              <h3 className="text-lg font-bold text-black mb-1">Growth</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-black">
                  ${billingCycle === 'monthly' ? '99' : '79'}
                </span>
                <span className="text-xs text-[#757575]">/mo</span>
              </div>
              {billingCycle === 'annual' && (
                <div className="text-xs font-medium text-[#0075de] mb-4">
                  Save $240 a year vs monthly
                </div>
              )}

              {/* Seconds hero block */}
              <div className="bg-[#f6f5f4] p-4 rounded-lg my-6">
                <div className="text-2xl font-bold text-black">240</div>
                <div className="text-xs font-medium text-black">seconds of video / month</div>
                <div className="text-[11px] text-[#757575] mt-1">
                  24 × 10s videos at 480p · 12 × 10s at 720p
                </div>
              </div>

              {/* Features list verbatim */}
              <ul className="space-y-2.5 text-xs text-[#615d59] mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>everything in Starter</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>follow 30 creators</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>Instagram Reels leaderboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>TikTok + Meta ad library</span>
                </li>
                <li className="flex items-center gap-2 text-black font-medium">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>2 Kling clones included</span>
                </li>
                <li className="text-[#757575] pl-6">No heroes — add $7 per 15s</li>
              </ul>
            </div>

            <button
              onClick={() => openStripeNotice('Growth')}
              className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium py-2.5 rounded-lg transition-colors text-center"
            >
              Choose Growth
            </button>
          </div>

          {/* Scale */}
          <div className="bg-white rounded-xl border border-black/8 p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-black mb-1">Scale</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-black">
                  ${billingCycle === 'monthly' ? '199' : '159'}
                </span>
                <span className="text-xs text-[#757575]">/mo</span>
              </div>
              {billingCycle === 'annual' && (
                <div className="text-xs font-medium text-[#0075de] mb-4">
                  Save $480 a year vs monthly
                </div>
              )}

              {/* Seconds hero block */}
              <div className="bg-[#f6f5f4] p-4 rounded-lg my-6">
                <div className="text-2xl font-bold text-black">500</div>
                <div className="text-xs font-medium text-black">seconds of video / month</div>
                <div className="text-[11px] text-[#757575] mt-1">
                  50 × 10s videos at 480p · 25 × 10s at 720p
                </div>
              </div>

              {/* Features list verbatim */}
              <ul className="space-y-2.5 text-xs text-[#615d59] mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>everything in Growth</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>unlimited follows</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>priority render queue</span>
                </li>
                <li className="flex items-center gap-2 text-black font-medium">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>5 Kling clones included</span>
                </li>
                <li className="flex items-center gap-2 text-black font-medium">
                  <Check className="w-4 h-4 text-[#0075de] shrink-0" />
                  <span>2 Seedance heroes included</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => openStripeNotice('Scale')}
              className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-sm font-medium py-2.5 rounded-lg transition-colors text-center"
            >
              Choose Scale
            </button>
          </div>
        </div>

        {/* Reassurance strip */}
        <div className="text-center text-xs text-[#757575] space-x-2">
          <span>7-day free trial</span>
          <span>·</span>
          <span>no card required</span>
          <span>·</span>
          <span>No free plan — cancel anytime</span>
          <span>·</span>
          <span>Annual prices are per month, billed annually</span>
          <span>·</span>
          <Link to="/pricing" className="text-[#0075de] hover:underline font-medium">
            See coin packs and add-ons →
          </Link>
        </div>
      </section>

      {/* 2.13 FAQ — "Questions, answered plainly" (6 questions, real answers) */}
      <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto border-t border-black/8">
        <h2 className="text-3xl font-bold tracking-tight text-black text-center mb-12">
          Questions, answered plainly
        </h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-black/8">
            <h3 className="text-base font-bold text-black mb-2">1. Is this TikTok Shop?</h3>
            <p className="text-sm text-[#615d59] leading-relaxed">
              No. CopyCat is for organic TikTok videos — AI-generated videos posted to a normal TikTok account, with no ad spend and no TikTok Shop.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-black/8">
            <h3 className="text-base font-bold text-black mb-2">2. Do I need a product ready?</h3>
            <p className="text-sm text-[#615d59] leading-relaxed">
              No. Most users do not have a product ready yet — it is custom-made. Tell CopyCat what you are making (or tick &quot;I don&apos;t have a product yet&quot;) and the concepts are built around it.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-black/8">
            <h3 className="text-base font-bold text-black mb-2">3. How long are the videos?</h3>
            <p className="text-sm text-[#615d59] leading-relaxed">
              Up to 30 seconds in one take, 9:16, with native audio. Plans include 100 to 500 seconds a month; extra seconds are $0.20/sec.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-black/8">
            <h3 className="text-base font-bold text-black mb-2">4. What models generate the video?</h3>
            <p className="text-sm text-[#615d59] leading-relaxed">
              Wan 3.0 is the default workhorse, Seedance 2.5 is the hero upgrade for the best quality, and Kling O3 is the clone mode that copies a viral video&apos;s motion and format for your product.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-black/8">
            <h3 className="text-base font-bold text-black mb-2">5. What happens after my 7-day trial?</h3>
            <p className="text-sm text-[#615d59] leading-relaxed">
              Nothing is charged automatically — we never take your card for a trial. When it ends, generation locks until you pick a plan and pay through Stripe, and you can cancel any time. Trial limits: 24h leaderboard only, follow 1 creator, 3 concept lists, 2 × 10s videos at 480p watermarked.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-black/8">
            <h3 className="text-base font-bold text-black mb-2 flex items-center gap-1.5 flex-wrap">
              <span>6. Can I use my own</span>
              <img src="/images/higgsfield.png" alt="Higgsfield" className="inline-block h-4 w-4 rounded-xs" />
              <span>Higgsfield account?</span>
            </h3>
            <p className="text-sm text-[#615d59] leading-relaxed">
              Yes — there is a BYO Higgsfield toggle. One thing to know: Higgsfield subscription credits do NOT pay for API calls. The API uses a separate pay-as-you-go balance. There is also a &quot;Send to Higgsfield&quot; web route that uses your subscription credits.
            </p>
          </div>
        </div>
      </section>

      {/* 2.14 Closing CTA band */}
      <section className="py-20 px-4 sm:px-8 bg-[#02093a] text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Ready to ride the next wave before it goes <span className="bg-[#ffb110] text-black px-2 py-0.5 rounded-md">viral?</span>
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Find the format, get the concept, make the video — in the same app, for $49, instead of $108 across two tools.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm text-white/90 bg-white/10 py-2 px-4 rounded-full">
            <span>$49/mo CopyCat Starter instead of</span>
            <img src="/images/minea.png" alt="Minea" className="inline-block h-4 w-4 rounded-xs" />
            <span>Minea $49 +</span>
            <img src="/images/higgsfield.png" alt="Higgsfield" className="inline-block h-4 w-4 rounded-xs" />
            <span>Higgsfield Plus $59 = $108/mo</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/auth/?trial=1"
              className="w-full sm:w-auto bg-[#ffb110] hover:bg-[#f0a508] text-black font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              Start 7-day free trial
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg text-sm transition-colors border border-white/20"
            >
              See pricing
            </Link>
          </div>

          <div className="text-xs text-white/60 pt-2">
            7-day free trial · no card required · cancel anytime
          </div>
          <div className="text-xs text-white/70 pt-2">
            Founder-level support — questions? Email <a href="mailto:hello@copycat.app" className="underline hover:text-white">hello@copycat.app</a> and you will hear from the people building CopyCat.
          </div>
        </div>
      </section>

      {/* 2.15 Footer */}
      <Footer />

      {/* Stripe Notice Modal */}
      <StripeNoticeModal
        isOpen={stripeNoticeOpen}
        onClose={() => setStripeNoticeOpen(false)}
        planName={chosenPlanModal}
      />
    </div>
  );
};
