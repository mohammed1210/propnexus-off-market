import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { OffMarketDeal } from '@/lib/types';
import { formatCurrency, formatDate, getScoreColor } from '@/lib/dealUtils';

interface OffMarketTableProps {
  deals: OffMarketDeal[];
  onViewDetails: (id: string) => void;
}

export function OffMarketTable({ deals, onViewDetails }: OffMarketTableProps) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No deals match your criteria
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Est. Value</TableHead>
            <TableHead className="text-right">Discount</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deals.map((deal) => {
            const scoreColorClass = getScoreColor(deal.investment_score);
            return (
              <TableRow key={deal.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{deal.title}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="text-foreground">{deal.address}</div>
                    <div className="text-muted-foreground">{deal.postcode}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(deal.price)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(deal.estimated_value)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                    {deal.discount_percent.toFixed(0)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={`${scoreColorClass} border`}>
                    {deal.investment_score}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {deal.agent_name || '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => onViewDetails(deal.id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
