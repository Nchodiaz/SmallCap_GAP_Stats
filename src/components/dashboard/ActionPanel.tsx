import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Download,
  Calendar,
  Settings,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

interface ActionPanelProps {
  onExport?: () => void;
  onRefresh?: () => void;
  onTimeRangeChange?: (range: string) => void;
  onSettingsChange?: () => void;
  isLoading?: boolean;
}

const ActionPanel = ({
  onExport = () => {},
  onRefresh = () => {},
  onTimeRangeChange = () => {},
  onSettingsChange = () => {},
  isLoading = false,
}: ActionPanelProps) => {
  const timeRanges = [
    { label: "1 Día", value: "1d" },
    { label: "1 Semana", value: "1w" },
    { label: "1 Mes", value: "1m" },
    { label: "3 Meses", value: "3m" },
    { label: "6 Meses", value: "6m" },
    { label: "1 Año", value: "1y" },
    { label: "Todo", value: "all" },
  ];

  return (
    <div className="w-full h-[30px] px-1 py-0.5 flex items-center justify-between bg-background border-t border-border">
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-6 text-[10px]"
              >
                <RefreshCw
                  className={`h-2.5 w-2.5 mr-0.5 ${isLoading ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
            </TooltipTrigger>
            <TooltipContent>Actualizar datos</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-[10px]"
                  >
                    <Calendar className="h-2.5 w-2.5 mr-0.5" />
                    Rango
                    <ChevronDown className="h-2.5 w-2.5 ml-0.5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Seleccionar rango de tiempo</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent>
            {timeRanges.map((range) => (
              <DropdownMenuItem
                key={range.value}
                onClick={() => onTimeRangeChange(range.value)}
                className="text-xs"
              >
                {range.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onSettingsChange}
                className="h-6 text-[10px]"
              >
                <Settings className="h-2.5 w-2.5 mr-0.5" />
                Config
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ajustar configuración</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                onClick={onExport}
                className="h-6 text-[10px]"
              >
                <Download className="h-2.5 w-2.5 mr-0.5" />
                Exportar
              </Button>
            </TooltipTrigger>
            <TooltipContent>Exportar datos como CSV</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ActionPanel;
