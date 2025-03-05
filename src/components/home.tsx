import React, { useState } from "react";
import SearchBar from "./dashboard/SearchBar";
import StatisticalOverview from "./dashboard/StatisticalOverview";
import PriceChart from "./dashboard/PriceChart";
import TimeAnalysis from "./dashboard/TimeAnalysis";
import ActionPanel from "./dashboard/ActionPanel";
import GapFilter from "./dashboard/GapFilter";
import DebugPanel from "./dashboard/DebugPanel";
import { fetchStockData, fetchGapStatistics } from "@/lib/api";

const Home = () => {
  const [ticker, setTicker] = useState<string>("AAPL");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("1d");
  const [minGap, setMinGap] = useState<number>(0.5);
  const [maxGap, setMaxGap] = useState<number>(5);
  const [gapType, setGapType] = useState<"all" | "positive" | "negative">(
    "all",
  );

  const handleSearch = (searchTicker: string) => {
    setIsLoading(true);
    setError(null);

    console.log(
      `Searching for ticker: ${searchTicker} with minGap=${minGap}, maxGap=${maxGap}, gapType=${gapType}`,
    );

    // Set the ticker immediately to trigger data fetching in child components
    setTicker(searchTicker);

    // Simulate API call for any other data that might be needed
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would handle errors from the API here
    }, 800);
  };

  const handleRefresh = () => {
    setIsLoading(true);

    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const handleExport = () => {
    // In a real app, this would generate and download a CSV file
    alert(`Exportando datos para ${ticker} con rango de tiempo ${timeRange}`);
  };

  const handleSettingsChange = () => {
    // In a real app, this would open a settings dialog
    alert("El diálogo de configuración se abriría aquí");
  };

  const handleGapFilterChange = (
    gapValue: number,
    max: number,
    type: "all" | "positive" | "negative",
  ) => {
    console.log(`Applying filter: gapValue=${gapValue}`);

    // Set the filter values based on the gap value
    if (gapValue > 0) {
      setMinGap(gapValue);
      setMaxGap(100);
      setGapType("positive");
    } else if (gapValue < 0) {
      setMinGap(gapValue); // Store the negative value directly
      setMaxGap(100);
      setGapType("negative");
    } else {
      setMinGap(0);
      setMaxGap(100);
      setGapType("all");
    }

    // In a real app, this would trigger a new data fetch with the updated filters
    handleRefresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto py-2 px-3 sm:px-4 lg:px-6">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Análisis de Gaps y Estadísticas Diarias
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-1 px-1 sm:px-2 lg:px-4 space-y-1">
        <div className="w-full">
          <SearchBar
            onSearch={handleSearch}
            isLoading={isLoading}
            error={error}
            onGapFilterChange={handleGapFilterChange}
          />
        </div>

        <StatisticalOverview
          ticker={ticker}
          isLoading={isLoading}
          minGap={minGap}
          maxGap={maxGap}
          gapType={gapType}
        />

        <PriceChart
          ticker={ticker}
          timeRange={timeRange}
          minGap={minGap}
          maxGap={maxGap}
          gapType={gapType}
        />

        <TimeAnalysis
          ticker={ticker}
          minGap={minGap}
          maxGap={maxGap}
          gapType={gapType}
        />

        <DebugPanel
          ticker={ticker}
          minGap={minGap}
          maxGap={maxGap}
          gapType={gapType}
          onTestData={async () => {
            console.log("Manual test of data fetching");
            try {
              const data = await fetchStockData(ticker);
              console.log(`Fetched ${data.length} data points for ${ticker}`);

              const stats = await fetchGapStatistics(
                ticker,
                minGap,
                maxGap,
                gapType,
              );
              console.log(`Gap statistics:`, stats);

              // Filter the data based on the gap criteria
              const filteredData = data.filter((day) => {
                if (!day.preMarketClose || !day.open) return false;

                const gapPercent =
                  ((day.open - day.preMarketClose) / day.preMarketClose) * 100;

                if (minGap > 0) {
                  return gapPercent >= minGap;
                } else if (minGap < 0) {
                  return gapPercent <= minGap;
                } else {
                  return true;
                }
              });

              console.log(
                `Filtered to ${filteredData.length} data points that match gap criteria`,
              );
              console.log(`Filtered data:`, filteredData);
            } catch (error) {
              console.error("Error in test data fetching:", error);
            }
          }}
        />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10">
        <ActionPanel
          onRefresh={handleRefresh}
          onTimeRangeChange={handleTimeRangeChange}
          onExport={handleExport}
          onSettingsChange={handleSettingsChange}
          isLoading={isLoading}
        />
      </footer>
      <div className="h-[30px]"></div>
    </div>
  );
};

export default Home;
