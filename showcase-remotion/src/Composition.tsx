import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const PALETTE = {
  blue: "#4269d0",
  green: "#3ca951",
  red: "#ff725c",
  purple: "#a463f2",
  amber: "#efb118",
  cyan: "#6cc5b0",
  pink: "#ff8ab7",
} as const;

const FPS = 30;
const SCENE_HOLD = 74;
const TRANSITION = 26;
const SEGMENT = SCENE_HOLD + TRANSITION;
const INTRO = 24;
const WIDTH = 1280;
const HEIGHT = 720;
const FONT =
  "'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif";
const MONO = "'Menlo', 'Monaco', 'Courier New', monospace";

type Point = [number, number];
type Metric = { value: string; delta: string; accent: string; spark: number[] };
type SceneProps = { frame: number; progress: number };
type SceneVariant = "report" | "terminal" | "screen" | "geo" | "studio";
type SceneSpec = {
  title: string;
  accents: [string, string, string];
  metrics: Metric[];
  render: React.FC<SceneProps>;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const ease = (value: number) => value * value * (3 - 2 * value);

const rgba = (hex: string, alpha: number) => {
  const clean = hex.replace("#", "");
  const [r, g, b] = clean.match(/.{1,2}/g)?.map((part) => parseInt(part, 16)) ?? [
    255,
    255,
    255,
  ];
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const series = (seed: number, count: number, base = 0.5, amp = 0.22) =>
  Array.from({ length: count }, (_, index) => {
    const x = count === 1 ? 0 : index / (count - 1);
    return (
      base +
      Math.sin((x * 2.1 + seed * 0.13) * Math.PI * 2) * amp * 0.62 +
      Math.cos((x * 4.4 + seed * 0.17) * Math.PI * 2) * amp * 0.28 +
      Math.sin((x * 0.75 + seed * 0.07) * Math.PI * 2) * amp * 0.2
    );
  });

const heat = (rows: number, cols: number, seed: number) =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const x = col / Math.max(1, cols - 1);
      const y = row / Math.max(1, rows - 1);
      return clamp(
        0.5 +
          Math.sin((x * 2.4 + y * 0.8 + seed) * Math.PI * 2) * 0.24 +
          Math.cos((x * 0.7 + y * 2.1 + seed * 0.3) * Math.PI * 2) * 0.18,
        0,
        1,
      );
    }),
  );

