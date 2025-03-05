import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Clock,
  DollarSign,
  Percent,
  TrendingDown,
  TrendingUp,
  Volume2,
  Banknote,
  BarChart,
  Building,
  Maximize,
  Minimize,
  Repeat,
} from "lucide-react";
import { fetchGapStatistics, GapStatistics } from "@/lib/api";

interface StatItemProps {
  title: string;
  value: string | number;
  change?: string | number;
  isPositive?: boolean;
  icon?: React.ReactNode;
}

interface StatisticalOverviewProps {
  ticker?: string;
  isLoading?: boolean;
  minGap?: number;
  maxGap?: number;
  gapType?: "all" | "positive" | "negative";
}

const StatisticalOverview = ({
  ticker = "AAPL",
  isLoading: externalLoading = false,
  minGap = 0.5,
  maxGap = 5,
  gapType = "all",
}: StatisticalOverviewProps) => {
  const [stats, setStats] = useState<GapStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(externalLoading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatistics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(
          `StatisticalOverview: Loading stats for ${ticker} with minGap=${minGap}, maxGap=${maxGap}, gapType=${gapType}`,
        );
        const statistics = await fetchGapStatistics(
          ticker,
          minGap,
          maxGap,
          gapType,
        );
        console.log(
          `StatisticalOverview: Loaded stats with ${statistics.gapsFound} gaps found`,
        );
        setStats(statistics);
      } catch (err) {
        setError("Error al cargar estadísticas");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, [ticker, minGap, maxGap, gapType]);

  if (isLoading || !stats) {
    return (
      <Card className="w-full bg-gray-50 dark:bg-gray-900">
        <CardHeader className="py-1 px-2">
          <CardTitle className="text-xs">
            Cargando estadísticas para {ticker}...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1">
          <div className="grid grid-cols-2 gap-1 animate-pulse">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="h-5 bg-gray-200 dark:bg-gray-700 rounded-sm"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-gray-50 dark:bg-gray-900">
        <CardHeader className="py-1 px-2">
          <CardTitle className="text-xs text-destructive">
            Error: {error}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1">
          <p className="text-xs">
            No se pudieron cargar las estadísticas. Intente nuevamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toString();
  };

  const {
    averageGap,
    averageVolume,
    avgDollarVolume,
    avgPremarketVolume,
    avgMarketCap,
    avgHodTime,
    avgLodTime,
    preMarketHighTime,
    preMarketLowTime,
    avgPremarketHighFade,
    avgCloseRed,
    avgHighSpike,
    avgLowSpike,
    avgRange,
    avgReturn,
    avgChange,
    avgHighGap,
    avgHighFade,
    avgHighToPmhChange,
    avgPremarketHighGap,
    gapsFound,
    gapsFoundPercent,
  } = stats;

  return (
    <Card className="w-full bg-gray-50 dark:bg-gray-900">
      <CardHeader className="py-1 px-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xs">
            Resumen Estadístico para {ticker} (Gap {minGap}% - {maxGap}%)
          </CardTitle>
          <div className="text-xs flex items-center gap-2">
            <span className="text-blue-600 font-medium">{gapsFound} gaps</span>
            <span className="text-gray-500">
              ({gapsFoundPercent}% del total)
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-1">
        <div className="grid grid-cols-2 gap-1">
          <div className="space-y-0.5">
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Volume2 className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg Volume</span>
              </span>
              <span className="font-medium">{formatVolume(averageVolume)}</span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Banknote className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg $ Volume</span>
              </span>
              <span className="font-medium">
                ${(avgDollarVolume / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Volume2 className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg Premarket Volume</span>
              </span>
              <span className="font-medium">
                {formatVolume(avgPremarketVolume)}
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Building className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg Market Cap</span>
              </span>
              <span className="font-medium">
                ${(avgMarketCap / 1000000000).toFixed(2)}B
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg HOD Time</span>
              </span>
              <span className="font-medium">{avgHodTime}</span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg LOD Time</span>
              </span>
              <span className="font-medium">{avgLodTime}</span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg Premarket High Time</span>
              </span>
              <span className="font-medium">{preMarketHighTime}</span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg Premarket Low Time</span>
              </span>
              <span className="font-medium">{preMarketLowTime}</span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <TrendingDown className="h-2.5 w-2.5 text-red-500" />
                <span>Avg Premarket High Fade</span>
              </span>
              <span className="font-medium">
                {avgPremarketHighFade.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <ArrowDown className="h-2.5 w-2.5 text-red-500" />
                <span>Avg Close red</span>
              </span>
              <span className="font-medium">{avgCloseRed}%</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Percent className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg Gap Value</span>
              </span>
              <span className="font-medium text-green-500">
                {averageGap.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Maximize className="h-2.5 w-2.5 text-green-500" />
                <span>Avg High Spike</span>
              </span>
              <span className="font-medium text-green-500">
                +{avgHighSpike.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Minimize className="h-2.5 w-2.5 text-red-500" />
                <span>Avg Low Spike</span>
              </span>
              <span className="font-medium text-red-500">
                {avgLowSpike.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <BarChart className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg Range</span>
              </span>
              <span className="font-medium text-green-500">
                {avgRange.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Repeat className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg Return</span>
              </span>
              <span
                className={`font-medium ${avgReturn > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {avgReturn.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg Change</span>
              </span>
              <span
                className={`font-medium ${avgChange > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {avgChange.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <ArrowUp className="h-2.5 w-2.5 text-green-500" />
                <span>Avg High Gap</span>
              </span>
              <span className="font-medium text-green-500">
                {avgHighGap.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <TrendingDown className="h-2.5 w-2.5 text-red-500" />
                <span>Avg High Fade</span>
              </span>
              <span className="font-medium text-red-500">
                {avgHighFade.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Percent className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg High to PMH Change</span>
              </span>
              <span
                className={`font-medium ${avgHighToPmhChange > 0 ? "text-green-500" : "text-red-500"}`}
              >
                {avgHighToPmhChange.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-0.5 bg-white rounded-sm text-[10px]">
              <span className="flex items-center gap-1">
                <Percent className="h-2.5 w-2.5 text-blue-500" />
                <span>Avg Premarket High Gap</span>
              </span>
              <span className="font-medium text-green-500">
                {avgPremarketHighGap.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticalOverview;
