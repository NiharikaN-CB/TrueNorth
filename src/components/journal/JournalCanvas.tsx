"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "fabric";

export function JournalCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Get initial dimensions of the parent wrapper
    const initialWidth = containerRef.current.clientWidth;
    const initialHeight = containerRef.current.clientHeight || 350;

    // Initialize Fabric Canvas on the client
    const canvasInstance = new Canvas(canvasRef.current, {
      width: initialWidth,
      height: initialHeight,
      isDrawingMode: true,
      backgroundColor: "transparent",
    });

    fabricCanvasRef.current = canvasInstance;

    // Configure the freehand drawing brush style
    if (canvasInstance.freeDrawingBrush) {
      canvasInstance.freeDrawingBrush.color = "#984343"; // pastel-maroon
      canvasInstance.freeDrawingBrush.width = 3;
    }

    // Handle responsive resize of the canvas container
    const handleResize = () => {
      if (!containerRef.current || !fabricCanvasRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 350;
      
      fabricCanvasRef.current.setDimensions({
        width: newWidth,
        height: newHeight
      });
      fabricCanvasRef.current.renderAll();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup: Dispose the Fabric canvas instance on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose().catch((err) => {
          console.error("Error disposing fabric canvas: ", err);
        });
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[350px] relative border border-[#D79B95]/20 rounded-xl overflow-hidden shadow-inner bg-[#F1E4D9]/20"
      style={{ 
        backgroundImage: "radial-gradient(#D79B95 0.8px, transparent 0.8px)", 
        backgroundSize: "16px 16px" 
      }}
      aria-label="Journal drawing canvas"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
