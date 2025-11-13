export interface OffMarketDeal {
  id: string;
  title: string;
  address: string;
  postcode: string;
  price: number;
  estimated_value: number;
  discount_percent: number;
  refurb_cost?: number;
  rent_potential?: number;
  investment_score: number;
  agent_name?: string;
  agent_phone?: string;
  notes?: string;
  created_at: string;
  imageurl?: string;
  source?: string;
  status?: string;
}

export interface DealFilters {
  postcode?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  minScore?: number;
}

export type ViewMode = 'cards' | 'table';
