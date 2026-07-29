/** Realistic sample market data powering the TradeMind AI dashboard. */

export const statCards = [
  {
    key: "btc",
    label: "BTC Price",
    value: "$68,412",
    change: "+2.41%",
    positive: true,
    sub: "24h vol $38.2B",
    spark: [64200, 64980, 64510, 65890, 66720, 66210, 67480, 67910, 67320, 68120, 68410],
  },
  {
    key: "fng",
    label: "Fear & Greed Index",
    value: "72",
    change: "Greed",
    positive: true,
    sub: "Yesterday 65 · Neutral",
    spark: [41, 46, 52, 49, 58, 61, 57, 64, 65, 69, 72],
  },
  {
    key: "dom",
    label: "BTC Dominance",
    value: "54.8%",
    change: "-0.36%",
    positive: false,
    sub: "ETH 17.2% · Others 28.0%",
    spark: [56.1, 56.0, 55.7, 55.9, 55.4, 55.2, 55.3, 55.0, 54.9, 55.1, 54.8],
  },
  {
    key: "mcap",
    label: "Total Market Cap",
    value: "$2.41T",
    change: "+1.87%",
    positive: true,
    sub: "Stables $162B · 6.7%",
    spark: [2.29, 2.31, 2.3, 2.34, 2.36, 2.35, 2.38, 2.39, 2.37, 2.4, 2.41],
  },
] as const;

export const marketSeries = [
  { t: "00:00", btc: 66980, eth: 3412, vol: 1.9 },
  { t: "03:00", btc: 67240, eth: 3438, vol: 2.4 },
  { t: "06:00", btc: 66890, eth: 3401, vol: 3.1 },
  { t: "09:00", btc: 67610, eth: 3466, vol: 2.7 },
  { t: "12:00", btc: 67980, eth: 3489, vol: 3.6 },
  { t: "15:00", btc: 67520, eth: 3452, vol: 2.9 },
  { t: "18:00", btc: 68210, eth: 3514, vol: 4.2 },
  { t: "21:00", btc: 68412, eth: 3538, vol: 3.4 },
];

export const opportunities = [
  {
    pair: "SOLUSDT",
    score: 91,
    bias: "Long bias",
    conf: 92,
    risk: "Low",
    note: "Open interest rising with price, funding still neutral at 0.008%.",
    change: "+4.6%",
  },
  {
    pair: "LINKUSDT",
    score: 84,
    bias: "Long bias",
    conf: 81,
    risk: "Medium",
    note: "Reclaimed the 4H range high; invalidation sits under $16.40.",
    change: "+3.1%",
  },
  {
    pair: "ARBUSDT",
    score: 79,
    bias: "Long bias",
    conf: 74,
    risk: "Medium",
    note: "Liquidity swept below equal lows, momentum turning positive.",
    change: "+2.2%",
  },
];

export const highRisk = [
  { pair: "PEPEUSDT", score: 28, reason: "Funding at 0.11% — crowded longs", change: "-7.4%" },
  { pair: "WIFUSDT", score: 33, reason: "Long liquidations clustered 4% below", change: "-5.9%" },
  { pair: "APTUSDT", score: 37, reason: "OI up 22% while price is flat", change: "-1.8%" },
];

export const alerts = [
  {
    time: "2 min ago",
    tone: "positive" as const,
    title: "SOLUSDT score crossed 90",
    body: "Momentum, OI and funding aligned on the 4H timeframe.",
  },
  {
    time: "18 min ago",
    tone: "warning" as const,
    title: "BTC funding heating up",
    body: "Perp funding moved to 0.042% — leverage is getting one-sided.",
  },
  {
    time: "47 min ago",
    tone: "neutral" as const,
    title: "ETHUSDT entered a compression range",
    body: "Volatility at a 12-day low. Breakout watch above $3,560.",
  },
  {
    time: "1 h ago",
    tone: "negative" as const,
    title: "PEPEUSDT risk raised to High",
    body: "Crowded positioning plus fading spot volume.",
  },
];

