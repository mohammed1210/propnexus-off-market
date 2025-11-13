import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { OffMarketPage } from '@/components/pages/OffMarketPage';
import { ImportPage } from '@/components/pages/ImportPage';
import { DealDetailPage } from '@/components/pages/DealDetailPage';

type Page = 'list' | 'import' | 'detail';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('list');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const navigateToList = () => {
    setCurrentPage('list');
    setSelectedDealId(null);
  };

  const navigateToImport = () => {
    setCurrentPage('import');
  };

  const navigateToDetail = (dealId: string) => {
    setSelectedDealId(dealId);
    setCurrentPage('detail');
  };

  return (
    <>
      {currentPage === 'list' && (
        <OffMarketPage
          onNavigateToImport={navigateToImport}
          onNavigateToDetail={navigateToDetail}
        />
      )}
      {currentPage === 'import' && <ImportPage onNavigateBack={navigateToList} />}
      {currentPage === 'detail' && selectedDealId && (
        <DealDetailPage dealId={selectedDealId} onNavigateBack={navigateToList} />
      )}
      <Toaster position="top-right" />
    </>
  );
}

export default App