export const PALETTE = {
  blue: "#4269d0",
  green: "#3ca951",
  red: "#ff725c",
  purple: "#a463f2",
  amber: "#efb118",
  cyan: "#6cc5b0",
  gray: "#9696a0",
  pink: "#ff8ab7",
} as const;

export type SparkCard = {
  value: string;
  delta: string;
  accent: string;
  spark: number[];
};

export type Candle = [number, number, number, number];
export type FlowCurve = [[number, number], [number, number], [number, number]];
export type NetworkNode = { x: number; y: number; r: number; accent: string };
export type Block = { x: number; y: number; w: number; h: number };

const TAU = Math.PI * 2;

export const clamp = (value: number, low: number, high: number) =>
  Math.max(low, Math.min(high, value));

export const ease = (t: number) => t * t * (3 - 2 * t);

export const makeSeries = (
  seed: number,
  count: number,
  base: number,
  amplitude: number,
  drift: number,
) => {
  const phase = seed * 0.371;
  return Array.from({ length: count }, (_, index) => {
    const x = count === 1 ? 0 : index / (count - 1);
    const waveA = Math.sin((x * (2.2 + drift) + phase) * TAU);
    const waveB = Math.sin((x * (4.8 + drift * 0.2) + phase * 0.7) * TAU);
    const waveC = Math.cos((x * (1.1 + drift * 0.1) + phase * 1.3) * TAU);
    return base + amplitude * (0.72 * waveA + 0.26 * waveB + 0.18 * waveC);
  });
};

export const makeHeatmap = (
  rows: number,
  cols: number,
  seed: number,
  base = 0.2,
  span = 0.8,
) =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const x = col / Math.max(1, cols - 1);
      const y = row / Math.max(1, rows - 1);
      const wave =
        Math.sin((x * (2.4 + seed * 0.03) + y * 0.9 + seed * 0.11) * TAU) *
          0.6 +
        Math.cos((x * 0.6 + y * (2.2 + seed * 0.02)) * TAU) * 0.4;
      const diagonal = Math.sin((x + y * 0.9 + seed * 0.07) * TAU);
      return clamp(base + span * (0.5 + 0.28 * wave + 0.15 * diagonal), 0, 1);
    }),
  );

export const buildRetailData = () => {
  const cards: SparkCard[] = [
    { value: "84.2", delta: "+12.4%", accent: PALETTE.blue, spark: makeSeries(3, 20, 0.56, 0.18, 0.4) },
    { value: "31.8", delta: "+8.7%", accent: PALETTE.green, spark: makeSeries(4, 20, 0.42, 0.14, 0.7) },
    { value: "9.1", delta: "-2.3%", accent: PALETTE.red, spark: makeSeries(5, 20, 0.35, 0.11, 1.0) },
    { value: "76.5", delta: "+5.4%", accent: PALETTE.purple, spark: makeSeries(6, 20, 0.61, 0.15, 0.8) },
    { value: "18.2", delta: "+4.2%", accent: PALETTE.amber, spark: makeSeries(7, 20, 0.48, 0.13, 0.6) },
  ];

  return {
    cards,
    area: [
      makeSeries(11, 96, 0.46, 0.12, 0.7),
      makeSeries(12, 96, 0.32, 0.09, 1.1),
      makeSeries(13, 96, 0.18, 0.08, 1.4),
    ],
    donut: [42, 27, 18, 13],
    bars: [82, 71, 64, 56, 48, 39],
    heatmap: makeHeatmap(7, 14, 14, 0.15, 0.85),
  };
};

