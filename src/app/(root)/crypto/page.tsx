import TradingViewWidget from "@/components/TradingViewWidget";
import {
  CRYPTO_HEATMAP_WIDGET_CONFIG,
  CRYPTO_MARKET_OVERVIEW_WIDGET_CONFIG,
  CRYPTO_TOP_STORIES_WIDGET_CONFIG,
} from "@/lib/constants";

export default function CryptoDashboard() {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl py-6 sm:py-8 lg:py-10">
      {/* Page Title */}
      <div className="mb-8 sm:mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-balance">
          Crypto Dashboard
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg">
          Real-time cryptocurrency market data and analytics
        </p>
      </div>

      {/* Grid Layout */}
      <div className="space-y-6 sm:space-y-8">
        {/* Top Section - Crypto Overview & Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crypto Market Overview */}
          <div className="lg:col-span-1">
            <TradingViewWidget
              title="Crypto Overview"
              scriptUrl={`${scriptUrl}market-overview.js`}
              config={CRYPTO_MARKET_OVERVIEW_WIDGET_CONFIG}
              height={600}
            />
          </div>

          {/* Crypto Heatmap */}
          <div className="lg:col-span-2">
            <TradingViewWidget
              title="Crypto Market Heatmap"
              scriptUrl={`${scriptUrl}crypto-coins-heatmap.js`}
              config={CRYPTO_HEATMAP_WIDGET_CONFIG}
              height={600}
            />
          </div>
        </div>

        {/* Bottom Section - Latest Crypto News */}
        <div className="w-full">
          <TradingViewWidget
            title="Latest Crypto News"
            scriptUrl={`${scriptUrl}timeline.js`}
            config={CRYPTO_TOP_STORIES_WIDGET_CONFIG}
            height={600}
          />
        </div>
      </div>
    </div>
  );
}
