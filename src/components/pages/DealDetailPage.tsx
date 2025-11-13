import React from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  MapPin,
  CurrencyGbp,
  TrendUp,
  Wrench,
  HouseLine,
  User,
  Phone,
  DownloadSimple,
  FilePdf,
  Calendar,
} from '@phosphor-icons/react';
import type { OffMarketDeal } from '@/lib/types';
import {
  formatCurrency,
  formatDate,
  getScoreColor,
  getScoreLabel,
  computeInvestmentScore,
} from '@/lib/dealUtils';
import { toast } from 'sonner';

interface DealDetailPageProps {
  dealId: string;
  onNavigateBack: () => void;
}

export function DealDetailPage({ dealId, onNavigateBack }: DealDetailPageProps) {
  const [deals] = useKV<OffMarketDeal[]>('offmarket-deals', []);
  const deal = deals?.find((d) => d.id === dealId);

  if (!deal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Deal not found</h2>
          <p className="text-muted-foreground mb-4">The deal you're looking for doesn't exist</p>
          <Button onClick={onNavigateBack}>Back to Deals</Button>
        </div>
      </div>
    );
  }

  const scoreColorClass = getScoreColor(deal.investment_score);
  const scoreLabel = getScoreLabel(deal.investment_score);

  const handleExportCRM = () => {
    const crmData = {
      id: deal.id,
      title: deal.title,
      address: deal.address,
      postcode: deal.postcode,
      price: deal.price,
      estimated_value: deal.estimated_value,
      discount_percent: deal.discount_percent,
      investment_score: deal.investment_score,
      agent_name: deal.agent_name,
      agent_phone: deal.agent_phone,
      notes: deal.notes,
      source: deal.source,
      status: deal.status,
      created_at: deal.created_at,
    };

    const blob = new Blob([JSON.stringify(crmData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deal-${deal.id}-crm-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Deal exported for CRM import');
  };

  const handleExportPDF = () => {
    toast.info('PDF generation feature coming soon');
  };

  const potentialProfit = deal.estimated_value - deal.price - (deal.refurb_cost || 0);
  const roiPercent = deal.price > 0 ? (potentialProfit / deal.price) * 100 : 0;
  const grossYield = deal.rent_potential && deal.price > 0
    ? ((deal.rent_potential * 12) / deal.price) * 100
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={onNavigateBack} className="gap-2 mb-4">
            <ArrowLeft size={18} />
            Back to Deals
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                {deal.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin size={14} weight="fill" />
                {deal.address}, {deal.postcode}
              </p>
            </div>
            {deal.status && (
              <Badge className="bg-primary text-primary-foreground">{deal.status}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {deal.imageurl ? (
              <Card className="overflow-hidden">
                <img
                  src={deal.imageurl}
                  alt={deal.title}
                  className="w-full h-96 object-cover"
                />
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="w-full h-96 bg-muted flex items-center justify-center">
                  <HouseLine size={96} className="text-muted-foreground" />
                </div>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendUp size={20} />
                  Investment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Asking Price</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {formatCurrency(deal.price)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Estimated Value</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {formatCurrency(deal.estimated_value)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Discount</p>
                    <Badge
                      variant="outline"
                      className="bg-accent/10 text-accent border-accent/30 text-xl px-3 py-1"
                    >
                      {deal.discount_percent.toFixed(1)}% off
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Potential Profit</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {formatCurrency(potentialProfit)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deal.refurb_cost && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Wrench size={14} />
                        Refurbishment Cost
                      </p>
                      <p className="text-lg font-medium text-foreground">
                        {formatCurrency(deal.refurb_cost)}
                      </p>
                    </div>
                  )}
                  {deal.rent_potential && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <HouseLine size={14} />
                        Monthly Rent Potential
                      </p>
                      <p className="text-lg font-medium text-foreground">
                        {formatCurrency(deal.rent_potential)}/mo
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Potential ROI</p>
                    <p className="text-lg font-medium text-foreground">
                      {roiPercent.toFixed(1)}%
                    </p>
                  </div>
                  {grossYield !== null && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Gross Yield</p>
                      <p className="text-lg font-medium text-foreground">
                        {grossYield.toFixed(2)}%
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {deal.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{deal.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-6xl font-bold">
                    <span className={scoreColorClass.split(' ')[0]}>
                      {deal.investment_score}
                    </span>
                  </div>
                  <Badge className={`${scoreColorClass} border text-base px-4 py-1`}>
                    {scoreLabel}
                  </Badge>
                </div>

                <Progress value={deal.investment_score} className="h-3" />

                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Score Breakdown:</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price Discount</span>
                      <span className="font-medium text-foreground">
                        +{Math.min(40, (deal.discount_percent / 100) * 40).toFixed(0)} pts
                      </span>
                    </div>
                    {deal.rent_potential && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rental Potential</span>
                        <span className="font-medium text-foreground">
                          +{Math.min(30, (deal.rent_potential / 1500) * 30).toFixed(0)} pts
                        </span>
                      </div>
                    )}
                    {deal.refurb_cost && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Refurb Required</span>
                        <span className="font-medium text-destructive">
                          -{Math.min(20, (deal.refurb_cost / 20000) * 20).toFixed(0)} pts
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {(deal.agent_name || deal.agent_phone) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User size={20} />
                    Agent Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {deal.agent_name && (
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-muted-foreground" />
                      <span className="text-foreground">{deal.agent_name}</span>
                    </div>
                  )}
                  {deal.agent_phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      <a
                        href={`tel:${deal.agent_phone}`}
                        className="text-primary hover:underline"
                      >
                        {deal.agent_phone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Deal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Added:</span>
                  <span className="text-foreground">{formatDate(deal.created_at)}</span>
                </div>
                {deal.source && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Source:</span>
                    <span className="text-foreground">{deal.source}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleExportCRM} variant="outline" className="w-full gap-2">
                <DownloadSimple size={18} weight="fill" />
                Export to CRM
              </Button>
              <Button onClick={handleExportPDF} variant="outline" className="w-full gap-2">
                <FilePdf size={18} weight="fill" />
                Download Deal Pack
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
