import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Cpu, Activity, Battery, Zap, Server, CheckCircle } from 'lucide-react';

export default function HiveView({ zone, onBack }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const elementsRef = useRef({ drones: [], flowers: [] });
    const [isMissionComplete, setIsMissionComplete] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const W = canvas.width;
        const H = canvas.height;
        const CX = W / 2;
        const CY = H / 2;

        const C_DRONE = '#FFD700'; // Yellow
        const C_FLOWER_POLL = '#4CAF50'; // Green
        const C_FLOWER_PEND = '#FF5252'; // Red

        // Init crops (scattered, avoiding server center)
        elementsRef.current.flowers = Array.from({ length: 80 }, () => {
            let fx = Math.random() * W;
            let fy = Math.random() * H;
            // push away from center server
            while (Math.hypot(fx - CX, fy - CY) < 100) {
                fx = Math.random() * W;
                fy = Math.random() * H;
            }
            return {
                x: fx,
                y: fy,
                pollinated: false,
                size: 3 + Math.random() * 4,
            };
        });

        // Init drones at the server (center)
        const numDrones = zone?.drones || 30;
        elementsRef.current.drones = Array.from({ length: numDrones }, () => ({
            x: CX,
            y: CY,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            state: 'LEAVING', // LEAVING, POLLINATING, RETURNING, DOCKED
            rotorAngle: Math.random() * Math.PI * 2
        }));

        const drawServer = (ctx, x, y) => {
            ctx.save();
            ctx.translate(x, y);

            // Server glowing base
            ctx.beginPath();
            ctx.ellipse(0, 15, 50, 20, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(230, 184, 92, 0.1)';
            ctx.shadowColor = '#e6b85c';
            ctx.shadowBlur = 20;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Server rack chassis
            ctx.fillStyle = '#111';
            ctx.strokeStyle = '#e6b85c';
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(-40, -40);
            ctx.lineTo(40, -40);
            ctx.lineTo(40, 30);
            ctx.lineTo(-40, 30);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Server blades/lights
            for (let i = -30; i <= 20; i += 12) {
                ctx.fillStyle = '#222';
                ctx.fillRect(-35, i, 70, 8);

                // Blinking lights
                ctx.fillStyle = Math.random() > 0.1 ? '#4CAF50' : '#FF5252';
                ctx.fillRect(-30, i + 2, 4, 4);

                ctx.fillStyle = Math.random() > 0.3 ? '#e6b85c' : '#333';
                ctx.fillRect(-22, i + 2, 4, 4);

                ctx.fillStyle = Math.random() > 0.5 ? '#03A9F4' : '#333';
                ctx.fillRect(-14, i + 2, 4, 4);
            }

            // Server top
            ctx.beginPath();
            ctx.moveTo(-40, -40);
            ctx.lineTo(-30, -55);
            ctx.lineTo(50, -55);
            ctx.lineTo(40, -40);
            ctx.closePath();
            ctx.fillStyle = '#1a1a1a';
            ctx.fill();
            ctx.stroke();

            // Server side
            ctx.beginPath();
            ctx.moveTo(40, -40);
            ctx.lineTo(50, -55);
            ctx.lineTo(50, 15);
            ctx.lineTo(40, 30);
            ctx.closePath();
            ctx.fillStyle = '#0a0a0a';
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        };

        const drawQuadcopter = (ctx, d) => {
            ctx.save();
            ctx.translate(d.x, d.y);

            // Rotation based on velocity
            const angle = Math.atan2(d.vy, d.vx);
            const speed = Math.hypot(d.vx, d.vy);

            // Tilt forward slightly based on speed
            ctx.rotate(angle);

            // Arms
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-6, -6); ctx.lineTo(6, 6);
            ctx.moveTo(-6, 6); ctx.lineTo(6, -6);
            ctx.stroke();

            // Rotors
            d.rotorAngle += 0.8 + speed * 0.1; // Spin fast
            ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
            const rSize = 4;
            [[-6, -6], [6, -6], [-6, 6], [6, 6]].forEach(pos => {
                ctx.save();
                ctx.translate(pos[0], pos[1]);
                ctx.rotate(d.rotorAngle);
                ctx.beginPath();
                ctx.ellipse(0, 0, rSize, rSize / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Central body (Yellow)
            ctx.beginPath();
            ctx.arc(0, 0, 4, 0, Math.PI * 2);
            ctx.fillStyle = C_DRONE;
            ctx.shadowColor = C_DRONE;
            ctx.shadowBlur = 5;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Front indicator
            ctx.fillStyle = '#000';
            ctx.fillRect(2, -1.5, 3, 3);

            ctx.restore();
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(3, 3, 3, 0.4)'; // Slight trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const { flowers, drones } = elementsRef.current;

            let anyUnpollinated = false;
            let allDocked = true;

            // Render Crops
            flowers.forEach(f => {
                if (!f.pollinated) anyUnpollinated = true;

                ctx.beginPath();
                ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
                ctx.fillStyle = f.pollinated ? C_FLOWER_POLL : C_FLOWER_PEND;
                ctx.shadowColor = f.pollinated ? C_FLOWER_POLL : C_FLOWER_PEND;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Inner core
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.size * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = '#000';
                ctx.fill();
            });

            // Draw Server
            drawServer(ctx, CX, CY);

            // Update Drones
            drones.forEach(d => {
                if (d.state === 'LEAVING') {
                    // Explode outward initially
                    d.vx *= 0.95;
                    d.vy *= 0.95;
                    if (Math.hypot(d.vx, d.vy) < 1) d.state = 'POLLINATING';
                    allDocked = false;
                } else if (d.state === 'POLLINATING') {
                    if (!anyUnpollinated) {
                        d.state = 'RETURNING';
                    } else {
                        // Find nearest unpollinated
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

                        if (nearest) {
                            if (minDist > 10) {
                                const angle = Math.atan2(nearest.y - d.y, nearest.x - d.x);
                                d.vx += Math.cos(angle) * 0.6;
                                d.vy += Math.sin(angle) * 0.6;
                            } else {
                                nearest.pollinated = true;
                            }
                        }
                    }
                    d.vx += (Math.random() - 0.5) * 1;
                    d.vy += (Math.random() - 0.5) * 1;
                    d.vx *= 0.9;
                    d.vy *= 0.9;
                    allDocked = false;
                } else if (d.state === 'RETURNING') {
                    const distToHome = Math.hypot(CX - d.x, CY - d.y);
                    if (distToHome < 20) {
                        d.state = 'DOCKED';
                        d.vx = 0;
                        d.vy = 0;
                        d.x = CX + (Math.random() - 0.5) * 20;
                        d.y = CY + (Math.random() - 0.5) * 20;
                    } else {
                        const angle = Math.atan2(CY - d.y, CX - d.x);
                        d.vx += Math.cos(angle) * 0.8;
                        d.vy += Math.sin(angle) * 0.8;
                        d.vx *= 0.92;
                        d.vy *= 0.92;
                        allDocked = false;
                    }
                }

                if (d.state !== 'DOCKED') {
                    d.x += d.vx;
                    d.y += d.vy;

                    // Bounds check
                    if (d.x < 0) d.vx += 2;
                    if (d.x > W) d.vx -= 2;
                    if (d.y < 0) d.vy += 2;
                    if (d.y > H) d.vy -= 2;

                    drawQuadcopter(ctx, d);
                }
            });

            // Check win condition
            if (!anyUnpollinated && allDocked) {
                setIsMissionComplete(true);
            }

            animRef.current = requestAnimationFrame(animate);
        };

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
            <div style={{ padding: '32px', borderBottom: '1px solid var(--gold-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="hud-button" onClick={onBack}>
                    <ChevronLeft size={16} /> RETURN TO GLOBE
                </button>
                <div style={{ textAlign: 'right' }}>
                    <h1 className="hud-title" style={{ fontSize: '20px' }}>HIVE {zone.hive}</h1>
                    <h2 className="hud-subtitle">{zone.name} · {zone.crop || 'Polli-Sector'}</h2>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', padding: '32px', gap: '32px', overflow: 'hidden' }}>
                {/* Canvas Container that shrinks when complete */}
                <div style={{
                    flex: isMissionComplete ? '0 0 50%' : '1',
                    transition: 'flex 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    border: '1px solid var(--gold-border)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

                    <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
                        <h1 className="hud-title">ACTIVE SWARM MARL.SIM</h1>
                        <h2 className="hud-subtitle" style={{ color: isMissionComplete ? 'var(--gold-text-muted)' : 'var(--green-healthy)' }}>
                            {isMissionComplete ? '● MISSION ACCOMPLISHED' : '● MAPPO-v3.2 DECENTRALIZED EXC.'}
                        </h2>
                    </div>

                    <div style={{ position: 'absolute', bottom: '24px', right: '24px', background: 'var(--bg-hud)', border: '1px solid var(--gold-border)', padding: '16px', display: 'flex', gap: '24px' }}>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}><Cpu size={12} /> AGX ORIN</div>
                            <div style={{ color: 'var(--gold-primary)', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>242 TOPS</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}><Activity size={12} /> COVERAGE</div>
                            <div style={{ color: 'var(--green-healthy)', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>
                                {isMissionComplete ? '100%' : '94.2%'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '10px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}><Battery size={12} /> SWARM ENG.</div>
                            <div style={{ color: 'var(--gold-glow)', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>88%</div>
                        </div>
                    </div>
                </div>

                {/* Text Area that fades in when complete */}
                <div style={{
                    flex: '1',
                    opacity: isMissionComplete ? 1 : 0,
                    transform: isMissionComplete ? 'translateX(0)' : 'translateX(50px)',
                    transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s', // Delay fade in
                    pointerEvents: isMissionComplete ? 'auto' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 40px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <CheckCircle size={48} color="var(--green-healthy)" />
                        <div>
                            <h1 className="hud-title" style={{ fontSize: '28px', color: 'var(--green-healthy)' }}>MISSION SUCCESS</h1>
                            <h2 className="hud-subtitle" style={{ fontSize: '14px' }}>POLLINATION CYCLE COMPLETE</h2>
                        </div>
                    </div>

                    <div style={{ borderLeft: '2px solid var(--gold-border)', paddingLeft: '24px' }}>
                        <p style={{ color: 'var(--gold-primary)', fontSize: '16px', lineHeight: '1.6', marginBottom: '16px' }}>
                            The Pollidrone swarm has successfully navigated the sector, identifying and pollinating all target crops with 100% accuracy.
                        </p>
                        <p style={{ color: 'var(--gold-text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
                            Driven by decentralized MAPPO algorithms on the NVIDIA AGX Orin, the drones dynamically allocated targets, avoided collisions, and utilized optimized pathing to maximize battery efficiency while ensuring complete agricultural coverage.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <li style={{ background: 'var(--bg-hud)', padding: '12px', border: '1px solid var(--gold-border)' }}>
                                <div style={{ fontSize: '10px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}>TOTAL FLIGHT TIME</div>
                                <div style={{ color: 'var(--gold-primary)', fontSize: '16px', fontWeight: 500 }}>04m 12s</div>
                            </li>
                            <li style={{ background: 'var(--bg-hud)', padding: '12px', border: '1px solid var(--gold-border)' }}>
                                <div style={{ fontSize: '10px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}>CROPS POLLINATED</div>
                                <div style={{ color: 'var(--green-healthy)', fontSize: '16px', fontWeight: 500 }}>80 / 80</div>
                            </li>
                            <li style={{ background: 'var(--bg-hud)', padding: '12px', border: '1px solid var(--gold-border)' }}>
                                <div style={{ fontSize: '10px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}>AVERAGE LATENCY</div>
                                <div style={{ color: 'var(--gold-primary)', fontSize: '16px', fontWeight: 500 }}>12ms via DGX Spark</div>
                            </li>
                            <li style={{ background: 'var(--bg-hud)', padding: '12px', border: '1px solid var(--gold-border)' }}>
                                <div style={{ fontSize: '10px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}>HARDWARE STATUS</div>
                                <div style={{ color: 'var(--green-healthy)', fontSize: '16px', fontWeight: 500 }}>ALL SYSTEMS GREEN</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
