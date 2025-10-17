import React, { useEffect, useRef, useCallback } from "react";
import type { Point, Baia } from "../types/baia";

type Props = {
  fileUrl?: string;
  baias: Baia[];
  currentPolygon: Point[];
  setCurrentPolygon: (p: Point[] | ((prev: Point[]) => Point[])) => void;
  isDrawing: boolean;
  setIsDrawing: (v: boolean) => void;
  selectedBaiaId: string | null;
  setSelectedBaiaId: (id: string | null) => void;
  onLoaded?: () => void;
};

const colors = [
  "#FF6B6B",
  "#6BCB77",
  "#4D96FF",
  "#FFD93D",
  "#C77DFF",
  "#3FC1C9",
  "#FF9F1C",
];

export function BaiaCanvas({
  fileUrl,
  baias,
  currentPolygon,
  setCurrentPolygon,
  isDrawing,
  // setIsDrawing not used in canvas
  selectedBaiaId,
  setSelectedBaiaId,
  onLoaded,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    const updateCanvasSize = () => {
      const rect = video.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      if (ctx) ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      draw();
    };

    const observer = new ResizeObserver(updateCanvasSize);
    observer.observe(video);
    updateCanvasSize();
    onLoaded?.();

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUrl]);

  const pointInPolygon = (point: Point, polygon: Point[]) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x,
        yi = polygon[i].y;
      const xj = polygon[j].x,
        yj = polygon[j].y;
      const intersect =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const drawPolygon = (ctx: CanvasRenderingContext2D, poly: Point[]) => {
    if (poly.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(poly[0].x, poly[0].y);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i].x, poly[i].y);
    if (poly.length >= 3) {
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    } else {
      ctx.stroke();
    }
    poly.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

  // clear in CSS pixel units (account for transform)
  const clearW = canvas.width / (devicePixelRatio || 1);
  const clearH = canvas.height / (devicePixelRatio || 1);
  ctx.clearRect(0, 0, clearW, clearH);

    baias.forEach((b, i) => {
      const color = colors[i % colors.length];
      if (b.id === selectedBaiaId) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.fillStyle = color + "55";
      } else {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = color;
        ctx.fillStyle = color + "33";
      }
      drawPolygon(ctx, b.polygon);

      const cx = b.polygon.reduce((s, p) => s + p.x, 0) / b.polygon.length;
      const cy = b.polygon.reduce((s, p) => s + p.y, 0) / b.polygon.length;
      const label = b.id;
      ctx.font = "16px Arial";
      const textWidth = ctx.measureText(label).width;
      const padding = 6;
      const rectX = cx - textWidth / 2 - padding / 2;
      const rectY = cy - 12 - padding / 2;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(rectX, rectY, textWidth + padding, 20);
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(label, cx, cy);
    });

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#555";
    ctx.fillStyle = "#5555";
    drawPolygon(ctx, currentPolygon);
  }, [baias, currentPolygon, selectedBaiaId]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  // Because we set ctx.setTransform(devicePixelRatio,...), drawing uses CSS pixels.
  // Use CSS pixel coordinates directly (no extra scaling)
  const x = Math.round(e.clientX - rect.left);
  const y = Math.round(e.clientY - rect.top);
    if (isDrawing) {
      setCurrentPolygon((prev) => [...prev, { x, y }]);
      return;
    }
    let foundId: string | null = null;
    for (const b of baias) {
      if (pointInPolygon({ x, y }, b.polygon)) {
        foundId = b.id;
        break;
      }
    }
    setSelectedBaiaId(foundId);
  };

  return (
    <div className="relative inline-block w-full max-w-[600px]">
      <video ref={videoRef} src={fileUrl} controls className="w-full h-auto rounded-lg shadow-md block" />
      <canvas ref={canvasRef} onClick={handleCanvasClick} className={`absolute top-0 left-0 rounded-lg cursor-crosshair ${isDrawing ? "opacity-100" : "pointer-events-none opacity-0"}`} />
    </div>
  );
}

export default BaiaCanvas;
