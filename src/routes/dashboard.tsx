import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/Shell";
import {
  CryptoNews,
  EconomicCalendar,
  Heatmap,
  HighRiskCoins,
  LatestAlerts,
  MarketOverview,
  OpportunityMeter,
  ScoreRankings,
  StatCards,
  TopOpportunities,
} from "@/components/dashboard/Widgets";
import {
  AISummary,
  AtlasAssistant,
  PortfolioSummary,
  QuickActions,
  TradingTip,
  UpcomingEvents,
} from "@/components/dashboard/Rail";

const title = "Dashboard — TradeMind AI";
const description =
  "Live crypto futures dashboard: TradeMind scores, AI alerts, market heatmap, risk analysis and portfolio insight in one premium workspace.";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <DashboardShell
      main={
        <>
          <StatCards />
          <MarketOverview />
          <div className="grid gap-5 lg:grid-cols-2 xl:gap-6">
            <TopOpportunities />
            <HighRiskCoins />
          </div>
          <div className="grid gap-5 lg:grid-cols-2 xl:gap-6">
            <LatestAlerts />
            <OpportunityMeter />
          </div>
          <ScoreRankings />
          <Heatmap />
          <div className="grid gap-5 lg:grid-cols-2 xl:gap-6">
            <EconomicCalendar />
            <CryptoNews />
          </div>
        </>
      }
      rail={
        <>
          <AtlasAssistant />
          <AISummary />
          <TradingTip />
          <UpcomingEvents />
          <PortfolioSummary />
          <QuickActions />
        </>
      }
    />
  );
}
