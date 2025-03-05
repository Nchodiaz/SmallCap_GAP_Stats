import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchStockData, StockData } from "@/lib/api";

const GapFilterTestView = () => {
  const [ticker, setTicker] = useState("TRNR");
  const [gapValue, setGapValue] = useState("20");
  const [stockData, setStockData] = useState<StockData[] | null>(null);
  const [filteredData, setFilteredData] = useState<StockData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStockData(ticker);
      setStockData(data);

      // Apply filter
      const gapThreshold = parseFloat(gapValue);
      if (!isNaN(gapThreshold)) {
        applyFilter(data, gapThreshold);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilter = (data: StockData[], threshold: number) => {
    const filtered = data.filter((day) => {
      if (!day.preMarketClose || !day.open) return false;

      const gapPercent =
        ((day.open - day.preMarketClose) / day.preMarketClose) * 100;

      if (threshold > 0) {
        return gapPercent >= threshold;
      } else if (threshold < 0) {
        return gapPercent <= threshold;
      } else {
        return true;
      }
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = () => {
    if (stockData) {
      const threshold = parseFloat(gapValue);
      if (!isNaN(threshold)) {
        applyFilter(stockData, threshold);
      }
    }
  };

  return (
    <div className="p-4 space-y-4 bg-background">
      <Card>
        <CardHeader>
          <CardTitle>Gap Filter Test Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Ticker"
              className="w-24"
            />
            <Input
              value={gapValue}
              onChange={(e) => setGapValue(e.target.value)}
              placeholder="Gap %"
              className="w-24"
            />
            <Button onClick={fetchData} disabled={isLoading}>
              {isLoading ? "Loading..." : "Fetch Data"}
            </Button>
            <Button onClick={handleFilterChange} disabled={!stockData}>
              Apply Filter
            </Button>
          </div>

          {stockData && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">
                All Stock Data ({stockData.length} days)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Open
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PM Close
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gap %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stockData.slice(0, 20).map((day, index) => {
                      const gapPercent = day.preMarketClose
                        ? ((day.open - day.preMarketClose) /
                            day.preMarketClose) *
                          100
                        : null;

                      return (
                        <tr key={index}>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            {day.date}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            ${day.open.toFixed(2)}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            {day.preMarketClose
                              ? `$${day.preMarketClose.toFixed(2)}`
                              : "N/A"}
                          </td>
                          <td
                            className={`px-2 py-1 whitespace-nowrap text-xs ${
                              gapPercent !== null && gapPercent > 0
                                ? "text-green-500"
                                : gapPercent !== null && gapPercent < 0
                                  ? "text-red-500"
                                  : ""
                            }`}
                          >
                            {gapPercent !== null
                              ? `${gapPercent.toFixed(2)}%`
                              : "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredData && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">
                Filtered Data ({filteredData.length} days)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Open
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PM Close
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gap %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((day, index) => {
                      const gapPercent = day.preMarketClose
                        ? ((day.open - day.preMarketClose) /
                            day.preMarketClose) *
                          100
                        : null;

                      return (
                        <tr key={index}>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            {day.date}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            ${day.open.toFixed(2)}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            {day.preMarketClose
                              ? `$${day.preMarketClose.toFixed(2)}`
                              : "N/A"}
                          </td>
                          <td
                            className={`px-2 py-1 whitespace-nowrap text-xs ${
                              gapPercent !== null && gapPercent > 0
                                ? "text-green-500"
                                : gapPercent !== null && gapPercent < 0
                                  ? "text-red-500"
                                  : ""
                            }`}
                          >
                            {gapPercent !== null
                              ? `${gapPercent.toFixed(2)}%`
                              : "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GapFilterTestView;
