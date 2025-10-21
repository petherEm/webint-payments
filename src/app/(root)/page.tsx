import Hero from "@/components/Hero";
import TradingViewWidget from "@/components/TradingViewWidget";
import {
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  HEATMAP_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from "@/lib/constants";

export default function Home() {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-6 sm:py-8 lg:py-10">
        {/* Page Title */}

        <div className="mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-balance">
            Market Overview
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Real-time market data and analytics
          </p>
        </div>

        {/* Grid Layout */}
        <div className="space-y-6 sm:space-y-8">
          {/* Top Section - Market Overview & Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TradingViewWidget
                title="Market Overview"
                scriptUrl={`${scriptUrl}market-overview.js`}
                config={MARKET_OVERVIEW_WIDGET_CONFIG}
                height={600}
              />
            </div>
            <div className="lg:col-span-2">
              <TradingViewWidget
                title="Stock Heatmap"
                scriptUrl={`${scriptUrl}stock-heatmap.js`}
                config={HEATMAP_WIDGET_CONFIG}
                height={600}
              />
            </div>
          </div>

          {/* Bottom Section - Timeline & Market Data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TradingViewWidget
                title="Latest News"
                scriptUrl={`${scriptUrl}timeline.js`}
                config={TOP_STORIES_WIDGET_CONFIG}
                height={600}
              />
            </div>
            <div className="lg:col-span-2">
              <TradingViewWidget
                title="Market Data"
                scriptUrl={`${scriptUrl}market-quotes.js`}
                config={MARKET_DATA_WIDGET_CONFIG}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
