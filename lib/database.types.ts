// =====================================================
// CUSTOM BUSINESS HATS - DATABASE TYPES
// =====================================================

export type RewardTier = 'Bronze' | 'Silver' | 'Gold' | 'VIP' | 'Elite' | 'Diamond' | 'Platinum';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type EmbroideryType = 'standard' | 'puff';

// =====================================================
// CUSTOMERS
// =====================================================
export interface Customer {
  id: string;
  email: string;
  phone: string | null;
  name: string | null;
  total_lifetime_spend: number;
  total_hats_ordered: number;
  reward_tier: RewardTier;
  has_setup_fee_paid: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerInsert {
  email: string;
  phone?: string | null;
  name?: string | null;
  total_lifetime_spend?: number;
  total_hats_ordered?: number;
  reward_tier?: RewardTier;
  has_setup_fee_paid?: boolean;
}

export interface CustomerUpdate {
  email?: string;
  phone?: string | null;
  name?: string | null;
  total_lifetime_spend?: number;
  total_hats_ordered?: number;
  reward_tier?: RewardTier;
  has_setup_fee_paid?: boolean;
  updated_at?: string;
}

// =====================================================
// ORDERS
// =====================================================
export interface OrderItem {
  id: string;
  name: string;
  model: string;
  color: string;
  quantity: number;
  unitPrice: number;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  email: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  items: OrderItem[];
  embroidery_type: EmbroideryType | null;
  front_location: string | null;
  extra_locations: string[] | null;
  artwork_filename: string | null;
  artwork_url: string | null;
  hat_subtotal: number;
  volume_discount: number;
  artwork_fee: number;
  puff_embroidery_fee: number;
  extra_locations_fee: number;
  total_amount: number;
  total_hats: number;
  shipping_name: string | null;
  shipping_address: ShippingAddress | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface OrderInsert {
  order_number: string;
  customer_id?: string | null;
  email: string;
  stripe_session_id?: string | null;
  stripe_payment_intent?: string | null;
  items: OrderItem[];
  embroidery_type?: EmbroideryType | null;
  front_location?: string | null;
  extra_locations?: string[] | null;
  artwork_filename?: string | null;
  artwork_url?: string | null;
  hat_subtotal: number;
  volume_discount?: number;
  artwork_fee?: number;
  puff_embroidery_fee?: number;
  extra_locations_fee?: number;
  total_amount: number;
  total_hats: number;
  shipping_name?: string | null;
  shipping_address?: ShippingAddress | null;
  status?: OrderStatus;
}

// =====================================================
// LOGOS
// =====================================================
export interface Logo {
  id: string;
  customer_id: string | null;
  email: string;
  filename: string;
  storage_path: string;
  public_url: string | null;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface LogoInsert {
  customer_id?: string | null;
  email: string;
  filename: string;
  storage_path: string;
  public_url?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
}

// =====================================================
// HAT SALES ANALYTICS
// =====================================================
export interface HatSale {
  id: string;
  order_id: string | null;
  hat_model: string;
  hat_color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sale_date: string;
  created_at: string;
}

export interface HatSaleInsert {
  order_id?: string | null;
  hat_model: string;
  hat_color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sale_date?: string;
}

// =====================================================
// REVENUE ANALYTICS
// =====================================================
export interface Revenue {
  id: string;
  order_id: string | null;
  amount: number;
  revenue_date: string;
  revenue_type: 'sale' | 'refund';
  created_at: string;
}

export interface RevenueInsert {
  order_id?: string | null;
  amount: number;
  revenue_date?: string;
  revenue_type?: 'sale' | 'refund';
}

// =====================================================
// SITE STATS
// =====================================================
export interface SiteStats {
  id: number;
  total_hats_produced: number;
  total_orders: number;
  total_customers: number;
  updated_at: string;
}

// =====================================================
// REWARD TIER THRESHOLDS & BENEFITS
// =====================================================
export interface TierBenefits {
  artworkCredit: boolean;        // $50 Artwork Credit
  partnerCredit: boolean;        // $50 ShirtLaunch.com Order Credit
  freeShipping12: boolean;       // Free Shipping @ 12 Hats
  rewardsCashPercent: number;    // Rewards Cash percentage (0, 3, 4, 5, or 6)
  accountManager: boolean;       // Direct Account Manager
  freeArtworkSampling: boolean;  // Free Artwork Sampling
}

export interface RewardTierInfo {
  tier: RewardTier;
  minSpend: number;
  maxSpend: number | null;       // null for Platinum (no max)
  benefits: TierBenefits;
}

export const REWARD_TIERS: RewardTierInfo[] = [
  { 
    tier: 'Bronze', 
    minSpend: 0, 
    maxSpend: 250,
    benefits: { artworkCredit: true, partnerCredit: false, freeShipping12: false, rewardsCashPercent: 0, accountManager: false, freeArtworkSampling: false }
  },
  { 
    tier: 'Silver', 
    minSpend: 250, 
    maxSpend: 500,
    benefits: { artworkCredit: true, partnerCredit: true, freeShipping12: false, rewardsCashPercent: 0, accountManager: false, freeArtworkSampling: false }
  },
  { 
    tier: 'Gold', 
    minSpend: 500, 
    maxSpend: 1000,
    benefits: { artworkCredit: true, partnerCredit: true, freeShipping12: true, rewardsCashPercent: 0, accountManager: false, freeArtworkSampling: false }
  },
  { 
    tier: 'VIP', 
    minSpend: 1000, 
    maxSpend: 2500,
    benefits: { artworkCredit: true, partnerCredit: true, freeShipping12: true, rewardsCashPercent: 3, accountManager: false, freeArtworkSampling: false }
  },
  { 
    tier: 'Elite', 
    minSpend: 2500, 
    maxSpend: 5000,
    benefits: { artworkCredit: true, partnerCredit: true, freeShipping12: true, rewardsCashPercent: 4, accountManager: false, freeArtworkSampling: false }
  },
  { 
    tier: 'Diamond', 
    minSpend: 5000, 
    maxSpend: 10000,
    benefits: { artworkCredit: true, partnerCredit: true, freeShipping12: true, rewardsCashPercent: 5, accountManager: true, freeArtworkSampling: false }
  },
  { 
    tier: 'Platinum', 
    minSpend: 10000, 
    maxSpend: null,
    benefits: { artworkCredit: true, partnerCredit: true, freeShipping12: true, rewardsCashPercent: 6, accountManager: true, freeArtworkSampling: true }
  },
];

export function calculateRewardTier(lifetimeSpend: number): RewardTier {
  for (let i = REWARD_TIERS.length - 1; i >= 0; i--) {
    if (lifetimeSpend >= REWARD_TIERS[i].minSpend) {
      return REWARD_TIERS[i].tier;
    }
  }
  return 'Bronze';
}

export function getTierInfo(tier: RewardTier): RewardTierInfo | undefined {
  return REWARD_TIERS.find(t => t.tier === tier);
}

export function getTierBenefits(tier: RewardTier): TierBenefits {
  const found = REWARD_TIERS.find(t => t.tier === tier);
  return found?.benefits || REWARD_TIERS[0].benefits;
}

export function getRewardsCashPercent(tier: RewardTier): number {
  const found = REWARD_TIERS.find(t => t.tier === tier);
  return found?.benefits.rewardsCashPercent || 0;
}

export function getNextTier(tier: RewardTier): { tier: RewardTier; amountNeeded: number } | null {
  const currentIndex = REWARD_TIERS.findIndex(t => t.tier === tier);
  if (currentIndex < REWARD_TIERS.length - 1) {
    const next = REWARD_TIERS[currentIndex + 1];
    return { tier: next.tier, amountNeeded: next.minSpend };
  }
  return null;
}

export function formatSpendRange(tierInfo: RewardTierInfo): string {
  if (tierInfo.maxSpend === null) {
    return `$${(tierInfo.minSpend / 1000).toFixed(0)}k+`;
  }
  if (tierInfo.minSpend === 0) {
    return `$0-${tierInfo.maxSpend}`;
  }
  if (tierInfo.minSpend >= 1000) {
    const min = tierInfo.minSpend >= 1000 ? `$${(tierInfo.minSpend / 1000).toFixed(tierInfo.minSpend % 1000 === 0 ? 0 : 1)}k` : `$${tierInfo.minSpend}`;
    const max = tierInfo.maxSpend >= 1000 ? `$${(tierInfo.maxSpend / 1000).toFixed(tierInfo.maxSpend % 1000 === 0 ? 0 : 1)}k` : `$${tierInfo.maxSpend}`;
    return `${min}-${max.replace('$', '')}`;
  }
  return `$${tierInfo.minSpend}-${tierInfo.maxSpend}`;
}