const pathLine = (points: Point[]) =>
  points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point[0].toFixed(2)} ${point[1].toFixed(2)}`)
    .join(" ");

const scaledPoints = (
  data: number[],
  width: number,
  height: number,
  padX: number,
  padY: number,
  domain?: [number, number],
) => {
  const min = domain?.[0] ?? Math.min(...data);
  const max = domain?.[1] ?? Math.max(...data);
  const span = max - min || 1;
  return data.map((value, index) => {
    const t = data.length === 1 ? 0 : index / (data.length - 1);
    return [
      padX + t * (width - padX * 2),
      padY + (1 - (value - min) / span) * (height - padY * 2),
    ] as Point;
  });
};

const polyLength = (points: Point[]) =>
  points.reduce((sum, point, index) => {
    if (index === 0) {
      return 0;
    }
    const prev = points[index - 1];
    return sum + Math.hypot(point[0] - prev[0], point[1] - prev[1]);
  }, 0);

const metric = (value: string, delta: string, accent: string, seed: number): Metric => ({
  value,
  delta,
  accent,
  spark: series(seed, 22, 0.5, 0.2),
});

const metricGroups = {
  retail: [
    metric("84.2", "+12.4%", PALETTE.blue, 1),
    metric("31.8", "+8.7%", PALETTE.green, 2),
    metric("9.1", "-2.3%", PALETTE.red, 3),
    metric("76.5", "+5.4%", PALETTE.purple, 4),
    metric("18.2", "+4.2%", PALETTE.amber, 5),
  ],
  finance: [
    metric("124.6", "+2.8%", PALETTE.red, 6),
    metric("78.1", "+1.4%", PALETTE.blue, 7),
    metric("21.8", "-0.9%", PALETTE.amber, 8),
    metric("56.3", "+3.2%", PALETTE.purple, 9),
  ],
  energy: [
    metric("96.4", "+4.1%", PALETTE.green, 10),
    metric("82.9", "+1.8%", PALETTE.cyan, 11),
    metric("15.3", "-0.7%", PALETTE.blue, 12),
    metric("64.2", "+3.5%", PALETTE.amber, 13),
    metric("27.8", "+0.9%", PALETTE.red, 14),
  ],
  city: [
    metric("42.8", "+6.3%", PALETTE.blue, 15),
    metric("18.4", "+2.1%", PALETTE.purple, 16),
    metric("73.1", "+3.8%", PALETTE.cyan, 17),
    metric("9.6", "-0.5%", PALETTE.amber, 18),
  ],
  logistics: [
    metric("62.5", "+7.1%", PALETTE.blue, 19),
    metric("27.4", "+4.6%", PALETTE.cyan, 20),
    metric("18.2", "+1.9%", PALETTE.green, 21),
    metric("81.0", "+2.3%", PALETTE.purple, 22),
    metric("12.6", "-0.8%", PALETTE.amber, 23),
  ],
};

const Shell: React.FC<{
  title: string;
  accents: [string, string, string];
  metrics: Metric[];
  progress: number;
  variant?: SceneVariant;
  children: React.ReactNode;
}> = ({ title, accents, metrics, progress, variant = "screen", children }) => {
  const light = variant === "report";
  const terminal = variant === "terminal";
  const geo = variant === "geo";
  const backgroundColor = light ? "#f4f7fb" : terminal ? "#06070a" : "#03050c";
  const foreground = light ? "#172033" : "#f8fafc";
  const gridAlpha = light ? 0.035 : 0.018;
  const headerMeta = light ? "BOARD PACK / EXPORT" : terminal ? "LIVE MARKET / HEDGE" : "30 FPS / REMOTION";

  return (
  <AbsoluteFill
    style={{
      overflow: "hidden",
      color: foreground,
      fontFamily: FONT,
      backgroundColor,
      backgroundImage: [
        `radial-gradient(760px circle at 18% 20%, ${rgba(accents[0], light ? 0.14 : 0.22)} 0%, transparent 50%)`,
        `radial-gradient(640px circle at 80% 74%, ${rgba(accents[1], light ? 0.10 : 0.18)} 0%, transparent 46%)`,
        `radial-gradient(520px circle at 55% 40%, ${rgba(accents[2], light ? 0.08 : 0.12)} 0%, transparent 52%)`,
        `linear-gradient(180deg, rgba(${light ? "17,24,39" : "255,255,255"},${light ? 0.028 : 0.026}) 1px, transparent 1px)`,
        `linear-gradient(90deg, rgba(${light ? "17,24,39" : "255,255,255"},${gridAlpha}) 1px, transparent 1px)`,
      ].join(", "),
      backgroundSize: `auto, auto, auto, ${geo ? 64 : 82}px ${geo ? 64 : 82}px, ${geo ? 64 : 82}px ${geo ? 64 : 82}px`,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 36%, rgba(255,255,255,0.025) 100%)",
          opacity: light ? 0 : 1,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 26,
        left: 30,
        right: 30,
        height: 42,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1.2,
            color: light ? "#172033" : "#eef6ff",
          }}
        >
          anyviz
        </div>
        <div
          style={{
            width: 1,
            height: 20,
            background: light ? "rgba(17,24,39,0.18)" : "rgba(255,255,255,0.18)",
          }}
        />
        <div style={{ fontSize: 18, fontWeight: 700, color: light ? "#172033" : "rgba(248,250,252,0.92)" }}>
          {title}
        </div>
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 12,
          color: light ? "rgba(17,24,39,0.56)" : "rgba(248,250,252,0.54)",
          border: light ? "1px solid rgba(17,24,39,0.1)" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          padding: "8px 12px",
          background: light ? "rgba(255,255,255,0.74)" : "rgba(255,255,255,0.025)",
        }}
      >
        {headerMeta}
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 86,
        left: 30,
        right: 30,
        display: "grid",
        gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))`,
        gap: 14,
        transform: `translateY(${(1 - progress) * 10}px)`,
        opacity: 0.78 + progress * 0.22,
      }}
    >
      {metrics.map((item, index) => (
        <MetricCard key={`${item.value}-${index}`} item={item} progress={progress} variant={variant} />
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        inset: "204px 30px 28px 30px",
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
  );
};

const Card: React.FC<{
  accent: string;
  children: React.ReactNode;
  variant?: SceneVariant;
  style?: React.CSSProperties;
}> = ({ accent, children, variant = "screen", style }) => {
  const light = variant === "report";
  const terminal = variant === "terminal";
  const studio = variant === "studio";
  return (
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      borderRadius: light ? 10 : studio ? 14 : 18,
      background: light
        ? "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(247,250,255,0.92))"
        : terminal
          ? "linear-gradient(135deg, rgba(8,10,14,0.98), rgba(15,10,12,0.92))"
          : "linear-gradient(135deg, rgba(11,15,26,0.98), rgba(18,24,38,0.88))",
      border: light ? "1px solid rgba(17,24,39,0.08)" : "1px solid rgba(255,255,255,0.075)",
      boxShadow: light ? "0 14px 34px rgba(20,31,50,0.10)" : "0 18px 40px rgba(0,0,0,0.36)",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: "0 0 auto 0",
        height: 4,
        background: `linear-gradient(90deg, ${rgba(accent, 0.85)}, ${rgba(accent, 0.1)})`,
      }}
    />
    {children}
  </div>
  );
};

