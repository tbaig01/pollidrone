import { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import "../index.css";

// ── Design tokens (blue-tech theme) ──
const BLUE = "#4c8dc9";
const BLUE_DIM = "#3a6fa0";
const GOLD = "#c9a84c";
const BG = "#050505";
const CARD = "#0a0a0a";
const BORDER = "rgba(76,141,201,0.18)";
const BORDER_GOLD = "rgba(201,168,76,0.15)";
const TEXT = "#d4c5a0";
const DIM = "#b0a58a";
const CITE = "#7da8c9";
const WHITE = "#f0ead6";
const NVIDIA_GREEN = "#76b900";

// ═══════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════

// ── Scroll-triggered visibility ──
function useScrollReveal(threshold = 0.15) {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, vis];
}

// ── Section divider ──
function SectionDivider({ title, subtitle, color = BLUE }) {
    return (
        <div style={{ textAlign: "center", padding: "70px 0 36px" }}>
            <div style={{ width: 50, height: 1, background: color, margin: "0 auto 22px", opacity: 0.5 }} />
            <h2 style={{ fontSize: 42, fontWeight: 300, color, letterSpacing: "0.08em", lineHeight: 1, margin: 0 }}>{title}</h2>
            {subtitle && (
                <div style={{ fontSize: 15, letterSpacing: "0.2em", color: WHITE, fontFamily: "monospace", textTransform: "uppercase", marginTop: 14, opacity: 0.7 }}>{subtitle}</div>
            )}
        </div>
    );
}

// ── Section label ──
function SectionLabel({ children, color = CITE }) {
    return (
        <div style={{ fontSize: 14, letterSpacing: "0.25em", color, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 18 }}>{children}</div>
    );
}

// ── Icon badge for tier cards ──
function TierBadge({ emoji, label, color = BLUE }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>{emoji}</span>
            <span style={{ fontSize: 13, color, fontFamily: "monospace", fontWeight: 600, letterSpacing: "0.05em" }}>{label}</span>
        </div>
    );
}

