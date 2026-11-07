import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPlan, ProductProfile, ConceptItem, GeneratedVideo, CoinTransaction } from '../types';
import { TRIAL_LIMITS } from '../config';

interface AppContextType {
  user: string | null;
  plan: UserPlan | null;
  onboarding: ProductProfile;
  follows: string[];
  videos: GeneratedVideo[];
  savedConcepts: ConceptItem[];
  coins: number;
  trialConceptListsUsed: number;
  trialDaysLeft: number;
  isTrial: boolean;
  hasActivePlanOrTrial: boolean;
  startTrial: () => void;
  signUpWithEmail: (email: string, pass: string, startTrialOnSuccess?: boolean) => Promise<{ ok: boolean; error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  followCreator: (handle: string) => { ok: boolean; error?: string; limitReached?: boolean };
  unfollowCreator: (handle: string) => void;
  saveConcept: (item: ConceptItem) => void;
  deleteSavedConcept: (id: string) => void;
  updateConceptStatus: (id: string, status: 'Unused' | 'Used in a video' | 'Generated') => void;
  incrementTrialConceptCount: () => boolean;
  addGeneratedVideo: (video: GeneratedVideo) => void;
  deleteGeneratedVideo: (id: string) => void;
  deductCoins: (amount: number, description: string) => boolean;
  refundCoins: (amount: number, description: string) => void;
  transactions: CoinTransaction[];
  updateProfile: (profile: Partial<ProductProfile>) => void;
  cancelAccount: () => void;
  setPendingChosenPlan: (plan: string | null) => void;
  pendingChosenPlan: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('cc_user'));
  const [plan, setPlan] = useState<UserPlan | null>(() => {
    const raw = localStorage.getItem('cc_plan');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const [onboarding, setOnboarding] = useState<ProductProfile>(() => {
    const raw = localStorage.getItem('cc_onboarding');
    if (!raw) {
      return {
        product: "LED bike wings",
        character: "a cyclist in a yellow jacket",
        hasProduct: true
      };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {
        product: "LED bike wings",
        character: "a cyclist in a yellow jacket",
        hasProduct: true
      };
    }
  });

  const [follows, setFollows] = useState<string[]>(() => {
    const raw = localStorage.getItem('cc_follows');
    if (!raw) return ["@wingwolt.us"];
    try {
      return JSON.parse(raw);
    } catch {
      return ["@wingwolt.us"];
    }
  });

  const [videos, setVideos] = useState<GeneratedVideo[]>(() => {
    const raw = localStorage.getItem('cc_videos');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  const [savedConcepts, setSavedConcepts] = useState<ConceptItem[]>(() => {
    const raw = localStorage.getItem('cc_concepts');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  const [coins, setCoins] = useState<number>(() => {
    const raw = localStorage.getItem('cc_coins');
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 20; // default for trial
  });

  const [trialConceptListsUsed, setTrialConceptListsUsed] = useState<number>(() => {
    const raw = localStorage.getItem('cc_trial_concept_count');
    return raw ? parseInt(raw, 10) || 0 : 0;
  });

  const [transactions, setTransactions] = useState<CoinTransaction[]>(() => {
    const raw = localStorage.getItem('cc_transactions');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  const [pendingChosenPlan, setPendingChosenPlan] = useState<string | null>(null);

  // Sync states to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('cc_user', user);
    } else {
      localStorage.removeItem('cc_user');
    }
  }, [user]);

  useEffect(() => {
    if (plan) {
      localStorage.setItem('cc_plan', JSON.stringify(plan));
    } else {
      localStorage.removeItem('cc_plan');
    }
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('cc_onboarding', JSON.stringify(onboarding));
  }, [onboarding]);

  useEffect(() => {
    localStorage.setItem('cc_follows', JSON.stringify(follows));
  }, [follows]);

  useEffect(() => {
    localStorage.setItem('cc_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('cc_concepts', JSON.stringify(savedConcepts));
  }, [savedConcepts]);

  useEffect(() => {
    localStorage.setItem('cc_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('cc_trial_concept_count', trialConceptListsUsed.toString());
  }, [trialConceptListsUsed]);

  useEffect(() => {
    localStorage.setItem('cc_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const isTrial = plan?.plan === 'trial';
  const hasActivePlanOrTrial = Boolean(plan && plan.plan);

  const trialDaysLeft = (() => {
    if (!plan || plan.plan !== 'trial' || !plan.trial_ends_at) return 0;
    const end = new Date(plan.trial_ends_at).getTime();
    const now = Date.now();
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  })();

  const startTrial = () => {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const newPlan: UserPlan = {
      plan: 'trial',
      started_at: now.toISOString(),
      trial_ends_at: trialEnd.toISOString(),
      stripe: false
    };
    setPlan(newPlan);
    setCoins(TRIAL_LIMITS.totalSeconds); // 20s
    setTrialConceptListsUsed(0);
  };

  const signUpWithEmail = async (email: string, pass: string, startTrialOnSuccess = false) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { ok: false, error: 'Please enter a valid email address.' };
    }
    if (pass.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters.' };
    }

    const rawUsers = localStorage.getItem('cc_users');
    let usersList: { email: string; passHash: string; createdAt: string }[] = [];
    try {
      usersList = rawUsers ? JSON.parse(rawUsers) : [];
    } catch {
      usersList = [];
    }

    const exists = usersList.some(u => u.email === cleanEmail);
    if (exists) {
      return { ok: false, error: 'An account with that email already exists here. Log in instead.' };
    }

    const passHash = await sha256(pass);
    usersList.push({
      email: cleanEmail,
      passHash,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('cc_users', JSON.stringify(usersList));

    setUser(cleanEmail);

    if (startTrialOnSuccess) {
      startTrial();
    }

    return { ok: true };
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const rawUsers = localStorage.getItem('cc_users');
    let usersList: { email: string; passHash: string; createdAt: string }[] = [];
    try {
      usersList = rawUsers ? JSON.parse(rawUsers) : [];
    } catch {
      usersList = [];
    }

    const passHash = await sha256(pass);
    const matched = usersList.find(u => u.email === cleanEmail && u.passHash === passHash);

    if (!matched) {
      return { ok: false, error: 'Email or password did not match an account in this browser.' };
    }

    setUser(cleanEmail);
    return { ok: true };
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('cc_user');
  };

  const followCreator = (handle: string): { ok: boolean; error?: string; limitReached?: boolean } => {
    if (follows.includes(handle)) {
      return { ok: true };
    }
    if (isTrial && follows.length >= TRIAL_LIMITS.maxFollows) {
      return {
        ok: false,
        limitReached: true,
        error: `Trial limit: trial users can follow 1 creator only. Upgrade to Starter to follow 10 creators.`
      };
    }
    setFollows(prev => [...prev, handle]);
    return { ok: true };
  };

  const unfollowCreator = (handle: string) => {
    setFollows(prev => prev.filter(h => h !== handle));
  };

  const saveConcept = (item: ConceptItem) => {
    setSavedConcepts(prev => {
      const filtered = prev.filter(c => c.id !== item.id);
      return [
        {
          ...item,
          status: item.status || 'Unused',
          savedAt: new Date().toISOString()
        },
        ...filtered
      ];
    });
  };

  const deleteSavedConcept = (id: string) => {
    setSavedConcepts(prev => prev.filter(c => c.id !== id));
  };

  const updateConceptStatus = (id: string, status: 'Unused' | 'Used in a video' | 'Generated') => {
    setSavedConcepts(prev =>
      prev.map(c => (c.id === id ? { ...c, status } : c))
    );
  };

  const incrementTrialConceptCount = (): boolean => {
    if (isTrial) {
      if (trialConceptListsUsed >= TRIAL_LIMITS.maxConceptLists) {
        return false;
      }
      setTrialConceptListsUsed(prev => prev + 1);
      return true;
    }
    return true;
  };

  const addGeneratedVideo = (video: GeneratedVideo) => {
    setVideos(prev => [video, ...prev]);
  };

  const deleteGeneratedVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const deductCoins = (amount: number, description: string): boolean => {
    if (coins < amount) return false;
    const newBal = coins - amount;
    setCoins(newBal);
    setTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        date: new Date().toISOString(),
        description,
        coins: -amount,
        balanceAfter: newBal
      },
      ...prev
    ]);
    return true;
  };

  const refundCoins = (amount: number, description: string) => {
    const newBal = coins + amount;
    setCoins(newBal);
    setTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        date: new Date().toISOString(),
        description: `Refund: ${description} (Failed generation = 0 coins)`,
        coins: amount,
        balanceAfter: newBal
      },
      ...prev
    ]);
  };

  const updateProfile = (profile: Partial<ProductProfile>) => {
    setOnboarding(prev => ({ ...prev, ...profile }));
  };

  const cancelAccount = () => {
    setUser(null);
    setPlan(null);
    localStorage.removeItem('cc_user');
    localStorage.removeItem('cc_plan');
    localStorage.removeItem('cc_videos');
    localStorage.removeItem('cc_concepts');
    localStorage.removeItem('cc_coins');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        plan,
        onboarding,
        follows,
        videos,
        savedConcepts,
        coins,
        trialConceptListsUsed,
        trialDaysLeft,
        isTrial,
        hasActivePlanOrTrial,
        startTrial,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        followCreator,
        unfollowCreator,
        saveConcept,
        deleteSavedConcept,
        updateConceptStatus,
        incrementTrialConceptCount,
        addGeneratedVideo,
        deleteGeneratedVideo,
        deductCoins,
        refundCoins,
        transactions,
        updateProfile,
        cancelAccount,
        setPendingChosenPlan,
        pendingChosenPlan
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
