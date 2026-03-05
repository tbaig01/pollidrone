import React, { useState, useRef, useCallback } from 'react';
import HUD from './components/HUD';
import GlobeView from './components/GlobeView';
import HiveView from './components/HiveView';
import PresentationOverlay from './components/PresentationOverlay';

export default function App() {
    const globeRef = useRef();
    const [selectedZone, setSelectedZone] = useState(null);
    const [hiveHealth] = useState(98);
    const [showExperience, setShowExperience] = useState(true); // Default to showing the event overlay

    const handleHiveSelect = useCallback((zone) => {
        // Hide the presentation overlay to focus on the hive
        setShowExperience(false);

        // Animate camera to the hive
        if (globeRef.current) {
            // Calculate a slight offset for point of view
            globeRef.current.pointOfView({
                lat: zone.lat - 5, // slightly below to frame it
                lng: zone.lng,
                altitude: 0.8
            }, 1000); // 1000ms transition
        }

        // Wait for the transition, then open the HiveView overlay
        setTimeout(() => {
            setSelectedZone(zone);
        }, 1200);

    }, []);

    const handleBackToGlobe = useCallback(() => {
        setSelectedZone(null);
        // Bring back the presentation overlay
        setTimeout(() => setShowExperience(true), 500);

        if (globeRef.current) {
            // Zoom back out to generic view
            globeRef.current.pointOfView({ altitude: 2.2 }, 1500);
            globeRef.current.controls().autoRotate = true;
        }
    }, []);

    const handleResetZoom = useCallback(() => {
        if (globeRef.current) {
            globeRef.current.pointOfView({ altitude: 2.2 }, 1500);
        }
    }, []);

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#030303', display: 'flex', overflow: 'hidden' }}>

            {/* Event Experience Presentation Overlay */}
            {showExperience && !selectedZone && (
                <div style={{ zIndex: 20 }}>
                    <PresentationOverlay />
                </div>
            )}

            {/* Main Interactive Area (Globe or HiveView) */}
            <div style={{ flex: 1, position: 'relative' }}>
                {/* 3D Global View */}
                <GlobeView
                    globeRef={globeRef}
                    onHiveSelect={handleHiveSelect}
                />

                {/* Main HUD overlay visible in global mode */}
                {!selectedZone && (
                    <>
                        <HUD
                            hiveHealth={hiveHealth}
                            isDragActive={true}
                            onResetZoom={handleResetZoom}
                        />

                        {/* Hero Title */}
                        {showExperience === false && (
                            <div style={{
                                position: 'absolute',
                                top: '40px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 10,
                                pointerEvents: 'none',
                                textAlign: 'center'
                            }}>
                                <h1 style={{
                                    fontSize: '3rem',
                                    fontWeight: '700',
                                    letterSpacing: '12px',
                                    color: 'var(--gold-primary)',
                                    textShadow: '0 0 20px rgba(255, 193, 77, 0.5)',
                                    margin: 0,
                                    textTransform: 'uppercase'
                                }}>
                                    POLLIDRONE
                                </h1>
                                <div style={{
                                    width: '40%',
                                    height: '1px',
                                    background: 'var(--gold-border)',
                                    margin: '8px auto'
                                }} />
                                <p style={{
                                    color: 'var(--gold-text-muted)',
                                    letterSpacing: '6px',
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    margin: 0
                                }}>
                                    Planetary Swarm Control
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Zoomed Hive Overlay visible only when a zone is selected */}
                {selectedZone && (
                    <HiveView
                        zone={selectedZone}
                        onBack={handleBackToGlobe}
                    />
                )}
            </div>
        </div>
    );
}
