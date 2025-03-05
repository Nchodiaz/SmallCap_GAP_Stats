import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

interface SearchBarProps {
  onSearch?: (ticker: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onGapFilterChange?: (
    min: number,
    max: number,
    type: "all" | "positive" | "negative",
  ) => void;
}

// Inline gap filter component
const GapFilterInline = ({
  onChange,
}: {
  onChange: (gapValue: number) => void;
}) => {
  const [gapInput, setGapInput] = useState<string>("20");

  const handleGapInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGapInput(e.target.value);
  };

  const handleApplyFilter = () => {
    const gapValue = parseFloat(gapInput);
    if (!isNaN(gapValue)) {
      onChange(gapValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Filter className="h-3 w-3 text-blue-500" />
        <Label htmlFor="gap-input" className="text-xs whitespace-nowrap">
          Gap (%){" "}
          {gapInput && parseFloat(gapInput) > 0
            ? "≥"
            : gapInput && parseFloat(gapInput) < 0
              ? "≤"
              : ""}
        </Label>
      </div>
      <div className="relative flex-1">
        <Input
          id="gap-input"
          type="number"
          value={gapInput}
          onChange={handleGapInputChange}
          className="h-8 text-xs"
          step="any"
          placeholder="Filtro de gap (ej. 20 o -20)"
        />
      </div>
      <Button
        onClick={handleApplyFilter}
        className="h-8 text-xs px-3"
        variant="outline"
      >
        Aplicar Filtro
      </Button>
    </div>
  );
};

const SearchBar = (props: SearchBarProps) => {
  const { onSearch = () => {}, isLoading = false, error = null } = props;
  const [ticker, setTicker] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation - ticker should not be empty and should only contain letters and numbers
    if (!ticker || !/^[A-Za-z0-9.\-]+$/.test(ticker)) {
      setIsInvalid(true);
      return;
    }

    setIsInvalid(false);
    onSearch(ticker.toUpperCase());
  };

  return (
    <div className="w-full bg-background p-2 border rounded-md flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search size={14} />
            </div>
            <Input
              type="text"
              placeholder="Símbolo (ej., AAPL, MSFT)"
              value={ticker}
              onChange={(e) => {
                setTicker(e.target.value);
                if (isInvalid) setIsInvalid(false);
              }}
              className={cn(
                "pl-7 h-8 text-sm",
                isInvalid &&
                  "border-destructive focus-visible:ring-destructive",
              )}
              disabled={isLoading}
              aria-invalid={isInvalid}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="h-8 text-xs px-3"
          >
            {isLoading ? "Cargando..." : "Buscar"}
          </Button>
        </div>

        {(isInvalid || error) && (
          <div className="mt-1 text-xs text-destructive">
            {isInvalid ? "Por favor ingrese un símbolo válido" : error}
          </div>
        )}
      </form>

      <GapFilterInline
        onChange={(gapValue) => {
          if (props.onGapFilterChange) {
            console.log(`Applying gap filter: ${gapValue}`);
            props.onGapFilterChange(gapValue, 100, "all");
          }

          // Only trigger search if we have a valid ticker
          if (onSearch && !isInvalid && ticker) {
            console.log(
              `Triggering search for ${ticker.toUpperCase()} after filter change`,
            );
            onSearch(ticker.toUpperCase());
          } else {
            console.log(
              `Not triggering search: isInvalid=${isInvalid}, ticker=${ticker}`,
            );
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
