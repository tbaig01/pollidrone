import { useState, useEffect, useRef, useCallback } from "react";

const NVIDIA_GREEN = "#76B900";
const NVIDIA_GREEN_DIM = "#4a7a00";
const BG_DARK = "#0a0e13";
const BG_CARD = "#111820";
const BG_CARD_HOVER = "#1a2230";
const BORDER = "#1e2a3a";
const TEXT_PRIMARY = "#e8edf3";
const TEXT_SECONDARY = "#7a8a9e";
const CRITICAL_RED = "#ff4757";
const WARNING_AMBER = "#ffa502";
const HEALTHY_GREEN = "#2ed573";

// Simulated zone data
const ZONES = [
    { id: 1, name: "Thames Valley, UK", lat: 51.45, lng: -0.98, health: 0.34, status: "critical", crop: "Rapeseed", area: "2,400 ha", beeActivity: 12, swarmDeployed: true, drones: 24 },
    { id: 2, name: "Andalusia, Spain", lat: 37.38, lng: -5.99, health: 0.52, status: "warning", crop: "Almonds", area: "8,100 ha", beeActivity: 31, swarmDeployed: true, drones: 48 },
    { id: 3, name: "California Central Valley", lat: 36.77, lng: -119.42, health: 0.41, status: "critical", crop: "Almonds", area: "12,300 ha", beeActivity: 18, swarmDeployed: false, drones: 0 },
    { id: 4, name: "Provence, France", lat: 43.95, lng: 6.06, health: 0.78, status: "healthy", crop: "Lavender", area: "3,200 ha", beeActivity: 67, swarmDeployed: false, drones: 0 },
    { id: 5, name: "Punjab, India", lat: 31.15, lng: 75.34, health: 0.29, status: "critical", crop: "Mustard", area: "15,700 ha", beeActivity: 8, swarmDeployed: true, drones: 64 },
    { id: 6, name: "Hokkaido, Japan", lat: 43.06, lng: 141.35, health: 0.61, status: "warning", crop: "Melon", area: "1,800 ha", beeActivity: 42, swarmDeployed: false, drones: 0 },
    { id: 7, name: "Kent, UK", lat: 51.27, lng: 0.52, health: 0.88, status: "healthy", crop: "Apples", area: "4,500 ha", beeActivity: 73, swarmDeployed: false, drones: 0 },
    { id: 8, name: "São Paulo, Brazil", lat: -23.55, lng: -46.63, health: 0.45, status: "warning", crop: "Coffee", area: "9,400 ha", beeActivity: 25, swarmDeployed: true, drones: 36 },
];

const ORCHESTRATOR_LOG = [
    { time: "14:32:07", type: "alert", msg: "NDVI anomaly detected — Thames Valley rapeseed zone dropped below 0.35 threshold" },
    { time: "14:32:08", type: "analysis", msg: "Cross-referencing Sentinel-2 spectral data with historical bloom cycles..." },
    { time: "14:32:09", type: "decision", msg: "Pollination deficit confirmed. Bee activity at 12% of expected baseline." },
    { time: "14:32:10", type: "deploy", msg: "Dispatching Swarm-07 (24 units) to Thames Valley. ETA: 12 min. Policy: MAPPO-v3.2" },
    { time: "14:33:15", type: "alert", msg: "Punjab mustard zone NDVI critical — 0.29. Seasonal window closing in 48hrs." },
    { time: "14:33:16", type: "decision", msg: "Priority escalation: Punjab moved to URGENT. Deploying Swarm-12 (64 units)." },
    { time: "14:34:02", type: "status", msg: "Andalusia Swarm-03 coverage at 67%. Energy reserves nominal. Re-optimizing paths." },
    { time: "14:35:11", type: "analysis", msg: "São Paulo coffee bloom detected via spectral shift. Deploying preventive swarm." },
    { time: "14:36:44", type: "status", msg: "Thames Valley Swarm-07 pollination rate: 94.2% coverage achieved in sector A." },
    { time: "14:37:22", type: "decision", msg: "Hokkaido melon zone approaching threshold — scheduling pre-emptive reconnaissance." },
];

