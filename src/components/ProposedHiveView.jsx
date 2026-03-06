import React from 'react';
import { ChevronLeft, MapPin, Send, Globe, Shield } from 'lucide-react';

export default function ProposedHiveView({ zone, onBack }) {
    // Determine region-specific government and charity
    const regionInfo = {
        'Borneo, Malaysia': {
            government: 'Malaysian Ministry of Natural Resources & Environmental Sustainability (NRES)',
            charity: 'WWF-Malaysia & Borneo Conservation Trust',
            flag: '🇲🇾',
            ecosystem: 'Tropical Rainforest & Palm Oil Plantation Buffer Zones',
            deficitType: 'Critical pollinator decline due to deforestation and monoculture expansion',
            satellites: 'Sentinel-2 NDVI anomaly detected — 34% pollinator activity drop over 18 months',
        },
        'Great Rift Valley, Kenya': {
            government: 'Kenya Wildlife Service (KWS) & National Environment Management Authority (NEMA)',
            charity: 'WWF-Kenya & African Wildlife Foundation',
            flag: '🇰🇪',
            ecosystem: 'Savanna-Highland Transition & Smallholder Agriculture',
            deficitType: 'Pollinator deficit threatening smallholder crop yields across 12,000+ hectares',
            satellites: 'NASA HLS spectral analysis — EVI decline of 28% correlating with reduced fruit-set',
        },
    };

    const info = regionInfo[zone.name] || regionInfo['Borneo, Malaysia'];

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            background: 'rgba(3, 3, 3, 0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                padding: '32px',
                borderBottom: '1px solid rgba(76, 141, 201, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <button className="hud-button" onClick={onBack}>
                    <ChevronLeft size={16} /> RETURN TO GLOBE
                </button>
                <div style={{ textAlign: 'right' }}>
                    <h1 className="hud-title" style={{ fontSize: '20px', color: '#4c8dc9' }}>
                        PROPOSED SITE — {zone.hive}
                    </h1>
                    <h2 className="hud-subtitle" style={{ color: '#7da8c9' }}>
                        {zone.name} · Conservation Intelligence
                    </h2>
                </div>
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px',
            }}>
                <div style={{ maxWidth: '800px', width: '100%' }}>
                    {/* Status Badge */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '40px',
                    }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: '#4c8dc9',
                            boxShadow: '0 0 12px rgba(76,141,201,0.6)',
                            animation: 'pulse 2s ease-in-out infinite',
                        }} />
                        <span style={{
                            fontSize: '14px',
                            fontFamily: 'monospace',
                            letterSpacing: '0.2em',
                            color: '#4c8dc9',
                            fontWeight: 600,
                        }}>PROPOSAL PENDING</span>
                    </div>

                    {/* Main Proposal Card */}
                    <div style={{
                        border: '1px solid rgba(76,141,201,0.25)',
                        borderRadius: '10px',
                        background: 'rgba(76,141,201,0.04)',
                        padding: '40px',
                        marginBottom: '24px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                            <MapPin size={36} color="#4c8dc9" />
                            <div>
                                <h2 style={{
                                    fontSize: '26px',
                                    fontWeight: 300,
                                    color: '#f0ead6',
                                    margin: 0,
                                }}>{info.flag} {zone.name}</h2>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#7da8c9',
                                    fontFamily: 'monospace',
                                    marginTop: '4px',
                                    letterSpacing: '0.05em',
                                }}>{info.ecosystem}</div>
                            </div>
                        </div>

                        <p style={{
                            fontSize: '17px',
                            color: '#f0ead6',
                            lineHeight: 1.8,
                            opacity: 0.85,
                            margin: '0 0 24px 0',
                        }}>
                            This site has been identified as a <span style={{ color: '#4c8dc9', fontWeight: 500 }}>pollinator deficit zone</span> through
                            combined satellite imagery and drone ground-truth survey data. Based on our Conservation Intelligence analysis,
                            a <span style={{ color: '#c9a84c', fontWeight: 500 }}>BeeHive deployment</span> has been formally proposed to the
                            region's governing body and conservation partners.
                        </p>

                        {/* Deficit Details */}
                        <div style={{
                            background: 'rgba(76,141,201,0.08)',
                            border: '1px solid rgba(76,141,201,0.15)',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '24px',
                        }}>
                            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#7da8c9', letterSpacing: '0.15em', marginBottom: '8px' }}>DEFICIT ANALYSIS</div>
                            <div style={{ fontSize: '15px', color: '#f0ead6', lineHeight: 1.7, opacity: 0.8 }}>{info.deficitType}</div>
                            <div style={{ fontSize: '13px', color: '#7da8c9', fontFamily: 'monospace', marginTop: '10px' }}>{info.satellites}</div>
                        </div>

                        {/* Proposal Recipients */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{
                                background: 'rgba(3,3,3,0.5)',
                                border: '1px solid rgba(76,141,201,0.2)',
                                padding: '20px',
                                borderRadius: '8px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <Globe size={16} color="#4c8dc9" />
                                    <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#7da8c9', letterSpacing: '0.15em' }}>GOVERNMENT BODY</span>
                                </div>
                                <div style={{ fontSize: '15px', color: '#f0ead6', lineHeight: 1.6, opacity: 0.85 }}>{info.government}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                                    <Send size={12} color="#4c8dc9" />
                                    <span style={{ fontSize: '12px', color: '#4c8dc9', fontFamily: 'monospace' }}>PROPOSAL SUBMITTED</span>
                                </div>
                            </div>
                            <div style={{
                                background: 'rgba(3,3,3,0.5)',
                                border: '1px solid rgba(76,141,201,0.2)',
                                padding: '20px',
                                borderRadius: '8px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <Shield size={16} color="#76b900" />
                                    <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#7da8c9', letterSpacing: '0.15em' }}>CONSERVATION PARTNER</span>
                                </div>
                                <div style={{ fontSize: '15px', color: '#f0ead6', lineHeight: 1.6, opacity: 0.85 }}>{info.charity}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
                                    <Send size={12} color="#76b900" />
                                    <span style={{ fontSize: '12px', color: '#76b900', fontFamily: 'monospace' }}>PROPOSAL SUBMITTED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '16px',
                    }}>
                        <div style={{ background: 'rgba(3,3,3,0.5)', border: '1px solid rgba(76,141,201,0.15)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '10px', color: '#7da8c9', fontFamily: 'monospace', letterSpacing: '0.1em' }}>DATA SOURCE</div>
                            <div style={{ color: '#4c8dc9', fontSize: '16px', fontWeight: 500, marginTop: '6px' }}>NASA HLS + Sentinel-2</div>
                        </div>
                        <div style={{ background: 'rgba(3,3,3,0.5)', border: '1px solid rgba(76,141,201,0.15)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '10px', color: '#7da8c9', fontFamily: 'monospace', letterSpacing: '0.1em' }}>PROPOSED UNITS</div>
                            <div style={{ color: '#c9a84c', fontSize: '16px', fontWeight: 500, marginTop: '6px' }}>3× BeeHive Stations</div>
                        </div>
                        <div style={{ background: 'rgba(3,3,3,0.5)', border: '1px solid rgba(76,141,201,0.15)', padding: '16px', borderRadius: '8px' }}>
                            <div style={{ fontSize: '10px', color: '#7da8c9', fontFamily: 'monospace', letterSpacing: '0.1em' }}>MISSION TYPE</div>
                            <div style={{ color: '#76b900', fontSize: '16px', fontWeight: 500, marginTop: '6px' }}>Conservation Intel</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
