"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function DrawCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const strokesRef = useRef([]);
  const drawingRef = useRef(false);

  const [, forceRender] = useState(0);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2.5 * ratio;

    for (const stroke of strokesRef.current) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x * ratio, stroke[0].y * ratio);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x * ratio, stroke[i].y * ratio);
      }
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      redraw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [redraw]);

  const pointFromEvent = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e) => {
    drawingRef.current = true;
    strokesRef.current.push([pointFromEvent(e)]);
  };

  const handlePointerMove = (e) => {
    if (!drawingRef.current) return;
    const current = strokesRef.current[strokesRef.current.length - 1];
    current.push(pointFromEvent(e));
    redraw();
  };

  const stopDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    forceRender((n) => n + 1);
  };

  const undo = () => {
    strokesRef.current.pop();
    redraw();
    forceRender((n) => n + 1);
  };

  const clear = () => {
    strokesRef.current = [];
    redraw();
    forceRender((n) => n + 1);
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="w-full h-48 md:h-64 border border-ink/30 bg-white/60 touch-none"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
      </div>
      <div className="flex gap-3 justify-end mt-3">
        <button
          type="button"
          onClick={undo}
          className="px-4 py-1.5 text-xs tracking-[0.1em] border border-accent text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer"
        >
          undo
        </button>
        <button
          type="button"
          onClick={clear}
          className="px-4 py-1.5 text-xs tracking-[0.1em] border border-accent text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer"
        >
          clear
        </button>
      </div>
    </div>
  );
}
