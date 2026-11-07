import React, { useState } from 'react';

/**
 * ThreeDBarChart - Interactive 3D Isometric Bar Chart for Scientific Literature Analytics.
 * Renders extruded 3D isometric prisms with multi-facet gradient lighting,
 * dynamic perspective tilt, and hover inspections.
 */
export default function ThreeDBarChart({ 
  data = [], 
  height = 260, 
  primaryColor = 'teal', // 'teal' | 'indigo' | 'purple'
  unitLabel = 'Publications' 
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-500 font-mono">
        No chronological publication data available
      </div>
    );
  }

  // Determine scale
  const maxVal = Math.max(...data.map(d => Number(d.papers || d.count || d.total_count || 1)), 10);
  const chartHeight = height - 60; // Leave room for top perspective & bottom labels
  const barWidth = Math.min(32, Math.max(16, Math.floor(480 / (data.length * 1.6))));
  const depthX = 12; // 3D extrusion width on X-axis
  const depthY = 10; // 3D extrusion height on Y-axis (isometric angle)

  const colorThemes = {
    teal: {
      front: 'url(#frontGradTeal)',
      side: 'url(#sideGradTeal)',
      top: '#2dd4bf',
      glow: 'rgba(20, 184, 166, 0.4)'
    },
    indigo: {
      front: 'url(#frontGradIndigo)',
      side: 'url(#sideGradIndigo)',
      top: '#818cf8',
      glow: 'rgba(99, 102, 241, 0.4)'
    },
    purple: {
      front: 'url(#frontGradPurple)',
      side: 'url(#sideGradPurple)',
      top: '#c084fc',
      glow: 'rgba(168, 85, 247, 0.4)'
    }
  }[primaryColor] || {
    front: 'url(#frontGradTeal)',
    side: 'url(#sideGradTeal)',
    top: '#2dd4bf',
    glow: 'rgba(20, 184, 166, 0.4)'
  };

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${Math.max(600, data.length * 56)} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ minHeight: `${height}px` }}
      >
        <defs>
          {/* Teal 3D Gradients */}
          <linearGradient id="frontGradTeal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="sideGradTeal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#115e59" stopOpacity="0.95" />
          </linearGradient>

          {/* Indigo 3D Gradients */}
          <linearGradient id="frontGradIndigo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4338ca" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="sideGradIndigo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0.95" />
          </linearGradient>

          {/* Hover Glow Filter */}
          <filter id="glow3d" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 3D Isometric Base Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - 40 - (pct * chartHeight);
          const val = Math.round(pct * maxVal);
          return (
            <g key={idx} className="opacity-40">
              <line
                x1="30"
                y1={y}
                x2="100%"
                y2={y}
                stroke="#334155"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x="24"
                y={y + 3}
                fill="#64748b"
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="end"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* 3D Prism Columns */}
        {data.map((item, idx) => {
          const val = Number(item.papers || item.count || item.total_count || 0);
          const colHeight = Math.max(8, (val / maxVal) * chartHeight);
          const spacing = Math.max(54, 580 / data.length);
          const x = 50 + (idx * spacing);
          const baseY = height - 40;
          const topY = baseY - colHeight;

          const isHovered = hoveredIndex === idx;

          // 3D Geometry coordinates for isometric extruded prism:
          // Front face: (x, topY) to (x + barWidth, topY) to (x + barWidth, baseY) to (x, baseY)
          // Top cap: (x, topY) to (x + depthX, topY - depthY) to (x + barWidth + depthX, topY - depthY) to (x + barWidth, topY)
          // Right side face: (x + barWidth, topY) to (x + barWidth + depthX, topY - depthY) to (x + barWidth + depthX, baseY - depthY) to (x + barWidth, baseY)

          return (
            <g
              key={idx}
              className="cursor-pointer transition-transform duration-200"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              filter={isHovered ? 'url(#glow3d)' : undefined}
            >
              {/* Shadow Base */}
              <ellipse
                cx={x + barWidth / 2 + depthX / 2}
                cy={baseY + 4}
                rx={barWidth * 0.75}
                ry="4"
                fill="#000000"
                opacity={isHovered ? 0.6 : 0.35}
              />

              {/* 1. Right Side Extrusion Face */}
              <polygon
                points={`
                  ${x + barWidth},${topY}
                  ${x + barWidth + depthX},${topY - depthY}
                  ${x + barWidth + depthX},${baseY - depthY}
                  ${x + barWidth},${baseY}
                `}
                fill={colorThemes.side}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
              />

              {/* 2. Top Cap Isometric Face */}
              <polygon
                points={`
                  ${x},${topY}
                  ${x + depthX},${topY - depthY}
                  ${x + barWidth + depthX},${topY - depthY}
                  ${x + barWidth},${topY}
                `}
                fill={colorThemes.top}
                opacity={isHovered ? 1 : 0.85}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.5"
              />

              {/* 3. Front Face */}
              <rect
                x={x}
                y={topY}
                width={barWidth}
                height={colHeight}
                fill={colorThemes.front}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
                rx="1"
              />

              {/* Value Label above 3D Column */}
              <text
                x={x + barWidth / 2 + depthX / 2}
                y={topY - depthY - 6}
                fill={isHovered ? '#f8fafc' : '#94a3b8'}
                fontSize={isHovered ? "11" : "10"}
                fontWeight={isHovered ? "bold" : "600"}
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
                className="transition-all"
              >
                {val}
              </text>

              {/* Year Label Below Baseline */}
              <text
                x={x + barWidth / 2}
                y={baseY + 18}
                fill={isHovered ? '#38bdf8' : '#64748b'}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fontWeight={isHovered ? "bold" : "normal"}
                textAnchor="middle"
              >
                {item.year || item.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Info Tooltip on Hover */}
      {hoveredIndex !== null && data[hoveredIndex] && (
        <div className="absolute top-2 right-4 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-teal-500/40 text-xs shadow-xl pointer-events-none flex items-center gap-2 backdrop-blur-md animate-in fade-in font-mono">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          <span className="text-slate-300 font-bold">{data[hoveredIndex].year || data[hoveredIndex].label}:</span>
          <span className="text-teal-300 font-bold">{data[hoveredIndex].papers || data[hoveredIndex].count}</span>
          <span className="text-slate-400 text-[10px]">{unitLabel}</span>
        </div>
      )}
    </div>
  );
}
