import { useEffect, useRef } from "react";

interface MatrixRainProps {
  color?: string; // Tail stream color, e.g., '#a3e635'
  headColor?: string; // Glowing head character color, e.g., '#ffffff'
  charSet?: string; // Custom character string or preset
  speed?: number; // Speed multiplier (default 1)
  density?: number; // Column spacing step size (smaller = denser, default 18)
  fontSize?: number; // Font size in px (default 14)
  opacity?: number; // Canvas overall opacity (default 0.25)
}

export function MatrixRainCanvas({
  color = "#a3e635",
  headColor = "#ffffff",
  charSet,
  speed = 0.5,
  density = 20,
  fontSize = 13,
  opacity = 0.25,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const chars =
      charSet ??
      "012345678901234567890123456789VIPRATECH0123456789SIGNAL0123456789";
    const characters = chars.split("");

    let drops: number[] = [];

    const resizeCanvas = () => {
      const width = window.innerWidth || document.documentElement.clientWidth;
      const height = window.innerHeight || document.documentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;

      // Use Math.ceil so the matrix rain covers the rightmost edge completely
      const newColumns = Math.ceil(width / density) + 1;

      if (newColumns > drops.length) {
        for (let i = drops.length; i < newColumns; i++) {
          drops[i] = Math.random() * -100;
        }
      } else if (newColumns < drops.length) {
        drops.length = newColumns;
      }
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      // Semi-transparent fade background to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * density;
        const y = drops[i] * fontSize;

        // Draw glowing head character
        ctx.fillStyle = headColor;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fillText(text, x, y);

        // Reset shadow for trails to save GPU rendering
        ctx.shadowBlur = 0;

        // Draw trail character behind head
        ctx.fillStyle = color;
        const prevText = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(prevText, x, y - fontSize);

        // Reset drop position if it goes past the screen bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Increment Y position
        drops[i] += 0.4 * speed;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [color, headColor, charSet, speed, density, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity }}
    />
  );
}
