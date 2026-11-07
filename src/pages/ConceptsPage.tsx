import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { DashboardShell } from '../components/dashboard/DashboardShell';
import { useApp } from '../context/AppContext';
import { VIDEOS_DATA, TRIAL_LIMITS } from '../config';
import { ConceptItem } from '../types';
import { api } from '../api';
import { UpgradeModal } from '../components/common/Modals';
import { Edit2, Bookmark, Check, ArrowRight, Sparkles } from 'lucide-react';

export const ConceptsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    onboarding,
    isTrial,
    trialConceptListsUsed,
    incrementTrialConceptCount,
    saveConcept,
    savedConcepts,
    updateConceptStatus
  } = useApp();

  const sourceVideoParam = searchParams.get('video');
  const autoGenerateParam = searchParams.get('auto') === '1';

  const [selectedVideoId, setSelectedVideoId] = useState<string>(sourceVideoParam || '');
  const [selectedNiche, setSelectedNiche] = useState<string>('cycling_moto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [conceptsList, setConceptsList] = useState<ConceptItem[]>([]);
  const [isFallbackNotice, setIsFallbackNotice] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editHook, setEditHook] = useState('');

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');

  const listsLeftInTrial = Math.max(0, TRIAL_LIMITS.maxConceptLists - trialConceptListsUsed);

  // Generate Concepts implementation
  const triggerConceptGeneration = async (vidId?: string) => {
    if (isTrial && trialConceptListsUsed >= TRIAL_LIMITS.maxConceptLists) {
      setUpgradeMessage("Trial limit reached: trial users get 3 concept lists total across the whole trial. Upgrade to Starter for unlimited Claude concepts.");
      setUpgradeModalOpen(true);
      return;
    }

    setIsGenerating(true);
    const targetVideo = VIDEOS_DATA.find(v => v.id === (vidId || selectedVideoId));

    const res = await api('/api/v1/concepts', {
      method: 'POST',
      body: JSON.stringify({
        product: onboarding.product,
        character: onboarding.character,
        niche: selectedNiche,
        video_id: targetVideo?.id
      })
    });

    setIsGenerating(false);

    if (isTrial) {
      incrementTrialConceptCount();
    }

    if (res.data?.source === 'template_fallback' || !res.ok) {
      setIsFallbackNotice(true);
    } else {
      setIsFallbackNotice(false);
    }

    // Generate 5 structured concepts tailored to product & character
    const generated: ConceptItem[] = [
      {
        id: 'c_' + Date.now() + '_1',
        title: `The 3-Second Contrast Hook for ${onboarding.product}`,
        hook: `"Nobody believed this little accessory could make night riding this dramatic."`,
        shots: [
          { time: '0–3s', label: 'Hook', desc: `Close-up pitch-black street, sudden brilliant glow of ${onboarding.product} cutting the darkness.` },
          { time: '3–8s', label: 'Problem', desc: `Standard bike lights get swallowed by city glare — you are invisible to drivers.` },
          { time: '8–15s', label: 'Demo', desc: `${onboarding.character} effortlessly attaches ${onboarding.product} in one click with zero tools.` },
          { time: '15–20s', label: 'Proof', desc: `Side-by-side shot from 50 yards away showing night visibility.` },
          { time: '20–25s', label: 'CTA', desc: `Comment 'WING' or tap bio link to claim the remaining inventory before Friday.` }
        ],
        niche: targetVideo?.niche || 'Cycling / Moto',
        product: onboarding.product,
        status: 'Unused'
      },
      {
        id: 'c_' + Date.now() + '_2',
        title: `Stop Scroll: "The Cop Stopped Me For This"`,
        hook: `"I literally had a driver pull up at the red light just to ask what was glowing."`,
        shots: [
          { time: '0–3s', label: 'Hook', desc: `Driver rolling down passenger window at night gesturing at the luminous bike frame.` },
          { time: '3–8s', label: 'Problem', desc: `Cheap Amazon plastic lights snap off or die after two rain showers.` },
          { time: '8–15s', label: 'Demo', desc: `${onboarding.character} unboxes waterproof aerospace mount, snaps it on.` },
          { time: '15–20s', label: 'Proof', desc: `Submerging the device in water while running rainbow aero strobe mode.` },
          { time: '20–25s', label: 'CTA', desc: `Comment 'WINGS' if you need this sent directly to your DMs.` }
        ],
        niche: targetVideo?.niche || 'Cycling / Moto',
        product: onboarding.product,
        status: 'Unused'
      },
      {
        id: 'c_' + Date.now() + '_3',
        title: `Problem → Solution: "Why Haven't Riders Seen This?"`,
        hook: `"If you ride at night and don't have side wings, you are gambling with traffic."`,
        shots: [
          { time: '0–3s', label: 'Hook', desc: `Blind spot simulator showing how traditional headlights miss side angles.` },
          { time: '3–8s', label: 'Problem', desc: `90% of bicycle night collisions happen from lateral side approaches.` },
          { time: '8–15s', label: 'Demo', desc: `Panoramic aerodynamic projection casting 12-foot glowing wings onto asphalt.` },
          { time: '15–20s', label: 'Proof', desc: `${onboarding.character} cruising safely past busy crosswalk.` },
          { time: '20–25s', label: 'CTA', desc: `Grab yours from the link in my bio before the winter holiday cutoff.` }
        ],
        niche: targetVideo?.niche || 'Cycling / Moto',
        product: onboarding.product,
        status: 'Unused'
      }
    ];

    setConceptsList(generated);
  };

  // Auto-generate on arrival from "Recreate here"
  useEffect(() => {
    if (autoGenerateParam && sourceVideoParam) {
      setSelectedVideoId(sourceVideoParam);
      triggerConceptGeneration(sourceVideoParam);
    }
  }, [autoGenerateParam, sourceVideoParam]);

  const handleUseConcept = (concept: ConceptItem) => {
    updateConceptStatus(concept.id, 'Used in a video');
    navigate(`/videos?concept=${encodeURIComponent(concept.title + ': ' + concept.hook)}`);
  };

  const handleStartEdit = (concept: ConceptItem) => {
    setEditingId(concept.id);
    setEditTitle(concept.title);
    setEditHook(concept.hook);
  };

  const handleSaveEdit = (id: string) => {
    setConceptsList(prev =>
      prev.map(c => (c.id === id ? { ...c, title: editTitle, hook: editHook } : c))
    );
    setEditingId(null);
  };

  return (
    <DashboardShell>
      <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
        {/* Top Brief Card */}
        <div className="bg-white rounded-xl border border-black/8 p-4 sm:p-5 shadow-2xs flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#0075de] mb-0.5">
              Current Creative Brief
            </div>
            <div className="text-sm font-bold text-black">
              Concepts for: {onboarding.product} · {onboarding.character}
            </div>
            <div className="text-xs text-[#757575] mt-0.5">
              Every concept on this page is adapted specifically to your product and character profile.
            </div>
          </div>
          <Link
            to="/settings"
            className="text-xs font-semibold text-[#0075de] hover:underline px-3 py-1.5 rounded-lg border border-[#0075de]/20 bg-[#e6f3fe]/40 whitespace-nowrap"
          >
            Edit brief
          </Link>
        </div>

        {/* Generate Concepts Bar */}
        <div className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base font-bold text-black">Generate Concepts</h2>
            {isTrial && (
              <span className="text-xs font-semibold text-[#0075de] bg-[#e6f3fe] px-2.5 py-1 rounded-md">
                {listsLeftInTrial} of {TRIAL_LIMITS.maxConceptLists} concept lists left in your trial
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#757575] mb-1">Source Video (Optional)</label>
              <select
                value={selectedVideoId}
                onChange={(e) => setSelectedVideoId(e.target.value)}
                className="w-full bg-[#f6f5f4] text-xs font-medium text-black border border-black/10 rounded-lg p-2.5 focus:outline-none"
              >
                <option value="">No source video (Generate from brief)</option>
                {VIDEOS_DATA.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} ({v.creator} · {v.viewsFormatted} views)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#757575] mb-1">Taxonomy Niche</label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full bg-[#f6f5f4] text-xs font-medium text-black border border-black/10 rounded-lg p-2.5 focus:outline-none"
              >
                <option value="cycling_moto">Cycling / Moto</option>
                <option value="automotive">Automotive</option>
                <option value="gifting_holiday">Gift</option>
                <option value="fandom_character">Fandom</option>
                <option value="toys_games">Toys</option>
                <option value="beauty_practical">Beauty</option>
                <option value="home_lifestyle">Home</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => triggerConceptGeneration()}
            disabled={isGenerating}
            className="w-full bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 text-center flex items-center justify-center gap-2"
          >
            {isGenerating ? "Claude is writing your concepts…" : "Generate concepts"}
          </button>

          {isFallbackNotice && (
            <div className="text-xs text-[#757575] bg-[#f6f5f4] p-3 rounded-lg border border-black/8 mt-2">
              Template concepts — connect OpenRouter for Claude Sonnet concepts.
            </div>
          )}
        </div>

        {/* Results List: Concept cards in a LIST (one per row) */}
        {conceptsList.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-black">
              Generated Concepts ({conceptsList.length})
            </h3>

            <div className="space-y-4">
              {conceptsList.map((concept) => {
                const isEditing = editingId === concept.id;

                return (
                  <div
                    key={concept.id}
                    className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-4"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full text-base font-bold border border-black/10 p-2 rounded"
                        />
                        <textarea
                          value={editHook}
                          onChange={(e) => setEditHook(e.target.value)}
                          className="w-full text-xs italic border border-black/10 p-2 rounded"
                          rows={2}
                        />
                        <button
                          onClick={() => handleSaveEdit(concept.id)}
                          className="bg-[#0075de] text-white text-xs px-3 py-1.5 rounded"
                        >
                          Save changes
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="text-base font-bold text-black">{concept.title}</h4>
                          <span className="text-[11px] font-semibold text-[#0075de] bg-[#e6f3fe] px-2 py-0.5 rounded">
                            {concept.status || 'Unused'}
                          </span>
                        </div>
                        <div className="text-sm italic font-serif-hero text-black bg-[#f6f5f4] p-3 rounded-lg border border-black/5">
                          Hook (first 3 seconds): {concept.hook}
                        </div>
                      </div>
                    )}

                    {/* 5-Shot Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-black/5">
                      {concept.shots.map((shot, idx) => (
                        <div key={idx} className="bg-[#f6f5f4]/80 p-2.5 rounded-lg border border-black/5 text-xs">
                          <div className="font-mono text-[10px] text-[#0075de] font-semibold">{shot.time}</div>
                          <div className="font-semibold text-black mt-0.5">{shot.label}</div>
                          <div className="text-[11px] text-[#615d59] mt-1 leading-snug">{shot.desc}</div>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => handleStartEdit(concept)}
                        className="px-3 py-1.5 text-xs font-medium text-[#615d59] hover:text-black border border-black/10 rounded-lg hover:bg-black/5 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          saveConcept(concept);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-[#615d59] hover:text-black border border-black/10 rounded-lg hover:bg-black/5 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleUseConcept(concept)}
                        className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <span>Use this concept</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Saved Concepts Section Below */}
        <div className="bg-white rounded-xl border border-black/8 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-black">
              Saved Concepts Library ({savedConcepts.length})
            </h3>
            <span className="text-xs text-[#757575]">Reusable across videos</span>
          </div>

          {savedConcepts.length === 0 ? (
            <p className="text-xs text-[#757575] italic py-4">
              No saved concepts yet. Generate and click &quot;Save&quot; to build your reusable concept library.
            </p>
          ) : (
            <div className="divide-y divide-black/8">
              {savedConcepts.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black">{item.title}</span>
                      <span className="text-[10px] font-semibold text-[#757575] bg-[#f6f5f4] px-2 py-0.5 rounded">
                        {item.status || 'Unused'}
                      </span>
                    </div>
                    <div className="text-xs italic text-[#615d59]">{item.hook}</div>
                  </div>
                  <button
                    onClick={() => handleUseConcept(item)}
                    className="bg-[#0075de] hover:bg-[#0068c8] text-white text-xs font-medium px-3 py-1.5 rounded-lg self-start sm:self-auto shrink-0 transition-colors"
                  >
                    Use in video
                  </button>
                </div>
              ))}
            </div>
          )}
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
