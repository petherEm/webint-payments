"use client";

import { memo } from "react";
import useTradingViewWidget from "@/hooks/useTradingViewWidget";
import { cn } from "@/lib/utils";

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

const TradingViewWidget = ({
  title,
  scriptUrl,
  config,
  height = 600,
  className,
}: TradingViewWidgetProps) => {
  const containerRef = useTradingViewWidget(scriptUrl, config, height);

  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
          {title}
        </h3>
      )}
      <div
        className={cn(
          "tradingview-widget-container rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300",
          className
        )}
        ref={containerRef}
      >
        <div
          className="tradingview-widget-container__widget"
          style={{ height, width: "100%" }}
        />
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
