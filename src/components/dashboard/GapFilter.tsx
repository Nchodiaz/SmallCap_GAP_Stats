import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GapFilterProps {
  minGap?: number;
  maxGap?: number;
  gapType?: "all" | "positive" | "negative";
  onChange?: (
    min: number,
    max: number,
    type: "all" | "positive" | "negative",
  ) => void;
}

const GapFilter = ({
  minGap = 0.5,
  maxGap = 5,
  gapType = "all",
  onChange = () => {},
}: GapFilterProps) => {
  const [gapInput, setGapInput] = useState<string>("0");

  // Initialize the input field with the current minGap value
  useEffect(() => {
    if (gapType === "positive") {
      setGapInput(minGap.toString());
    } else if (gapType === "negative") {
      setGapInput((-minGap).toString());
    } else {
      setGapInput("0");
    }
  }, [minGap, gapType]);

  const handleGapInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGapInput(e.target.value);
  };

  const handleApplyFilter = () => {
    const gapValue = parseFloat(gapInput);
    if (isNaN(gapValue)) return;

    // Pass the gap value directly to the parent component
    // The type will be determined by the sign of the value
    onChange(gapValue, 100, "all");
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader className="py-1 px-2">
        <CardTitle className="text-xs flex items-center gap-1">
          <Filter className="h-3 w-3 text-blue-500" />
          Filtro de Gap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <div className="space-y-1">
          <div className="space-y-0.5">
            <div className="flex justify-between items-center">
              <Label htmlFor="gap-input" className="text-xs">
                Gap (%){" "}
                {gapInput && parseFloat(gapInput) > 0
                  ? "≥"
                  : gapInput && parseFloat(gapInput) < 0
                    ? "≤"
                    : ""}
              </Label>
              <Input
                id="gap-input"
                type="number"
                value={gapInput}
                onChange={handleGapInputChange}
                className="h-5 w-16 text-xs px-1 py-0"
                step="any"
              />
            </div>
            <div className="flex justify-end mt-1">
              <Button
                onClick={handleApplyFilter}
                className="h-6 text-xs px-2 py-0"
                variant="outline"
              >
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GapFilter;
