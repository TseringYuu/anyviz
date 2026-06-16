import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp, ease, type Block, type Candle, type FlowCurve, type NetworkNode, type SparkCard, PALETTE } from "./showcase-data";

type SceneShellProps = {
  accentA: string;
  accentB: string;
  accentC: string;
  children: React.ReactNode;
};

type PanelProps = {
  accent: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

type MetricRowProps = {
  cards: SparkCard[];
  frame: number;
  progress: number;
  columns?: number;
};

type SparklineProps = {
  data: number[];
  accent: string;
  frame: number;
  progress: number;
  width?: number;
  height?: number;
};

type AreaPanelProps = {
  series: number[][];
  frame: number;
  progress: number;
  width?: number;
  height?: number;
  accents: string[];
};

type DonutPanelProps = {
  ratios: number[];
  frame: number;
  progress: number;
  width?: number;
  height?: number;
  accents: string[];
};

type BarsPanelProps = {
  values: number[];
  frame: number;
  progress: number;
  width?: number;
  height?: number;
  accents: string[];
};

type HeatmapPanelProps = {
  grid: number[][];
  frame: number;
  progress: number;
  width?: number;
  height?: number;
  accents: string[];
};

type FlowPanelProps = {
  flows: FlowCurve[];
  frame: number;
  progress: number;
  width?: number;
  height?: number;
  accents: string[];
};

type NetworkPanelProps = {
  nodes: NetworkNode[];
  edges: Array<[number, number, number]>;
  frame: number;
  progress: number;
  width?: number;
  height?: number;
  accents: string[];
};

type RadarPanelProps = {
  values: number[];
  frame: number;
  progress: number;
  width?: number;
  height?: number;
  accents: string[];
};

type GaugePanelProps = {
  values: number[];
  frame: number;
  progress: number;
  width?: number;
  height?: number;
  accents: string[];
};

type TreemapPanelProps = {
  blocks: Block[];
  frame: number;
  progress: number;
  width?: number;
  height?: number;
  accents: string[];
};

type CandlePanelProps = {
  candles: Candle[];
  frame: number;
  progress: number;
  width?: number;
  height?: number;
  accents: string[];
};

const FONT = "'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif";
const MONO = "'Menlo', 'Monaco', 'Courier New', monospace";
type Point = [number, number];

const rgba = (hex: string, alpha: number) => {
  const clean = hex.replace("#", "");
  const value = clean.length === 3
    ? clean.split("").map((ch) => ch + ch).join("")
    : clean;
  const parts = value.match(/.{1,2}/g);
  if (!parts || parts.length !== 3) {
    return `rgba(255,255,255,${alpha})`;
  }
  const [r, g, b] = parts.map((part) => Number.parseInt(part, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const line = (points: Point[]) =>
  points.map((point, index) => `${index === 0 ? "M" : "L"}${point[0].toFixed(2)} ${point[1].toFixed(2)}`).join(" ");

const toPoints = (data: number[], width: number, height: number, paddingX = 0, paddingY = 0) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  return data.map((value, index) => {
    const t = data.length === 1 ? 0 : index / (data.length - 1);
    const x = paddingX + t * (width - paddingX * 2);
    const y = paddingY + (1 - (value - min) / span) * (height - paddingY * 2);
    return [x, y] as Point;
  });
};

const lengthOfPolyline = (points: Point[]) => {
  let length = 0;
  for (let index = 1; index < points.length; index += 1) {
    const dx = points[index][0] - points[index - 1][0];
    const dy = points[index][1] - points[index - 1][1];
    length += Math.hypot(dx, dy);
  }
  return length;
};

const pointOnPolyline = (points: Point[], t: number) => {
  if (points.length === 0) {
    return [0, 0] as Point;
  }
  if (points.length === 1) {
    return points[0];
  }
  const total = lengthOfPolyline(points) || 1;
  const target = clamp(t, 0, 1) * total;
  let running = 0;
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const segment = Math.hypot(end[0] - start[0], end[1] - start[1]);
    if (running + segment >= target) {
      const local = (target - running) / (segment || 1);
      return [
        start[0] + (end[0] - start[0]) * local,
        start[1] + (end[1] - start[1]) * local,
      ] as Point;
    }
    running += segment;
  }
  return points[points.length - 1];
};

const sampleQuadratic = (
  p0: Point,
  p1: Point,
  p2: Point,
  steps = 36,
) => {
  const points: Point[] = [];
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    const a = (1 - t) * (1 - t);
    const b = 2 * (1 - t) * t;
    const c = t * t;
    points.push([
      a * p0[0] + b * p1[0] + c * p2[0],
      a * p0[1] + b * p1[1] + c * p2[1],
    ] as Point);
  }
  return points;
};

const describeArc = (cx: number, cy: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start[0].toFixed(2)} ${start[1].toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end[0].toFixed(2)} ${end[1].toFixed(2)}`;
};

const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
  const radians = ((angleInDegrees - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)] as const;
};

const valueColor = (value: string) => (value.trim().startsWith("-") ? PALETTE.red : PALETTE.green);

export const SceneShell: React.FC<SceneShellProps> = ({ accentA, accentB, accentC, children }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#03050C",
        backgroundImage: [
          `radial-gradient(900px circle at 16% 18%, ${rgba(accentA, 0.18)} 0%, transparent 40%)`,
          `radial-gradient(700px circle at 82% 78%, ${rgba(accentB, 0.14)} 0%, transparent 38%)`,
          `radial-gradient(540px circle at 52% 44%, ${rgba(accentC, 0.10)} 0%, transparent 44%)`,
          "linear-gradient(180deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "auto, auto, auto, 76px 76px, 76px 76px",
        overflow: "hidden",
        color: "#F8FAFC",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.00) 34%, rgba(255,255,255,0.03) 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 26,
          left: 26,
          right: 26,
          height: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1.5,
            background: "linear-gradient(90deg, #F8FAFC 0%, #6cc5b0 55%, #4269d0 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textTransform: "uppercase",
          }}
        >
          anyviz
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#7AE0B8",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#3ca951",
              boxShadow: "0 0 14px rgba(60, 169, 81, 0.95)",
            }}
          />
          LIVE
        </div>
      </div>
      {children}
    </AbsoluteFill>
  );
};

export const Panel: React.FC<PanelProps> = ({ accent, style, children }) => {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        background: "linear-gradient(135deg, rgba(11,15,26,0.97) 0%, rgba(255,255,255,0.03) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 18px 34px rgba(0, 0, 0, 0.34)",
        minHeight: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: 18,
          background: `linear-gradient(90deg, ${rgba(accent, 0.33)} 0%, ${rgba(accent, 0.06)} 100%)`,
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.00) 24%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};

export const MetricRow: React.FC<MetricRowProps> = ({ cards, frame, progress, columns = 5 }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: 16,
      }}
    >
      {cards.map((card, index) => (
        <div
          key={`${card.value}-${index}`}
          style={{
            minHeight: 108,
            borderRadius: 24,
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(11,15,26,0.97) 0%, rgba(255,255,255,0.025) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 14px 28px rgba(0, 0, 0, 0.30)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 16,
            transform: `translateY(${(1 - progress) * 6}px)`,
            opacity: 0.9 + progress * 0.1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: card.accent,
                boxShadow: `0 0 16px ${rgba(card.accent, 0.9)}`,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.25)",
                fontFamily: MONO,
                letterSpacing: 1,
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: -1.2,
              fontFamily: MONO,
            }}
          >
            {card.value}
          </div>
          <div
            style={{
              fontSize: 13,
              color: valueColor(card.delta),
              fontWeight: 700,
              fontFamily: MONO,
            }}
          >
            {card.delta}
          </div>
          <div style={{ height: 26 }}>
            <Sparkline data={card.spark} accent={card.accent} frame={frame} progress={progress} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  accent,
  frame,
  progress,
  width = 220,
  height = 26,
}) => {
  const points = toPoints(data, width, height, 4, 4);
  const d = line(points);
  const length = lengthOfPolyline(points);
  const dotIndex = Math.floor(((frame * 0.02) % 1) * (points.length - 1));
  const dot = pointOnPolyline(points, ((frame * 0.02) % 1) * 0.92 + 0.04);
  const reveal = ease(clamp(progress * 1.2, 0, 1));
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path
        d={`${d} L ${width - 4} ${height - 4} L 4 ${height - 4} Z`}
        fill={rgba(accent, 0.10)}
        opacity={0.7}
      />
      <path
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${length} ${length}`}
        strokeDashoffset={length * (1 - reveal)}
      />
      <circle cx={dot[0]} cy={dot[1]} r={3.5 + 0.8 * Math.sin(frame * 0.08 + dotIndex)} fill={accent} />
      <circle
        cx={dot[0]}
        cy={dot[1]}
        r={7.5}
        fill="none"
        stroke={rgba(accent, 0.18)}
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const AreaPanel: React.FC<AreaPanelProps> = ({
  series,
  frame,
  progress,
  width = 660,
  height = 280,
  accents,
}) => {
  const viewBox = `0 0 ${width} ${height}`;
  const xPadding = 22;
  const yPadding = 22;
  const points = series.map((lineData) => toPoints(lineData, width, height, xPadding, yPadding));
  const reveal = ease(clamp(progress * 1.15, 0, 1));
  const sweep = ((frame * 0.75) % 1) * (width - 60) + 30;

  return (
    <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="none">
      <defs>
        <linearGradient id="area-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <g opacity={0.3}>
        {Array.from({ length: 6 }, (_, index) => (
          <line
            key={`grid-y-${index}`}
            x1={xPadding}
            x2={width - xPadding}
            y1={yPadding + (index * (height - yPadding * 2)) / 5}
            y2={yPadding + (index * (height - yPadding * 2)) / 5}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: 8 }, (_, index) => (
          <line
            key={`grid-x-${index}`}
            y1={yPadding}
            y2={height - yPadding}
            x1={xPadding + (index * (width - xPadding * 2)) / 7}
            x2={xPadding + (index * (width - xPadding * 2)) / 7}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
      </g>
      {points.map((linePoints, index) => {
        const poly = line(linePoints);
        const length = lengthOfPolyline(linePoints);
        const fillPoints = [
          ...linePoints,
          [width - xPadding, height - yPadding],
          [xPadding, height - yPadding],
        ] as Array<[number, number]>;
        return (
          <g key={`area-${index}`}>
            <polygon
              points={fillPoints.map((point) => `${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ")}
              fill={rgba(accents[index % accents.length], 0.10 - index * 0.015)}
            />
            <path
              d={poly}
              fill="none"
              stroke={accents[index % accents.length]}
              strokeWidth={3.2 - index * 0.1}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${length} ${length}`}
              strokeDashoffset={length * (1 - reveal)}
            />
            {linePoints.map((point, pointIndex) => {
              const t = progress * 0.9 + pointIndex * 0.02;
              const pulse = 0.5 + 0.5 * Math.sin(frame * 0.08 + pointIndex + index);
              return (
                <g key={`${index}-${pointIndex}`}>
                  <circle
                    cx={point[0]}
                    cy={point[1]}
                    r={2.8 + (pointIndex % 5 === 0 ? 1.1 : 0)}
                    fill={accents[index % accents.length]}
                    opacity={0.95}
                  />
                  {pointIndex % 13 === 0 ? (
                    <circle
                      cx={point[0]}
                      cy={point[1]}
                      r={7.5 + pulse * 2}
                      fill="none"
                      stroke={rgba(accents[index % accents.length], 0.18 + t * 0.05)}
                      strokeWidth={1.5}
                    />
                  ) : null}
                </g>
              );
            })}
          </g>
        );
      })}
      <rect x={sweep - 10} y={yPadding} width={20} height={height - yPadding * 2} rx={10} fill="url(#area-sweep)" opacity={0.8} />
    </svg>
  );
};

export const DonutPanel: React.FC<DonutPanelProps> = ({
  ratios,
  frame,
  progress,
  width = 280,
  height = 280,
  accents,
}) => {
  const radius = Math.min(width, height) * 0.27;
  const cx = width / 2;
  const cy = height / 2;
  const total = ratios.reduce((sum, value) => sum + value, 0) || 1;
  const reveal = ease(clamp(progress * 1.15, 0, 1));
  const breathe = 1 + 0.014 * Math.sin(frame * 0.05);
  const circumference = 2 * Math.PI * radius;
  let cursor = 0;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="donut-sweep" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <g transform={`translate(${cx}, ${cy}) scale(${breathe})`}>
        <circle cx={0} cy={0} r={radius + 28} fill="rgba(255,255,255,0.02)" />
        {ratios.map((ratio, index) => {
          const strokeWidth = 24;
          const segment = (ratio / total) * circumference * reveal;
          const offset = (circumference * cursor) / 360;
          cursor += (ratio / total) * 360 + 5;
          return (
            <circle
              key={`donut-${index}`}
              cx={0}
              cy={0}
              r={radius}
              fill="none"
              stroke={accents[index % accents.length]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${Math.max(8, segment)} ${circumference}`}
              strokeDashoffset={-offset}
              transform="rotate(-90)"
              opacity={0.94}
            />
          );
        })}
        <circle cx={0} cy={0} r={radius * 0.48} fill="#0b0f1a" />
        <circle cx={0} cy={0} r={radius * 0.22} fill={accents[0]} opacity={0.9} />
      </g>
    </svg>
  );
};

export const BarsPanel: React.FC<BarsPanelProps> = ({
  values,
  frame,
  progress,
  width = 240,
  height = 280,
  accents,
}) => {
  const max = Math.max(...values) * 1.08;
  const gap = 10;
  const barHeight = (height - 34 - gap * (values.length - 1)) / values.length;
  const reveal = ease(clamp(progress * 1.1, 0, 1));
  const sweep = ((frame * 0.84) % 1) * (width - 30) + 15;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {values.map((value, index) => {
        const widthPx = ((width - 36) * value) / max;
        const top = 20 + index * (barHeight + gap);
        const color = accents[index % accents.length];
        return (
          <g key={`bar-${index}`}>
            <rect x={18} y={top} width={width - 36} height={barHeight} rx={barHeight / 2} fill="rgba(255,255,255,0.04)" />
            <rect
              x={18}
              y={top}
              width={Math.max(8, widthPx * reveal)}
              height={barHeight}
              rx={barHeight / 2}
              fill={color}
            />
            <circle
              cx={18 + Math.max(8, widthPx * reveal) * (0.68 + 0.06 * Math.sin(frame * 0.06 + index))}
              cy={top + barHeight / 2}
              r={3.6}
              fill="#F8FAFC"
              opacity={0.9}
            />
          </g>
        );
      })}
      <rect x={sweep - 8} y={16} width={16} height={height - 32} rx={8} fill="rgba(255,255,255,0.08)" opacity={0.55} />
    </svg>
  );
};

export const HeatmapPanel: React.FC<HeatmapPanelProps> = ({
  grid,
  frame,
  progress,
  width = 1160,
  height = 180,
  accents,
}) => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const gap = 5;
  const cellWidth = (width - 32 - gap * (cols - 1)) / cols;
  const cellHeight = (height - 26 - gap * (rows - 1)) / rows;
  const reveal = ease(clamp(progress * 1.08, 0, 1));
  const sweep = ((frame * 0.63) % 1) * (width - 40) + 20;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {grid.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const paletteIndex = Math.min(accents.length - 1, Math.floor(value * (accents.length - 1)));
          const color = accents[paletteIndex];
          const x = 16 + colIndex * (cellWidth + gap);
          const y = 13 + rowIndex * (cellHeight + gap);
          return (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={x}
              y={y}
              width={cellWidth}
              height={cellHeight}
              rx={6}
              fill={rgba(color, 0.18 + value * 0.48 * reveal)}
              stroke={rgba(color, 0.1)}
              strokeWidth={1}
            />
          );
        }),
      )}
      <rect x={sweep - 9} y={10} width={18} height={height - 20} rx={9} fill="rgba(255,255,255,0.07)" opacity={0.55} />
    </svg>
  );
};

export const FlowPanel: React.FC<FlowPanelProps> = ({
  flows,
  frame,
  progress,
  width = 1160,
  height = 190,
  accents,
}) => {
  const reveal = ease(clamp(progress * 1.15, 0, 1));
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {flows.map((flow, index) => {
        const sampled = sampleQuadratic(flow[0], flow[1], flow[2], 40);
        const path = line(sampled);
        const total = lengthOfPolyline(sampled);
        const t = (frame * 0.018 + index * 0.13) % 1;
        const dot = pointOnPolyline(sampled, t);
        const color = accents[index % accents.length];
        return (
          <g key={`flow-${index}`}>
            <path d={path} fill="none" stroke={rgba(color, 0.12)} strokeWidth={12 - index} strokeLinecap="round" />
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`${total} ${total}`}
              strokeDashoffset={total * (1 - reveal)}
            />
            <circle cx={dot[0]} cy={dot[1]} r={5.5} fill={color} />
            <circle cx={dot[0]} cy={dot[1]} r={13} fill="none" stroke={rgba(color, 0.15)} strokeWidth={2} />
          </g>
        );
      })}
    </svg>
  );
};

export const NetworkPanel: React.FC<NetworkPanelProps> = ({
  nodes,
  edges,
  frame,
  progress,
  width = 730,
  height = 378,
  accents,
}) => {
  const reveal = ease(clamp(progress * 1.15, 0, 1));
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {edges.map((edge, index) => {
        const a = nodes[edge[0]];
        const b = nodes[edge[1]];
        const c = nodes[edge[2]];
        const sampled = sampleQuadratic([a.x, a.y], [b.x, b.y], [c.x, c.y], 30);
        const path = line(sampled);
        const total = lengthOfPolyline(sampled);
        const color = accents[index % accents.length];
        const dot = pointOnPolyline(sampled, (frame * 0.016 + index * 0.11) % 1);
        return (
          <g key={`edge-${index}`}>
            <path d={path} fill="none" stroke={rgba(color, 0.10)} strokeWidth={9} strokeLinecap="round" />
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={`${total} ${total}`}
              strokeDashoffset={total * (1 - reveal)}
            />
            <circle cx={dot[0]} cy={dot[1]} r={4.5} fill="#F8FAFC" opacity={0.9} />
          </g>
        );
      })}
      {nodes.map((node, index) => {
        const color = node.accent || accents[index % accents.length];
        const pulse = 1 + 0.06 * Math.sin(frame * 0.05 + index);
        return (
          <g key={`node-${index}`}>
            <circle cx={node.x} cy={node.y} r={node.r * 2.1} fill={rgba(color, 0.12)} />
            <circle cx={node.x} cy={node.y} r={node.r * 1.2 * pulse} fill={color} opacity={0.95} />
            <circle cx={node.x} cy={node.y} r={node.r * 1.6 * pulse} fill="none" stroke={rgba(color, 0.2)} strokeWidth={2} />
          </g>
        );
      })}
    </svg>
  );
};

export const RadarPanel: React.FC<RadarPanelProps> = ({
  values,
  frame,
  progress,
  width = 360,
  height = 150,
  accents,
}) => {
  const cx = width / 2;
  const cy = height / 2 + 2;
  const radius = Math.min(width, height) * 0.34;
  const reveal = ease(clamp(progress * 1.05, 0, 1));
  const angleStep = (Math.PI * 2) / values.length;
  const angles = values.map((_, index) => -Math.PI / 2 + index * angleStep);
  const points = values.map((value, index) => {
    const pulsed = value * (1 + 0.04 * Math.sin(frame * 0.05 + index));
    const rr = radius * (0.26 + 0.72 * pulsed * reveal);
    return [cx + Math.cos(angles[index]) * rr, cy + Math.sin(angles[index]) * rr] as const;
  });
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {Array.from({ length: 5 }, (_, ringIndex) => {
        const ringRadius = radius * ((ringIndex + 1) / 5);
        return <circle key={`ring-${ringIndex}`} cx={cx} cy={cy} r={ringRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />;
      })}
      {angles.map((angle, index) => {
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        return <line key={`axis-${index}`} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />;
      })}
      <polygon points={points.map((point) => `${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ")} fill={rgba(accents[0], 0.18)} stroke={accents[1]} strokeWidth={3} />
      {points.map((point, index) => (
        <g key={`radar-${index}`}>
          <circle cx={point[0]} cy={point[1]} r={4.4} fill={accents[index % accents.length]} />
          <circle cx={point[0]} cy={point[1]} r={10.5} fill="none" stroke={rgba(accents[index % accents.length], 0.18)} strokeWidth={1.5} />
        </g>
      ))}
      <circle cx={cx} cy={cy} r={6} fill={accents[0]} />
    </svg>
  );
};

export const GaugePanel: React.FC<GaugePanelProps> = ({
  values,
  frame,
  progress,
  width = 460,
  height = 156,
  accents,
}) => {
  const baseWidth = width / values.length;
  const arcStart = 200;
  const arcEnd = 340;
  const reveal = ease(clamp(progress * 1.1, 0, 1));
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {values.map((value, index) => {
        const cx = baseWidth * (index + 0.5);
        const cy = height * 0.68;
        const pulse = 1 + 0.02 * Math.sin(frame * 0.05 + index);
        const radius = Math.min(baseWidth * 0.42, height * 0.42) * pulse;
        const color = accents[index % accents.length];
        const eased = clamp(value * reveal, 0, 1);
        const endAngle = arcStart + (arcEnd - arcStart) * eased;
        const pointer = polarToCartesian(cx, cy, radius * 0.78, endAngle);
        return (
          <g key={`gauge-${index}`}>
            <path d={describeArc(cx, cy, radius, arcStart, arcEnd)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} />
            <path d={describeArc(cx, cy, radius, arcStart, endAngle)} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" />
            <line x1={cx} y1={cy} x2={pointer[0]} y2={pointer[1]} stroke={color} strokeWidth={3} />
            <circle cx={cx} cy={cy} r={6} fill={color} />
            <circle cx={cx} cy={cy} r={radius + 14} fill="none" stroke={rgba(color, 0.12)} strokeWidth={2} />
          </g>
        );
      })}
    </svg>
  );
};

export const TreemapPanel: React.FC<TreemapPanelProps> = ({
  blocks,
  frame,
  progress,
  width = 782,
  height = 378,
  accents,
}) => {
  const reveal = ease(clamp(progress * 1.1, 0, 1));
  const sweep = ((frame * 0.62) % 1) * (width - 40) + 20;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {blocks.map((block, index) => {
        const color = accents[index % accents.length];
        return (
          <g key={`block-${index}`}>
            <rect
              x={16 + block.x}
              y={14 + block.y}
              width={block.w}
              height={block.h}
              rx={8}
              fill={rgba(color, 0.16 + 0.12 * ((index % 3) / 2))}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
            <rect
              x={18 + block.x}
              y={16 + block.y}
              width={Math.max(8, block.w * reveal)}
              height={16}
              rx={4}
              fill="rgba(255,255,255,0.06)"
            />
          </g>
        );
      })}
      <rect x={sweep - 8} y={12} width={16} height={height - 24} rx={8} fill="rgba(255,255,255,0.07)" opacity={0.55} />
    </svg>
  );
};

export const CandlePanel: React.FC<CandlePanelProps> = ({
  candles,
  frame,
  progress,
  width = 840,
  height = 300,
  accents,
}) => {
  const marginX = 28;
  const marginY = 22;
  const candleWidth = (width - marginX * 2) / candles.length;
  const prices = candles.flatMap((candle) => candle);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const reveal = ease(clamp(progress * 1.1, 0, 1));
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {Array.from({ length: 5 }, (_, index) => (
        <line
          key={`candle-grid-${index}`}
          x1={marginX}
          x2={width - marginX}
          y1={marginY + (index * (height - marginY * 2)) / 4}
          y2={marginY + (index * (height - marginY * 2)) / 4}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
        />
      ))}
      {candles.map(([open, high, low, close], index) => {
        const cx = marginX + index * candleWidth + candleWidth / 2;
        const wickTop = marginY + (1 - (high - min) / span) * (height - marginY * 2);
        const wickBottom = marginY + (1 - (low - min) / span) * (height - marginY * 2);
        const openY = marginY + (1 - (open - min) / span) * (height - marginY * 2);
        const closeY = marginY + (1 - (close - min) / span) * (height - marginY * 2);
        const bodyTop = Math.min(openY, closeY);
        const bodyBottom = Math.max(openY, closeY);
        const color = close >= open ? accents[0] : accents[2];
        const bodyHeight = Math.max(6, (bodyBottom - bodyTop) * reveal);
        const bodyY = bodyBottom - bodyHeight;
        return (
          <g key={`candle-${index}`}>
            <line x1={cx} y1={wickTop} x2={cx} y2={wickBottom} stroke={rgba(color, 0.85)} strokeWidth={2} />
            <rect
              x={cx - candleWidth * 0.18}
              y={bodyY}
              width={candleWidth * 0.36}
              height={bodyHeight}
              rx={4}
              fill={color}
            />
            <circle
              cx={cx + candleWidth * 0.16}
              cy={bodyY + bodyHeight * (0.68 + 0.08 * Math.sin(frame * 0.08 + index))}
              r={3.5}
              fill="#F8FAFC"
            />
          </g>
        );
      })}
    </svg>
  );
};
