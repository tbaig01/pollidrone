import React, { useEffect, useRef } from 'react';
import { ChevronLeft, Cpu, Activity, Battery, Zap } from 'lucide-react';

export default function HiveView({ zone, onBack }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const elementsRef = useRef({ drones: [], flowers: [] });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Resize
        const resize = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const W = canvas.width;
        const H = canvas.height;

        // Golden scheme
        const C_DRONE = '#e6b85c';
        const C_TRAIL = 'rgba(230, 184, 92, 0.15)';
        const C_FLOWER_POLL = 'rgba(76, 175, 80, 0.6)'; // green
        const C_FLOWER_PEND = 'rgba(255, 193, 77, 0.4)'; // gold

        // Init flowers
        elementsRef.current.flowers = Array.from({ length: 60 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            pollinated: Math.random() < 0.2, // mostly unpollinated
            size: 2 + Math.random() * 3,
        }));

        // Init drones based on swarm size (fallback to 24)
        const numDrones = zone?.drones || 24;
        elementsRef.current.drones = Array.from({ length: numDrones }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
        }));

        const animate = () => {
            // Fade out for trails
            ctx.fillStyle = 'rgba(3, 3, 3, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const { flowers, drones } = elementsRef.current;

            // Render flowers
            flowers.forEach(f => {
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
                ctx.fillStyle = f.pollinated ? C_FLOWER_POLL : C_FLOWER_PEND;
                ctx.fill();
                if (f.pollinated) {
                    ctx.beginPath();
                    ctx.arc(f.x, f.y, f.size + 4, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(76, 175, 80, 0.2)';
                    ctx.stroke();
                }
            });

            // Update and render drones
            drones.forEach(d => {
                // Find nearest unpollinated flower
                let nearest = null;
                let minDist = Infinity;
                flowers.forEach(f => {
                    if (!f.pollinated) {
                        const dist = Math.hypot(f.x - d.x, f.y - d.y);
                        if (dist < minDist) {
                            minDist = dist;
                            nearest = f;
                        }
                    }
                });

                if (nearest && minDist > 8) {
                    const angle = Math.atan2(nearest.y - d.y, nearest.x - d.x);
                    d.vx += Math.cos(angle) * 0.4;
                    d.vy += Math.sin(angle) * 0.4;
                } else if (nearest && minDist <= 8) {
                    nearest.pollinated = true; // DO pollination
                }

                // Random jitter
                d.vx += (Math.random() - 0.5) * 0.5;
                d.vy += (Math.random() - 0.5) * 0.5;

                // Friction limits
                d.vx *= 0.92;
                d.vy *= 0.92;

                d.x += d.vx;
                d.y += d.vy;

                // Bounce walls
                if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
                if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

                // Draw drone
                ctx.beginPath();
                ctx.arc(d.x, d.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = C_DRONE;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(d.x, d.y, 10, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(230, 184, 92, 0.4)';
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - d.vx * 4, d.y - d.vy * 4);
                ctx.strokeStyle = C_TRAIL;
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            animRef.current = requestAnimationFrame(animate);
        };

        // Initial solid clear
        ctx.fillStyle = '#030303';
        ctx.fillRect(0, 0, W, H);
        animate();

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [zone]);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            background: 'rgba(3, 3, 3, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Simulation Header / Navigation */}
            <div style={{ padding: '32px', borderBottom: '1px solid var(--gold-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="hud-button" onClick={onBack}>
                    <ChevronLeft size={16} /> RETURN TO GLOBE
                </button>
                <div style={{ textAlign: 'right' }}>
                    <h1 className="hud-title" style={{ fontSize: '20px' }}>HIVE {zone.hive}</h1>
                    <h2 className="hud-subtitle">{zone.name} · {zone.crop || 'Polli-Sector'}</h2>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative', margin: '32px', border: '1px solid var(--gold-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

                {/* Internal Overlay */}
                <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
                    <h1 className="hud-title">ACTIVE SWARM MARL.SIM</h1>
                    <h2 className="hud-subtitle" style={{ color: 'var(--green-healthy)' }}>● MAPPO-v3.2 DECENTRALIZED EXC.</h2>
                </div>

                <div style={{ position: 'absolute', bottom: '24px', right: '24px', background: 'var(--bg-hud)', border: '1px solid var(--gold-border)', padding: '16px', display: 'flex', gap: '24px' }}>
                    <div>
                        <div style={{ fontSize: '10px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}><Cpu size={12} /> AGX ORIN</div>
                        <div style={{ color: 'var(--gold-primary)', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>242 TOPS</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '10px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}><Activity size={12} /> COVERAGE</div>
                        <div style={{ color: 'var(--green-healthy)', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>94.2%</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '10px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}><Battery size={12} /> SWARM ENG.</div>
                        <div style={{ color: 'var(--gold-glow)', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>88%</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
