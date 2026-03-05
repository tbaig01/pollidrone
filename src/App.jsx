import React, { useState, useRef, useCallback } from 'react';
import HUD from './components/HUD';
import GlobeView from './components/GlobeView';
import HiveView from './components/HiveView';

export default function App() {
    const globeRef = useRef();
    const [selectedZone, setSelectedZone] = useState(null);
    const [hiveHealth, setHiveHealth] = useState(98);

    const handleHiveSelect = useCallback((zone) => {
        // Animate camera to the hive
        if (globeRef.current) {
            // Calculate a slight offset for point of view
            const currentPov = globeRef.current.pointOfView();
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
        <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#030303' }}>
            {/* 3D Global View */}
            <GlobeView
                globeRef={globeRef}
                onHiveSelect={handleHiveSelect}
            />

            {/* Main HUD overlay visible in global mode */}
            {!selectedZone && (
                <HUD
                    hiveHealth={hiveHealth}
                    isDragActive={true}
                    onResetZoom={handleResetZoom}
                />
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
