import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendUp } from '@phosphor-icons/react';
import type { OffMarketDeal } from '@/lib/types';
import { formatCurrency, formatDate, getScoreColor, getScoreLabel } from '@/lib/dealUtils';

interface OffMarketCardProps {
  deal: OffMarketDeal;
  onViewDetails: (id: string) => void;
}

export function OffMarketCard({ deal, onViewDetails }: OffMarketCardProps) {
  const scoreColorClass = getScoreColor(deal.investment_score);
  const scoreLabel = getScoreLabel(deal.investment_score);

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        {deal.imageurl ? (
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <img
              src={deal.imageurl}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {deal.status && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                {deal.status}
              </Badge>
            )}
          </div>
        ) : (
          <div className="relative w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
            <MapPin size={48} className="text-muted-foreground" />
            {deal.status && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                {deal.status}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
            {deal.title}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin size={14} weight="fill" />
            {deal.address}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{deal.postcode}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {formatCurrency(deal.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              Est. Value: {formatCurrency(deal.estimated_value)}
            </p>
          </div>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 text-base px-3 py-1">
            {deal.discount_percent.toFixed(0)}% off
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <TrendUp size={16} weight="bold" className={scoreColorClass.split(' ')[0]} />
            <span className="text-sm font-medium text-muted-foreground">Investment Score</span>
          </div>
          <Badge className={`${scoreColorClass} border font-semibold`}>
            {deal.investment_score} - {scoreLabel}
          </Badge>
        </div>

        {deal.agent_name && (
          <div className="text-xs text-muted-foreground pt-2">
            Agent: {deal.agent_name}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={() => onViewDetails(deal.id)} 
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
