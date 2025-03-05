import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Download,
  LineChart as LineChartIcon,
} from "lucide-react";
import { fetchStockData } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";

interface PriceChartProps {
  ticker?: string;
  data?: {
    time: string;
    price: number;
    volume: number;
    isPreMarket: boolean;
  }[];
  timeRange?: string;
  minGap?: number;
  maxGap?: number;
  gapType?: "all" | "positive" | "negative";
}

const PriceChart = ({
  ticker = "AAPL",
  data: initialData,
  timeRange = "1d",
  minGap = 0.5,
  maxGap = 5,
  gapType = "all",
}: PriceChartProps) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [viewType, setViewType] = useState<"price" | "percent">("percent");
  const [data, setData] = useState(initialData || generateMockData());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log(
          `PriceChart: Loading data for ${ticker} with minGap=${minGap}, maxGap=${maxGap}, gapType=${gapType}`,
        );
        const stockData = await fetchStockData(ticker);
        console.log(`PriceChart: Loaded ${stockData.length} data points`);

        // Filter the data based on the gap criteria
        const filteredData = stockData.filter((day) => {
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
          `PriceChart: Filtered to ${filteredData.length} data points that match gap criteria`,
        );

        // Transform the data for the chart
        // For now, we'll use our mock data generator, but in a real app
        // we would transform the filtered data into the format needed for the chart
        const chartData = generateMockData();

        // Calculate average values for the gap indicator
        const gapValue =
          filteredData.length > 0
            ? filteredData.reduce((sum, day) => {
                return (
                  sum +
                  ((day.open - day.preMarketClose!) / day.preMarketClose!) * 100
                );
              }, 0) / filteredData.length
            : 0;

        setData(chartData);
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [ticker, minGap, maxGap, gapType]);

  return (
    <Card className="w-full h-[250px] bg-background">
      <CardHeader className="flex flex-row items-center justify-between py-1 px-2">
        <div>
          <CardTitle className="text-xs font-bold">
            {ticker} - Evolución Promedio del Precio
          </CardTitle>
          <p className="text-[10px] text-muted-foreground">
            Evolución cada 15 minutos (4:00 AM - 4:00 PM ET)
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <Select
            value={viewType}
            onValueChange={(value) => setViewType(value as "price" | "percent")}
          >
            <SelectTrigger className="h-6 text-[10px] w-[60px]">
              <SelectValue placeholder="Vista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Precio</SelectItem>
              <SelectItem value="percent">Porcentaje</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="h-6 text-[10px] w-[50px]">
              <SelectValue placeholder="Rango" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Día</SelectItem>
              <SelectItem value="5d">5 Días</SelectItem>
              <SelectItem value="1m">1 Mes</SelectItem>
              <SelectItem value="3m">3 Meses</SelectItem>
              <SelectItem value="6m">6 Meses</SelectItem>
              <SelectItem value="1y">1 Año</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" className="h-6 w-6">
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="icon" className="h-6 w-6">
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="icon" className="h-6 w-6">
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[210px] w-full">
          {/* Chart visualization area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ChartVisualization data={data} viewType={viewType} />
          </div>

          {/* Time navigation controls */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 py-1">
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              <ArrowLeft className="h-3 w-3 mr-1" />
              Anterior
            </Button>
            <Button variant="ghost" size="sm" className="h-6 text-xs">
              Siguiente
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          {/* Gap indicator */}
          <div className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-card p-0.5 rounded-md shadow-md text-[8px]">
            <div className="font-medium">
              Gap: <span className="text-green-500">+2.3%</span>
            </div>
            <div className="text-muted-foreground">
              Máx PM: <span className="font-medium">+1.4%</span>
            </div>
            <div className="text-muted-foreground">
              Apertura: <span className="font-medium">+0.8%</span>
            </div>
            <div className="text-muted-foreground">
              Rango: <span className="font-medium">2.9%</span>
            </div>
            <div className="text-muted-foreground">
              Intervalo: <span className="font-medium">15min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label, viewType }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formattedTime = new Date(data.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
        <p className="font-medium">{formattedTime}</p>
        <p className="text-[#2563eb]">
          {viewType === "price"
            ? `$${data.price.toFixed(2)}`
            : `${data.percentChange.toFixed(2)}%`}
        </p>
        <p className="text-gray-500">Vol: {data.volume.toLocaleString()}</p>
        {data.isPreMarket && (
          <p className="text-[#9333ea] text-[10px]">Pre-market</p>
        )}
      </div>
    );
  }
  return null;
};

