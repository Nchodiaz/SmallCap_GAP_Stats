import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DebugPanelProps {
  ticker: string;
  minGap: number;
  maxGap: number;
  gapType: "all" | "positive" | "negative";
  onTestData: () => void;
}

const DebugPanel = ({
  ticker,
  minGap,
  maxGap,
  gapType,
  onTestData,
}: DebugPanelProps) => {
  return (
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader className="py-1 px-2">
        <CardTitle className="text-xs">Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-1 text-xs">
          <div>
            <strong>Current Ticker:</strong> {ticker}
          </div>
          <div>
            <strong>Gap Filter:</strong>{" "}
            {minGap > 0 ? `≥ ${minGap}%` : minGap < 0 ? `≤ ${minGap}%` : "All"}
          </div>
          <div>
            <strong>Gap Type:</strong> {gapType}
          </div>
          <div className="pt-1">
            <Button
              onClick={onTestData}
              variant="outline"
              size="sm"
              className="h-6 text-[10px] w-full"
            >
              Test Data Fetching
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
