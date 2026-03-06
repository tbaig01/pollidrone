import React from 'react';
import { Cpu } from 'lucide-react';

export default function SystemGuideWidget({ onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                position: 'absolute',
                top: '50%',
                right: '40px',
                transform: 'translateY(-50%)',
                background: 'rgba(3, 3, 3, 0.8)',
                border: '1px solid var(--blue-accent)',
                padding: '16px 24px',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 0 20px var(--blue-glow)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(76, 141, 201, 0.1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(76, 141, 201, 0.25)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(3, 3, 3, 0.8)';
                e.currentTarget.style.boxShadow = '0 0 20px var(--blue-glow)';
            }}
        >
            <div>
                <div style={{ fontSize: '10px', color: 'var(--blue-accent)', letterSpacing: '2px', fontWeight: 'bold' }}>
                    SYSTEM ARCHITECTURE
                </div>
                <div style={{ fontSize: '14px', color: 'var(--gold-text)', marginTop: '4px' }}>
                    THE POLLIDRONE PLATFORM
                </div>
            </div>
            <Cpu className="pulsing-alert" size={24} color="var(--blue-accent)" style={{ animation: 'none', opacity: 0.8 }} />
            <div style={{
                fontSize: '10px',
                color: 'var(--gold-text-muted)',
                border: '1px solid var(--gold-border)',
                padding: '4px 8px',
                marginLeft: '4px'
            }}>
                VIEW SYSTEM
            </div>
        </div>
    );
}
