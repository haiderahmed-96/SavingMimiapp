import { useUIStore } from "../stores/useUIStore";
import { useEffect, useState } from "react";

const COLORS = ["#10B981", "#06B6D4", "#FBBF24", "#F43F5E", "#38BDF8", "#F59E0B"];

export default function Celebration() {
  const show = useUIStore((s) => s.showCelebration);
  const [pieces, setPieces] = useState<{ id: number; left: number; color: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    if (show) {
      setPieces(
        Array.from({ length: 40 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 1,
          size: Math.random() * 8 + 4,
        }))
      );
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute confetti-piece rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.5,
            background: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-7xl animate-scale-in">🏆</div>
      </div>
    </div>
  );
}
