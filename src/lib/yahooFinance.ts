// Yahoo Finance API integration

import { StockData } from "./api";

// Base URL for Yahoo Finance API
const BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart/";

// Interface for Yahoo Finance API response
interface YahooFinanceResponse {
  chart: {
    result: Array<{
      meta: {
        symbol: string;
        regularMarketPrice: number;
        chartPreviousClose: number;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: number[];
          high: number[];
          low: number[];
          close: number[];
          volume: number[];
        }>;
      };
    }>;
    error: any;
  };
}

/**
 * Fetch historical stock data from Yahoo Finance
 * @param ticker Stock ticker symbol
 * @param period Period to fetch data for (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @param interval Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)
 */
export async function fetchYahooFinanceData(
  ticker: string,
  period: string = "1y",
  interval: string = "1d",
): Promise<StockData[]> {
  try {
    console.log(
      `Fetching Yahoo Finance data for ${ticker} with period=${period} and interval=${interval}`,
    );

    // Construct the URL with parameters
    const url = `${BASE_URL}${ticker}?period1=${getStartTimestamp(period)}&period2=${Math.floor(Date.now() / 1000)}&interval=${interval}&includePrePost=true`;

    // Fetch data from Yahoo Finance API
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Yahoo Finance API error: ${response.status} ${response.statusText}`,
      );
    }

    const data: YahooFinanceResponse = await response.json();

    // Check if there's an error in the response
    if (data.chart.error) {
      throw new Error(
        `Yahoo Finance API error: ${JSON.stringify(data.chart.error)}`,
      );
    }

    // Check if there are results
    if (!data.chart.result || data.chart.result.length === 0) {
      throw new Error("No data returned from Yahoo Finance API");
    }

    // Extract the data
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    // Convert to our StockData format
    const stockData: StockData[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      // Skip entries with missing data
      if (
        !quotes.open[i] ||
        !quotes.high[i] ||
        !quotes.low[i] ||
        !quotes.close[i]
      ) {
        continue;
      }

      // Create a date string from the timestamp
      const date = new Date(timestamps[i] * 1000).toISOString().split("T")[0];

      // Create a StockData object
      const dataPoint: StockData = {
        ticker,
        date,
        open: quotes.open[i],
        high: quotes.high[i],
        low: quotes.low[i],
        close: quotes.close[i],
        volume: quotes.volume[i],
        // For daily data, we don't have premarket data from this endpoint
        // We'll need to simulate it or fetch it separately
        preMarketClose: i > 0 ? quotes.close[i - 1] : undefined,
      };

      stockData.push(dataPoint);
    }

    console.log(`Fetched ${stockData.length} data points for ${ticker}`);
    return stockData;
  } catch (error) {
    console.error("Error fetching Yahoo Finance data:", error);
    // Fall back to mock data if the API fails
    throw error;
  }
}

/**
 * Get the start timestamp for a given period
 * @param period Period string (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * @returns Unix timestamp in seconds
 */
function getStartTimestamp(period: string): number {
  const now = new Date();
  const currentTimestamp = Math.floor(now.getTime() / 1000);

  switch (period) {
    case "1d":
      return currentTimestamp - 86400; // 1 day in seconds
    case "5d":
      return currentTimestamp - 86400 * 5;
    case "1mo":
      return currentTimestamp - 86400 * 30;
    case "3mo":
      return currentTimestamp - 86400 * 90;
    case "6mo":
      return currentTimestamp - 86400 * 180;
    case "1y":
      return currentTimestamp - 86400 * 365;
    case "2y":
      return currentTimestamp - 86400 * 365 * 2;
    case "5y":
      return currentTimestamp - 86400 * 365 * 5;
    case "10y":
      return currentTimestamp - 86400 * 365 * 10;
    case "ytd":
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return Math.floor(startOfYear.getTime() / 1000);
    case "max":
      return 0; // Yahoo Finance will return the maximum available data
    default:
      return currentTimestamp - 86400 * 365; // Default to 1 year
  }
}

/**
 * Calculate the gap percentage between the previous close and current open
 * @param data Stock data array
 * @returns Array of gap percentages
 */
export function calculateGapPercentages(data: StockData[]): number[] {
  const gapPercentages: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const currentDay = data[i];

    // Skip if we don't have premarket close (previous day's close)
    if (!currentDay.preMarketClose) continue;

    // Calculate the gap percentage
    const gapPercent =
      ((currentDay.open - currentDay.preMarketClose) /
        currentDay.preMarketClose) *
      100;
    gapPercentages.push(gapPercent);
  }

  return gapPercentages;
}

/**
 * Filter stock data based on gap percentage criteria
 * @param data Stock data array
 * @param minGap Minimum gap percentage (positive value for up gaps, negative for down gaps)
 * @returns Filtered stock data array
 */
export function filterByGapPercentage(
  data: StockData[],
  minGap: number,
): StockData[] {
  return data.filter((day) => {
    if (!day.preMarketClose) return false;

    const gapPercent =
      ((day.open - day.preMarketClose) / day.preMarketClose) * 100;

    if (minGap > 0) {
      // For positive gaps, filter where gap percentage is >= minGap
      return gapPercent >= minGap;
    } else if (minGap < 0) {
      // For negative gaps, filter where gap percentage is <= minGap
      return gapPercent <= minGap;
    } else {
      // If minGap is 0, include all gaps
      return true;
    }
  });
}
