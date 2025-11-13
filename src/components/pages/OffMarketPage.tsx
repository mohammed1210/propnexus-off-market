import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadSimple, SquaresFour, ListBullets } from '@phosphor-icons/react';
import { OffMarketCard } from '@/components/offmarket/OffMarketCard';
import { OffMarketTable } from '@/components/offmarket/OffMarketTable';
import { OffMarketFilters } from '@/components/offmarket/OffMarketFilters';
import type { OffMarketDeal, DealFilters, ViewMode } from '@/lib/types';

interface OffMarketPageProps {
  onNavigateToImport: () => void;
  onNavigateToDetail: (id: string) => void;
}

export function OffMarketPage({ onNavigateToImport, onNavigateToDetail }: OffMarketPageProps) {
  const [deals] = useKV<OffMarketDeal[]>('offmarket-deals', []);
  const [filters, setFilters] = useState<DealFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filteredDeals, setFilteredDeals] = useState<OffMarketDeal[]>([]);

  useEffect(() => {
    if (!deals) {
      setFilteredDeals([]);
      return;
    }

    let filtered = [...deals];

    if (filters.postcode) {
      const searchPostcode = filters.postcode.toUpperCase().replace(/\s/g, '');
      filtered = filtered.filter((deal) =>
        deal.postcode.replace(/\s/g, '').includes(searchPostcode)
      );
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((deal) => deal.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((deal) => deal.price <= filters.maxPrice!);
    }

    if (filters.minDiscount !== undefined) {
      filtered = filtered.filter((deal) => deal.discount_percent >= filters.minDiscount!);
    }

    if (filters.minScore !== undefined) {
      filtered = filtered.filter((deal) => deal.investment_score >= filters.minScore!);
    }

    setFilteredDeals(filtered);
  }, [deals, filters]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                Off-Market Deals
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredDeals.length} {filteredDeals.length === 1 ? 'property' : 'properties'} available
              </p>
            </div>
            <Button onClick={onNavigateToImport} className="gap-2">
              <UploadSimple size={18} weight="fill" />
              Import Deals
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <OffMarketFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredDeals.length} of {deals?.length || 0} deals
              </p>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                <TabsList>
                  <TabsTrigger value="cards" className="gap-2">
                    <SquaresFour size={16} />
                    Cards
                  </TabsTrigger>
                  <TabsTrigger value="table" className="gap-2">
                    <ListBullets size={16} />
                    Table
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {filteredDeals.length === 0 ? (
              <div className="text-center py-24 bg-card rounded-lg border border-border">
                <div className="space-y-4">
                  <div className="text-6xl">📭</div>
                  <h3 className="text-xl font-semibold text-foreground">No deals found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {!deals || deals.length === 0
                      ? "You haven't imported any off-market deals yet. Click Import Deals to get started."
                      : 'No deals match your current filters. Try adjusting your criteria.'}
                  </p>
                  {(!deals || deals.length === 0) && (
                    <Button onClick={onNavigateToImport} className="gap-2 mt-4">
                      <UploadSimple size={18} weight="fill" />
                      Import Your First Deals
                    </Button>
                  )}
                </div>
              </div>
            ) : viewMode === 'cards' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDeals.map((deal) => (
                  <OffMarketCard
                    key={deal.id}
                    deal={deal}
                    onViewDetails={onNavigateToDetail}
                  />
                ))}
              </div>
            ) : (
              <OffMarketTable deals={filteredDeals} onViewDetails={onNavigateToDetail} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
