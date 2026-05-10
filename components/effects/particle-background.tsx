"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix rain characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*(){}[]<>ΛΔΩΨΦ◈▸◇※⌕";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);
    const speeds: number[] = Array(columns).fill(0).map(() => Math.random() * 0.5 + 0.3);

    const animate = () => {
      ctx.fillStyle = "rgba(13, 13, 13, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Glow effect
        ctx.shadowColor = "#00FF00";
        ctx.shadowBlur = 5;

        // Color based on position
        if (drops[i] < 5) {
          ctx.fillStyle = "#FFFFFF"; // Head
        } else if (drops[i] < 10) {
          ctx.fillStyle = "#00FF00"; // Bright green
        } else {
          ctx.fillStyle = `rgba(0, 255, 0, ${Math.max(0.1, 1 - drops[i] / 50)})`; // Fade
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = Math.random() * 0.5 + 0.3;
        }
        drops[i] += speeds[i];
      }

      ctx.shadowBlur = 0;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none opacity-30"
    />
  );
}

export function CyberGrid() {
  return (
    <div className="fixed inset-0 -z-5 pointer-events-none matrix-grid" />
  );
}

export function GlowOrb({
  className,
  color = "green"
}: {
  className?: string;
  color?: "green" | "magenta" | "cyan" | "purple";
}) {
  const colorMap = {
    green: "#00FF00",
    magenta: "#FF00FF",
    cyan: "#00FFFF",
    purple: "#B967FF",
  };

  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] ${className}`}
      style={{ backgroundColor: colorMap[color] }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function HUDLines() {
  return (
    <div className="fixed inset-0 -z-5 pointer-events-none opacity-20">
      {/* Horizontal lines */}
      <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-[var(--neon-green)]" />
      <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-[var(--neon-cyan)]" />
      {/* Vertical lines */}
      <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-[var(--neon-magenta)]" />
      <div className="absolute top-0 bottom-0 right-1/4 w-[1px] bg-[var(--neon-green)]" />
      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-[var(--neon-cyan)]" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-[var(--neon-green)]" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-[var(--neon-magenta)]" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[var(--neon-green)]" />
    </div>
  );
}

export function StatusIndicator({
  status = "active",
  label = "SYSTEM"
}: {
  status?: "active" | "warning" | "error";
  label?: string;
}) {
  const statusConfig = {
    active: { color: "#00FF00", text: "ACTIVE" },
    warning: { color: "#FFB800", text: "WARNING" },
    error: { color: "#FF3333", text: "ERROR" },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      className="flex items-center gap-2 font-mono text-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: config.color }}
        animate={{
          opacity: [1, 0.5, 1],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span style={{ color: config.color }}>{label}.{config.text}</span>
    </motion.div>
  );
}