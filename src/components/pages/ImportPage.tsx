import React, { useState, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UploadSimple, CheckCircle, Warning } from '@phosphor-icons/react';
import { parseCSV } from '@/lib/dealUtils';
import type { OffMarketDeal } from '@/lib/types';
import { toast } from 'sonner';

interface ImportPageProps {
  onNavigateBack: () => void;
}

export function ImportPage({ onNavigateBack }: ImportPageProps) {
  const [deals, setDeals] = useKV<OffMarketDeal[]>('offmarket-deals', []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    setImportResults(null);

    try {
      const text = await file.text();
      const parsedDeals = parseCSV(text);

      if (parsedDeals.length === 0) {
        toast.error('No valid deals found in CSV');
        setImportResults({ success: 0, failed: 0, total: 0 });
        setIsProcessing(false);
        return;
      }

      const validDeals = parsedDeals.filter(
        (deal) => deal.title && deal.address && deal.postcode && deal.price && deal.estimated_value
      );

      const currentDeals = deals || [];
      const updatedDeals = [...currentDeals, ...validDeals] as OffMarketDeal[];

      setDeals(updatedDeals);

      setImportResults({
        success: validDeals.length,
        failed: parsedDeals.length - validDeals.length,
        total: parsedDeals.length,
      });

      toast.success(`Successfully imported ${validDeals.length} deals`);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to parse CSV file');
      setImportResults({ success: 0, failed: 0, total: 0 });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={onNavigateBack} className="gap-2 mb-4">
            <ArrowLeft size={18} />
            Back to Deals
          </Button>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Import Off-Market Deals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a CSV file to bulk import property leads
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CSV File Format</CardTitle>
              <CardDescription>
                Your CSV file should include the following columns (header row required):
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="text-muted-foreground">
                  title,address,postcode,price,estimated_value,refurb_cost,rent_potential,agent_name,agent_phone,notes,source,status
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Required fields:</strong> title, address,
                  postcode, price, estimated_value
                </p>
                <p>
                  <strong className="text-foreground">Optional fields:</strong> refurb_cost,
                  rent_potential, agent_name, agent_phone, notes, source, status
                </p>
                <p>
                  <strong className="text-foreground">Note:</strong> Investment scores and discount
                  percentages are calculated automatically
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Select a CSV file to import deals</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                <UploadSimple size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {isProcessing ? 'Processing...' : 'Upload CSV File'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the button below to select a file from your computer
                </p>
                <Button onClick={handleUploadClick} disabled={isProcessing} className="gap-2">
                  <UploadSimple size={18} weight="fill" />
                  {isProcessing ? 'Processing...' : 'Choose File'}
                </Button>
              </div>

              {importResults && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={20} weight="fill" />
                    <span className="font-medium">
                      {importResults.success} deals imported successfully
                    </span>
                  </div>
                  {importResults.failed > 0 && (
                    <div className="flex items-center gap-2 text-destructive">
                      <Warning size={20} weight="fill" />
                      <span className="font-medium">
                        {importResults.failed} deals failed to import (missing required fields)
                      </span>
                    </div>
                  )}
                  <Button onClick={onNavigateBack} className="w-full mt-4">
                    View Imported Deals
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example CSV</CardTitle>
              <CardDescription>Copy this template to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-muted-foreground whitespace-pre">
{`title,address,postcode,price,estimated_value,refurb_cost,rent_potential,agent_name,agent_phone,source,status
3 Bed Victorian Terrace,15 Maple Street,SW1A 1AA,250000,320000,25000,1200,John Smith,07700900123,Agent Lead,Motivated Seller
Modern 2 Bed Flat,Flat 5 Oak House,M1 1AA,180000,220000,15000,950,Sarah Jones,07700900456,Rightmove,Needs Refurb
Period Conversion,22 Elm Road,B1 1AA,310000,380000,35000,1500,Mike Brown,07700900789,Direct,Quick Sale`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