const MetricCard: React.FC<{ item: Metric; progress: number; variant: SceneVariant }> = ({
  item,
  progress,
  variant,
}) => {
  const light = variant === "report";
  return (
  <Card accent={item.accent} variant={variant} style={{ height: 98, padding: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: 10,
          background: item.accent,
          boxShadow: `0 0 14px ${rgba(item.accent, 0.45)}`,
        }}
      />
      <div
        style={{
          color: item.delta.startsWith("-") ? PALETTE.red : PALETTE.green,
          fontFamily: MONO,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {item.delta}
      </div>
    </div>
    <div
      style={{
        marginTop: 8,
        fontFamily: MONO,
        fontWeight: 800,
        fontSize: 30,
        lineHeight: 1,
        color: light ? "#172033" : "#f8fafc",
      }}
    >
      {item.value}
    </div>
    <Spark data={item.spark} color={item.accent} progress={progress} />
  </Card>
  );
};

const Spark: React.FC<{ data: number[]; color: string; progress: number }> = ({
  data,
  color,
  progress,
}) => {
  const w = 210;
  const h = 24;
  const points = scaledPoints(data, w, h, 3, 4);
  const length = polyLength(points);
  return (
    <svg width="100%" height={26} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path
        d={`${pathLine(points)} L ${w - 3} ${h - 3} L 3 ${h - 3} Z`}
        fill={rgba(color, 0.12)}
      />
      <path
        d={pathLine(points)}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${length} ${length}`}
        strokeDashoffset={length * (1 - ease(progress))}
      />
    </svg>
  );
};

const AreaChart: React.FC<{
  data: number[][];
  colors: string[];
  progress: number;
  width?: number;
  height?: number;
}> = ({ data, colors, progress, width = 760, height = 332 }) => {
  const padX = 34;
  const padY = 30;
  const reveal = ease(progress);
  const values = data.flat();
  const domain: [number, number] = [Math.min(...values), Math.max(...values)];
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {Array.from({ length: 5 }, (_, index) => {
        const y = padY + (index * (height - padY * 2)) / 4;
        return (
          <line
            key={`grid-${index}`}
            x1={padX}
            x2={width - padX}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
          />
        );
      })}
      {data.map((item, index) => {
        const pts = scaledPoints(item, width, height, padX, padY, domain);
        const length = polyLength(pts);
        const fill = [
          ...pts,
          [width - padX, height - padY] as Point,
          [padX, height - padY] as Point,
        ];
        return (
          <g key={`area-${index}`}>
            <polygon
              points={fill.map((point) => `${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ")}
              fill={rgba(colors[index % colors.length], 0.13 - index * 0.025)}
            />
            <path
              d={pathLine(pts)}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth={3.4 - index * 0.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${length} ${length}`}
              strokeDashoffset={length * (1 - reveal)}
            />
            {pts
              .filter((_, pointIndex) => pointIndex % 13 === 0)
              .map((point, pointIndex) => (
                <circle
                  key={`point-${index}-${pointIndex}`}
                  cx={point[0]}
                  cy={point[1]}
                  r={4}
                  fill={colors[index % colors.length]}
                  stroke="#0b0f1a"
                  strokeWidth={2}
                />
              ))}
          </g>
        );
      })}
    </svg>
  );
};

const Bars: React.FC<{
  values: number[];
  colors: string[];
  progress: number;
  width?: number;
  height?: number;
}> = ({
  values,
  colors,
  progress,
  width = 420,
  height = 284,
}) => {
  const w = width;
  const h = height;
  const max = Math.max(...values) * 1.08;
  const gap = Math.max(8, Math.min(14, h * 0.045));
  const barH = (h - 42 - gap * (values.length - 1)) / values.length;
  const reveal = ease(progress);
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {values.map((value, index) => {
        const y = 24 + index * (barH + gap);
        const full = w - 48;
        const current = Math.max(8, (full * value * reveal) / max);
        const color = colors[index % colors.length];
        return (
          <g key={`bar-${index}`}>
            <rect x={24} y={y} width={full} height={barH} rx={Math.min(10, barH / 2)} fill="rgba(255,255,255,0.05)" />
            <rect x={24} y={y} width={current} height={barH} rx={Math.min(10, barH / 2)} fill={color} />
            <circle cx={24 + current} cy={y + barH / 2} r={4} fill="#f8fafc" opacity={0.82} />
          </g>
        );
      })}
    </svg>
  );
};

const Donut: React.FC<{ values: number[]; colors: string[]; progress: number }> = ({
  values,
  colors,
  progress,
}) => {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 78;
  const stroke = 24;
  const total = values.reduce((sum, value) => sum + value, 0);
  const reveal = ease(progress);
  const circumference = Math.PI * 2 * radius;
  let cursor = 0;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} preserveAspectRatio="xMidYMid meet">
      <circle cx={cx} cy={cy} r={radius + 32} fill="rgba(255,255,255,0.025)" />
      {values.map((value, index) => {
        const part = value / total;
        const segment = circumference * part * reveal;
        const offset = circumference * cursor;
        cursor += part;
        return (
          <circle
            key={`donut-${index}`}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={colors[index % colors.length]}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${Math.max(2, segment)} ${circumference}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={46} fill="#0b0f1a" />
      <circle cx={cx} cy={cy} r={18} fill={colors[0]} opacity={0.9} />
    </svg>
  );
};

const Heatmap: React.FC<{ grid: number[][]; colors: string[]; progress: number }> = ({
  grid,
  colors,
  progress,
}) => {
  const w = 1120;
  const h = 150;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 1;
  const gap = 6;
  const cellW = (w - 34 - gap * (cols - 1)) / cols;
  const cellH = (h - 28 - gap * (rows - 1)) / rows;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {grid.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const x = 17 + colIndex * (cellW + gap);
          const y = 14 + rowIndex * (cellH + gap);
          const color = colors[Math.min(colors.length - 1, Math.floor(value * colors.length))];
          return (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={x}
              y={y}
              width={cellW}
              height={cellH}
              rx={5}
              fill={rgba(color, 0.12 + value * 0.48 * ease(progress))}
              stroke={rgba(color, 0.13)}
            />
          );
        }),
      )}
    </svg>
  );
};

const StackedLoad: React.FC<{ progress: number; colors: string[] }> = ({ progress, colors }) => {
  const w = 820;
  const h = 318;
  const data = [series(71, 64, 0.42, 0.13), series(72, 64, 0.28, 0.1), series(73, 64, 0.18, 0.08)];
  const totals = data[0].map((_, index) => data.reduce((sum, row) => sum + row[index], 0));
  const max = Math.max(...totals) * 1.12;
  const padX = 42;
  const padY = 28;
  const reveal = ease(progress);
  const layers: Point[][] = [];
  const baseline = Array.from({ length: data[0].length }, () => 0);
  for (const row of data) {
    const top = row.map((value, index) => {
      baseline[index] += value;
      const x = padX + (index / (row.length - 1)) * (w - padX * 2);
      const y = h - padY - (baseline[index] / max) * (h - padY * 2);
      return [x, y] as Point;
    });
    layers.push(top);
  }
  const baseLine = data[0].map((_, index) => [
    padX + (index / (data[0].length - 1)) * (w - padX * 2),
    h - padY,
  ] as Point);

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {Array.from({ length: 5 }, (_, index) => (
        <line key={index} x1={padX} x2={w - padX} y1={padY + (index * (h - padY * 2)) / 4} y2={padY + (index * (h - padY * 2)) / 4} stroke="rgba(255,255,255,0.07)" />
      ))}
      {layers.map((top, index) => {
        const bottom = index === 0 ? baseLine : layers[index - 1];
        const fillPoints = [...top, ...bottom.slice().reverse()];
        const length = polyLength(top);
        return (
          <g key={`stack-${index}`}>
            <polygon points={fillPoints.map((point) => `${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ")} fill={rgba(colors[index], 0.18 + index * 0.03)} />
            <path d={pathLine(top)} fill="none" stroke={colors[index]} strokeWidth={3} strokeDasharray={`${length} ${length}`} strokeDashoffset={length * (1 - reveal)} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
};

const GeoFlowMap: React.FC<{ progress: number }> = ({ progress }) => {
  const w = 720;
  const h = 315;
  const centers: Array<[number, number, string, string]> = [
    [150, 118, "North", PALETTE.blue],
    [268, 190, "West", PALETTE.purple],
    [405, 116, "Core", PALETTE.cyan],
    [536, 210, "South", PALETTE.amber],
    [602, 96, "East", PALETTE.green],
  ];
  const flows: Array<[number, number, number]> = [
    [0, 2, 3],
    [1, 2, 4],
    [2, 3, 5],
    [2, 4, 2],
    [4, 3, 3],
  ];
  const reveal = ease(progress);
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d="M92 70 C170 28 246 54 312 88 C378 45 512 46 620 92 C663 160 633 235 550 260 C456 300 334 278 244 244 C156 265 83 214 76 144 C72 112 78 90 92 70Z" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
      {flows.map(([from, to, width], index) => {
        const a = centers[from];
        const b = centers[to];
        const cx = (a[0] + b[0]) / 2;
        const cy = Math.min(a[1], b[1]) - 42 - index * 6;
        const d = `M${a[0]} ${a[1]} Q${cx} ${cy} ${b[0]} ${b[1]}`;
        const approx = Math.hypot(a[0] - b[0], a[1] - b[1]) * 1.25;
        return (
          <path key={`flow-${index}`} d={d} fill="none" stroke={a[3]} strokeWidth={width} strokeLinecap="round" strokeDasharray={`${approx} ${approx}`} strokeDashoffset={approx * (1 - reveal)} opacity={0.78} />
        );
      })}
      {centers.map(([x, y, label, color]) => (
        <g key={label}>
          <circle cx={x} cy={y} r={18} fill={rgba(color, 0.16)} />
          <circle cx={x} cy={y} r={8} fill={color} stroke="#0b0f1a" strokeWidth={3} />
          <text x={x} y={y + 34} textAnchor="middle" fill="rgba(248,250,252,0.66)" fontFamily={MONO} fontSize={11}>{label}</text>
        </g>
      ))}
    </svg>
  );
};

const SankeyFlow: React.FC<{ progress: number; colors: string[] }> = ({ progress, colors }) => {
  const w = 420;
  const h = 318;
  const left = [[54, 70], [54, 158], [54, 246]] as Point[];
  const mid = [[198, 96], [198, 220]] as Point[];
  const right = [[354, 66], [354, 150], [354, 238]] as Point[];
  const links: Array<[Point, Point, string, number]> = [
    [left[0], mid[0], colors[0], 14],
    [left[1], mid[0], colors[1], 10],
    [left[1], mid[1], colors[2], 12],
    [left[2], mid[1], colors[3], 16],
    [mid[0], right[0], colors[0], 12],
    [mid[0], right[1], colors[1], 11],
    [mid[1], right[1], colors[2], 9],
    [mid[1], right[2], colors[3], 15],
  ];
  const reveal = ease(progress);
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {links.map(([a, b, color, stroke], index) => {
        const d = `M${a[0]} ${a[1]} C${a[0] + 86} ${a[1]}, ${b[0] - 86} ${b[1]}, ${b[0]} ${b[1]}`;
        const len = Math.hypot(a[0] - b[0], a[1] - b[1]) * 1.45;
        return (
          <path key={`link-${index}`} d={d} fill="none" stroke={rgba(color, 0.52)} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - reveal)} />
        );
      })}
      {[...left, ...mid, ...right].map((point, index) => (
        <rect key={`node-${index}`} x={point[0] - 9} y={point[1] - 28} width={18} height={56} rx={6} fill={colors[index % colors.length]} />
      ))}
    </svg>
  );
};

const Candle: React.FC<{ progress: number }> = ({ progress }) => {
  const w = 790;
  const h = 320;
  const candles = Array.from({ length: 34 }, (_, index) => {
    const base = 100 + index * 0.42 + Math.sin(index * 0.37) * 1.2;
    const open = base + Math.sin(index * 0.9) * 1.4;
    const close = base + Math.cos(index * 0.74) * 1.5;
    const high = Math.max(open, close) + 1.2 + Math.abs(Math.sin(index)) * 0.9;
    const low = Math.min(open, close) - 1.1 - Math.abs(Math.cos(index * 0.8)) * 0.8;
    return { open, close, high, low };
  });
  const all = candles.flatMap((item) => [item.open, item.close, item.high, item.low]);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const xPad = 34;
  const yPad = 26;
  const slot = (w - xPad * 2) / candles.length;
  const reveal = ease(progress);
  const y = (value: number) => yPad + (1 - (value - min) / span) * (h - yPad * 2);
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {Array.from({ length: 5 }, (_, index) => (
        <line
          key={`grid-${index}`}
          x1={xPad}
          x2={w - xPad}
          y1={yPad + (index * (h - yPad * 2)) / 4}
          y2={yPad + (index * (h - yPad * 2)) / 4}
          stroke="rgba(255,255,255,0.07)"
        />
      ))}
      {candles.map((item, index) => {
        const cx = xPad + slot * index + slot / 2;
        const up = item.close >= item.open;
        const color = up ? PALETTE.green : PALETTE.red;
        const bodyTop = Math.min(y(item.open), y(item.close));
        const bodyBottom = Math.max(y(item.open), y(item.close));
        const bodyH = Math.max(5, (bodyBottom - bodyTop) * reveal);
        return (
          <g key={`candle-${index}`}>
            <line x1={cx} x2={cx} y1={y(item.high)} y2={y(item.low)} stroke={rgba(color, 0.82)} strokeWidth={2} />
            <rect
              x={cx - slot * 0.22}
              y={bodyBottom - bodyH}
              width={slot * 0.44}
              height={bodyH}
              rx={3}
              fill={color}
            />
          </g>
        );
      })}
    </svg>
  );
};

const Radar: React.FC<{ progress: number; colors: string[] }> = ({ progress, colors }) => {
  const w = 340;
  const h = 220;
  const cx = w / 2;
  const cy = h / 2;
  const radius = 82;
  const values = [0.82, 0.64, 0.74, 0.58, 0.88, 0.7];
  const points = values.map((value, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / values.length;
    const r = radius * (0.18 + value * 0.82 * ease(progress));
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as Point;
  });
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {[0.25, 0.5, 0.75, 1].map((part) => (
        <circle key={part} cx={cx} cy={cy} r={radius * part} fill="none" stroke="rgba(255,255,255,0.08)" />
      ))}
      {points.map((point, index) => (
        <line key={`axis-${index}`} x1={cx} y1={cy} x2={point[0]} y2={point[1]} stroke="rgba(255,255,255,0.06)" />
      ))}
      <polygon
        points={points.map((point) => `${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ")}
        fill={rgba(colors[0], 0.18)}
        stroke={colors[1]}
        strokeWidth={3}
      />
      {points.map((point, index) => (
        <circle key={`dot-${index}`} cx={point[0]} cy={point[1]} r={4.5} fill={colors[index % colors.length]} />
      ))}
    </svg>
  );
};

const RetailScene: React.FC<SceneProps> = ({ progress }) => (
  <Shell title="Retail Weekly Board Report" accents={[PALETTE.blue, PALETTE.green, PALETTE.cyan]} metrics={metricGroups.retail} progress={progress} variant="report">
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "310px 160px", gap: 16 }}>
      <Card accent={PALETTE.blue} variant="report">
        <AreaChart data={[series(31, 72, 0.54, 0.13), series(32, 72, 0.43, 0.1), series(33, 72, 0.34, 0.09)]} colors={[PALETTE.blue, PALETTE.cyan, PALETTE.green]} progress={progress} />
      </Card>
      <Card accent={PALETTE.green} variant="report">
        <Donut values={[42, 27, 18, 13]} colors={[PALETTE.blue, PALETTE.green, PALETTE.amber, PALETTE.cyan]} progress={progress} />
      </Card>
      <Card accent={PALETTE.cyan} variant="report" style={{ gridColumn: "1 / 3" }}>
        <Heatmap grid={heat(6, 18, 1.3)} colors={[PALETTE.blue, PALETTE.cyan, PALETTE.green, PALETTE.amber, PALETTE.purple]} progress={progress} />
      </Card>
    </div>
  </Shell>
);

const FinanceScene: React.FC<SceneProps> = ({ progress }) => (
  <Shell title="Global Markets Trading Terminal" accents={[PALETTE.red, PALETTE.blue, PALETTE.purple]} metrics={metricGroups.finance} progress={progress} variant="terminal">
    <div style={{ display: "grid", gridTemplateColumns: "2.05fr 1fr", gridTemplateRows: "320px 150px", gap: 16 }}>
      <Card accent={PALETTE.red} variant="terminal">
        <Candle progress={progress} />
      </Card>
      <Card accent={PALETTE.purple} variant="terminal">
        <Radar progress={progress} colors={[PALETTE.purple, PALETTE.blue, PALETTE.cyan, PALETTE.amber, PALETTE.green, PALETTE.red]} />
      </Card>
      <Card accent={PALETTE.blue} variant="terminal" style={{ gridColumn: "1 / 3" }}>
        <AreaChart data={[series(41, 80, 0.5, 0.2), series(42, 80, 0.44, 0.17)]} colors={[PALETTE.red, PALETTE.blue]} progress={progress} width={1120} height={150} />
      </Card>
    </div>
  </Shell>
);

const EnergyScene: React.FC<SceneProps> = ({ progress }) => (
  <Shell title="Smart Energy Operations Screen" accents={[PALETTE.green, PALETTE.cyan, PALETTE.blue]} metrics={metricGroups.energy} progress={progress} variant="screen">
    <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gridTemplateRows: "318px 152px", gap: 16 }}>
      <Card accent={PALETTE.cyan}>
        <StackedLoad progress={progress} colors={[PALETTE.green, PALETTE.cyan, PALETTE.blue]} />
      </Card>
      <Card accent={PALETTE.green}>
        <Donut values={[39, 28, 19, 14]} colors={[PALETTE.green, PALETTE.cyan, PALETTE.blue, PALETTE.amber]} progress={progress} />
      </Card>
      <Card accent={PALETTE.green} style={{ gridColumn: "1 / 3" }}>
        <Bars values={[92, 84, 77, 60, 46, 38]} colors={[PALETTE.green, PALETTE.cyan, PALETTE.blue, PALETTE.amber, PALETTE.purple, PALETTE.red]} progress={progress} width={1120} height={152} />
      </Card>
    </div>
  </Shell>
);

const CityScene: React.FC<SceneProps> = ({ progress }) => (
  <Shell title="Urban Mobility Geo Dashboard" accents={[PALETTE.blue, PALETTE.purple, PALETTE.cyan]} metrics={metricGroups.city} progress={progress} variant="geo">
    <div style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gridTemplateRows: "315px 155px", gap: 16 }}>
      <Card accent={PALETTE.blue}>
        <GeoFlowMap progress={progress} />
      </Card>
      <Card accent={PALETTE.purple}>
        <Bars values={[88, 81, 76, 68, 54, 49]} colors={[PALETTE.blue, PALETTE.purple, PALETTE.cyan, PALETTE.amber, PALETTE.green, PALETTE.red]} progress={progress} width={430} height={315} />
      </Card>
      <Card accent={PALETTE.cyan} style={{ gridColumn: "1 / 3" }}>
        <Heatmap grid={heat(6, 20, 2.8)} colors={[PALETTE.blue, PALETTE.purple, PALETTE.cyan, PALETTE.amber, PALETTE.green]} progress={progress} />
      </Card>
    </div>
  </Shell>
);

const LogisticsScene: React.FC<SceneProps> = ({ progress }) => (
  <Shell title="Logistics Flow Control Report" accents={[PALETTE.blue, PALETTE.cyan, PALETTE.green]} metrics={metricGroups.logistics} progress={progress} variant="studio">
    <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gridTemplateRows: "318px 152px", gap: 16 }}>
      <Card accent={PALETTE.blue} variant="studio">
        <AreaChart data={[series(51, 86), series(52, 86, 0.36, 0.2), series(53, 86, 0.54, 0.17)]} colors={[PALETTE.blue, PALETTE.cyan, PALETTE.green]} progress={progress} />
      </Card>
      <Card accent={PALETTE.green} variant="studio">
        <SankeyFlow progress={progress} colors={[PALETTE.blue, PALETTE.green, PALETTE.cyan, PALETTE.amber, PALETTE.purple]} />
      </Card>
      <Card accent={PALETTE.cyan} variant="studio" style={{ gridColumn: "1 / 3" }}>
        <Heatmap grid={heat(6, 20, 3.4)} colors={[PALETTE.blue, PALETTE.cyan, PALETTE.green, PALETTE.amber, PALETTE.purple]} progress={progress} />
      </Card>
    </div>
  </Shell>
);

const OverviewScene: React.FC<SceneProps> = ({ progress }) => (
  <Shell title="Multi-Industry Executive Showcase" accents={[PALETTE.blue, PALETTE.purple, PALETTE.cyan]} metrics={metricGroups.finance} progress={progress} variant="screen">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 235px)", gap: 16 }}>
      <Card accent={PALETTE.blue}>
        <AreaChart data={[series(61, 58), series(62, 58, 0.36, 0.18)]} colors={[PALETTE.blue, PALETTE.cyan]} progress={progress} width={380} height={235} />
      </Card>
      <Card accent={PALETTE.green}>
        <Donut values={[38, 24, 20, 18]} colors={[PALETTE.blue, PALETTE.green, PALETTE.purple, PALETTE.amber]} progress={progress} />
      </Card>
      <Card accent={PALETTE.cyan}>
        <GeoFlowMap progress={progress} />
      </Card>
      <Card accent={PALETTE.amber}>
        <Heatmap grid={heat(6, 10, 5.2)} colors={[PALETTE.blue, PALETTE.cyan, PALETTE.green, PALETTE.amber]} progress={progress} />
      </Card>
      <Card accent={PALETTE.purple}>
        <Bars values={[88, 73, 65, 55, 48, 36]} colors={[PALETTE.green, PALETTE.blue, PALETTE.purple, PALETTE.amber, PALETTE.cyan, PALETTE.red]} progress={progress} width={380} height={235} />
      </Card>
      <Card accent={PALETTE.red}>
        <Radar progress={progress} colors={[PALETTE.purple, PALETTE.blue, PALETTE.cyan, PALETTE.amber, PALETTE.green, PALETTE.red]} />
      </Card>
    </div>
  </Shell>
);

const SCENES: SceneSpec[] = [
  {
    title: "Retail Operations Command Center",
    accents: [PALETTE.blue, PALETTE.green, PALETTE.cyan],
    metrics: metricGroups.retail,
    render: RetailScene,
  },
  {
    title: "Global Markets Risk Wall",
    accents: [PALETTE.red, PALETTE.blue, PALETTE.purple],
    metrics: metricGroups.finance,
    render: FinanceScene,
  },
  {
    title: "Smart Energy Network Twin",
    accents: [PALETTE.green, PALETTE.cyan, PALETTE.blue],
    metrics: metricGroups.energy,
    render: EnergyScene,
  },
  {
    title: "Urban Mobility Intelligence Screen",
    accents: [PALETTE.blue, PALETTE.purple, PALETTE.cyan],
    metrics: metricGroups.city,
    render: CityScene,
  },
  {
    title: "Logistics Flow Control Tower",
    accents: [PALETTE.blue, PALETTE.cyan, PALETTE.green],
    metrics: metricGroups.logistics,
    render: LogisticsScene,
  },
  {
    title: "Multi-Industry Executive Wall",
    accents: [PALETTE.blue, PALETTE.purple, PALETTE.cyan],
    metrics: metricGroups.finance,
    render: OverviewScene,
  },
];

const currentSceneIndex = (frame: number) =>
  Math.min(Math.floor(frame / SEGMENT), SCENES.length - 1);

const transitionProgress = (frame: number, index: number) => {
  const local = frame - index * SEGMENT;
  if (index >= SCENES.length - 1 || local < SCENE_HOLD) {
    return 0;
  }
  return interpolate(local, [SCENE_HOLD, SCENE_HOLD + TRANSITION], [0, 1], {
    easing: Easing.bezier(0.45, 0, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const sceneProgress = (frame: number, index: number) => {
  const start = index * SEGMENT;
  const introStart = index === 0 ? 0 : start - TRANSITION * 0.5;
  return interpolate(frame, [introStart, introStart + INTRO], [0, 1], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const SceneLayer: React.FC<{
  scene: SceneSpec;
  frame: number;
  progress: number;
  opacity: number;
  scale: number;
}> = ({ scene, frame, progress, opacity, scale }) => {
  const Scene = scene.render;
  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "50% 50%",
        willChange: "opacity, transform",
      }}
    >
      <Scene frame={frame} progress={progress} />
    </AbsoluteFill>
  );
};

export const ShowcaseComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const index = currentSceneIndex(frame);
  const current = SCENES[index];
  const next = SCENES[Math.min(index + 1, SCENES.length - 1)];
  const transition = transitionProgress(frame, index);
  const currentOpacity = 1 - ease(transition);
  const nextOpacity = ease(transition);
  const currentScale = 1 + transition * 0.012;
  const nextScale = 1.012 - transition * 0.012;

  return (
    <AbsoluteFill style={{ width: WIDTH, height: HEIGHT, backgroundColor: "#03050c" }}>
      <SceneLayer
        scene={current}
        frame={frame}
        progress={sceneProgress(frame, index)}
        opacity={currentOpacity}
        scale={currentScale}
      />
      {transition > 0 ? (
        <SceneLayer
          scene={next}
          frame={frame}
          progress={sceneProgress(frame, index + 1)}
          opacity={nextOpacity}
          scale={nextScale}
        />
      ) : null}
      {transition > 0 ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background: `radial-gradient(760px circle at 50% 50%, rgba(255,255,255,${0.035 * Math.sin(transition * Math.PI)}), transparent 58%)`,
            opacity: 0.8,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const showcaseDuration = SCENES.length * SEGMENT - TRANSITION;
export const showcaseFps = FPS;
