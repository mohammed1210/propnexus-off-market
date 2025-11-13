import type { OffMarketDeal } from './types';

export function computeInvestmentScore(deal: Partial<OffMarketDeal>): number {
  if (!deal.price || !deal.estimated_value) {
    return 0;
  }

  const priceScore = Math.min(
    40,
    ((deal.estimated_value - deal.price) / deal.estimated_value) * 40
  );

  const refurbPenalty = deal.refurb_cost
    ? Math.min(20, (deal.refurb_cost / 20000) * 20)
    : 0;

  const rentBoost = deal.rent_potential
    ? Math.min(30, (deal.rent_potential / 1500) * 30)
    : 0;

  return Math.round(Math.max(0, Math.min(100, priceScore + rentBoost - refurbPenalty)));
}

export function getScoreColor(score: number): string {
  if (score >= 71) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 41) return 'text-accent bg-accent/10 border-accent/30';
  return 'text-destructive bg-destructive/10 border-destructive/30';
}

export function getScoreLabel(score: number): string {
  if (score >= 71) return 'Excellent';
  if (score >= 41) return 'Good';
  return 'Fair';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function parseCSV(csvText: string): Partial<OffMarketDeal>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const deals: Partial<OffMarketDeal>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const deal: Partial<OffMarketDeal> = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    headers.forEach((header, index) => {
      const value = values[index];
      if (!value) return;

      switch (header) {
        case 'title':
          deal.title = value;
          break;
        case 'address':
          deal.address = value;
          break;
        case 'postcode':
          deal.postcode = value.toUpperCase();
          break;
        case 'price':
          deal.price = parseFloat(value.replace(/[£,]/g, ''));
          break;
        case 'estimated_value':
        case 'value':
          deal.estimated_value = parseFloat(value.replace(/[£,]/g, ''));
          break;
        case 'refurb_cost':
        case 'refurb':
          deal.refurb_cost = parseFloat(value.replace(/[£,]/g, ''));
          break;
        case 'rent_potential':
        case 'rent':
          deal.rent_potential = parseFloat(value.replace(/[£,]/g, ''));
          break;
        case 'agent_name':
        case 'agent':
          deal.agent_name = value;
          break;
        case 'agent_phone':
        case 'phone':
          deal.agent_phone = value;
          break;
        case 'notes':
          deal.notes = value;
          break;
        case 'imageurl':
        case 'image':
          deal.imageurl = value;
          break;
        case 'source':
          deal.source = value;
          break;
        case 'status':
          deal.status = value;
          break;
      }
    });

    if (deal.title && deal.price && deal.estimated_value) {
      deal.discount_percent = ((deal.estimated_value - deal.price) / deal.estimated_value) * 100;
      deal.investment_score = computeInvestmentScore(deal);
      deals.push(deal);
    }
  }

  return deals;
}
