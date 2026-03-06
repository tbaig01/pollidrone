import { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import "../index.css";

// ── Design tokens ──
const GOLD = "#c9a84c";
const RED = "#c94c4c";
const BG = "#050505";
const CARD = "#0a0a0a";
const BORDER = "rgba(201,168,76,0.15)";
const TEXT = "#d4c5a0";
const DIM = "#b0a58a";
const CITE = "#8d9e8a";
const WHITE = "#f0ead6";

// ═══════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════

// ── Animated number counter ──
function Big({ end, dur = 2200, prefix = "", suffix = "", color = RED }) {
    const [v, setV] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    const s = performance.now();
                    const go = (n) => {
                        const t = Math.min((n - s) / dur, 1);
                        setV((1 - Math.pow(1 - t, 3)) * end);
                        if (t < 1) requestAnimationFrame(go);
                    };
                    requestAnimationFrame(go);
                    obs.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [end, dur]);
    return (
        <span ref={ref} style={{ color, fontFamily: "monospace", fontWeight: 300 }}>
            {prefix}{Math.round(v).toLocaleString()}{suffix}
        </span>
    );
}

// ── Donut chart ──
function Donut({ value, label, sub, color = GOLD, size = 140 }) {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    const r = size / 2 - 10;
    const c = 2 * Math.PI * r;
    return (
        <div ref={ref} style={{ textAlign: "center" }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(201,168,76,0.08)" strokeWidth="7" />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7"
                    strokeDasharray={c} strokeDashoffset={vis ? c * (1 - value / 100) : c} strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)" }} />
            </svg>
            <div style={{ marginTop: -size / 2 - 16, position: "relative" }}>
                <div style={{ fontSize: 30, fontWeight: 300, color, fontFamily: "monospace" }}>{value}%</div>
            </div>
            <div style={{ marginTop: size / 2 - 18 }}>
                <div style={{ fontSize: 16, color: WHITE, fontWeight: 500, marginTop: 10 }}>{label}</div>
                {sub && <div style={{ fontSize: 13, color: CITE, marginTop: 4 }}>{sub}</div>}
            </div>
        </div>
    );
}

// ── Horizontal bar ──
function Bar({ label, value, max = 100, unit = "%", color = RED, delay = 0 }) {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                <span style={{ fontSize: 16, color: WHITE }}>{label}</span>
                <span style={{ fontSize: 20, color, fontFamily: "monospace", fontWeight: 600 }}>{value}{unit}</span>
            </div>
            <div style={{ height: 8, background: "rgba(201,168,76,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                    height: "100%", borderRadius: 4,
                    background: `linear-gradient(90deg, ${color}, ${color}99)`,
                    width: vis ? `${(value / max) * 100}%` : "0%",
                    transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
                }} />
            </div>
        </div>
    );
}

