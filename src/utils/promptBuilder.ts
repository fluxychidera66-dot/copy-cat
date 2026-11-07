import { VideoMetadata, ProductProfile } from '../types';

export function buildHiggsfieldPrompt(video: VideoMetadata, profile: ProductProfile): string {
  const hasUserProduct = profile && profile.product && profile.product.trim().length > 0;
  const hasUserChar = profile && profile.character && profile.character.trim().length > 0;

  const productSection = hasUserProduct
    ? `Product: "${profile.product}"\nCharacter / Subject: ${hasUserChar ? `"${profile.character}"` : 'Realistic young creator with high energy, natural TikTok vlog lighting.'}`
    : `Product: High-converting viral ${video.niche} dropship accessory\nCharacter / Subject: Dynamic relatable creator in casual modern streetwear.`;

  return `HIGGSFIELD AI VIDEO GENERATION PROMPT — ORGANIC TIKTOK CLONE
Adapted from Viral Benchmark: ${video.title} (${video.viewsFormatted} views by ${video.creator})

--- PROMPT FOR HIGGSFIELD ---
Model: Wan 3.0 / Seedance 2.5 (9:16 Vertical, 30fps)
Scene Description:
Cinematic 9:16 vertical commercial video shot on iPhone 16 Pro, ultra-realistic TikTok aesthetic. Close-up dynamic perspective showcasing ${productSection}. 

Opening Hook (0–3s):
Fast-paced dynamic camera push-in. High-contrast lighting. The subject grabs attention immediately with the visual payoff: "${video.caption}".

Visual Motion & Action:
Smooth camera tracking, shallow depth of field, natural hand motion, realistic textures and micro-expressions. Lighting shifts dramatically to emphasize the product in action, matching the viral cadence of ${video.creator}.

Cinematic Keywords:
hyper-realistic, photorealistic 8k, TikTok organic vlog style, golden hour rim lighting, crisp 9:16 composition, cinematic depth of field, natural motion blur.

Negative Prompt:
blurry, low resolution, 3d render look, artificial gloss, distorted hands, robotic movement, frame jitter, oversaturated neon.

TikTok Caption & CTA:
"${video.caption}" · Comment "${video.ctaKeyword?.replace('Comment ', '').replace(/"/g, '') || 'LINK'}" to get yours before the batch sells out!`;
}

// Backward compatibility alias
export const buildClaudePrompt = buildHiggsfieldPrompt;
