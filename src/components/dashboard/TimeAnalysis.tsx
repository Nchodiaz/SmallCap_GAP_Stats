import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface TimeAnalysisProps {
  ticker?: string;
  preMarketHighTime?: string;
  preMarketLowTime?: string;
  regularSessionHighTime?: string;
  regularSessionLowTime?: string;
  typicalGapTime?: string;
  minGap?: number;
  maxGap?: number;
  gapType?: "all" | "positive" | "negative";
  volatilityPatterns?: Array<{
    time: string;
    description: string;
    direction: "up" | "down";
  }>;
}

const TimeAnalysis = ({
  ticker = "AAPL",
  preMarketHighTime = "08:45 AM",
  preMarketLowTime = "07:30 AM",
  regularSessionHighTime = "10:15 AM",
  regularSessionLowTime = "02:30 PM",
  typicalGapTime = "09:15 AM",
  minGap = 0.5,
  maxGap = 5,
  gapType = "all",
  volatilityPatterns = [
    {
      time: "09:30 AM",
      description: "Pico de volatilidad en apertura",
      direction: "up",
    },
    {
      time: "10:00 AM",
      description: "Establecimiento de tendencia en primera hora",
      direction: "up",
    },
    {
      time: "12:00 PM",
      description: "Consolidación en hora de almuerzo",
      direction: "down",
    },
    {
      time: "03:45 PM",
      description: "Momentum de fin de día",
      direction: "up",
    },
  ],
}: TimeAnalysisProps) => {
  // Log the props to help with debugging
  React.useEffect(() => {
    console.log(
      `TimeAnalysis: Rendering for ${ticker} with minGap=${minGap}, maxGap=${maxGap}, gapType=${gapType}`,
    );
  }, [ticker, minGap, maxGap, gapType]);
  return (
    <Card className="w-full bg-white">
      <CardHeader className="py-1 px-2">
        <CardTitle className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3 text-blue-500" />
          Análisis Temporal para {ticker}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="space-y-1">
            <h3 className="text-[10px] font-medium">Horarios de Premarket</h3>
            <div className="space-y-0.5">
              <div className="flex justify-between items-center p-0.5 bg-slate-50 rounded-md text-[10px]">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  Máximo Típico
                </span>
                <span className="font-medium">{preMarketHighTime}</span>
              </div>
              <div className="flex justify-between items-center p-0.5 bg-slate-50 rounded-md text-[10px]">
                <span className="flex items-center gap-1">
                  <ArrowDown className="h-3 w-3 text-red-500" />
                  Mínimo Típico
                </span>
                <span className="font-medium">{preMarketLowTime}</span>
              </div>
              <div className="flex justify-between items-center p-0.5 bg-slate-50 rounded-md text-[10px]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-blue-500" />
                  Hora Típica del Gap
                </span>
                <span className="font-medium">{typicalGapTime}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-[10px] font-medium">
              Horarios de Sesión Regular
            </h3>
            <div className="space-y-0.5">
              <div className="flex justify-between items-center p-0.5 bg-slate-50 rounded-md text-[10px]">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  Máximo Típico (HOD)
                </span>
                <span className="font-medium">{regularSessionHighTime}</span>
              </div>
              <div className="flex justify-between items-center p-0.5 bg-slate-50 rounded-md text-[10px]">
                <span className="flex items-center gap-1">
                  <ArrowDown className="h-3 w-3 text-red-500" />
                  Mínimo Típico (LOD)
                </span>
                <span className="font-medium">{regularSessionLowTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1">
          <h3 className="text-[10px] font-medium mb-0.5">
            Patrones de Volatilidad
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
            {volatilityPatterns.map((pattern, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-0.5 bg-slate-50 rounded-md text-[10px]"
              >
                <span className="flex items-center gap-1">
                  {pattern.direction === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className="font-medium">{pattern.time}</span>
                </span>
                <span className="text-[10px] truncate ml-2">
                  {pattern.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeAnalysis;
