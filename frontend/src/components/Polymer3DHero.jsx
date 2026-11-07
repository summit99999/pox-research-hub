import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Orbit, Layers, CircleDot } from 'lucide-react';

/**
 * Polymer3DHero - Interactive 3D Macromolecular Visualizer
 * Renders physically grounded polymer topologies (worm-like chain, micelle, bottlebrush, dendrimer, hydrogel mesh)
 * with real-time 3D perspective projection, orbital rotation, and specular sphere shading.
 */
export default function Polymer3DHero({ className = '', height = 360 }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [topologyMode, setTopologyMode] = useState('chain'); // 'chain' | 'micelle' | 'bottlebrush' | 'dendrimer' | 'network'
  const [rotationSpeed, setRotationSpeed] = useState(0.008);
  const animFrameId = useRef(null);

  // Interaction tracking
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const angles = useRef({ rotX: 0.25, rotY: 0.45 });

  const TOPOLOGY_MODES = [
    { id: 'chain', label: 'Polymer Chain', desc: 'Worm-like chain & persistence length' },
    { id: 'micelle', label: 'Core-Shell Micelle', desc: 'Amphiphilic block copolymer self-assembly' },
    { id: 'bottlebrush', label: 'Bottlebrush', desc: 'Dense macromonomer steric extension' },
    { id: 'dendrimer', label: 'Dendrimer G-3', desc: 'Multivalent hyperbranched tree' },
    { id: 'network', label: 'Hydrogel Network', desc: 'Tetrafunctional crosslinked network' }
  ];

  // Generate 3D nodes & bonds based on active macromolecular topology
  const generateTopologyData = (mode) => {
    const nodes = [];
    const bonds = [];

    if (mode === 'chain') {
      // Worm-like flexible polymer chain with 48 beads
      const numBeads = 48;
      let x = -130, y = 0, z = 0;
      let theta = 0;
      for (let i = 0; i < numBeads; i++) {
        // Pseudo-random walk with helical persistence
        const progress = i / numBeads;
        theta += 0.45;
        x = -130 + progress * 260 + Math.sin(theta * 1.5) * 22;
        y = Math.cos(theta * 1.2) * 55 + Math.sin(i * 0.3) * 25;
        z = Math.sin(theta * 1.8) * 60;
        
        // Alternating monomer types (e.g. Block copolymer or repeating heteroatoms C, N, O)
        const isHetero = i % 3 === 0;
        nodes.push({
          x, y, z,
          radius: isHetero ? 6.5 : 5,
          color: isHetero ? '#8b5cf6' : (i % 2 === 0 ? '#06b6d4' : '#10b981'),
          type: isHetero ? 'Heteroatom (N/O)' : 'Carbon Backbone'
        });
        if (i > 0) {
          bonds.push([i - 1, i, '#64748b']);
        }
      }
    } else if (mode === 'micelle') {
      // Core-Shell Polymeric Micelle: Dense hydrophobic core (amber/red) + Corona coils (teal/cyan)
      const coreCount = 28;
      for (let i = 0; i < coreCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / coreCount);
        const theta = Math.sqrt(coreCount * Math.PI) * phi;
        const r = 24 + Math.sin(i * 1.7) * 8;
        nodes.push({
          x: r * Math.cos(theta) * Math.sin(phi),
          y: r * Math.sin(theta) * Math.sin(phi),
          z: r * Math.cos(phi),
          radius: 5,
          color: '#f97316',
          type: 'Hydrophobic Core'
        });
      }
      // Hydrophilic Corona hair brushes radiating outward
      const coronaArms = 14;
      const armLength = 5;
      let nodeIdx = coreCount;
      for (let a = 0; a < coronaArms; a++) {
        const baseCoreIdx = a * 2;
        let prevIdx = baseCoreIdx;
        const phi = Math.acos(-1 + (2 * a) / coronaArms);
        const theta = Math.sqrt(coronaArms * Math.PI) * phi;
        const dirX = Math.cos(theta) * Math.sin(phi);
        const dirY = Math.sin(theta) * Math.sin(phi);
        const dirZ = Math.cos(phi);

        for (let seg = 1; seg <= armLength; seg++) {
          const dist = 32 + seg * 18;
          const wobble = Math.sin(seg * 1.5 + a) * 10;
          nodes.push({
            x: dirX * dist + wobble,
            y: dirY * dist + Math.cos(seg * 1.5) * 8,
            z: dirZ * dist,
            radius: 4,
            color: '#14b8a6',
            type: 'Hydrophilic Corona'
          });
          bonds.push([prevIdx, nodeIdx, '#38bdf8']);
          prevIdx = nodeIdx;
          nodeIdx++;
        }
      }
    } else if (mode === 'bottlebrush') {
      // Bottlebrush Polymer: Rigid extended central backbone with dense radial sidechain bristles
      const backboneNodes = 18;
      let nodeIdx = 0;
      const backboneIndices = [];
      for (let b = 0; b < backboneNodes; b++) {
        const x = -130 + (b / (backboneNodes - 1)) * 260;
        const y = Math.sin(b * 0.4) * 15;
        const z = Math.cos(b * 0.4) * 15;
        nodes.push({
          x, y, z,
          radius: 6,
          color: '#ec4899',
          type: 'Rigid Backbone'
        });
        backboneIndices.push(nodeIdx);
        if (b > 0) {
          bonds.push([nodeIdx - 1, nodeIdx, '#f43f5e']);
        }
        nodeIdx++;
      }
      // Dense side bristles grafted from each backbone bead
      backboneIndices.forEach((bbIdx, bStep) => {
        const numBristles = 4;
        for (let br = 0; br < numBristles; br++) {
          const angle = (br / numBristles) * Math.PI * 2 + bStep * 0.5;
          let prev = bbIdx;
          for (let seg = 1; seg <= 3; seg++) {
            const rad = seg * 18;
            nodes.push({
              x: nodes[bbIdx].x + Math.sin(bStep + seg) * 4,
              y: nodes[bbIdx].y + Math.cos(angle) * rad,
              z: nodes[bbIdx].z + Math.sin(angle) * rad,
              radius: 3.5,
              color: '#a855f7',
              type: 'Grafted Sidechain'
            });
            bonds.push([prev, nodeIdx, '#c084fc']);
            prev = nodeIdx;
            nodeIdx++;
          }
        }
      });
    } else if (mode === 'dendrimer') {
      // Dendrimer Generation 3: Central core dividing symmetrically
      let nodeIdx = 0;
      nodes.push({ x: 0, y: 0, z: 0, radius: 8, color: '#f59e0b', type: 'Dendrimer Core' });
      nodeIdx++; // 0

      // G1: 3 branches
      const g1Indices = [];
      const g1Dist = 38;
      const g1Angles = [
        [0, 1, 0],
        [Math.cos(Math.PI * 7/6), Math.sin(Math.PI * 7/6), 0.5],
        [Math.cos(Math.PI * 11/6), Math.sin(Math.PI * 11/6), -0.5]
      ];
      g1Angles.forEach(v => {
        nodes.push({
          x: v[0] * g1Dist,
          y: v[1] * g1Dist,
          z: v[2] * g1Dist,
          radius: 6,
          color: '#8b5cf6',
          type: 'G-1 Branch'
        });
        bonds.push([0, nodeIdx, '#a78bfa']);
        g1Indices.push(nodeIdx);
        nodeIdx++;
      });

      // G2: 2 branches per G1 = 6 nodes
      const g2Indices = [];
      const g2Dist = 72;
      g1Indices.forEach((g1Idx, i) => {
        for (let b = -1; b <= 1; b += 2) {
          const baseNode = nodes[g1Idx];
          const norm = Math.hypot(baseNode.x, baseNode.y, baseNode.z) || 1;
          const nx = baseNode.x / norm;
          const ny = baseNode.y / norm;
          const nz = baseNode.z / norm;
          nodes.push({
            x: nx * g2Dist + b * 22,
            y: ny * g2Dist + b * 18,
            z: nz * g2Dist + (i % 2 === 0 ? 25 : -25),
            radius: 5,
            color: '#06b6d4',
            type: 'G-2 Branch'
          });
          bonds.push([g1Idx, nodeIdx, '#67e8f9']);
          g2Indices.push(nodeIdx);
          nodeIdx++;
        }
      });

      // G3: Multivalent peripheral surface groups (12 nodes)
      const g3Dist = 110;
      g2Indices.forEach((g2Idx, i) => {
        for (let b = -1; b <= 1; b += 2) {
          const baseNode = nodes[g2Idx];
          const norm = Math.hypot(baseNode.x, baseNode.y, baseNode.z) || 1;
          nodes.push({
            x: (baseNode.x / norm) * g3Dist + b * 15,
            y: (baseNode.y / norm) * g3Dist + b * 12,
            z: (baseNode.z / norm) * g3Dist + (i % 2 === 0 ? 18 : -18),
            radius: 4.5,
            color: '#10b981',
            type: 'G-3 Surface Multivalent Group'
          });
          bonds.push([g2Idx, nodeIdx, '#34d399']);
          nodeIdx++;
        }
      });
    } else if (mode === 'network') {
      // 3D Hydrogel Network: Crosslinked tetrafunctional lattice with solvent permeability
      const step = 65;
      const grid = 3;
      let nodeIdx = 0;
      const gridMap = {};

      for (let ix = -1; ix <= 1; ix++) {
        for (let iy = -1; iy <= 1; iy++) {
          for (let iz = -1; iz <= 1; iz++) {
            // Displace slightly for organic elasticity
            const jx = Math.sin(ix * 2 + iy) * 12;
            const jy = Math.cos(iy * 2 + iz) * 12;
            const jz = Math.sin(iz * 2 + ix) * 12;
            nodes.push({
              x: ix * step + jx,
              y: iy * step + jy,
              z: iz * step + jz,
              radius: 6,
              color: '#38bdf8',
              type: 'Crosslinking Junction'
            });
            gridMap[`${ix},${iy},${iz}`] = nodeIdx;
            nodeIdx++;
          }
        }
      }
      // Connect adjacent lattice junctions
      for (let ix = -1; ix <= 1; ix++) {
        for (let iy = -1; iy <= 1; iy++) {
          for (let iz = -1; iz <= 1; iz++) {
            const curr = gridMap[`${ix},${iy},${iz}`];
            if (ix < 1) bonds.push([curr, gridMap[`${ix + 1},${iy},${iz}`], '#0284c7']);
            if (iy < 1) bonds.push([curr, gridMap[`${ix},${iy + 1},${iz}`], '#0284c7']);
            if (iz < 1) bonds.push([curr, gridMap[`${ix},${iy},${iz + 1}`], '#0284c7']);
          }
        }
      }
    }

    return { nodes, bonds };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let heightPx = (canvas.height = height);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      heightPx = canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const { nodes, bonds } = generateTopologyData(topologyMode);

    const render = () => {
      if (isPlaying) {
        angles.current.rotY += rotationSpeed;
        angles.current.rotX += rotationSpeed * 0.35;
      }

      ctx.clearRect(0, 0, width, heightPx);

      const cx = width / 2;
      const cy = heightPx / 2;
      const fov = 380;

      const cosY = Math.cos(angles.current.rotY);
      const sinY = Math.sin(angles.current.rotY);
      const cosX = Math.cos(angles.current.rotX);
      const sinX = Math.sin(angles.current.rotX);

      // Project all 3D points to 2D screen coordinates
      const projected = nodes.map(n => {
        // Rotate around Y
        const x1 = n.x * cosY + n.z * sinY;
        const z1 = -n.x * sinY + n.z * cosY;
        // Rotate around X
        const y2 = n.y * cosX - z1 * sinX;
        const z2 = n.y * sinX + z1 * cosX;

        // Perspective scale
        const scale = fov / (fov + z2 + 180);
        return {
          sx: cx + x1 * scale,
          sy: cy + y2 * scale,
          z: z2,
          scale,
          color: n.color,
          radius: Math.max(1.8, n.radius * scale)
        };
      });

      // Draw Bonds first with depth-based opacity
      bonds.forEach(([i, j, bondColor]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) return;

        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.12, Math.min(0.85, (avgZ + 150) / 300));

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.strokeStyle = bondColor || '#475569';
        ctx.globalAlpha = alpha * 0.75;
        ctx.lineWidth = Math.max(1, 2.2 * ((p1.scale + p2.scale) / 2));
        ctx.stroke();
      });

      // Sort nodes by Z-depth (back-to-front rendering for proper occlusion)
      const sortedIndices = projected
        .map((p, idx) => ({ ...p, origIdx: idx }))
        .sort((a, b) => a.z - b.z);

      // Render 3D shaded spheres
      sortedIndices.forEach(p => {
        const alpha = Math.max(0.2, Math.min(1.0, (p.z + 180) / 320));
        ctx.globalAlpha = alpha;

        // Specular 3D ball gradient
        const grad = ctx.createRadialGradient(
          p.sx - p.radius * 0.35,
          p.sy - p.radius * 0.35,
          p.radius * 0.1,
          p.sx,
          p.sy,
          p.radius
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, p.color);
        grad.addColorStop(1, '#090d16');

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Subtle glow halo for primary nodes
        if (p.radius > 4.5) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, p.radius * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.15;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;
      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [topologyMode, isPlaying, rotationSpeed]);

  // Mouse / Touch Interaction for Manual 3D Orbiting
  const handleMouseDown = (e) => {
    isDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;
    angles.current.rotY += deltaX * 0.008;
    angles.current.rotX += deltaY * 0.008;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800/90 shadow-2xl ${className}`}>
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-indigo-500/10 blur-[90px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[240px] h-[240px] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating Topology Selector Pills */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-lg pointer-events-auto">
          {TOPOLOGY_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setTopologyMode(mode.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                topologyMode === mode.id
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Play/Pause & Reset Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <button
            onClick={() => setIsPlaying(p => !p)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title={isPlaying ? 'Pause 3D Orbit' : 'Resume 3D Orbit'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={() => {
              angles.current = { rotX: 0.25, rotY: 0.45 };
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Reset Perspective"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Information Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
          <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Interactive 3D Macromolecule: Click & Drag to Orbit</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800/80 text-[11px] text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{TOPOLOGY_MODES.find(m => m.id === topologyMode)?.desc}</span>
        </div>
      </div>
    </div>
  );
}