export const rankings = [
  { pair: "SOLUSDT", score: 91, conf: 92, trend: "Strong bullish", change: "+4.6%" },
  { pair: "BTCUSDT", score: 88, conf: 90, trend: "Bullish", change: "+2.4%" },
  { pair: "LINKUSDT", score: 84, conf: 81, trend: "Bullish", change: "+3.1%" },
  { pair: "ETHUSDT", score: 76, conf: 78, trend: "Neutral / up", change: "+1.2%" },
  { pair: "AVAXUSDT", score: 68, conf: 70, trend: "Neutral", change: "+0.4%" },
  { pair: "DOGEUSDT", score: 52, conf: 61, trend: "Choppy", change: "-0.9%" },
];

export const heatmap = [
  { sym: "BTC", chg: 2.41 }, { sym: "ETH", chg: 1.24 }, { sym: "SOL", chg: 4.62 },
  { sym: "BNB", chg: 0.87 }, { sym: "XRP", chg: -1.12 }, { sym: "ADA", chg: -0.44 },
  { sym: "AVAX", chg: 0.41 }, { sym: "LINK", chg: 3.08 }, { sym: "DOT", chg: -0.76 },
  { sym: "ARB", chg: 2.18 }, { sym: "OP", chg: 1.63 }, { sym: "TON", chg: -2.05 },
  { sym: "NEAR", chg: 1.02 }, { sym: "INJ", chg: -3.31 }, { sym: "SUI", chg: 5.24 },
  { sym: "DOGE", chg: -0.91 }, { sym: "PEPE", chg: -7.42 }, { sym: "WIF", chg: -5.88 },
];

export const calendar = [
  { time: "Today 14:30", event: "US Core CPI (MoM)", impact: "High", forecast: "0.3%", prev: "0.4%" },
  { time: "Today 20:00", event: "FOMC Minutes", impact: "High", forecast: "—", prev: "—" },
  { time: "Tomorrow 14:30", event: "Initial Jobless Claims", impact: "Medium", forecast: "221K", prev: "218K" },
  { time: "Fri 14:30", event: "PPI (YoY)", impact: "Medium", forecast: "2.1%", prev: "2.2%" },
];

export const news = [
  {
    source: "Reuters",
    time: "24 min ago",
    title: "Spot bitcoin ETFs record fourth straight day of net inflows",
    tag: "Flows",
  },
  {
    source: "CoinDesk",
    time: "1 h ago",
    title: "Solana network fees hit a monthly high as DEX volume climbs",
    tag: "On-chain",
  },
  {
    source: "Bloomberg",
    time: "2 h ago",
    title: "Traders trim leverage into the CPI print, futures basis narrows",
    tag: "Macro",
  },
  {
    source: "The Block",
    time: "3 h ago",
    title: "Ethereum staking withdrawals fall to lowest level since March",
    tag: "On-chain",
  },
];

export const portfolio = {
  total: "$48,920",
  change: "+$1,284 (2.69%)",
  positive: true,
  allocation: [
    { name: "BTC", value: 42, color: "var(--emerald)" },
    { name: "ETH", value: 24, color: "var(--electric)" },
    { name: "SOL", value: 18, color: "var(--purple)" },
    { name: "Stables", value: 16, color: "oklch(0.72 0.02 260)" },
  ],
};

export const upcomingEvents = [
  { label: "US Core CPI", when: "in 3 h 12 m", impact: "High" },
  { label: "FOMC Minutes", when: "in 8 h 42 m", impact: "High" },
  { label: "BTC options expiry", when: "Fri 08:00 UTC", impact: "Medium" },
];

export const chatSeed = [
  {
    role: "assistant" as const,
    text: "Morning. BTC holds 68.4K with funding still calm. SOL is the strongest setup on the board at a score of 91 — want the reasoning?",
  },
  { role: "user" as const, text: "Yes, why is SOL scoring so high?" },
  {
    role: "assistant" as const,
    text: "Three inputs align: open interest is up 14% while price makes higher lows, funding sits at a neutral 0.008%, and spot volume leads perps. Invalidation is a 4H close under $158.",
  },
];
