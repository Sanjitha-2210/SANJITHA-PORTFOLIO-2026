"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  speedY: number;
  speedX: number;
  swayAmplitude: number;
  swayFrequency: number;
  parallaxFactor: number;
  layer: "far" | "mid" | "foreground";
  hue: "gold" | "emerald" | "amber" | "cream";
}

export default function BokehParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    const PARTICLE_COUNT = 32;

    // Scroll & Mouse reactive states
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    let mouseX = -1000;
    let mouseY = -1000;

    const isDarkMode = () =>
      document.documentElement.classList.contains("dark");

    // Palette generator matching Cream & Forest Green / Gold theme
    const getColor = (hue: Particle["hue"], alpha: number, dark: boolean) => {
      if (dark) {
        switch (hue) {
          case "gold":
            return `rgba(212, 176, 124, ${alpha})`; // Warm light gold
          case "emerald":
            return `rgba(74, 222, 128, ${alpha * 0.9})`; // Soft emerald
          case "amber":
            return `rgba(176, 141, 94, ${alpha * 0.95})`; // Tan / amber
          case "cream":
            return `rgba(237, 232, 220, ${alpha * 0.85})`; // Warm cream ember
        }
      } else {
        switch (hue) {
          case "gold":
            return `rgba(138, 106, 60, ${alpha * 0.95})`; // Rich tan / bronze
          case "emerald":
            return `rgba(30, 107, 66, ${alpha * 0.85})`; // Deep forest green
          case "amber":
            return `rgba(196, 150, 85, ${alpha * 0.9})`; // Amber
          case "cream":
            return `rgba(90, 94, 85, ${alpha * 0.6})`; // Soft earth tone
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const createParticle = (initialY?: number): Particle => {
      const depthRand = Math.random();
      let layer: Particle["layer"] = "mid";
      let radius = 6;
      let parallaxFactor = 0.35;
      let baseAlpha = 0.35;

      if (depthRand < 0.35) {
        // Far background: larger, heavily out-of-focus soft bokeh orbs
        layer = "far";
        radius = Math.random() * 16 + 12; // 12px to 28px
        parallaxFactor = 0.12; // barely moves with scroll
        baseAlpha = Math.random() * 0.18 + 0.12; // soft transparency
      } else if (depthRand < 0.75) {
        // Mid layer: floating embers
        layer = "mid";
        radius = Math.random() * 6 + 4; // 4px to 10px
        parallaxFactor = 0.35;
        baseAlpha = Math.random() * 0.28 + 0.22;
      } else {
        // Foreground: crisp luminous sparks
        layer = "foreground";
        radius = Math.random() * 3 + 1.8; // 1.8px to 4.8px
        parallaxFactor = 0.65; // moves noticeably with scroll
        baseAlpha = Math.random() * 0.35 + 0.35;
      }

      const hues: Particle["hue"][] = ["gold", "amber", "emerald", "cream"];
      const hue = hues[Math.floor(Math.random() * hues.length)];
      const x = Math.random() * width;

      return {
        x,
        y: initialY !== undefined ? initialY : Math.random() * height,
        originX: x,
        radius,
        baseAlpha,
        alpha: baseAlpha,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        speedY: Math.random() * 0.28 + 0.12, // gentle upward drift
        speedX: (Math.random() - 0.5) * 0.2,
        swayAmplitude: Math.random() * 25 + 10,
        swayFrequency: Math.random() * 0.008 + 0.004,
        parallaxFactor,
        layer,
        hue,
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    };

    resize();
    initParticles();

    // Scroll tracking
    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    // Mouse tracking for gentle ambient air displacement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 1;

      // Smooth scroll interpolation (lerp)
      const scrollDiff = targetScrollY - scrollY;
      scrollY += scrollDiff * 0.08;

      ctx.clearRect(0, 0, width, height);

      const dark = isDarkMode();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Natural upward drift
        p.y -= p.speedY;

        // 2. Sinusoidal horizontal sway (floating leaf / ember motion)
        const sway =
          Math.sin(time * p.swayFrequency + p.twinkleOffset) *
          p.swayAmplitude *
          0.04;
        p.x += p.speedX + sway;

        // 3. Mouse gentle ambient displacement
        if (mouseX > -500) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;
          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 0.75;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // 4. Parallax vertical shift based on scroll
        const parallaxShift = -scrollY * p.parallaxFactor;
        const currentRenderY = (p.y + parallaxShift) % height;
        const finalY = currentRenderY < 0 ? currentRenderY + height : currentRenderY;

        // 5. Wrap around screen edges seamlessly
        if (p.x < -p.radius * 2) p.x = width + p.radius;
        if (p.x > width + p.radius * 2) p.x = -p.radius;
        if (p.y < -p.radius * 2) {
          p.y = height + p.radius;
          p.x = Math.random() * width;
        }

        // 6. Twinkle / breathing luminosity
        const pulse = Math.sin(time * p.twinkleSpeed + p.twinkleOffset);
        p.alpha = Math.max(0.04, p.baseAlpha + pulse * 0.12);

        // 7. Render soft radial bokeh gradient
        const mainColor = getColor(p.hue, p.alpha, dark);
        const edgeColor = getColor(p.hue, 0, dark);

        const gradient = ctx.createRadialGradient(
          p.x,
          finalY,
          0,
          p.x,
          finalY,
          p.radius
        );

        if (p.layer === "far") {
          // Soft out-of-focus circular orb
          gradient.addColorStop(0, mainColor);
          gradient.addColorStop(0.4, getColor(p.hue, p.alpha * 0.6, dark));
          gradient.addColorStop(1, edgeColor);
        } else if (p.layer === "mid") {
          gradient.addColorStop(0, mainColor);
          gradient.addColorStop(0.6, getColor(p.hue, p.alpha * 0.45, dark));
          gradient.addColorStop(1, edgeColor);
        } else {
          // Crisp bright center with halo
          gradient.addColorStop(0, getColor(p.hue, Math.min(1, p.alpha * 1.5), dark));
          gradient.addColorStop(0.3, mainColor);
          gradient.addColorStop(1, edgeColor);
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, finalY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 select-none"
    />
  );
}

