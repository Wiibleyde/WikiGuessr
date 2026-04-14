"use client";

import { useEffect, useState } from "react";

interface ConfettiProps {
    active: boolean;
}

const PARTICLE_COUNT = 40;
const COLORS = [
    "var(--color-primary)",
    "var(--color-success)",
    "var(--color-warning)",
    "#ec4899",
    "#3b82f6",
    "#f97316",
];
const SHAPES = ["●", "■", "▲", "★", "♦"];

interface Particle {
    id: number;
    color: string;
    shape: string;
    left: number;
    delay: number;
    duration: number;
    size: number;
    drift: number;
}

function generateParticles(): Particle[] {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.5 + Math.random() * 1.5,
        size: 8 + Math.random() * 10,
        drift: -30 + Math.random() * 60,
    }));
}

export default function Confetti({ active }: ConfettiProps) {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (active) {
            setParticles(generateParticles());
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 3500);
            return () => clearTimeout(timer);
        }
    }, [active]);

    if (!visible) return null;

    return (
        <div
            className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
            aria-hidden="true"
        >
            {particles.map((p) => (
                <span
                    key={p.id}
                    className="absolute animate-confetti-fall"
                    style={{
                        left: `${p.left}%`,
                        top: "-5%",
                        color: p.color,
                        fontSize: `${p.size}px`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        // @ts-expect-error CSS custom property for drift
                        "--drift": `${p.drift}px`,
                    }}
                >
                    {p.shape}
                </span>
            ))}
        </div>
    );
}
