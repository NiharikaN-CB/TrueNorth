"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas, IText } from "fabric";

export interface JournalCanvasRef {
  undo: () => void;
  redo: () => void;
}

interface JournalCanvasProps {
  activeTool: string;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
  initialCanvasJson?: string;
  onCanvasChange?: (json: string) => void;
}

export const JournalCanvas = forwardRef<JournalCanvasRef, JournalCanvasProps>(
  ({ activeTool, onHistoryChange, initialCanvasJson = "{}", onCanvasChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);

    // Refs to store state for event listeners
    const activeToolRef = useRef<string>(activeTool);
    const historyStackRef = useRef<string[]>([]);
    const historyIndexRef = useRef<number>(-1);
    const isHandlingHistoryRef = useRef<boolean>(false);
    const onHistoryChangeRef = useRef<((canUndo: boolean, canRedo: boolean) => void) | undefined>(onHistoryChange);
    const onCanvasChangeRef = useRef<((json: string) => void) | undefined>(onCanvasChange);

    // Keep ref values up-to-date
    useEffect(() => {
      activeToolRef.current = activeTool;
    }, [activeTool]);

    useEffect(() => {
      onHistoryChangeRef.current = onHistoryChange;
    }, [onHistoryChange]);

    useEffect(() => {
      onCanvasChangeRef.current = onCanvasChange;
    }, [onCanvasChange]);

    const notifyHistoryChange = () => {
      if (onHistoryChangeRef.current) {
        const canUndo = historyIndexRef.current > 0;
        const canRedo = historyIndexRef.current < historyStackRef.current.length - 1;
        onHistoryChangeRef.current(canUndo, canRedo);
      }
    };

    const undo = async () => {
      const canvasInstance = fabricCanvasRef.current;
      if (!canvasInstance || historyIndexRef.current <= 0) return;

      isHandlingHistoryRef.current = true;
      historyIndexRef.current -= 1;
      const jsonStr = historyStackRef.current[historyIndexRef.current];

      try {
        await canvasInstance.loadFromJSON(JSON.parse(jsonStr));
        canvasInstance.renderAll();
        onCanvasChangeRef.current?.(jsonStr);
      } catch (err) {
        console.error("Error loading undo state: ", err);
      } finally {
        isHandlingHistoryRef.current = false;
        notifyHistoryChange();
      }
    };

    const redo = async () => {
      const canvasInstance = fabricCanvasRef.current;
      if (!canvasInstance || historyIndexRef.current >= historyStackRef.current.length - 1) return;

      isHandlingHistoryRef.current = true;
      historyIndexRef.current += 1;
      const jsonStr = historyStackRef.current[historyIndexRef.current];

      try {
        await canvasInstance.loadFromJSON(JSON.parse(jsonStr));
        canvasInstance.renderAll();
        onCanvasChangeRef.current?.(jsonStr);
      } catch (err) {
        console.error("Error loading redo state: ", err);
      } finally {
        isHandlingHistoryRef.current = false;
        notifyHistoryChange();
      }
    };

    useImperativeHandle(ref, () => ({
      undo,
      redo,
    }));

    useEffect(() => {
      if (!canvasRef.current || !containerRef.current) return;

      const initialWidth = containerRef.current.clientWidth;
      const initialHeight = containerRef.current.clientHeight || 350;

      // Initialize Canvas
      const canvasInstance = new Canvas(canvasRef.current, {
        width: initialWidth,
        height: initialHeight,
        isDrawingMode: activeToolRef.current === "pen",
        backgroundColor: "transparent",
      });

      fabricCanvasRef.current = canvasInstance;

      // Configure Pen style
      if (canvasInstance.freeDrawingBrush) {
        canvasInstance.freeDrawingBrush.color = "#984343";
        canvasInstance.freeDrawingBrush.width = 3;
      }

      const saveHistory = () => {
        if (isHandlingHistoryRef.current) return;

        const jsonStr = JSON.stringify(canvasInstance.toJSON());
        const currentHistory = historyStackRef.current[historyIndexRef.current];

        // If state is identical to current index, ignore to prevent duplicate snapshotting
        if (currentHistory === jsonStr) return;

        // Truncate stack if we had undone changes
        const newStack = historyStackRef.current.slice(0, historyIndexRef.current + 1);
        newStack.push(jsonStr);

        historyStackRef.current = newStack;
        historyIndexRef.current = newStack.length - 1;

        notifyHistoryChange();
        onCanvasChangeRef.current?.(jsonStr);
      };

      // Load initial state asynchronously if provided
      const loadInitialState = async () => {
        if (initialCanvasJson && initialCanvasJson !== "{}") {
          isHandlingHistoryRef.current = true;
          try {
            await canvasInstance.loadFromJSON(JSON.parse(initialCanvasJson));
            canvasInstance.renderAll();
          } catch (err) {
            console.error("Error loading initial canvas state: ", err);
          } finally {
            isHandlingHistoryRef.current = false;
          }
        }
        
        // Save initial state in the history stack
        const initialJson = JSON.stringify(canvasInstance.toJSON());
        historyStackRef.current = [initialJson];
        historyIndexRef.current = 0;
        notifyHistoryChange();
      };

      loadInitialState();

      // Event Listeners for History Snapshotting
      canvasInstance.on("path:created", () => {
        if (isHandlingHistoryRef.current) return;
        saveHistory();
      });

      canvasInstance.on("object:added", (opt) => {
        if (isHandlingHistoryRef.current) return;
        // Ignore path additions because they are handled by path:created
        if (opt.target && opt.target.type === "path") return;
        saveHistory();
      });

      canvasInstance.on("object:modified", () => {
        if (isHandlingHistoryRef.current) return;
        saveHistory();
      });

      canvasInstance.on("object:removed", () => {
        if (isHandlingHistoryRef.current) return;
        saveHistory();
      });

      // Event Listener for Text creation & Eraser deletion on click
      canvasInstance.on("mouse:down", (opt) => {
        const currentTool = activeToolRef.current;

        if (currentTool === "text") {
          // If clicked an existing object, let user select/move it
          if (opt.target) return;

          const { x, y } = opt.scenePoint;

          const textObj = new IText("Write here...", {
            left: x,
            top: y,
            fontFamily: "var(--font-serif), Georgia, serif",
            fill: "#984343",
            fontSize: 20,
            editable: true,
          });

          canvasInstance.add(textObj);
          canvasInstance.setActiveObject(textObj);
          
          // Enter editing mode asynchronously
          setTimeout(() => {
            textObj.enterEditing();
          }, 50);
          
          canvasInstance.renderAll();
        } else if (currentTool === "eraser") {
          // If clicked an object, delete it
          if (opt.target) {
            canvasInstance.remove(opt.target);
            canvasInstance.discardActiveObject();
            canvasInstance.renderAll();
          }
        }
      });

      // Keyboard delete listener for accessible removal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Delete" || e.key === "Backspace") {
          const activeObject = canvasInstance.getActiveObject();
          if (activeObject) {
            // If editing text, do not delete the object
            if (activeObject.type === "itext" && (activeObject as IText).isEditing) {
              return;
            }
            canvasInstance.remove(activeObject);
            canvasInstance.discardActiveObject();
            canvasInstance.renderAll();
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      // Handle responsive resize
      const handleResize = () => {
        if (!containerRef.current || !fabricCanvasRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight || 350;
        fabricCanvasRef.current.setDimensions({
          width: newWidth,
          height: newHeight,
        });
        fabricCanvasRef.current.renderAll();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", handleResize);
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose().catch((err) => {
            console.error("Error disposing fabric canvas: ", err);
          });
          fabricCanvasRef.current = null;
        }
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Effect to configure modes on activeTool change
    useEffect(() => {
      const canvasInstance = fabricCanvasRef.current;
      if (!canvasInstance) return;

      if (activeTool === "pen") {
        canvasInstance.isDrawingMode = true;
        canvasInstance.selection = false;
        canvasInstance.skipTargetFind = true;
        canvasInstance.discardActiveObject();
        canvasInstance.renderAll();
      } else if (activeTool === "text") {
        canvasInstance.isDrawingMode = false;
        canvasInstance.selection = true;
        canvasInstance.skipTargetFind = false;
        canvasInstance.forEachObject((obj) => {
          obj.selectable = true;
          obj.evented = true;
        });
        canvasInstance.renderAll();
      } else if (activeTool === "eraser") {
        canvasInstance.isDrawingMode = false;
        canvasInstance.selection = false;
        canvasInstance.skipTargetFind = false;
        canvasInstance.discardActiveObject();
        canvasInstance.renderAll();
      } else {
        // Mock tool modes or inert mode
        canvasInstance.isDrawingMode = false;
        canvasInstance.selection = false;
        canvasInstance.skipTargetFind = true;
        canvasInstance.discardActiveObject();
        canvasInstance.renderAll();
      }
    }, [activeTool]);

    return (
      <div
        ref={containerRef}
        className="w-full h-full min-h-[350px] relative border border-[#D79B95]/20 rounded-xl overflow-hidden shadow-inner bg-[#F1E4D9]/20"
        style={{
          backgroundImage: "radial-gradient(#D79B95 0.8px, transparent 0.8px)",
          backgroundSize: "16px 16px",
        }}
        aria-label="Journal drawing canvas"
      >
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      </div>
    );
  }
);

JournalCanvas.displayName = "JournalCanvas";