const StatusBadge = ({ status }) => {
    const colors = {
        critical: { bg: "rgba(255,71,87,0.15)", text: CRITICAL_RED, border: "rgba(255,71,87,0.3)" },
        warning: { bg: "rgba(255,165,2,0.15)", text: WARNING_AMBER, border: "rgba(255,165,2,0.3)" },
        healthy: { bg: "rgba(46,213,115,0.15)", text: HEALTHY_GREEN, border: "rgba(46,213,115,0.3)" },
    };
    const c = colors[status];
    return (
        <span style={{
            padding: "2px 10px",
            borderRadius: "12px",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            background: c.bg,
            color: c.text,
            border: `1px solid ${c.border}`,
        }}>
            {status === "critical" && "● "}{status}
        </span>
    );
};

const KPICard = ({ label, value, unit, trend, icon }) => (
    <div style={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: "12px",
        padding: "20px",
        flex: 1,
        minWidth: "180px",
        position: "relative",
        overflow: "hidden",
    }}>
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${NVIDIA_GREEN}, transparent)`,
        }} />
        <div style={{ fontSize: "12px", color: TEXT_SECONDARY, marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
            {icon} {label}
        </div>
        <div style={{ fontSize: "32px", fontWeight: 700, color: TEXT_PRIMARY, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>
            {value}<span style={{ fontSize: "14px", color: TEXT_SECONDARY, marginLeft: "4px" }}>{unit}</span>
        </div>
        {trend && (
            <div style={{ fontSize: "12px", color: trend > 0 ? HEALTHY_GREEN : CRITICAL_RED, marginTop: "6px", fontFamily: "'JetBrains Mono', monospace" }}>
                {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last cycle
            </div>
        )}
    </div>
);

const MiniNDVIChart = ({ value }) => {
    const w = 120, h = 32;
    // Generate fake historical data trending to current value
    const points = Array.from({ length: 12 }, (_, i) => {
        const base = value + (Math.random() - 0.5) * 0.2;
        const trend = value + ((i - 11) * (value - 0.6)) / 11;
        return Math.max(0, Math.min(1, trend + (Math.random() - 0.5) * 0.1));
    });
    const pathD = points.map((p, i) => {
        const x = (i / 11) * w;
        const y = h - p * h;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ");
    const color = value < 0.4 ? CRITICAL_RED : value < 0.6 ? WARNING_AMBER : HEALTHY_GREEN;

    return (
        <svg width={w} height={h} style={{ display: "block" }}>
            <defs>
                <linearGradient id={`grad-${value}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`${pathD} L${w},${h} L0,${h} Z`} fill={`url(#grad-${value})`} />
            <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
    );
};