export const buildFinanceData = () => {
  const cards: SparkCard[] = [
    { value: "124.6", delta: "+2.8%", accent: PALETTE.blue, spark: makeSeries(21, 20, 0.58, 0.14, 0.9) },
    { value: "78.1", delta: "+1.4%", accent: PALETTE.red, spark: makeSeries(22, 20, 0.43, 0.13, 0.5) },
    { value: "21.8", delta: "-0.9%", accent: PALETTE.amber, spark: makeSeries(23, 20, 0.38, 0.12, 1.2) },
    { value: "56.3", delta: "+3.2%", accent: PALETTE.purple, spark: makeSeries(24, 20, 0.51, 0.11, 0.8) },
  ];

  const candles: Candle[] = [];
  let price = 100;
  for (let i = 0; i < 38; i += 1) {
    const drift = Math.sin(i * 0.32) * 0.22;
    const open = price;
    const close = open + Math.sin(i * 0.58) * 0.65 + drift;
    const high = Math.max(open, close) + 0.18 + Math.abs(Math.sin(i * 0.9)) * 0.34;
    const low = Math.min(open, close) - 0.15 - Math.abs(Math.cos(i * 0.8)) * 0.24;
    candles.push([open, high, low, close]);
    price = close + 0.18 + Math.sin(i * 0.12) * 0.12;
  }

  const radar = Array.from({ length: 6 }, (_, i) => 0.38 + 0.48 * (0.5 + 0.5 * Math.sin(1.2 + i * 0.9)));
  const flows: FlowCurve[] = [
    [[70, 180], [230, 70], [360, 210]],
    [[70, 250], [190, 150], [360, 110]],
    [[70, 330], [210, 420], [370, 300]],
    [[400, 100], [560, 35], [680, 130]],
    [[410, 360], [540, 260], [690, 390]],
  ];

  return { cards, candles, radar, flows };
};

export const buildEnergyData = () => {
  const cards: SparkCard[] = [
    { value: "96.4", delta: "+4.1%", accent: PALETTE.green, spark: makeSeries(31, 20, 0.52, 0.13, 0.5) },
    { value: "82.9", delta: "+1.8%", accent: PALETTE.cyan, spark: makeSeries(32, 20, 0.48, 0.12, 1.0) },
    { value: "15.3", delta: "-0.7%", accent: PALETTE.blue, spark: makeSeries(33, 20, 0.44, 0.10, 0.7) },
    { value: "64.2", delta: "+3.5%", accent: PALETTE.amber, spark: makeSeries(34, 20, 0.57, 0.13, 0.8) },
    { value: "27.8", delta: "+0.9%", accent: PALETTE.red, spark: makeSeries(35, 20, 0.39, 0.11, 1.2) },
  ];

  const nodes: NetworkNode[] = [];
  const nodeDefs: Array<[number, number, number, string]> = [
    [0.0, 160, 8, PALETTE.blue],
    [0.8, 118, 7, PALETTE.green],
    [1.6, 142, 7, PALETTE.cyan],
    [2.4, 110, 6, PALETTE.amber],
    [3.2, 154, 7, PALETTE.purple],
    [4.1, 128, 6, PALETTE.red],
    [5.0, 140, 8, PALETTE.cyan],
    [5.8, 104, 6, PALETTE.green],
  ];
  for (const [ang, radius, size, accent] of nodeDefs) {
    const cx = 240;
    const cy = 240;
    nodes.push({
      x: cx + Math.cos(ang) * radius,
      y: cy + Math.sin(ang) * radius,
      r: size,
      accent,
    });
  }

  const edges: Array<[number, number, number]> = [
    [0, 1, 2],
    [0, 2, 3],
    [0, 3, 4],
    [4, 5, 6],
    [6, 7, 1],
    [1, 6, 2],
    [2, 7, 5],
  ];

  return {
    cards,
    nodes,
    edges,
    gauges: [0.88, 0.67, 0.53],
    donut: [39, 28, 19, 14],
    bars: [92, 84, 77, 60, 46],
  };
};

