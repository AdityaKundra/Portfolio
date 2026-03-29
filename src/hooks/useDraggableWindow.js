import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for draggable window behavior. Call handleMouseDown on the drag handle element.
 * @param {{ x: number, y: number }} position - current position
 * @param {(pos: { x: number, y: number }) => void} onPositionChange - called when position updates
 * @param {{ dragThresholdPx?: number }} [options] - If dragThresholdPx > 0, call shouldSuppressClick() on click after a drag to avoid opening links/modals
 */
export function useDraggableWindow(position, onPositionChange, options = {}) {
  const { dragThresholdPx = 0 } = options;
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const exceededThreshold = useRef(false);
  const suppressNextClickRef = useRef(false);

  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('[data-no-drag]')) return;
    e.preventDefault();
    if (dragThresholdPx > 0) {
      pointerStart.current = { x: e.clientX, y: e.clientY };
      exceededThreshold.current = false;
      suppressNextClickRef.current = false;
    }
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    if (!isDragging) return;
    const thresholdSq = dragThresholdPx * dragThresholdPx;
    const handleMouseMove = (e) => {
      if (dragThresholdPx > 0) {
        const dx = e.clientX - pointerStart.current.x;
        const dy = e.clientY - pointerStart.current.y;
        if (dx * dx + dy * dy > thresholdSq) exceededThreshold.current = true;
      }
      onPositionChange({
        x: Math.max(0, e.clientX - dragOffset.current.x),
        y: Math.max(0, e.clientY - dragOffset.current.y),
      });
    };
    const handleMouseUp = () => {
      if (dragThresholdPx > 0 && exceededThreshold.current) {
        suppressNextClickRef.current = true;
      }
      setIsDragging(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onPositionChange, dragThresholdPx]);

  const shouldSuppressClick = useCallback(() => {
    if (!suppressNextClickRef.current) return false;
    suppressNextClickRef.current = false;
    return true;
  }, []);

  return { handleMouseDown, shouldSuppressClick };
}
