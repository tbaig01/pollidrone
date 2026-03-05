import React from 'react';
import { ChevronLeft, Plus, Minus, Maximize, Target } from 'lucide-react';

export default function HUD({
    hiveHealth = 98,
    isDragActive = true,
    onResetZoom
}) {
    return (
        <>
            {/* Top Left - Title and Status */}
            <div className="hud-panel hud-top-left" style={{ padding: '24px' }}>
                <button className="hud-button" style={{ marginBottom: '40px', padding: '4px 8px' }}>
                    <ChevronLeft size={14} style={{ marginRight: '4px' }} />
                    GLOBE DRAG: {isDragActive ? 'ACTIVE' : 'LOCKED'}
                </button>

                <h1 className="hud-title">GLOBAL HIVE OPERATIONS</h1>
                <h2 className="hud-subtitle">OVERVIEW DASHBOARD</h2>
                <h2 className="hud-subtitle" style={{ color: 'var(--gold-dim)' }}>BACKDROP</h2>
            </div>

            {/* Top Right - Zoom & Health */}
            <div className="hud-panel hud-top-right" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '220px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--gold-border)', paddingBottom: '8px' }}>
                    <span className="hud-subtitle" style={{ margin: 0 }}>ZOOM CONTROL</span>
                    <Maximize size={12} color="var(--gold-text-muted)" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Minus size={14} style={{ cursor: 'pointer', color: 'var(--gold-text-muted)' }} onClick={onResetZoom} />
                    {/* Custom zoom slider visualization */}
                    <div style={{ flex: 1, margin: '0 12px', height: '2px', background: 'var(--gold-border)', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '40%', top: '-3px', width: '8px', height: '8px', background: 'var(--gold-primary)', borderRadius: '50%', boxShadow: '0 0 8px var(--gold-glow)' }} />
                    </div>
                    <Plus size={14} style={{ cursor: 'pointer', color: 'var(--gold-primary)' }} />
                </div>

                <div style={{ borderTop: '1px solid var(--gold-border)', paddingTop: '12px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="hud-subtitle" style={{ margin: 0 }}>HIVE HEALTH:</span>
                    <span className="status-value animate-pulse" style={{ color: 'var(--gold-glow)' }}>{hiveHealth}%</span>
                </div>
            </div>

            {/* Bottom Left - Detailed Logs / Status */}
            <div className="hud-panel hud-bottom-left" style={{ width: '260px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--gold-border)', paddingBottom: '8px', marginBottom: '8px' }}>
                    <span className="hud-subtitle" style={{ margin: 0 }}>SYSTEM DIAGNOSTICS</span>
                    <Target size={12} color="var(--gold-primary)" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '9px', color: 'var(--gold-text-muted)', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                    <span>NODE SYNC:</span> <span style={{ textAlign: 'right', color: 'var(--gold-primary)' }}>OPTIMAL</span>
                    <span>MAPPO STATE:</span> <span style={{ textAlign: 'right', color: 'var(--gold-primary)' }}>ONLINE</span>
                    <span>CTDE CLUSTER:</span> <span style={{ textAlign: 'right', color: 'var(--gold-primary)' }}>ACTIVE</span>
                    <span>ORIN INFERENCE:</span> <span style={{ textAlign: 'right', color: 'var(--gold-primary)' }}>2.4ms</span>
                    <span>SPARK UPLINK:</span> <span style={{ textAlign: 'right', color: 'var(--gold-primary)' }}>ENABLED</span>
                </div>
                <div style={{ borderTop: '1px solid var(--gold-border)', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="hud-subtitle" style={{ margin: 0 }}>GLOBAL HIVE STATUS:</span>
                    <span className="status-value">{hiveHealth}%</span>
                </div>
            </div>

            {/* Bottom Right Reticle / Logo */}
            <div className="hud-panel hud-bottom-right" style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 10px rgba(255,193,77,0.5))' }}>
                    <path d="M50,10 L60,40 L90,50 L60,60 L50,90 L40,60 L10,50 L40,40 Z" fill="var(--gold-primary)" opacity="0.8" />
                    <path d="M50,30 L55,45 L70,50 L55,55 L50,70 L45,55 L30,50 L45,45 Z" fill="#fff" opacity="0.9" />
                </svg>
            </div>
        </>
    );
}