export const buildCityData = () => {
  const cards: SparkCard[] = [
    { value: "42.8", delta: "+6.3%", accent: PALETTE.blue, spark: makeSeries(41, 20, 0.54, 0.16, 0.75) },
    { value: "18.4", delta: "+2.1%", accent: PALETTE.purple, spark: makeSeries(42, 20, 0.49, 0.14, 1.05) },
    { value: "73.1", delta: "+3.8%", accent: PALETTE.cyan, spark: makeSeries(43, 20, 0.58, 0.15, 0.6) },
    { value: "9.6", delta: "-0.5%", accent: PALETTE.amber, spark: makeSeries(44, 20, 0.35, 0.10, 0.9) },
  ];

  const blocks: Block[] = [];
  const cols = [36, 62, 92, 126, 84, 58, 110, 74, 88, 46, 58];
  const rows = [42, 68, 58, 94, 54, 72, 62, 88];
  let x = 0;
  let y = 0;
  for (let i = 0; i < 11; i += 1) {
    const bw = cols[i] + (i % 3) * 10;
    const bh = rows[i % rows.length] + ((i + 1) % 3) * 8;
    blocks.push({ x, y, w: bw, h: bh });
    x += bw + 10;
    if (x > 440) {
      x = 0;
      y += 88;
    }
  }

  const flows: FlowCurve[] = [
    [[40, 100], [220, 30], [400, 120]],
    [[65, 180], [200, 260], [390, 200]],
    [[80, 290], [210, 220], [410, 330]],
    [[120, 80], [280, 210], [440, 100]],
  ];

  return {
    cards,
    blocks,
    bars: [88, 81, 76, 68, 54, 49],
    heatmap: makeHeatmap(8, 12, 54, 0.22, 0.74),
    flows,
  };
};

export const buildLogisticsData = () => {
  const cards: SparkCard[] = [
    { value: "62.5", delta: "+7.1%", accent: PALETTE.blue, spark: makeSeries(51, 20, 0.53, 0.13, 1.1) },
    { value: "27.4", delta: "+4.6%", accent: PALETTE.cyan, spark: makeSeries(52, 20, 0.48, 0.12, 0.9) },
    { value: "18.2", delta: "+1.9%", accent: PALETTE.green, spark: makeSeries(53, 20, 0.44, 0.11, 0.8) },
    { value: "81.0", delta: "+2.3%", accent: PALETTE.purple, spark: makeSeries(54, 20, 0.58, 0.13, 0.7) },
    { value: "12.6", delta: "-0.8%", accent: PALETTE.amber, spark: makeSeries(55, 20, 0.35, 0.1, 1.0) },
  ];

  const flows: FlowCurve[] = [
    [[40, 90], [210, 20], [420, 130]],
    [[60, 160], [200, 260], [430, 220]],
    [[52, 250], [220, 190], [418, 90]],
    [[80, 330], [210, 430], [430, 320]],
    [[140, 60], [300, 180], [510, 80]],
  ];

  const nodes: NetworkNode[] = [];
  for (const [ang, radius, size] of [
    [0.2, 150, 7],
    [1.0, 100, 6],
    [1.8, 130, 6],
    [2.6, 150, 7],
    [3.4, 110, 6],
    [4.2, 138, 7],
    [5.1, 106, 6],
    [5.9, 148, 7],
  ] as Array<[number, number, number]>) {
    const cx = 220;
    const cy = 220;
    nodes.push({
      x: cx + Math.cos(ang) * radius,
      y: cy + Math.sin(ang) * radius,
      r: size,
      accent:
        size >= 7
          ? PALETTE.blue
          : size === 6 && ang > 4
            ? PALETTE.green
            : PALETTE.cyan,
    });
  }

  const edges: Array<[number, number, number]> = [
    [0, 1, 2],
    [0, 2, 3],
    [3, 4, 5],
    [5, 6, 7],
    [1, 6, 7],
    [2, 4, 6],
  ];

  return {
    cards,
    flows,
    nodes,
    edges,
    bars: [84, 79, 68, 60, 53, 42],
    heatmap: makeHeatmap(6, 12, 64, 0.18, 0.82),
  };
};

export const RETAIL = buildRetailData();
export const FINANCE = buildFinanceData();
export const ENERGY = buildEnergyData();
export const CITY = buildCityData();
export const LOGISTICS = buildLogisticsData();

