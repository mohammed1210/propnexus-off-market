import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { FunnelSimple, X } from '@phosphor-icons/react';
import type { DealFilters } from '@/lib/types';

interface OffMarketFiltersProps {
  filters: DealFilters;
  onFiltersChange: (filters: DealFilters) => void;
}

export function OffMarketFilters({ filters, onFiltersChange }: OffMarketFiltersProps) {
  const [localFilters, setLocalFilters] = useState<DealFilters>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleClear = () => {
    const emptyFilters: DealFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FunnelSimple size={20} weight="fill" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            placeholder="e.g., SW1A 1AA"
            value={localFilters.postcode || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, postcode: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="minPrice">
              Min Price: £{(localFilters.minPrice || 0).toLocaleString()}
            </Label>
            <Slider
              id="minPrice"
              min={0}
              max={1000000}
              step={10000}
              value={[localFilters.minPrice || 0]}
              onValueChange={([value]) => setLocalFilters({ ...localFilters, minPrice: value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPrice">
              Max Price: £{(localFilters.maxPrice || 1000000).toLocaleString()}
            </Label>
            <Slider
              id="maxPrice"
              min={0}
              max={1000000}
              step={10000}
              value={[localFilters.maxPrice || 1000000]}
              onValueChange={([value]) => setLocalFilters({ ...localFilters, maxPrice: value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minDiscount">
            Min Discount: {localFilters.minDiscount || 0}%
          </Label>
          <Slider
            id="minDiscount"
            min={0}
            max={50}
            step={5}
            value={[localFilters.minDiscount || 0]}
            onValueChange={([value]) => setLocalFilters({ ...localFilters, minDiscount: value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minScore">
            Min Investment Score: {localFilters.minScore || 0}
          </Label>
          <Slider
            id="minScore"
            min={0}
            max={100}
            step={10}
            value={[localFilters.minScore || 0]}
            onValueChange={([value]) => setLocalFilters({ ...localFilters, minScore: value })}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleClear} variant="outline">
            <X size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
