import TradingViewWidget from "@/components/TradingViewWidget";
import {
  FOREX_HEATMAP_WIDGET_CONFIG,
  FOREX_TOP_STORIES_WIDGET_CONFIG,
  FOREX_TICKER_TAPE_WIDGET_CONFIG,
} from "@/lib/constants";

export default function Forex() {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-6 sm:py-8 lg:py-10">
      {/* Page Title */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-balance">
          Forex Dashboard
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg">
          Real-time foreign exchange market data and analytics
        </p>
      </div>

      {/* Ticker Tape */}
      <div className="mb-6 sm:mb-8">
        <TradingViewWidget
          scriptUrl={`${scriptUrl}ticker-tape.js`}
          config={FOREX_TICKER_TAPE_WIDGET_CONFIG}
          height={46}
        />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forex News Section */}
        <div className="lg:col-span-1">
          <TradingViewWidget
            title="Latest Forex News"
            scriptUrl={`${scriptUrl}timeline.js`}
            config={FOREX_TOP_STORIES_WIDGET_CONFIG}
            height={600}
          />
        </div>

        {/* Forex Heatmap Section */}
        <div className="lg:col-span-2">
          <TradingViewWidget
            title="Forex Cross Rates Heatmap"
            scriptUrl={`${scriptUrl}forex-heat-map.js`}
            config={FOREX_HEATMAP_WIDGET_CONFIG}
            height={600}
          />
        </div>
      </div>
    </div>
  );
}
