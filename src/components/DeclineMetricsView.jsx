import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, Skull, Activity, Factory, DollarSign, Sprout, ChevronLeft } from 'lucide-react';
import '../index.css';

export default function DeclineMetricsView({ onClose }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Trigger animations after a short delay for dramatic effect
        const timer = setTimeout(() => {
            setMounted(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(3, 3, 3, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            zIndex: 50
        }}>
            {/* Back Button */}
            <button
                onClick={onClose}
                className="hud-button"
                style={{
                    position: 'absolute',
                    top: '48px',
                    left: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <ChevronLeft size={16} /> RETURN TO GLOBE
            </button>

            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', marginTop: '60px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <h1 className="hud-title" style={{ fontSize: '48px', marginBottom: '8px' }}>THE COLLAPSE</h1>
                    <h2 className="hud-subtitle" style={{ fontSize: '20px', color: 'var(--red-alert)' }}>
                        ● GLOBAL POLLINATOR CRISIS
                    </h2>
                </div>

                {/* 3-Column Grid Layout for the data */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>

                    {/* Slide 2: The Human Cost */}
                    <div style={{
                        background: 'var(--bg-hud)',
                        border: '1px solid var(--gold-border)',
                        padding: '32px',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <Skull size={32} color="var(--red-alert)" />
                            <h3 style={{ color: 'var(--gold-primary)', fontSize: '20px', margin: 0 }}>The Human Cost</h3>
                        </div>

                        <div style={{ fontSize: '56px', fontWeight: 700, color: 'var(--red-alert)', lineHeight: 1, marginBottom: '8px' }}>
                            500,000
                        </div>
                        <div style={{ color: 'var(--gold-primary)', fontSize: '20px', marginBottom: '24px' }}>
                            early deaths annually
                        </div>
                        <p style={{ color: 'var(--gold-text-muted)', fontSize: '16px', lineHeight: 1.6, margin: 0, marginTop: 'auto' }}>
                            Attributed to lower consumption of healthy foods due to insufficient pollination.
                            <br /><br /><span style={{ opacity: 0.6, fontSize: '12px' }}>Source: The Lancet Planetary Health</span>
                        </p>
                        <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.03 }}>
                            <Skull size={200} color="var(--red-alert)" />
                        </div>
                    </div>

                    {/* Slide 3: The Collapse (Animated Chart) */}
                    <div style={{
                        background: 'var(--bg-hud)',
                        border: '1px solid var(--gold-border)',
                        padding: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <TrendingDown size={32} color="var(--gold-glow)" />
                            <h3 style={{ color: 'var(--gold-primary)', fontSize: '20px', margin: 0 }}>Biomass Decline</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--gold-glow)' }}>-76%</div>
                                <div style={{ fontSize: '12px', color: 'var(--gold-text-muted)' }}>Flying Insect Biomass<br />(over 27 years)</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--red-alert)' }}>35%</div>
                                <div style={{ fontSize: '12px', color: 'var(--gold-text-muted)' }}>NA Bee Species<br />at Extinction Risk</div>
                            </div>
                        </div>

                        {/* Animated Chart SVG */}
                        <div style={{ position: 'relative', height: '120px', width: '100%', borderBottom: '1px solid rgba(255,215,0,0.2)', borderLeft: '1px solid rgba(255,215,0,0.2)' }}>
                            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                {/* Grid lines */}
                                <line x1="0" y1="25" x2="300" y2="25" stroke="rgba(255,215,0,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,215,0,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                <line x1="0" y1="75" x2="300" y2="75" stroke="rgba(255,215,0,0.1)" strokeWidth="1" strokeDasharray="4 4" />

                                {/* The Decline Line */}
                                <path
                                    d="M 0 10 Q 50 15, 100 30 T 200 60 T 300 90"
                                    fill="none"
                                    stroke="var(--gold-glow)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    style={{
                                        strokeDasharray: 400,
                                        strokeDashoffset: mounted ? 0 : 400,
                                        transition: 'stroke-dashoffset 3s cubic-bezier(0.4, 0, 0.2, 1) 0.5s'
                                    }}
                                />

                                {/* Area under curve */}
                                <path
                                    d="M 0 10 Q 50 15, 100 30 T 200 60 T 300 90 L 300 100 L 0 100 Z"
                                    fill="rgba(255, 215, 0, 0.1)"
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        transition: 'opacity 2s ease 2s'
                                    }}
                                />

                                {/* End dot */}
                                <circle
                                    cx="300" cy="90" r="4"
                                    fill="var(--red-alert)"
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        transition: 'opacity 0.5s ease 3s'
                                    }}
                                />
                            </svg>
                            <div style={{ position: 'absolute', bottom: -20, left: 0, fontSize: '10px', color: 'var(--gold-text-muted)' }}>1989</div>
                            <div style={{ position: 'absolute', bottom: -20, right: 0, fontSize: '10px', color: 'var(--gold-text-muted)' }}>Present</div>
                        </div>
                    </div>

                    {/* Slide 4: Cost of Inaction (Animated Spike) */}
                    <div style={{
                        background: 'var(--bg-hud)',
                        border: '1px solid var(--gold-border)',
                        padding: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            <AlertTriangle size={32} color="var(--gold-primary)" />
                            <h3 style={{ color: 'var(--gold-primary)', fontSize: '20px', margin: 0 }}>Cost of Inaction</h3>
                        </div>

                        <p style={{ color: 'var(--gold-text-muted)', fontSize: '14px', lineHeight: 1.5, marginBottom: '24px' }}>
                            Networks do not decline gradually. They hold until they hit a critical threshold, then collapse simultaneously.
                        </p>

                        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}>WELFARE LOSS</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--red-alert)' }}>$729B</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--gold-text-muted)', fontFamily: 'monospace' }}>CROP PRICE</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--red-alert)' }}>+187%</div>
                            </div>
                        </div>

                        {/* Animated Spike Chart */}
                        <div style={{ position: 'relative', height: '100px', width: '100%', borderBottom: '1px solid rgba(255,215,0,0.2)', overflow: 'hidden' }}>
                            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                {/* Sudden Spike Line */}
                                <path
                                    d="M 0 90 L 180 90 Q 200 90, 210 50 L 230 10 L 300 10"
                                    fill="none"
                                    stroke="var(--red-alert)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    style={{
                                        strokeDasharray: 400,
                                        strokeDashoffset: mounted ? 0 : 400,
                                        transition: 'stroke-dashoffset 2s cubic-bezier(1, 0, 0, 1) 2.5s'
                                    }}
                                />
                                {/* Forecast Area */}
                                <rect x="210" y="0" width="90" height="100" fill="rgba(255, 82, 82, 0.1)"
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        transition: 'opacity 1s ease 4s'
                                    }}
                                />
                            </svg>
                            <div style={{ position: 'absolute', top: 10, right: 10, fontSize: '12px', color: 'var(--red-alert)', opacity: mounted ? 1 : 0, transition: 'opacity 1s ease 4s', fontWeight: 'bold' }}>COLLAPSE EVENT</div>
                        </div>
                        <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--gold-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>ScienceDirect, Feb 2025</span>
                            <span>Ecological Economics, 2024</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
