import React, { useEffect, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

const ZONES = [
    { id: 1, name: "Thames Valley, UK", lat: 51.45, lng: -0.98, hive: "Alpha-1" },
    { id: 2, name: "Andalusia, Spain", lat: 37.38, lng: -5.99, hive: "Beta-1" },
    { id: 3, name: "California Central Valley", lat: 36.77, lng: -119.42, hive: "Gamma-2" },
    { id: 4, name: "Provence, France", lat: 43.95, lng: 6.06, hive: "Sigma-4" },
    { id: 5, name: "Punjab, India", lat: 31.15, lng: 75.34, hive: "Delta-3" },
    { id: 6, name: "Hokkaido, Japan", lat: 43.06, lng: 141.35, hive: "Omega-1" },
    { id: 7, name: "Kent, UK", lat: 51.27, lng: 0.52, hive: "Alpha-2" },
    { id: 8, name: "São Paulo, Brazil", lat: -23.55, lng: -46.63, hive: "Zeta-5" },
];

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ color: 'red', zIndex: 9999, position: 'absolute', top: 0, left: 0, background: 'rgba(0,0,0,0.8)', padding: 20 }}>
                    <h2>Globe Crash</h2>
                    <pre>{this.state.error && this.state.error.toString()}</pre>
                    <pre>{this.state.error && this.state.error.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

export default function GlobeView({ onHiveSelect, globeRef }) {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [landPolygons, setLandPolygons] = useState([]);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(data => setLandPolygons(data.features));
    }, []);

    const markerSvg = `< svg viewBox = "-4 0 36 36" xmlns = "http://www.w3.org/2000/svg" >
    <path fill="rgba(230,184,92,0.2)" stroke="#e6b85c" stroke-width="2" d="M14 0L28 7v14L14 28L0 21V7z" />
    <circle cx="14" cy="14" r="4" fill="#ffc14d" />
  </svg > `;

    const markerMaterial = useMemo(() => {
        const map = new THREE.TextureLoader().load(`data: image / svg + xml; charset = utf - 8, ${encodeURIComponent(markerSvg)} `);
        return new THREE.SpriteMaterial({ map: map, transparent: true });
    }, [markerSvg]);

    useEffect(() => {
        const applyCustomGlobe = () => {
            if (globeRef?.current) {
                try {
                    const gm = globeRef.current.globeMaterial();
                    if (gm) {
                        gm.color = new THREE.Color('#1a150b');
                        gm.emissive = new THREE.Color('#33250a');
                        gm.emissiveIntensity = 0.5;
                        gm.wireframe = true;
                    }
                    const controls = globeRef.current.controls();
                    if (controls) {
                        controls.enableZoom = false;
                        controls.autoRotate = true;
                        controls.autoRotateSpeed = 0.5;
                    }
                } catch (e) {
                    console.warn('Globe initialization delayed', e);
                }
            }
        };

        // Try applying after render
        const t1 = setTimeout(applyCustomGlobe, 50);
        const t2 = setTimeout(applyCustomGlobe, 200);
        const t3 = setTimeout(applyCustomGlobe, 500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        }
    }, [globeRef]);

    const arcsData = useMemo(() => {
        return ZONES.map((zone, i) => {
            const nextZone = ZONES[(i + 1) % ZONES.length];
            return {
                startLat: zone.lat,
                startLng: zone.lng,
                endLat: nextZone.lat,
                endLng: nextZone.lng,
                color: 'rgba(230, 184, 92, 0.4)'
            };
        });
    }, []);

    return (
        <ErrorBoundary>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1, cursor: 'grab' }}>
                <Globe
                    ref={globeRef}
                    width={windowSize.width}
                    height={windowSize.height}
                    backgroundColor="#030303"
                    showAtmosphere={true}
                    atmosphereColor="#e6b85c"
                    atmosphereAltitude={0.15}

                    polygonsData={landPolygons}
                    polygonCapColor={() => 'rgba(230, 184, 92, 0.4)'}
                    polygonSideColor={() => 'rgba(230, 184, 92, 0.05)'}
                    polygonStrokeColor={() => '#e6b85c'}
                    polygonAltitude={0.015}

                    objectsData={ZONES}
                    objectLat="lat"
                    objectLng="lng"
                    objectAltitude={0.05}
                    objectThreeObject={() => {
                        const sprite = new THREE.Sprite(markerMaterial);
                        sprite.scale.set(8, 8, 1);
                        return sprite;
                    }}
                    onObjectClick={onHiveSelect}

                    labelsData={ZONES}
                    labelLat="lat"
                    labelLng="lng"
                    labelText="name"
                    labelSize={1.5}
                    labelDotRadius={0.5}
                    labelColor={() => 'rgba(230, 184, 92, 0.8)'}
                    labelResolution={2}
                    labelAltitude={0.06}

                    arcsData={arcsData}
                    arcColor="color"
                    arcDashLength={0.4}
                    arcDashGap={4}
                    arcDashInitialGap={() => Math.random() * 5}
                    arcDashAnimateTime={2000}
                    arcAltitudeAutoScale={0.2}
                />
            </div>
        </ErrorBoundary>
    );
}
