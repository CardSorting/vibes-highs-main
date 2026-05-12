import { useEffect, useRef } from 'react';

export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width: number;
    let height: number;
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const gridSize = 40;
      const dotSize = 1;
      const influenceRadius = 200;

      ctx.fillStyle = 'rgba(0, 255, 102, 0.15)';

      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let currentDotSize = dotSize;
          let opacity = 0.05;

          if (distance < influenceRadius) {
            const factor = 1 - distance / influenceRadius;
            currentDotSize = dotSize + factor * 2;
            opacity = 0.05 + factor * 0.2;
          }

          ctx.fillStyle = `rgba(0, 255, 102, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, currentDotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
