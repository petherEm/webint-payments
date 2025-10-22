import TradingViewWidget from "@/components/TradingViewWidget";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import { TrendingUp, BarChart3, LineChart } from "lucide-react";

interface StockDetailsPageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="min-h-screen bg-black">
      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symbol Info */}
            <div className="bg-black rounded-xl p-6 shadow-lg">
              <TradingViewWidget
                scriptUrl={`${scriptUrl}symbol-info.js`}
                config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                height={170}
              />
            </div>

            {/* Price Charts Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  Price Charts
                </h2>
              </div>

              {/* Candlestick Chart */}
              <div className="bg-black rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  Candlestick Chart
                </h3>
                <TradingViewWidget
                  scriptUrl={`${scriptUrl}advanced-chart.js`}
                  config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                  className="custom-chart"
                  height={500}
                />
              </div>

              {/* Baseline Chart */}
              <div className="bg-black rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-green-500" />
                  Baseline Chart
                </h3>
                <TradingViewWidget
                  scriptUrl={`${scriptUrl}advanced-chart.js`}
                  config={BASELINE_WIDGET_CONFIG(symbol)}
                  className="custom-chart"
                  height={500}
                />
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Technical Analysis */}
            <div className="bg-black rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Technical Analysis
              </h3>
              <TradingViewWidget
                scriptUrl={`${scriptUrl}technical-analysis.js`}
                config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                height={400}
              />
            </div>

            {/* Company Financials */}
            <div className="bg-black rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-500" />
                Financial Data
              </h3>
              <TradingViewWidget
                scriptUrl={`${scriptUrl}financials.js`}
                config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                height={464}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