// Chart visualization component using Recharts
const ChartVisualization = ({
  data,
  viewType,
}: {
  data: PriceChartProps["data"];
  viewType: "price" | "percent";
}) => {
  // Find the market open index (transition from pre-market to regular session)
  const marketOpenIndex = useMemo(() => {
    return data.findIndex(
      (item, index) =>
        index > 0 &&
        item.isPreMarket === false &&
        data[index - 1].isPreMarket === true,
    );
  }, [data]);

  // Format time for X-axis
  const formatXAxis = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format Y-axis based on view type
  const formatYAxis = (value) => {
    if (viewType === "price") {
      return `$${value.toFixed(2)}`;
    } else {
      return `${value.toFixed(1)}%`;
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 rounded-md overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="time"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 8 }}
            interval={Math.floor(data.length / 10)}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 8 }}
            domain={viewType === "price" ? ["auto", "auto"] : [-2, 5]}
          />
          <Tooltip content={<CustomTooltip viewType={viewType} />} />
          <Legend iconSize={8} iconType="line" wrapperStyle={{ fontSize: 8 }} />

          {/* Pre-market area */}
          <Area
            type="monotone"
            dataKey={viewType === "price" ? "price" : "percentChange"}
            name="Pre-market"
            stroke="#9333ea"
            fill="rgba(147, 51, 234, 0.05)"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls
            isAnimationActive={false}
            data={data.map((item, index) =>
              index <= marketOpenIndex
                ? item
                : { ...item, price: null, percentChange: null },
            )}
          />

          {/* Regular session line */}
          <Line
            type="monotone"
            dataKey={viewType === "price" ? "price" : "percentChange"}
            name="Sesión Regular"
            stroke="#2563eb"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls
            isAnimationActive={false}
            data={data.map((item, index) =>
              index >= marketOpenIndex
                ? item
                : { ...item, price: null, percentChange: null },
            )}
          />

          {/* Gap reference line */}
          {marketOpenIndex > 0 && (
            <ReferenceLine
              x={data[marketOpenIndex].time}
              stroke="#dc2626"
              strokeDasharray="3 3"
              label={{
                value: "Gap",
                position: "insideTopRight",
                fontSize: 8,
                fill: "#dc2626",
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Generate mock data for the chart with 15-minute intervals
function generateMockData() {
  const data = [];
  const basePrice = 180;
  const now = new Date();

  // Set reference price (previous day close)
  const referencePrice = basePrice;

  // Generate pre-market data (4:00 AM to 9:30 AM) in 15-minute intervals
  for (let hour = 4; hour <= 9; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      // Skip times after 9:30
      if (hour === 9 && minute > 30) continue;

      const time = new Date(now);
      time.setHours(hour);
      time.setMinutes(minute);

      // Calculate price as percentage change from reference
      const percentChange = Math.random() * 3 - 1 + (hour - 4) * 0.2; // Gradually increasing trend
      const price = referencePrice * (1 + percentChange / 100);

      data.push({
        time: time.toISOString(),
        price: price,
        percentChange: percentChange,
        volume: Math.floor(Math.random() * 10000) * (hour - 3), // Volume increases as we get closer to open
        isPreMarket: true,
      });
    }
  }

  // Generate regular session data (9:30 AM to 4:00 PM) in 15-minute intervals
  for (let hour = 9; hour <= 16; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      // Skip times before 9:30
      if (hour === 9 && minute < 30) continue;
      // Skip times after 4:00
      if (hour === 16 && minute > 0) continue;

      const time = new Date(now);
      time.setHours(hour);
      time.setMinutes(minute);

      // Calculate price as percentage change from reference
      // Create a more realistic pattern with morning volatility and afternoon trend
      let percentChange;
      if (hour < 11) {
        // Morning volatility (9:30-11:00)
        percentChange = Math.random() * 5 - 1.5 + (hour - 9) * 0.5;
      } else if (hour < 13) {
        // Midday consolidation (11:00-13:00)
        percentChange = Math.random() * 2 - 0.5 + 2;
      } else {
        // Afternoon trend (13:00-16:00)
        percentChange = Math.random() * 3 - 1 + 1.5 + (hour - 13) * 0.3;
      }

      const price = referencePrice * (1 + percentChange / 100);

      data.push({
        time: time.toISOString(),
        price: price,
        percentChange: percentChange,
        volume:
          Math.floor(Math.random() * 50000) *
          (1 + Math.sin(((hour - 9.5) * Math.PI) / 7)), // Volume curve with peaks at open and close
        isPreMarket: false,
      });
    }
  }

  // Sort by time
  data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return data;
}

export default PriceChart;
