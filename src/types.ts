export type PlanType = 'starter' | 'growth' | 'scale' | 'trial' | null;

export interface UserPlan {
  plan: PlanType;
  started_at: string;
  trial_ends_at: string | null;
  stripe: boolean;
}

export interface UserProfile {
  email: string;
  name?: string;
  createdAt: string;
}

export interface ProductProfile {
  product: string;
  character: string;
  hasProduct?: boolean;
}

export interface VideoMetadata {
  id: string;
  filename: string;
  title: string;
  caption: string;
  creator: string;
  views: number;
  viewsFormatted: string;
  likes: number;
  likesFormatted: string;
  comments: number;
  commentsFormatted: string;
  durationSec: number;
  niche: string;
  ctaKeyword?: string;
  formatName: string;
  isFounderVideo?: boolean;
  velocityPerHour?: number;
  engagementRate?: string;
  postedAgo?: string;
  statusTag?: 'Took off' | 'Flopped';
  windowTrending?: '2h' | '6h' | '12h' | '24h';
}

export interface ConceptItem {
  id: string;
  title: string;
  hook: string;
  shots: {
    time: string;
    label: string;
    desc: string;
  }[];
  niche?: string;
  product?: string;
  status?: 'Unused' | 'Used in a video' | 'Generated';
  savedAt?: string;
  sourceVideoId?: string;
}

export interface GeneratedVideo {
  id: string;
  prompt: string;
  mode: 'wan' | 'clone' | 'hero';
  resolution: '480p' | '720p' | '1080p';
  seconds: number;
  aspectRatio: '9:16' | '16:9' | '1:1';
  status: 'generating' | 'done' | 'failed';
  progress?: number;
  videoUrl?: string;
  posterUrl?: string;
  coinsSpent: number;
  createdAt: string;
  watermarked?: boolean;
}

export interface CoinTransaction {
  id: string;
  date: string;
  description: string;
  coins: number;
  balanceAfter: number;
}
