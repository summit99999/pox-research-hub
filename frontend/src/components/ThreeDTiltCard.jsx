import React, { useRef, useState, useEffect } from 'react';

/**
 * ThreeDTiltCard - Premium 3D interactive card with depth and dynamic glare reflection.
 * Smoothly tilts in 3D perspective following mouse movements without lagging.
 */
export default function ThreeDTiltCard({ 
  children, 
  className = '', 
  glowColor = 'teal', // 'teal' | 'indigo' | 'purple' | 'emerald' | 'amber'
  maxTilt = 8,        // Max rotation in degrees
  scale = 1.02,       // Subtle hover scale
  onClick = null
}) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setCoords({
      rotateX: rotateX.toFixed(2),
      rotateY: rotateY.toFixed(2),
      glareX: ((x / rect.width) * 100).toFixed(1),
      glareY: ((y / rect.height) * 100).toFixed(1)
    });
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const glowStyles = {
    teal: 'hover:shadow-[0_15px_35px_-10px_rgba(20,184,166,0.3)] hover:border-teal-500/40',
    indigo: 'hover:shadow-[0_15px_35px_-10px_rgba(99,102,241,0.3)] hover:border-indigo-500/40',
    purple: 'hover:shadow-[0_15px_35px_-10px_rgba(168,85,247,0.3)] hover:border-purple-500/40',
    emerald: 'hover:shadow-[0_15px_35px_-10px_rgba(16,185,129,0.3)] hover:border-emerald-500/40',
    amber: 'hover:shadow-[0_15px_35px_-10px_rgba(245,158,11,0.3)] hover:border-amber-500/40'
  }[glowColor] || 'hover:shadow-2xl';

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full"
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered && !isTouchDevice
            ? `rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease'
        }}
        className={`
          relative overflow-hidden rounded-2xl border transition-all duration-300
          bg-slate-900/90 dark:bg-slate-900/90 light:bg-white
          border-slate-800 dark:border-slate-800/80 light:border-slate-200
          shadow-lg dark:shadow-slate-950/50 light:shadow-slate-200/50
          ${glowStyles}
          ${className}
        `}
      >
        {/* Dynamic Light Sheen Glare Effect */}
        {isHovered && !isTouchDevice && (
          <div
            style={{
              background: `radial-gradient(circle at ${coords.glareX}% ${coords.glareY}%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 65%)`
            }}
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-200"
          />
        )}

        {/* Content */}
        <div className="relative z-0">
          {children}
        </div>
      </div>
    </div>
  );
}
