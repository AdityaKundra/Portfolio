import { useState, useEffect, useRef } from 'react';

/**
 * Hook for draggable window behavior. Call handleMouseDown on the title bar element.
 * @param {{ x: number, y: number }} position - current position
 * @param {(pos: { x: number, y: number }) => void} onPositionChange - called when position updates
 */
export function useDraggableWindow(position, onPositionChange) {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('[data-no-drag]')) return;
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      onPositionChange({
        x: Math.max(0, e.clientX - dragOffset.current.x),
        y: Math.max(0, e.clientY - dragOffset.current.y),
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onPositionChange]);

  return { handleMouseDown };
}
