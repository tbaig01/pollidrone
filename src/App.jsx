import React, { useState, useRef, useCallback } from 'react';
import HUD from './components/HUD';
import GlobeView from './components/GlobeView';
import HiveView from './components/HiveView';
import DeclineMetricsView from './components/DeclineMetricsView';
import DeclineAlertWidget from './components/DeclineAlertWidget';

export default function App() {
    const globeRef = useRef();
    const [selectedZone, setSelectedZone] = useState(null);
    const [hiveHealth] = useState(98);
    // True = showing the dramatic metrics covering the screen.
    // False = showing the globe with the alert widget hovering on the left.
    const [showMetricsOverlay, setShowMetricsOverlay] = useState(false);

    const handleHiveSelect = useCallback((zone) => {
        // Hide the metrics overlay to focus on the hive
        setShowMetricsOverlay(false);

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
        <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#030303', overflow: 'hidden' }}>

            {/* Main Interactive Globe Area */}
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

                    {/* Left-side Alert Widget */}
                    {!showMetricsOverlay && (
                        <DeclineAlertWidget onClick={() => setShowMetricsOverlay(true)} />
                    )}

                    {/* Hero Title */}
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
                </>
            )}

            {/* Event Experience Full Screen Presentation Overlay */}
            {showMetricsOverlay && !selectedZone && (
                <DeclineMetricsView onClose={() => setShowMetricsOverlay(false)} />
            )}

            {/* Zoomed Hive Overlay visible only when a zone is selected */}
            {selectedZone && (
                <HiveView
                    zone={selectedZone}
                    onBack={handleBackToGlobe}
                />
            )}
        </div>
    );
}