// Simulated world map with zone markers
const WorldMap = ({ zones, selectedZone, onSelect }) => {
    // Simple mercator projection
    const project = (lat, lng) => {
        const x = ((lng + 180) / 360) * 100;
        const latRad = (lat * Math.PI) / 180;
        const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 100;
        return { x: `${x}%`, y: `${y}%` };
    };

    return (
        <div style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: `radial-gradient(ellipse at 50% 50%, #0f1923 0%, ${BG_DARK} 100%)`,
            borderRadius: "8px",
            overflow: "hidden",
        }}>
            {/* Grid lines */}
            <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, opacity: 0.08 }}>
                {Array.from({ length: 19 }, (_, i) => (
                    <line key={`v${i}`} x1={`${(i / 18) * 100}%`} y1="0" x2={`${(i / 18) * 100}%`} y2="100%" stroke={NVIDIA_GREEN} strokeWidth="0.5" />
                ))}
                {Array.from({ length: 10 }, (_, i) => (
                    <line key={`h${i}`} x1="0" y1={`${(i / 9) * 100}%`} x2="100%" y2={`${(i / 9) * 100}%`} stroke={NVIDIA_GREEN} strokeWidth="0.5" />
                ))}
            </svg>
            {/* Continent outlines - simplified shapes */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, opacity: 0.12 }}>
                {/* Europe */}
                <ellipse cx="53" cy="28" rx="6" ry="8" fill={NVIDIA_GREEN} />
                {/* Africa */}
                <ellipse cx="53" cy="48" rx="7" ry="12" fill={NVIDIA_GREEN} />
                {/* Asia */}
                <ellipse cx="70" cy="32" rx="14" ry="10" fill={NVIDIA_GREEN} />
                {/* North America */}
                <ellipse cx="25" cy="30" rx="10" ry="9" fill={NVIDIA_GREEN} />
                {/* South America */}
                <ellipse cx="32" cy="55" rx="5" ry="12" fill={NVIDIA_GREEN} />
                {/* Australia */}
                <ellipse cx="82" cy="58" rx="5" ry="4" fill={NVIDIA_GREEN} />
            </svg>

            {/* Zone markers */}
            {zones.map((zone) => {
                const pos = project(zone.lat, zone.lng);
                const isSelected = selectedZone?.id === zone.id;
                const color = zone.status === "critical" ? CRITICAL_RED : zone.status === "warning" ? WARNING_AMBER : HEALTHY_GREEN;
                return (
                    <div
                        key={zone.id}
                        onClick={() => onSelect(zone)}
                        style={{
                            position: "absolute",
                            left: pos.x,
                            top: pos.y,
                            transform: "translate(-50%, -50%)",
                            cursor: "pointer",
                            zIndex: isSelected ? 10 : 1,
                        }}
                    >
                        {/* Pulse ring for critical/deployed */}
                        {(zone.status === "critical" || zone.swarmDeployed) && (
                            <div style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: isSelected ? "48px" : "32px",
                                height: isSelected ? "48px" : "32px",
                                borderRadius: "50%",
                                border: `1px solid ${color}`,
                                opacity: 0.4,
                                animation: "pulse 2s ease-in-out infinite",
                            }} />
                        )}
                        <div style={{
                            width: isSelected ? "16px" : "10px",
                            height: isSelected ? "16px" : "10px",
                            borderRadius: "50%",
                            background: color,
                            boxShadow: `0 0 ${isSelected ? "20px" : "10px"} ${color}`,
                            border: isSelected ? `2px solid white` : "none",
                            transition: "all 0.2s ease",
                        }} />
                        {isSelected && (
                            <div style={{
                                position: "absolute",
                                top: "-8px",
                                left: "20px",
                                background: BG_CARD,
                                border: `1px solid ${BORDER}`,
                                borderRadius: "8px",
                                padding: "8px 12px",
                                whiteSpace: "nowrap",
                                zIndex: 20,
                                minWidth: "180px",
                            }}>
                                <div style={{ fontSize: "12px", fontWeight: 600, color: TEXT_PRIMARY }}>{zone.name}</div>
                                <div style={{ fontSize: "11px", color: TEXT_SECONDARY, marginTop: "2px" }}>{zone.crop} · {zone.area}</div>
                                <div style={{ display: "flex", gap: "8px", marginTop: "6px", alignItems: "center" }}>
                                    <StatusBadge status={zone.status} />
                                    {zone.swarmDeployed && (
                                        <span style={{ fontSize: "10px", color: NVIDIA_GREEN, fontFamily: "'JetBrains Mono', monospace" }}>
                                            ◆ {zone.drones} drones active
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Map label */}
            <div style={{
                position: "absolute",
                bottom: "12px",
                left: "16px",
                fontSize: "10px",
                color: TEXT_SECONDARY,
                fontFamily: "'JetBrains Mono', monospace",
                opacity: 0.6,
                letterSpacing: "1px",
            }}>
                SENTINEL-2 / LANDSAT HLS · NDVI OVERLAY · LIVE
            </div>
            <div style={{
                position: "absolute",
                bottom: "12px",
                right: "16px",
                fontSize: "10px",
                color: TEXT_SECONDARY,
                fontFamily: "'JetBrains Mono', monospace",
                opacity: 0.6,
            }}>
                30m resolution · 2-3 day revisit
            </div>
        </div>
    );
};

const SwarmSimPanel = ({ zone }) => {
    const canvasRef = useRef(null);
    const dronesRef = useRef([]);
    const animRef = useRef(null);
    const flowersRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = canvas.width = 400;
        const H = canvas.height = 280;

        // Generate flowers
        flowersRef.current = Array.from({ length: 40 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            pollinated: Math.random() < 0.3,
            size: 3 + Math.random() * 3,
        }));

        // Generate drones
        const numDrones = zone?.drones || 16;
        dronesRef.current = Array.from({ length: Math.min(numDrones, 30) }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            target: null,
        }));

        const animate = () => {
            ctx.fillStyle = "rgba(10, 14, 19, 0.15)";
            ctx.fillRect(0, 0, W, H);

            // Draw flowers
            flowersRef.current.forEach((f) => {
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
                ctx.fillStyle = f.pollinated ? "rgba(46,213,115,0.6)" : "rgba(255,165,2,0.4)";
                ctx.fill();
                if (f.pollinated) {
                    ctx.beginPath();
                    ctx.arc(f.x, f.y, f.size + 3, 0, Math.PI * 2);
                    ctx.strokeStyle = "rgba(46,213,115,0.15)";
                    ctx.stroke();
                }
            });

            // Update and draw drones
            dronesRef.current.forEach((d) => {
                // Find nearest unpollinated flower
                let nearest = null;
                let minDist = Infinity;
                flowersRef.current.forEach((f) => {
                    if (!f.pollinated) {
                        const dist = Math.hypot(f.x - d.x, f.y - d.y);
                        if (dist < minDist) {
                            minDist = dist;
                            nearest = f;
                        }
                    }
                });

                if (nearest && minDist > 5) {
                    const angle = Math.atan2(nearest.y - d.y, nearest.x - d.x);
                    d.vx += Math.cos(angle) * 0.15;
                    d.vy += Math.sin(angle) * 0.15;
                } else if (nearest && minDist <= 5) {
                    nearest.pollinated = true;
                }

                // Add some randomness
                d.vx += (Math.random() - 0.5) * 0.3;
                d.vy += (Math.random() - 0.5) * 0.3;

                // Damping
                d.vx *= 0.95;
                d.vy *= 0.95;

                d.x += d.vx;
                d.y += d.vy;

                // Bounds
                if (d.x < 0 || d.x > W) d.vx *= -1;
                if (d.y < 0 || d.y > H) d.vy *= -1;
                d.x = Math.max(0, Math.min(W, d.x));
                d.y = Math.max(0, Math.min(H, d.y));

                // Draw drone
                ctx.beginPath();
                ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = NVIDIA_GREEN;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(d.x, d.y, 8, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(118,185,0,0.2)`;
                ctx.stroke();

                // Draw trail
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - d.vx * 6, d.y - d.vy * 6);
                ctx.strokeStyle = `rgba(118,185,0,0.15)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // Reset some pollinated flowers over time
            if (Math.random() < 0.02) {
                const polled = flowersRef.current.filter((f) => f.pollinated);
                if (polled.length > flowersRef.current.length * 0.8) {
                    flowersRef.current.forEach((f) => {
                        if (Math.random() < 0.3) f.pollinated = false;
                    });
                }
            }

            animRef.current = requestAnimationFrame(animate);
        };

        // Initial clear
        ctx.fillStyle = BG_DARK;
        ctx.fillRect(0, 0, W, H);
        animate();

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [zone]);

    const pollinatedCount = flowersRef.current.filter((f) => f.pollinated).length;
    const total = flowersRef.current.length;

    return (
        <div style={{ position: "relative" }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "280px",
                    borderRadius: "8px",
                    display: "block",
                }}
            />
            <div style={{
                position: "absolute",
                top: "10px",
                left: "12px",
                fontSize: "10px",
                fontFamily: "'JetBrains Mono', monospace",
                color: NVIDIA_GREEN,
                background: "rgba(10,14,19,0.8)",
                padding: "4px 8px",
                borderRadius: "4px",
                letterSpacing: "0.5px",
            }}>
                SWARM SIMULATION · MAPPO-v3.2 · LIVE
            </div>
            <div style={{
                position: "absolute",
                top: "10px",
                right: "12px",
                display: "flex",
                gap: "12px",
                fontSize: "10px",
                fontFamily: "'JetBrains Mono', monospace",
                background: "rgba(10,14,19,0.8)",
                padding: "4px 8px",
                borderRadius: "4px",
            }}>
                <span style={{ color: NVIDIA_GREEN }}>● drone</span>
                <span style={{ color: HEALTHY_GREEN }}>● pollinated</span>
                <span style={{ color: WARNING_AMBER }}>● pending</span>
            </div>
        </div>
    );
};

const OrchestratorLog = () => {
    const [visibleLogs, setVisibleLogs] = useState([]);
    const logRef = useRef(null);

    useEffect(() => {
        // Gradually reveal logs
        ORCHESTRATOR_LOG.forEach((_, i) => {
            setTimeout(() => {
                setVisibleLogs((prev) => [...prev, ORCHESTRATOR_LOG[i]]);
            }, i * 800);
        });
    }, []);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [visibleLogs]);

    const typeColors = {
        alert: CRITICAL_RED,
        analysis: "#7c8cf5",
        decision: NVIDIA_GREEN,
        deploy: WARNING_AMBER,
        status: TEXT_SECONDARY,
    };

    const typeLabels = {
        alert: "ALERT",
        analysis: "ANALYSIS",
        decision: "DECISION",
        deploy: "DEPLOY",
        status: "STATUS",
    };

    return (
        <div
            ref={logRef}
            style={{
                height: "280px",
                overflowY: "auto",
                padding: "12px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                lineHeight: "1.8",
                scrollbarWidth: "thin",
                scrollbarColor: `${BORDER} transparent`,
            }}
        >
            {visibleLogs.map((log, i) => (
                <div key={i} style={{ marginBottom: "4px", opacity: 0, animation: "fadeIn 0.3s forwards" }}>
                    <span style={{ color: TEXT_SECONDARY }}>{log.time}</span>
                    <span style={{
                        color: typeColors[log.type],
                        marginLeft: "8px",
                        fontWeight: 600,
                        fontSize: "9px",
                        padding: "1px 5px",
                        borderRadius: "3px",
                        background: `${typeColors[log.type]}15`,
                        border: `1px solid ${typeColors[log.type]}30`,
                    }}>
                        {typeLabels[log.type]}
                    </span>
                    <span style={{ color: TEXT_PRIMARY, marginLeft: "8px" }}>{log.msg}</span>
                </div>
            ))}
            <div style={{ color: NVIDIA_GREEN, animation: "blink 1s infinite" }}>▋</div>
        </div>
    );
};