// ── Grid-based flow chain (no horizontal scroll) ──
function FlowChain({ steps }) {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.15 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ position: "relative", padding: "24px 0" }}>
            {/* Connecting line behind the boxes */}
            <div style={{
                position: "absolute",
                top: "50%",
                left: "3%",
                right: "3%",
                height: 3,
                background: `linear-gradient(90deg, ${GOLD}60, ${RED}60)`,
                transform: "translateY(-50%)",
                opacity: vis ? 0.5 : 0,
                transition: "opacity 0.8s ease 0.2s",
            }} />

            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
                gap: 16,
                position: "relative",
                zIndex: 1,
            }}>
                {steps.map((step, i) => (
                    <div key={i} style={{
                        padding: "28px 16px",
                        borderRadius: 10,
                        border: `2px solid ${step.color}50`,
                        background: `${step.color}0c`,
                        textAlign: "center",
                        opacity: vis ? 1 : 0,
                        transform: vis ? "translateY(0)" : "translateY(20px)",
                        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
                    }}>
                        <div style={{ fontSize: 44, marginBottom: 10 }}>{step.icon}</div>
                        <div style={{
                            fontSize: 15, fontWeight: 600, color: step.color,
                            lineHeight: 1.35, fontFamily: "monospace", letterSpacing: "0.02em",
                        }}>{step.title}</div>
                    </div>
                ))}
            </div>

            {/* Arrow indicators between boxes */}
            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
                gap: 12,
                marginTop: -6,
                position: "relative",
                zIndex: 2,
            }}>
                {steps.map((_, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                        {i < steps.length - 1 && (
                            <svg width="24" height="12" viewBox="0 0 24 12" style={{
                                position: "absolute",
                                left: `${((i + 1) / steps.length) * 100}%`,
                                transform: "translateX(-50%) translateY(-60px)",
                                opacity: vis ? 0.5 : 0,
                                transition: `opacity 0.5s ease ${(i + 1) * 120 + 200}ms`,
                            }}>
                                <polygon points="6,0 18,0 12,12" fill={i < steps.length / 2 ? GOLD : RED} />
                            </svg>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Decline sparkline ──
function BigDecline({ data, color = GOLD, w = 500, h = 130 }) {
    const [vis, setVis] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    const mn = Math.min(...data.map((d) => d.v));
    const mx = Math.max(...data.map((d) => d.v));
    const rng = mx - mn || 1;
    const pts = data.map((d, i) => ({
        x: 10 + (i / (data.length - 1)) * (w - 20),
        y: 10 + (1 - (d.v - mn) / rng) * (h - 36),
    }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const area = line + ` L${pts[pts.length - 1].x},${h - 20} L${pts[0].x},${h - 20} Z`;
    return (
        <svg ref={ref} width={w} height={h} style={{ display: "block", maxWidth: "100%" }}>
            <defs>
                <linearGradient id="bigdec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {vis && (
                <>
                    <path d={area} fill="url(#bigdec)" style={{ animation: "fadeUp 1s ease" }} />
                    <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
                        style={{ strokeDasharray: 800, animation: "draw 2s ease forwards" }} />
                    <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="6" fill={color}>
                        <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                    </circle>
                </>
            )}
            {data.map((d, i) =>
                (i === 0 || i === data.length - 1) && (
                    <text key={i} x={pts[i].x} y={h - 4} fill={DIM} fontSize="12" fontFamily="monospace" textAnchor={i === 0 ? "start" : "end"}>{d.y}</text>
                )
            )}
        </svg>
    );
}

// ── Section divider with label ──
function SectionDivider({ title, subtitle, color = GOLD }) {
    return (
        <div style={{ textAlign: "center", padding: "60px 0 30px" }}>
            <div style={{ width: 50, height: 1, background: color, margin: "0 auto 20px", opacity: 0.4 }} />
            <h2 style={{ fontSize: 40, fontWeight: 300, color, letterSpacing: "0.08em", lineHeight: 1, margin: 0 }}>{title}</h2>
            {subtitle && (
                <div style={{ fontSize: 15, letterSpacing: "0.2em", color: WHITE, fontFamily: "monospace", textTransform: "uppercase", marginTop: 14, opacity: 0.7 }}>{subtitle}</div>
            )}
        </div>
    );
}

function SectionLabel({ children, color = CITE }) {
    return (
        <div style={{ fontSize: 14, letterSpacing: "0.25em", color, fontFamily: "monospace", textTransform: "uppercase", marginBottom: 18 }}>{children}</div>
    );
}

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
export default function DeclineMetricsView({ onClose }) {
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
                    <h1 style={{ fontSize: 72, fontWeight: 300, color: GOLD, letterSpacing: "0.12em", lineHeight: 1 }}>THE COLLAPSE</h1>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 18 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: RED, animation: "pulseDot 2s ease-in-out infinite" }} />
                        <span style={{ fontSize: 14, letterSpacing: "0.3em", color: DIM, fontFamily: "monospace" }}>GLOBAL POLLINATOR CRISIS</span>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════
            SECTION 1: THE HUMAN COST
            ══════════════════════════════════════════════════════ */}
                <SectionDivider title="THE HUMAN COST" subtitle="What pollinator decline is doing to people right now" color={RED} />

                {/* Big Death Counter */}
                <div style={{ textAlign: "center", padding: "20px 0 40px" }}>
                    <div style={{ fontSize: 120, lineHeight: 1, animation: "countPulse 3s ease-in-out infinite", letterSpacing: "-0.03em" }}>
                        <Big end={500000} dur={3000} />
                    </div>
                    <div style={{ fontSize: 24, color: TEXT, marginTop: 12, fontWeight: 300 }}>people dying every year</div>
                    <div style={{ fontSize: 17, color: WHITE, marginTop: 10, maxWidth: 540, margin: "10px auto 0", opacity: 0.8 }}>
                        from insufficient pollination — heart disease, stroke, diabetes, cancer
                    </div>
                    <div style={{ fontSize: 13, color: CITE, fontFamily: "monospace", marginTop: 18 }}>THE LANCET PLANETARY HEALTH, 2025</div>
                </div>

                {/* How They Die — Full-width grid flow */}
                <div style={{ padding: "30px 0 20px" }}>
                    <SectionLabel color={RED}>How 500,000 people die each year</SectionLabel>
                    <FlowChain steps={[
                        { icon: "🐝", title: "POLLINATORS\nDISAPPEAR", color: GOLD },
                        { icon: "🌾", title: "CROP YIELDS\nFALL", color: GOLD },
                        { icon: "🍞", title: "DIETS SHIFT\nTO GRAIN", color: "#d4a84c" },
                        { icon: "💔", title: "CHRONIC\nDISEASE RISES", color: RED },
                        { icon: "☠️", title: "500,000\nDIE", color: RED },
                    ]} />
                    <div style={{ fontSize: 13, color: CITE, textAlign: "center", marginTop: 12, fontFamily: "monospace" }}>
                        Harvard T.H. Chan School of Public Health · 156 countries · hundreds of farms across 4 continents
                    </div>
                </div>

                {/* Nutrition — full width 2 col */}
                <div style={{ padding: "40px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                    <div>
                        <SectionLabel>What pollinators give us</SectionLabel>
                        <Bar label="Vitamin C" value={98} unit="% from pollinators" color={GOLD} delay={0} />
                        <Bar label="Dietary Lipids" value={74} unit="% from pollinators" color={GOLD} delay={100} />
                        <Bar label="Vitamin A" value={41} unit="% from pollinators" color={RED} delay={200} />
                        <Bar label="Folate (B9)" value={7} unit="% from pollinators" color={GOLD} delay={300} />
                        <div style={{ marginTop: 12, padding: "14px 18px", background: `${RED}10`, border: `1px solid ${RED}30`, borderRadius: 6 }}>
                            <div style={{ fontSize: 16, color: RED, fontWeight: 500 }}>Only 2.5% of calories</div>
                            <div style={{ fontSize: 14, color: WHITE, marginTop: 5, opacity: 0.75 }}>But nearly all critical micronutrients. People feel full on grain — while dying of deficiency.</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
                        <div style={{ padding: "24px", border: `1px solid ${RED}30`, borderRadius: 8, background: `${RED}06` }}>
                            <div style={{ fontSize: 52, fontWeight: 300, color: RED, fontFamily: "monospace" }}>800K</div>
                            <div style={{ fontSize: 17, color: WHITE, marginTop: 5 }}>already dying per year from vitamin A deficiency</div>
                            <div style={{ fontSize: 14, color: CITE, marginTop: 7 }}>Mostly women and children. Leading preventable cause of childhood blindness.</div>
                        </div>
                        <div style={{ padding: "24px", border: `1px solid ${BORDER}`, borderRadius: 8, background: CARD }}>
                            <div style={{ fontSize: 52, fontWeight: 300, color: RED, fontFamily: "monospace" }}>71M</div>
                            <div style={{ fontSize: 17, color: WHITE, marginTop: 5 }}>people newly vitamin A deficient under complete loss</div>
                            <div style={{ fontSize: 14, color: CITE, marginTop: 7 }}>Plus 2.2 billion already below recommended intake would decline further.</div>
                        </div>
                    </div>
                </div>

                {/* Complete Loss Scenario */}
                <div style={{ padding: "30px 0" }}>
                    <SectionLabel color={RED}>If pollinators go entirely — The Lancet, 2015</SectionLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                        {[
                            { v: "1.42M", l: "additional deaths per year" },
                            { v: "27M", l: "disability-adjusted life years" },
                            { v: "−23%", l: "global fruit supply" },
                            { v: "−16%", l: "global vegetable supply" },
                            { v: "71M", l: "newly vitamin A deficient" },
                            { v: "173M", l: "newly folate deficient" },
                        ].map((d, i) => (
                            <div key={i} style={{ padding: "24px", border: `1px solid ${RED}25`, borderRadius: 8, background: `${RED}05`, textAlign: "center" }}>
                                <div style={{ fontSize: 38, fontWeight: 300, color: RED, fontFamily: "monospace" }}>{d.v}</div>
                                <div style={{ fontSize: 15, color: WHITE, marginTop: 8, opacity: 0.85 }}>{d.l}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: 24 }}>
                        <span style={{ fontSize: 16, color: CITE, fontStyle: "italic" }}>Under 50% loss: ~700,000 additional deaths per year. The more realistic near-term scenario.</span>
                    </div>
                </div>


                {/* ══════════════════════════════════════════════════════
            SECTION 2: THE CONSERVATION COST
            ══════════════════════════════════════════════════════ */}
                <SectionDivider title="THE CONSERVATION COST" subtitle="How ecosystems unravel from the ground up" color={GOLD} />

                {/* Biomass Decline — 2 col */}
                <div style={{ padding: "20px 0 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
                    <div>
                        <div style={{ fontSize: 80, fontWeight: 300, color: RED, fontFamily: "monospace", lineHeight: 1 }}>−76%</div>
                        <div style={{ fontSize: 20, color: WHITE, marginTop: 8 }}>flying insect biomass lost in 27 years</div>
                        <div style={{ fontSize: 15, color: WHITE, marginTop: 8, opacity: 0.75 }}>In protected nature areas. Not farmland. Protected areas.</div>
                        <div style={{ fontSize: 13, color: CITE, fontFamily: "monospace", marginTop: 14 }}>KREFELD STUDY · 63 SITES · 1,500 SAMPLES · 2017</div>
                    </div>
                    <BigDecline color={GOLD} w={500} h={140} data={[
                        { y: "1989", v: 100 }, { y: "", v: 94 }, { y: "", v: 86 }, { y: "", v: 76 },
                        { y: "", v: 64 }, { y: "", v: 52 }, { y: "", v: 40 }, { y: "", v: 32 }, { y: "Present", v: 24 },
                    ]} />
                </div>

                {/* Species at Risk — Donuts */}
                <div style={{ padding: "30px 0" }}>
                    <SectionLabel>Species at Risk Right Now</SectionLabel>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20, marginTop: 16 }}>
                        <Donut value={40} label="Invertebrate Pollinators" sub="IPBES, 2016" color={RED} size={130} />
                        <Donut value={35} label="NA Bee Species" sub="PNAS, March 2025" color={RED} size={130} />
                        <Donut value={46} label="Leafcutter Bees" sub="PNAS, March 2025" color={RED} size={130} />
                        <Donut value={25} label="Global Bee Species Gone" sub="Since 1990 · GBIF" color={GOLD} size={130} />
                        <Donut value={90} label="Flowering Plants Depend" sub="On animal pollinators" color={GOLD} size={130} />
                    </div>
                </div>

                {/* Ecosystem Cascade — Full-width grid flow */}
                <div style={{ padding: "30px 0" }}>
                    <SectionLabel color={GOLD}>The Ecosystem Cascade</SectionLabel>
                    <FlowChain steps={[
                        { icon: "🐝", title: "POLLINATORS\nDECLINE", color: GOLD },
                        { icon: "🌸", title: "90% OF PLANTS\nCAN'T REPRODUCE", color: GOLD },
                        { icon: "🌿", title: "PLANT DIVERSITY\nCOLLAPSES", color: GOLD },
                        { icon: "🐦", title: "FOOD WEBS\nCOLLAPSE", color: RED },
                        { icon: "🌍", title: "CARBON CAPTURE\nFAILS", color: RED },
                        { icon: "🔥", title: "CLIMATE\nSPIRAL", color: RED },
                    ]} />
                    <div style={{ textAlign: "center", marginTop: 16, padding: "16px 40px", border: `1px solid ${RED}30`, borderRadius: 8, background: `${RED}06` }}>
                        <div style={{ fontSize: 19, color: RED, fontWeight: 500 }}>Networks don't decline gradually.</div>
                        <div style={{ fontSize: 16, color: WHITE, marginTop: 6, opacity: 0.75 }}>They hold, and hold, and hold — then collapse all at once. No warning.</div>
                    </div>
                </div>

                {/* Measured Species Decline */}
                <div style={{ padding: "30px 0" }}>
                    <SectionLabel>Measured Species Decline</SectionLabel>
                    <Bar label="Some NA bumblebee species" value={96} unit="% lost" color={RED} />
                    <Bar label="Monarch butterfly" value={80} unit="% lost" color={RED} delay={80} />
                    <Bar label="Flying insect biomass" value={76} unit="% lost" color={RED} delay={160} />
                    <Bar label="NA managed honey bee colonies since 1947" value={59} unit="% lost" color={GOLD} delay={240} />
                    <Bar label="Western bumble bee since 1998" value={57} unit="% lost" color={GOLD} delay={320} />
                    <Bar label="UK wild insect pollinators" value={33} unit="% lost" color={GOLD} delay={400} />
                    <Bar label="Global bee species since 1990" value={25} unit="% lost" color={GOLD} delay={480} />
                </div>


                {/* ══════════════════════════════════════════════════════
            SECTION 3: THE ECONOMIC COST
            ══════════════════════════════════════════════════════ */}
                <SectionDivider title="THE ECONOMIC COST" subtitle="What inaction costs the global economy" color={GOLD} />

                {/* 3 Big Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, padding: "20px 0" }}>
                    <div style={{ padding: "32px", border: `1px solid ${BORDER}`, borderRadius: 8, background: CARD, textAlign: "center" }}>
                        <div style={{ fontSize: 54, fontWeight: 300, color: GOLD, fontFamily: "monospace" }}>$577B</div>
                        <div style={{ fontSize: 17, color: WHITE, marginTop: 8 }}>annual pollination value at risk</div>
                        <div style={{ fontSize: 13, color: CITE, fontFamily: "monospace", marginTop: 12 }}>OUR WORLD IN DATA</div>
                    </div>
                    <div style={{ padding: "32px", border: `1px solid ${RED}30`, borderRadius: 8, background: `${RED}06`, textAlign: "center" }}>
                        <div style={{ fontSize: 54, fontWeight: 300, color: RED, fontFamily: "monospace" }}>$729B</div>
                        <div style={{ fontSize: 17, color: WHITE, marginTop: 8 }}>global welfare loss under collapse</div>
                        <div style={{ fontSize: 13, color: CITE, fontFamily: "monospace", marginTop: 12 }}>SCIENCEDIRECT, FEB 2025</div>
                    </div>
                    <div style={{ padding: "32px", border: `1px solid ${RED}30`, borderRadius: 8, background: `${RED}06`, textAlign: "center" }}>
                        <div style={{ fontSize: 54, fontWeight: 300, color: RED, fontFamily: "monospace" }}>+187%</div>
                        <div style={{ fontSize: 17, color: WHITE, marginTop: 8 }}>crop price increase</div>
                        <div style={{ fontSize: 15, color: WHITE, marginTop: 5, opacity: 0.75 }}>Food nearly triples in cost worldwide</div>
                        <div style={{ fontSize: 13, color: CITE, fontFamily: "monospace", marginTop: 12 }}>ECOLOGICAL ECONOMICS, 2024</div>
                    </div>
                </div>

                {/* Who pays — bars */}
                <div style={{ padding: "24px 0" }}>
                    <Bar label="Low-income countries — agricultural value lost" value={30} max={35} unit="%" color={RED} />
                    <Bar label="European Union — crop yield loss by 2030" value={8} max={35} unit="%" color={GOLD} delay={100} />
                    <Bar label="High-income countries — agricultural value lost" value={5} max={35} unit="%" color={GOLD} delay={200} />
                </div>
                <div style={{ textAlign: "center", padding: "0 0 20px", fontSize: 17, color: WHITE, fontStyle: "italic", opacity: 0.7 }}>
                    In most of Africa and South Asia, there are no bees to rent at any price. Pollidrone isn't cheaper — it's the only option.
                </div>


                {/* ═══════════ CLOSING ═══════════ */}
                <div style={{ textAlign: "center", padding: "50px 0 80px" }}>
                    <div style={{ width: 50, height: 1, background: GOLD, margin: "0 auto 36px", opacity: 0.3 }} />
                    <div style={{ fontSize: 22, color: GOLD, lineHeight: 1.7, fontWeight: 300, fontStyle: "italic", maxWidth: 700, margin: "0 auto" }}>
                        "This isn't about replacing nature.<br />
                        It's about understanding it well enough to protect it —<br />
                        and keeping people fed while we do."
                    </div>
                    <div style={{ marginTop: 30, fontSize: 14, letterSpacing: "0.3em", color: CITE, fontFamily: "monospace" }}>
                        POLLIDRONE · POWERED BY DGX SPARK
                    </div>
                </div>
            </div>
        </div>
    );
}
