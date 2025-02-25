import { useEffect, useRef, useState, useCallback, ReactNode } from "react";

interface Props {
  isOpen: boolean;
  initialPosition: { x: number; y: number };
  onClose: () => void;
  children: ReactNode;
}

const Overlay: React.FC<Props> = ({
  isOpen,
  initialPosition,
  onClose,
  children,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: 500, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 500, height: 200 });

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - startPos.current.x,
          y: e.clientY - startPos.current.y,
        });
      } else if (isResizing) {
        setSize({
          width: Math.max(
            150,
            startSize.current.width + (e.clientX - startPos.current.x)
          ),
          height: Math.max(
            100,
            startSize.current.height + (e.clientY - startPos.current.y)
          ),
        });
      }
    },
    [isDragging, isResizing]
  );

  const onMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    startPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const onResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsResizing(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = size;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove]);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  if (!isOpen) return null;

  return (
    <div>
      <div
        className="overlay"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        <div className="overlay-header" onMouseDown={onMouseDown}>
          <button className="overlay-close-button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="overlay-content">{children}</div>
        <div
          className="overlay-resize-handle"
          onMouseDown={onResizeMouseDown}
        />
      </div>
    </div>
  );
};

export default Overlay;
