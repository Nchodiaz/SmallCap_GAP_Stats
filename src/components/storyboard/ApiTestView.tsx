import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchStockData,
  fetchGapStatistics,
  StockData,
  GapStatistics,
} from "@/lib/api";

const ApiTestView = () => {
  const [ticker, setTicker] = useState("AAPL");
  const [minGap, setMinGap] = useState(0.5);
  const [maxGap, setMaxGap] = useState(5);
  const [gapType, setGapType] = useState<"all" | "positive" | "negative">(
    "all",
  );

  const [stockData, setStockData] = useState<StockData[] | null>(null);
  const [gapStats, setGapStats] = useState<GapStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchStockData(ticker);
      setStockData(data);

      const stats = await fetchGapStatistics(ticker, minGap, maxGap, gapType);
      setGapStats(stats);
    } catch (err) {
      setError("Error fetching data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 bg-background">
      <Card>
        <CardHeader>
          <CardTitle>API Test Tool</CardTitle>
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
              type="number"
              value={minGap}
              onChange={(e) => setMinGap(parseFloat(e.target.value))}
              placeholder="Min Gap %"
              className="w-24"
            />
            <Input
              type="number"
              value={maxGap}
              onChange={(e) => setMaxGap(parseFloat(e.target.value))}
              placeholder="Max Gap %"
              className="w-24"
            />
            <select
              value={gapType}
              onChange={(e) =>
                setGapType(e.target.value as "all" | "positive" | "negative")
              }
              className="border rounded p-2"
            >
              <option value="all">All Gaps</option>
              <option value="positive">Positive Only</option>
              <option value="negative">Negative Only</option>
            </select>
            <Button onClick={fetchData} disabled={isLoading}>
              {isLoading ? "Loading..." : "Fetch Data"}
            </Button>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          {gapStats && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Gap Statistics</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <h4 className="font-semibold">Volume Metrics</h4>
                  <p>
                    Average Volume: {gapStats.averageVolume.toLocaleString()}
                  </p>
                  <p>
                    Avg $ Volume: $
                    {(gapStats.avgDollarVolume / 1000000).toFixed(2)}M
                  </p>
                  <p>
                    Avg Premarket Volume:{" "}
                    {gapStats.avgPremarketVolume.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Gap Metrics</h4>
                  <p>Average Gap: {gapStats.averageGap.toFixed(2)}%</p>
                  <p>Highest Gap: {gapStats.highestGap.toFixed(2)}%</p>
                  <p>Lowest Gap: {gapStats.lowestGap.toFixed(2)}%</p>
                  <p>
                    Gaps Found: {gapStats.gapsFound} (
                    {gapStats.gapsFoundPercent.toFixed(1)}%)
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div>
                  <h4 className="font-semibold">Time Metrics</h4>
                  <p>Avg HOD Time: {gapStats.avgHodTime}</p>
                  <p>Avg LOD Time: {gapStats.avgLodTime}</p>
                  <p>PM High Time: {gapStats.preMarketHighTime}</p>
                  <p>PM Low Time: {gapStats.preMarketLowTime}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <p>Avg High Spike: {gapStats.avgHighSpike.toFixed(2)}%</p>
                  <p>Avg Low Spike: {gapStats.avgLowSpike.toFixed(2)}%</p>
                  <p>Avg Range: {gapStats.avgRange.toFixed(2)}%</p>
                  <p>Avg Return: {gapStats.avgReturn.toFixed(2)}%</p>
                  <p>
                    Avg PM High Fade: {gapStats.avgPremarketHighFade.toFixed(2)}
                    %
                  </p>
                </div>
              </div>
            </div>
          )}

          {stockData && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">
                Stock Data Sample (First 5 days)
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
                        High
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Low
                      </th>
                      <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Close
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
                    {stockData.slice(0, 5).map((day, index) => {
                      const gapPercent = day.preMarketClose
                        ? (
                            ((day.open - day.preMarketClose) /
                              day.preMarketClose) *
                            100
                          ).toFixed(2)
                        : "N/A";

                      return (
                        <tr key={index}>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            {day.date}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            ${day.open.toFixed(2)}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            ${day.high.toFixed(2)}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            ${day.low.toFixed(2)}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            ${day.close.toFixed(2)}
                          </td>
                          <td className="px-2 py-1 whitespace-nowrap text-xs">
                            {day.preMarketClose
                              ? `$${day.preMarketClose.toFixed(2)}`
                              : "N/A"}
                          </td>
                          <td
                            className={`px-2 py-1 whitespace-nowrap text-xs ${
                              gapPercent !== "N/A" && parseFloat(gapPercent) > 0
                                ? "text-green-500"
                                : gapPercent !== "N/A" &&
                                    parseFloat(gapPercent) < 0
                                  ? "text-red-500"
                                  : ""
                            }`}
                          >
                            {gapPercent !== "N/A"
                              ? `${gapPercent}%`
                              : gapPercent}
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

export default ApiTestView;
