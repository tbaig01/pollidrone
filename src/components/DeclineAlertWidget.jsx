import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeclineAlertWidget({ onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                position: 'absolute',
                top: '50%',
                left: '40px',
                transform: 'translateY(-50%)',
                background: 'rgba(3, 3, 3, 0.8)',
                border: '1px solid var(--red-alert)',
                padding: '16px 24px',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 0 20px rgba(255, 82, 82, 0.1)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 82, 82, 0.1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 82, 82, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(3, 3, 3, 0.8)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 82, 82, 0.1)';
            }}
        >
            <AlertTriangle className="pulsing-alert" size={24} color="var(--red-alert)" />
            <div>
                <div style={{ fontSize: '10px', color: 'var(--red-alert)', letterSpacing: '2px', fontWeight: 'bold' }}>
                    SYSTEM WARNING
                </div>
                <div style={{ fontSize: '14px', color: 'var(--gold-text)', marginTop: '4px' }}>
                    CRITICAL BIOMASS DECLINE DETECTED
                </div>
            </div>
            <div style={{
                fontSize: '10px',
                color: 'var(--gold-text-muted)',
                border: '1px solid var(--gold-border)',
                padding: '4px 8px',
                marginLeft: '16px'
            }}>
                VIEW DATA
            </div>
        </div>
    );
}
