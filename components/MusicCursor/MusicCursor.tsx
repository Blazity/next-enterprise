"use client"

import React, { useEffect, useRef } from 'react';

interface MusicCursorProps {
  soundEnabled?: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  nx: number;
  ny: number;
  life: number;
}

interface Note {
  x: number;
  y: number;
  symbol: string;
  life: number;
  scale: number;
  rotation: number;
}

export default function MusicCursor({ soundEnabled = false }: MusicCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSoundTimeRef = useRef<number>(0);

  // Initialize Audio Context when sound is enabled
  useEffect(() => {
    if (soundEnabled && !audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
  }, [soundEnabled]);

  const playNote = () => {
    if (!soundEnabled || !audioCtxRef.current) return;
    
    const now = performance.now();
    // Rate limit sounds to avoid overwhelming audio
    if (now - lastSoundTimeRef.current < 150) return;
    lastSoundTimeRef.current = now;
    
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Pentatonic scale for pleasant, harmonious sounds
      const frequencies = [
        261.63, 293.66, 329.63, 392.00, 440.00, // Octave 4
        523.25, 587.33, 659.25, 783.99, 880.00, // Octave 5
      ];
      const symbolIndex = Math.floor(Math.random() * frequencies.length);
      const freq = frequencies[symbolIndex] ?? 261.63;
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      // Very soft volume
      const volume = 0.015;
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let trailPoints: TrailPoint[] = [];
    let notes: Note[] = [];

    // Start at center
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Smoothed positions
    let smoothX = mouseX;
    let smoothY = mouseY;
    let prevSmoothX = smoothX;
    let prevSmoothY = smoothY;
    
    // Normals for drawing the staff lines
    let currentNx = 0;
    let currentNy = -1;
    
    let time = 0;
    let distanceSinceLastNote = 0;
    let lastWaveX = smoothX;
    let lastWaveY = smoothY;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Lerp mouse position for buttery smooth movement
      prevSmoothX = smoothX;
      prevSmoothY = smoothY;
      
      smoothX += (mouseX - smoothX) * 0.15;
      smoothY += (mouseY - smoothY) * 0.15;

      const dx = smoothX - prevSmoothX;
      const dy = smoothY - prevSmoothY;
      const dist = Math.hypot(dx, dy);

      // 2. Calculate normal and wave
      time += 0.08; // Graceful wave oscillation

      if (dist > 0.1) {
        const targetNx = -dy / dist;
        const targetNy = dx / dist;
        
        // Lerp normal to avoid sharp twists in the staff lines
        currentNx += (targetNx - currentNx) * 0.05;
        currentNy += (targetNy - currentNy) * 0.05;

        // Normalize again after lerp
        const nLen = Math.hypot(currentNx, currentNy);
        if (nLen > 0) {
          currentNx /= nLen;
          currentNy /= nLen;
        }

        // Create the literal wave effect
        const waveAmplitude = 20;
        const waveOffset = Math.sin(time) * waveAmplitude;

        const waveX = smoothX + currentNx * waveOffset;
        const waveY = smoothY + currentNy * waveOffset;

        trailPoints.push({
          x: waveX,
          y: waveY,
          nx: currentNx,
          ny: currentNy,
          life: 1.0
        });

        const waveDist = Math.hypot(waveX - lastWaveX, waveY - lastWaveY);
        distanceSinceLastNote += waveDist;

        // Drop a note exactly every 50 pixels along the wave
        if (distanceSinceLastNote > 50) {
          distanceSinceLastNote = 0;

          const symbols = ['♩', '♪', '♫', '♬', '𝄞', '𝄢'];
          const symbolIndex = Math.floor(Math.random() * symbols.length);
          const symbol = symbols[symbolIndex] ?? '♪';

          // Snap the note to one of the 5 staff lines (offset -2 to 2)
          const staffSpacing = 8;
          const lineOffset = Math.floor(Math.random() * 5) - 2;

          notes.push({
            x: waveX + currentNx * lineOffset * staffSpacing,
            y: waveY + currentNy * lineOffset * staffSpacing,
            symbol,
            life: 1.0,
            scale: symbol === '𝄞' || symbol === '𝄢' ? 1.4 : 1.0,
            rotation: (Math.random() - 0.5) * 0.15 // Very slight, elegant tilt
          });

          playNote();
        }

        lastWaveX = waveX;
        lastWaveY = waveY;
      }

      // 3. Draw Staff Lines (The continuous wave trail)
      ctx.lineWidth = 1.2;
      const staffSpacing = 8;
      // White color as requested
      const staffColor = '255, 255, 255';

      for (let i = 1; i < trailPoints.length; i++) {
        const p1 = trailPoints[i - 1];
        const p2 = trailPoints[i];
        if (!p1 || !p2) continue;

        // Extremely slow fade (takes ~2.5 seconds to disappear)
        p2.life -= 0.006; 

        if (p2.life <= 0) continue;

        // Draw 5 parallel lines to form a musical staff
        for (let j = -2; j <= 2; j++) {
          ctx.strokeStyle = `rgba(${staffColor}, ${Math.max(0, p2.life * 0.35)})`; // Max opacity 0.35 for elegance
          ctx.beginPath();
          ctx.moveTo(p1.x + p1.nx * j * staffSpacing, p1.y + p1.ny * j * staffSpacing);
          ctx.lineTo(p2.x + p2.nx * j * staffSpacing, p2.y + p2.ny * j * staffSpacing);
          ctx.stroke();
        }
      }

      // 4. Draw Notes (Static in the air, fading out)
      const noteColor = '255, 255, 255';

      for (let i = 0; i < notes.length; i++) {
        const n = notes[i];
        if (!n) continue;
        n.life -= 0.005; // Notes fade slightly slower than the staff

        if (n.life <= 0) continue;

        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.rotation);
        
        // Slight shrink as it fades
        const currentScale = n.scale * (0.9 + 0.1 * n.life);
        ctx.scale(currentScale, currentScale);

        ctx.fillStyle = `rgba(${noteColor}, ${Math.max(0, n.life)})`;
        ctx.font = '36px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.symbol, 0, 0);
        ctx.restore();
      }

      // Cleanup dead particles
      trailPoints = trailPoints.filter(p => p.life > 0);
      notes = notes.filter(n => n.life > 0);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [soundEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