const ZoneTable = ({ zones, selectedZone, onSelect }) => (
    <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {["Zone", "Crop", "NDVI", "Trend", "Bee Activity", "Status", "Swarm"].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: TEXT_SECONDARY, fontWeight: 500, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {zones.map((z) => (
                    <tr
                        key={z.id}
                        onClick={() => onSelect(z)}
                        style={{
                            borderBottom: `1px solid ${BORDER}`,
                            background: selectedZone?.id === z.id ? `${NVIDIA_GREEN}08` : "transparent",
                            cursor: "pointer",
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => { if (selectedZone?.id !== z.id) e.currentTarget.style.background = BG_CARD_HOVER; }}
                        onMouseLeave={(e) => { if (selectedZone?.id !== z.id) e.currentTarget.style.background = "transparent"; }}
                    >
                        <td style={{ padding: "10px 12px", color: TEXT_PRIMARY, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{z.name}</td>
                        <td style={{ padding: "10px 12px", color: TEXT_SECONDARY }}>{z.crop}</td>
                        <td style={{ padding: "10px 12px", color: z.health < 0.4 ? CRITICAL_RED : z.health < 0.6 ? WARNING_AMBER : HEALTHY_GREEN, fontWeight: 600 }}>{z.health.toFixed(2)}</td>
                        <td style={{ padding: "10px 12px" }}><MiniNDVIChart value={z.health} /></td>
                        <td style={{ padding: "10px 12px", color: z.beeActivity < 20 ? CRITICAL_RED : z.beeActivity < 50 ? WARNING_AMBER : HEALTHY_GREEN }}>{z.beeActivity}%</td>
                        <td style={{ padding: "10px 12px" }}><StatusBadge status={z.status} /></td>
                        <td style={{ padding: "10px 12px" }}>
                            {z.swarmDeployed ? (
                                <span style={{ color: NVIDIA_GREEN }}>◆ {z.drones} active</span>
                            ) : (
                                <span style={{ color: TEXT_SECONDARY }}>—</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default function PolliSyncDashboard() {
    const [selectedZone, setSelectedZone] = useState(ZONES[0]);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const totalDrones = ZONES.reduce((s, z) => s + z.drones, 0);
    const criticalZones = ZONES.filter((z) => z.status === "critical").length;
    const avgNDVI = (ZONES.reduce((s, z) => s + z.health, 0) / ZONES.length).toFixed(2);
    const monitoredArea = "57,400";

    return (
        <div style={{
            background: BG_DARK,
            color: TEXT_PRIMARY,
            minHeight: "100vh",
            fontFamily: "'DM Sans', -apple-system, sans-serif",
            padding: "0",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 4px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 28px",
                borderBottom: `1px solid ${BORDER}`,
                background: `linear-gradient(180deg, ${BG_CARD} 0%, ${BG_DARK} 100%)`,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: `linear-gradient(135deg, ${NVIDIA_GREEN}, ${NVIDIA_GREEN_DIM})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: BG_DARK,
                    }}>
                        P
                    </div>
                    <div>
                        <div style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.5px" }}>
                            PolliSync
                            <span style={{ color: NVIDIA_GREEN, fontSize: "10px", marginLeft: "8px", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, verticalAlign: "middle", padding: "2px 6px", background: `${NVIDIA_GREEN}15`, borderRadius: "4px", border: `1px solid ${NVIDIA_GREEN}30` }}>
                                POWERED BY DGX SPARK
                            </span>
                        </div>
                        <div style={{ fontSize: "11px", color: TEXT_SECONDARY, fontFamily: "'JetBrains Mono', monospace", marginTop: "2px" }}>
                            Global Pollination Intelligence · Mission Control
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", color: TEXT_PRIMARY }}>
                            {time.toLocaleTimeString("en-GB")} UTC
                        </div>
                        <div style={{ fontSize: "10px", color: TEXT_SECONDARY, fontFamily: "'JetBrains Mono', monospace" }}>
                            {time.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </div>
                    </div>
                    <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: HEALTHY_GREEN,
                        boxShadow: `0 0 8px ${HEALTHY_GREEN}`,
                    }} />
                </div>
            </div>

            {/* KPI Row */}
            <div style={{
                display: "flex",
                gap: "16px",
                padding: "20px 28px",
                flexWrap: "wrap",
            }}>
                <KPICard icon="🌍" label="Zones Monitored" value={ZONES.length} unit="regions" trend={12} />
                <KPICard icon="🤖" label="Active Drones" value={totalDrones} unit="units" trend={28} />
                <KPICard icon="⚠️" label="Critical Zones" value={criticalZones} unit="zones" trend={-15} />
                <KPICard icon="🌱" label="Avg NDVI" value={avgNDVI} unit="" trend={8} />
                <KPICard icon="📡" label="Area Monitored" value={monitoredArea} unit="ha" trend={34} />
            </div>

            {/* Main Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                padding: "0 28px 16px",
            }}>
                {/* Left: Map */}
                <div style={{
                    background: BG_CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                }}>
                    <div style={{
                        padding: "14px 18px",
                        borderBottom: `1px solid ${BORDER}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>
                            🛰️ Satellite Monitoring · Ecosystem Health
                        </div>
                        <div style={{ fontSize: "10px", color: TEXT_SECONDARY, fontFamily: "'JetBrains Mono', monospace" }}>
                            NASA HLS · Sentinel-2 · Copernicus
                        </div>
                    </div>
                    <div style={{ height: "340px", padding: "8px" }}>
                        <WorldMap zones={ZONES} selectedZone={selectedZone} onSelect={setSelectedZone} />
                    </div>
                </div>

                {/* Right: Swarm Sim + Orchestrator */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Swarm Simulation */}
                    <div style={{
                        background: BG_CARD,
                        border: `1px solid ${BORDER}`,
                        borderRadius: "12px",
                        overflow: "hidden",
                        flex: 1,
                    }}>
                        <div style={{
                            padding: "14px 18px",
                            borderBottom: `1px solid ${BORDER}`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <div style={{ fontSize: "13px", fontWeight: 600 }}>
                                🐝 Swarm Digital Twin · {selectedZone?.name || "Select Zone"}
                            </div>
                            <div style={{
                                fontSize: "10px",
                                color: NVIDIA_GREEN,
                                fontFamily: "'JetBrains Mono', monospace",
                                padding: "2px 8px",
                                background: `${NVIDIA_GREEN}10`,
                                borderRadius: "4px",
                            }}>
                                MARL · {selectedZone?.drones || 16} agents
                            </div>
                        </div>
                        <SwarmSimPanel zone={selectedZone} />
                    </div>
                </div>
            </div>

            {/* Orchestrator Log */}
            <div style={{ padding: "0 28px 16px" }}>
                <div style={{
                    background: BG_CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                }}>
                    <div style={{
                        padding: "14px 18px",
                        borderBottom: `1px solid ${BORDER}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>
                            🧠 AI Orchestrator · Claude Strategic Agent
                        </div>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <span style={{ fontSize: "10px", color: HEALTHY_GREEN, fontFamily: "'JetBrains Mono', monospace" }}>● ONLINE</span>
                            <span style={{ fontSize: "10px", color: TEXT_SECONDARY, fontFamily: "'JetBrains Mono', monospace" }}>·</span>
                            <span style={{ fontSize: "10px", color: TEXT_SECONDARY, fontFamily: "'JetBrains Mono', monospace" }}>inference on DGX Spark</span>
                        </div>
                    </div>
                    <OrchestratorLog />
                </div>
            </div>

            {/* Zone Table */}
            <div style={{ padding: "0 28px 28px" }}>
                <div style={{
                    background: BG_CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                }}>
                    <div style={{
                        padding: "14px 18px",
                        borderBottom: `1px solid ${BORDER}`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <div style={{ fontSize: "13px", fontWeight: 600 }}>
                            📊 Zone Intelligence Feed
                        </div>
                        <div style={{ fontSize: "10px", color: TEXT_SECONDARY, fontFamily: "'JetBrains Mono', monospace" }}>
                            {ZONES.length} zones · click to inspect
                        </div>
                    </div>
                    <ZoneTable zones={ZONES} selectedZone={selectedZone} onSelect={setSelectedZone} />
                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: "16px 28px",
                borderTop: `1px solid ${BORDER}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "10px",
                fontFamily: "'JetBrains Mono', monospace",
                color: TEXT_SECONDARY,
            }}>
                <div>PolliSync v0.1.0 · NVIDIA DGX Spark · MARL Swarm Intelligence</div>
                <div>Built by Ayman & Vlad · NVIDIA AI Day 2026</div>
            </div>
        </div>
    );
}