// ── Grid-based tech stack flow (horizontal) ──
function TechFlow({ steps }) {
    const [ref, vis] = useScrollReveal(0.15);
    return (
        <div ref={ref} style={{ position: "relative", padding: "24px 0" }}>
            {/* Connecting line */}
            <div style={{
                position: "absolute", top: "50%", left: "3%", right: "3%", height: 3,
                background: `linear-gradient(90deg, ${NVIDIA_GREEN}60, ${BLUE}60)`,
                transform: "translateY(-50%)", opacity: vis ? 0.5 : 0,
                transition: "opacity 0.8s ease 0.2s",
            }} />
            <div style={{
                display: "grid", gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
                gap: 16, position: "relative", zIndex: 1,
            }}>
                {steps.map((step, i) => (
                    <div key={i} style={{
                        padding: "28px 16px", borderRadius: 10,
                        border: `2px solid ${step.color}50`, background: `${step.color}0c`,
                        textAlign: "center",
                        opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)",
                        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
                    }}>
                        <div style={{ fontSize: 44, marginBottom: 10 }}>{step.icon}</div>
                        <div style={{
                            fontSize: 15, fontWeight: 600, color: step.color,
                            lineHeight: 1.35, fontFamily: "monospace", letterSpacing: "0.02em",
                            whiteSpace: "pre-line",
                        }}>{step.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Animated tier card ──
function TierCard({ tier, title, hardware, tops, icon, color, children, delay = 0 }) {
    const [ref, vis] = useScrollReveal(0.12);
    return (
        <div ref={ref} style={{
            padding: "32px", border: `1px solid ${color}30`, borderRadius: 10,
            background: `${color}06`,
            opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)",
            transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                    <div style={{ fontSize: 13, fontFamily: "monospace", color, fontWeight: 600, letterSpacing: "0.1em", opacity: 0.8 }}>{tier}</div>
                    <div style={{ fontSize: 26, fontWeight: 300, color: WHITE, marginTop: 6 }}>{title}</div>
                </div>
                <span style={{ fontSize: 40 }}>{icon}</span>
            </div>
            <div style={{
                display: "inline-block", padding: "6px 14px", borderRadius: 6,
                background: `${NVIDIA_GREEN}15`, border: `1px solid ${NVIDIA_GREEN}30`,
                marginBottom: 16,
            }}>
                <span style={{ fontSize: 14, color: NVIDIA_GREEN, fontFamily: "monospace", fontWeight: 600 }}>{hardware}</span>
                {tops && <span style={{ fontSize: 12, color: DIM, marginLeft: 10 }}>{tops}</span>}
            </div>
            <div style={{ fontSize: 15, color: WHITE, lineHeight: 1.7, opacity: 0.85 }}>{children}</div>
        </div>
    );
}

// ── Mission card ──
function MissionCard({ number, title, subtitle, items, color, icon, delay = 0 }) {
    const [ref, vis] = useScrollReveal(0.15);
    return (
        <div ref={ref} style={{
            padding: "36px", border: `1px solid ${color}30`, borderRadius: 10,
            background: `${color}06`, flex: 1,
            opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)",
            transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <span style={{ fontSize: 44 }}>{icon}</span>
                <div>
                    <div style={{ fontSize: 12, fontFamily: "monospace", color, fontWeight: 600, letterSpacing: "0.15em" }}>MISSION {number}</div>
                    <div style={{ fontSize: 24, fontWeight: 300, color: WHITE, marginTop: 4 }}>{title}</div>
                </div>
            </div>
            <div style={{ fontSize: 16, color: WHITE, opacity: 0.8, marginBottom: 20, lineHeight: 1.6 }}>{subtitle}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{
                            width: 6, height: 6, borderRadius: "50%", background: color,
                            marginTop: 8, flexShrink: 0, opacity: 0.7,
                        }} />
                        <div style={{ fontSize: 15, color: WHITE, opacity: 0.75, lineHeight: 1.6 }}>{item}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Model family card ──
function ModelCard({ number, title, description, details, color = BLUE, delay = 0 }) {
    const [ref, vis] = useScrollReveal(0.15);
    return (
        <div ref={ref} style={{
            padding: "32px", border: `1px solid ${color}30`, borderRadius: 10,
            background: `${color}06`,
            opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)",
            transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}>
            <div style={{
                display: "inline-block", padding: "4px 12px", borderRadius: 4,
                background: `${color}15`, border: `1px solid ${color}30`,
                fontSize: 12, fontFamily: "monospace", fontWeight: 600, color, letterSpacing: "0.1em",
                marginBottom: 16,
            }}>{number}</div>
            <div style={{ fontSize: 22, fontWeight: 300, color: WHITE, marginBottom: 12 }}>{title}</div>
            <div style={{ fontSize: 15, color: WHITE, opacity: 0.8, lineHeight: 1.7, marginBottom: 16 }}>{description}</div>
            <div style={{ fontSize: 14, color: CITE, lineHeight: 1.7 }}>{details}</div>
        </div>
    );
}


// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
export default function SystemGuideView({ onClose }) {
    return (
        <div style={{
            position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh",
            background: BG, color: TEXT, fontFamily: "'Space Grotesk', system-ui, sans-serif",
            overflowX: "hidden", overflowY: "auto", zIndex: 50, userSelect: "auto",
        }}>
            {/* Back Button */}
            <button onClick={onClose} className="hud-button" style={{
                position: "fixed", top: 36, left: 36, zIndex: 60,
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(5,5,5,0.85)", backdropFilter: "blur(8px)", borderRadius: 4,
            }}>
                <ChevronLeft size={16} /> RETURN TO GLOBE
            </button>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>

                {/* ═══════════ HERO ═══════════ */}
                <div style={{ textAlign: "center", padding: "90px 0 20px" }}>
                    <h1 style={{ fontSize: 68, fontWeight: 300, color: BLUE, letterSpacing: "0.1em", lineHeight: 1 }}>THE PLATFORM</h1>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 18 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: NVIDIA_GREEN, boxShadow: `0 0 12px ${NVIDIA_GREEN}60` }} />
                        <span style={{ fontSize: 14, letterSpacing: "0.3em", color: DIM, fontFamily: "monospace" }}>POLLIDRONE SYSTEM ARCHITECTURE</span>
                    </div>
                </div>


                {/* ══════════════════════════════════════════════════════
                    SECTION 1: TWO MISSIONS. ONE PLATFORM. (Slide 5)
                ══════════════════════════════════════════════════════ */}
                <SectionDivider title="TWO MISSIONS" subtitle="One platform — not a bee replacement" color={BLUE} />

                {/* Key framing */}
                <div style={{ textAlign: "center", padding: "10px 0 40px", maxWidth: 800, margin: "0 auto" }}>
                    <div style={{ fontSize: 20, color: WHITE, lineHeight: 1.7, fontWeight: 300, opacity: 0.85 }}>
                        Bees are irreplaceable — they're part of an ecosystem we have to protect.
                        Pollidrone is the <span style={{ color: BLUE, fontWeight: 500 }}>safety net</span> — it monitors for pollination gaps
                        and only deploys when natural systems fall short.
                    </div>
                </div>

                {/* Dual mission cards */}
                <div style={{ display: "flex", gap: 24, padding: "0 0 20px" }}>
                    <MissionCard
                        number="1"
                        title="Agricultural Intelligence"
                        subtitle="When deployed to a farm, our swarm scouts the field, maps every flower, detects where pollinators are active, and generates intelligent pollination routes that only fill the gaps."
                        icon="🌾"
                        color={GOLD}
                        delay={0}
                        items={[
                            "10 drones sweep and build a living picture of the field",
                            "Bloom-stage classification at flower level",
                            "Detects natural pollinator activity — avoids zones pollinators are already handling",
                            "Generates energy-efficient coverage routes with zero overlap",
                            "Models improve over time from accumulated field data",
                        ]}
                    />
                    <MissionCard
                        number="2"
                        title="Conservation Intelligence"
                        subtitle="Satellite data combined with drone ground-truth identifies pollinator deficit zones — and once found, we propose a BeeHive deployment to that region's government, charity, or nature conservation body (e.g., DEFRA, WWF, FAO). This is the action layer that differentiates Conservation Intelligence from Agri Intelligence."
                        icon="🛰️"
                        color={BLUE}
                        delay={200}
                        items={[
                            "NASA HLS + Sentinel-2 satellite data identifies deficit zones",
                            "Swarm surveys pollinator activity at ground level",
                            "Maps exactly what's happening at flower level",
                            "Once a deficit is confirmed, a BeeHive deployment is formally proposed to the region's governing body or conservation partner",
                            "Feeds actionable proposals to governments (DEFRA, FAO) and charities (WWF, local trusts)",
                            "First-ever dataset combining drone-level + satellite-level analysis",
                        ]}
                    />
                </div>

                {/* Reinforcing loop */}
                <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
                    <div style={{ display: "inline-block", padding: "20px 40px", border: `1px solid ${BLUE}30`, borderRadius: 10, background: `${BLUE}06` }}>
                        <div style={{ fontSize: 17, color: WHITE, fontWeight: 400, lineHeight: 1.7, opacity: 0.85 }}>
                            Every farm deployment feeds <span style={{ color: GOLD, fontWeight: 500 }}>conservation data</span>
                            <span style={{ margin: "0 12px", color: BLUE, fontSize: 20 }}>→</span>
                            Every conservation insight predicts <span style={{ color: BLUE, fontWeight: 500 }}>next season's needs</span>
                        </div>
                        <div style={{ fontSize: 14, color: CITE, marginTop: 10 }}>The system moves from reactive to predictive</div>
                    </div>
                </div>

                <div style={{ textAlign: "center", padding: "10px 0 0" }}>
                    <div style={{ fontSize: 13, color: CITE, fontFamily: "monospace" }}>
                        THREE DEPLOYMENT SCENARIOS: Weather windows bees can't fly in · Colony collapse shortage · Regions with no commercial beekeeping
                    </div>
                </div>


                {/* ══════════════════════════════════════════════════════
                    SECTION 2: WHAT WE TRAIN ON DGX SPARK (Slide 6)
                ══════════════════════════════════════════════════════ */}
                <SectionDivider title="DGX SPARK TRAINING" subtitle="Three families of machine learning models" color={NVIDIA_GREEN} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, padding: "10px 0" }}>
                    <ModelCard
                        number="MODEL FAMILY 1"
                        title="MARL Swarm Policies"
                        description="Using MAPPO, we train thousands of drone agents simultaneously in a physics-accurate simulation. Emergent cooperative behaviours: coverage zone division, energy-efficient routing, teammate failure adaptation."
                        details="NVIDIA Isaac Sim + Pegasus · Isaac Lab + skrl · Requires 128GB unified memory — standard GPUs can't hold this workload"
                        color={NVIDIA_GREEN}
                        delay={0}
                    />
                    <ModelCard
                        number="MODEL FAMILY 2"
                        title="Agricultural Vision"
                        description="Bloom-stage classification, pollinator activity detection, fruit-set prediction. Trained on real-world data from every deployment — the system gets smarter over time."
                        details="Drone-level, flower-level observation data · Crop-specific models retrained as data accumulates · YOLOv8 Nano for edge deployment"
                        color={BLUE}
                        delay={150}
                    />
                    <ModelCard
                        number="MODEL FAMILY 3"
                        title="Pollinator Health Models"
                        description="Nobody has autonomous, field-scale, flower-level ground-truth data collected across hundreds of acres. That's what our drones generate — combined with satellite data, that's what we provide to governments."
                        details="Satellite spectral data (NDVI, EVI) + drone ground-truth · Regional pollination mapping · Predicts deficit zones before crop failure"
                        color={GOLD}
                        delay={300}
                    />
                </div>

                {/* Big stat */}
                <div style={{ textAlign: "center", padding: "30px 0 10px" }}>
                    <div style={{
                        display: "inline-block", padding: "20px 48px", borderRadius: 10,
                        background: `${NVIDIA_GREEN}08`, border: `1px solid ${NVIDIA_GREEN}25`,
                    }}>
                        <span style={{ fontSize: 56, fontWeight: 300, color: NVIDIA_GREEN, fontFamily: "monospace" }}>128 GB</span>
                        <div style={{ fontSize: 16, color: WHITE, marginTop: 8, opacity: 0.8 }}>unified memory — standard GPUs cannot hold this workload</div>
                        <div style={{ fontSize: 13, color: CITE, marginTop: 8, fontFamily: "monospace" }}>GRACE BLACKWELL ARCHITECTURE · DGX SPARK</div>
                    </div>
                </div>


                {/* ══════════════════════════════════════════════════════
                    SECTION 3: THREE TIERS. THREE NVIDIA PRODUCTS. (Slide 7)
                ══════════════════════════════════════════════════════ */}
                <SectionDivider title="THREE TIERS" subtitle="Three NVIDIA products across three deployment layers" color={BLUE} />

                <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "10px 0" }}>
                    <TierCard tier="TIER 1 · CLOUD" title="Conservation Cloud" hardware="DGX Spark" tops="Trains all 3 model families" icon="☁️" color={NVIDIA_GREEN} delay={0}>
                        Fleet management dashboard, conservation data aggregation, MARL policy training in simulation. Software updates deployed to BeeHives.
                        Satellite data serves as a <strong style={{ color: NVIDIA_GREEN }}>sales and conservation tool</strong>, not an operational trigger.
                    </TierCard>

                    <TierCard tier="TIER 2 · FIELD" title="The BeeHive" hardware="Jetson AGX Orin" tops="275 TOPS" icon="🏗️" color={BLUE} delay={150}>
                        The real operational brain. Plans missions, coordinates the entire swarm, tracks coverage, adapts to weather — all locally with <strong style={{ color: BLUE }}>zero cloud dependency</strong>.
                        A ruggedised unit at field edge with drone storage, charging docks, and pollen supply. Operates fully independently when offline.
                    </TierCard>

                    <TierCard tier="TIER 3 · EDGE" title="Individual Pollidrones" hardware="Jetson Orin Nano" tops="67 TOPS · $249 · 5-15W" icon="🐝" color={GOLD} delay={300}>
                        Each drone runs a trained MARL policy autonomously.
                        Real-time flower detection with YOLOv8, obstacle avoidance, cooperative coordination — all at millisecond speed.
                        Drones don't ask the server "should I turn left?" — they already know what to do because <strong style={{ color: GOLD }}>cooperation was baked in during training</strong>.
                    </TierCard>
                </div>

                {/* CTDE explanation */}
                <div style={{ padding: "40px 0 20px" }}>
                    <SectionLabel color={BLUE}>THE KEY PRINCIPLE — CTDE</SectionLabel>
                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
                    }}>
                        <div style={{
                            padding: "32px", borderRadius: 10,
                            border: `1px solid ${NVIDIA_GREEN}30`, background: `${NVIDIA_GREEN}06`,
                        }}>
                            <TierBadge emoji="🏟️" label="CENTRALIZED TRAINING" color={NVIDIA_GREEN} />
                            <div style={{ fontSize: 16, color: WHITE, lineHeight: 1.7, opacity: 0.85 }}>
                                On the DGX Spark, every agent sees everything — global state, all other agents.
                                The swarm learns cooperative strategies with full awareness.
                            </div>
                            <div style={{ fontSize: 14, color: CITE, marginTop: 14 }}>
                                Like coaches seeing all 11 players from every camera angle during training
                            </div>
                        </div>
                        <div style={{
                            padding: "32px", borderRadius: 10,
                            border: `1px solid ${GOLD}30`, background: `${GOLD}06`,
                        }}>
                            <TierBadge emoji="⚡" label="DECENTRALIZED EXECUTION" color={GOLD} />
                            <div style={{ fontSize: 16, color: WHITE, lineHeight: 1.7, opacity: 0.85 }}>
                                In the field, each drone uses only local observations. No central server needed.
                                But the team still moves as one — because the cooperation was baked in during training.
                            </div>
                            <div style={{ fontSize: 14, color: CITE, marginTop: 14 }}>
                                On match day, each player makes split-second decisions — but the team moves cohesively
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "center", padding: "20px 0 0" }}>
                        <div style={{
                            display: "inline-block", padding: "16px 36px", borderRadius: 8,
                            border: `1px solid ${BLUE}25`, background: `${BLUE}06`,
                        }}>
                            <div style={{ fontSize: 17, color: WHITE, fontWeight: 400, opacity: 0.85 }}>
                                Think of it like a <span style={{ color: BLUE, fontWeight: 500 }}>football team</span> — trains together with cameras everywhere.
                                On match day, each player acts on instinct. <span style={{ color: GOLD, fontWeight: 500 }}>That's exactly how our drones work.</span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* ══════════════════════════════════════════════════════
                    SECTION 4: 100% NVIDIA-NATIVE PIPELINE (Slide 8)
                ══════════════════════════════════════════════════════ */}
                <SectionDivider title="NVIDIA-NATIVE" subtitle="100% NVIDIA pipeline from simulation to field" color={NVIDIA_GREEN} />

                {/* Tech stack flow */}
                <TechFlow steps={[
                    { icon: "🎮", title: "ISAAC SIM\nSimulation", color: NVIDIA_GREEN },
                    { icon: "🚁", title: "PEGASUS\nMulti-Drone Physics", color: NVIDIA_GREEN },
                    { icon: "🧠", title: "ISAAC LAB\n+ skrl", color: BLUE },
                    { icon: "🔥", title: "PYTORCH\nTraining", color: BLUE },
                    { icon: "📦", title: "JETSON\nDeployment", color: GOLD },
                ]} />

                <div style={{ fontSize: 14, color: CITE, textAlign: "center", marginTop: 8, fontFamily: "monospace" }}>
                    Not cobbling together random tools — using NVIDIA's own ecosystem end to end
                </div>

                {/* 3 products × 3 tiers summary */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, padding: "40px 0 20px" }}>
                    <div style={{ padding: "28px", border: `1px solid ${NVIDIA_GREEN}30`, borderRadius: 10, background: `${NVIDIA_GREEN}06`, textAlign: "center" }}>
                        <div style={{ fontSize: 48, fontWeight: 300, color: NVIDIA_GREEN, fontFamily: "monospace" }}>DGX Spark</div>
                        <div style={{ fontSize: 16, color: WHITE, marginTop: 10, opacity: 0.85 }}>trains the brain</div>
                        <div style={{ fontSize: 13, color: CITE, fontFamily: "monospace", marginTop: 10 }}>128GB · Grace Blackwell</div>
                    </div>
                    <div style={{ padding: "28px", border: `1px solid ${BLUE}30`, borderRadius: 10, background: `${BLUE}06`, textAlign: "center" }}>
                        <div style={{ fontSize: 48, fontWeight: 300, color: BLUE, fontFamily: "monospace" }}>AGX Orin</div>
                        <div style={{ fontSize: 16, color: WHITE, marginTop: 10, opacity: 0.85 }}>runs field intelligence</div>
                        <div style={{ fontSize: 13, color: CITE, fontFamily: "monospace", marginTop: 10 }}>275 TOPS · BeeHive</div>
                    </div>
                    <div style={{ padding: "28px", border: `1px solid ${GOLD}30`, borderRadius: 10, background: `${GOLD}06`, textAlign: "center" }}>
                        <div style={{ fontSize: 48, fontWeight: 300, color: GOLD, fontFamily: "monospace" }}>Orin Nano</div>
                        <div style={{ fontSize: 16, color: WHITE, marginTop: 10, opacity: 0.85 }}>executes on every drone</div>
                        <div style={{ fontSize: 13, color: CITE, fontFamily: "monospace", marginTop: 10 }}>67 TOPS · $249 · 5-15W</div>
                    </div>
                </div>


                {/* ═══════════ CLOSING ═══════════ */}
                <div style={{ textAlign: "center", padding: "50px 0 80px" }}>
                    <div style={{ width: 50, height: 1, background: BLUE, margin: "0 auto 36px", opacity: 0.3 }} />
                    <div style={{ fontSize: 22, color: BLUE, lineHeight: 1.7, fontWeight: 300, fontStyle: "italic", maxWidth: 750, margin: "0 auto" }}>
                        "The DGX Spark trains swarm intelligence in simulation.<br />
                        The Jetson AGX Orin BeeHive coordinates field operations.<br />
                        The Jetson Orin Nano executes on every drone."
                    </div>
                    <div style={{ marginTop: 30, fontSize: 14, letterSpacing: "0.3em", color: CITE, fontFamily: "monospace" }}>
                        POLLIDRONE · POWERED BY DGX SPARK
                    </div>
                </div>
            </div>
        </div>
    );
}
