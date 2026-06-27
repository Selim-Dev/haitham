import { useEffect, useRef } from "react";

/* ─── Global CSS ─────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow-x: hidden; }

/* ── keyframes ── */
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(25px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulseKicker {
  0%,100% { transform: scale(1); }
  50%     { transform: scale(1.04); }
}
@keyframes shimmerText {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@keyframes floatY {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-8px); }
}
@keyframes rippleAnim {
  to { transform: scale(1); opacity: 0; }
}

/* ── util animation classes ── */
.fade-down-1 { animation: fadeDown 0.7s ease both; }
.fade-down-2 { animation: fadeDown 0.8s ease both; }
.fade-down-3 { animation: fadeDown 0.9s ease both; }
.fade-up-cards { animation: fadeUp 1s ease 0.2s both; }
.fade-up-trust { animation: fadeUp 1s ease 0.5s both; }
.float-1 { animation: floatY 3s ease-in-out infinite; }
.float-2 { animation: floatY 3s ease-in-out 0.8s infinite; }

/* ── kicker badge ── */
.kicker {
  display: inline-block;
  background: linear-gradient(135deg, #ff0055, #ff3377);
  color: #fff; font-size: 0.85rem; font-weight: 700;
  padding: 7px 20px; border-radius: 30px;
  box-shadow: 0 4px 15px rgba(255,0,85,0.35);
  margin-bottom: 22px;
  animation: pulseKicker 2.5s infinite;
}

/* ── shimmer gradient text ── */
.shimmer-text {
  display: block;
  background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmerText 3s linear infinite;
}

/* ══ REGION CARD ══ */
.region-card {
  position: relative; overflow: hidden;
  border-radius: 28px;
  padding: 44px 30px 38px;
  text-align: center;
  cursor: pointer; text-decoration: none;
  display: flex; flex-direction: column; align-items: center;
  transition: transform 0.25s cubic-bezier(.23,1,.32,1), box-shadow 0.25s ease;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
}
.region-card:active { transform: scale(0.97) !important; }

/* shimmer sweep on hover */
.region-card::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  pointer-events: none;
}
.region-card:hover::after { transform: translateX(100%); }

/* ── Egypt (green) ── */
.card-egypt {
  background: linear-gradient(145deg, #0d1117, #0d1a0d, #0d1117);
  border: 2px solid rgba(0,200,80,0.35);
  box-shadow:
    0 0 0 1px rgba(0,200,80,0.1),
    0 20px 60px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.05);
}
.card-egypt:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: rgba(0,220,90,0.7);
  box-shadow:
    0 0 40px rgba(0,200,80,0.25),
    0 30px 80px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.08);
}
.card-egypt .c-title { color: #00e676; }
.card-egypt .c-btn {
  background: linear-gradient(135deg, #00c853, #00e676);
  color: #000;
  box-shadow: 0 8px 25px rgba(0,200,80,0.4);
}
.card-egypt .c-btn:hover { box-shadow: 0 12px 35px rgba(0,200,80,0.6); filter: brightness(1.05); }

/* ── World (purple) ── */
.card-world {
  background: linear-gradient(145deg, #0d0d1a, #120d1a, #0d0d1a);
  border: 2px solid rgba(130,80,255,0.35);
  box-shadow:
    0 0 0 1px rgba(130,80,255,0.1),
    0 20px 60px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.05);
}
.card-world:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: rgba(150,100,255,0.7);
  box-shadow:
    0 0 40px rgba(130,80,255,0.25),
    0 30px 80px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.08);
}
.card-world .c-title { color: #bb86fc; }
.card-world .c-btn {
  background: linear-gradient(135deg, #7c4dff, #aa80ff);
  color: #fff;
  box-shadow: 0 8px 25px rgba(124,77,255,0.4);
}
.card-world .c-btn:hover { box-shadow: 0 12px 35px rgba(124,77,255,0.6); filter: brightness(1.1); }

/* ── CTA button inside card ── */
.c-btn {
  width: 100%; padding: 16px 20px;
  border-radius: 16px; border: none;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
  font-size: 1.1rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s ease;
  text-decoration: none; display: block;
  text-align: center;
}

/* arrow shifts on card hover */
.c-arrow { margin-right: 8px; display: inline-block; transition: transform 0.2s; }
.region-card:hover .c-arrow { transform: translateX(-5px); }

/* ── trust row ── */
.trust-item {
  display: flex; align-items: center; gap: 7px;
  font-size: 0.85rem; color: rgba(255,255,255,0.4); font-weight: 600;
}

/* ── mobile ── */
@media (max-width: 620px) {
  .cards-grid { grid-template-columns: 1fr !important; max-width: 400px !important; }
  .region-card { padding: 36px 22px 30px; }
  .trust-row { gap: 16px !important; }
}
`;

/* ─── Star Canvas ────────────────────────────────────────────────── */
function StarCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let stars = [];
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function init() {
      stars = [];
      const count = Math.floor((W * H) / 6000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.4 + 0.2,
          a: Math.random(),
          da: (Math.random() - 0.5) * 0.005,
          dx: (Math.random() - 0.5) * 0.08,
          dy: (Math.random() - 0.5) * 0.08,
          gold: Math.random() < 0.08,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.x += s.dx; s.y += s.dy; s.a += s.da;
        if (s.a < 0) { s.a = 0; s.da *= -1; }
        if (s.a > 1) { s.a = 1; s.da *= -1; }
        if (s.x < 0) s.x = W; else if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H; else if (s.y > H) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(255,215,0,${s.a * 0.7})`
          : `rgba(255,255,255,${s.a * 0.6})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    resize(); init(); draw();
    const onResize = () => { resize(); init(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

/* ─── Ripple helper ──────────────────────────────────────────────── */
function handleRipple(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position:absolute;border-radius:50%;pointer-events:none;
    width:${size}px;height:${size}px;
    left:${e.clientX - rect.left - size / 2}px;
    top:${e.clientY - rect.top - size / 2}px;
    background:rgba(255,255,255,0.12);
    transform:scale(0);animation:rippleAnim 0.5s ease-out forwards;
    z-index:10;
  `;
  card.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

/* ─── Region Card ────────────────────────────────────────────────── */
function RegionCard({ href, variant, children }) {
  return (
    <a href={href} className={`region-card card-${variant}`} onClick={handleRipple}>
      {children}
    </a>
  );
}

/* ─── Trust items data ───────────────────────────────────────────── */
const TRUST = [
  { icon: "🔒", label: "دفع آمن 100%" },
  { icon: "⚡", label: "وصول فوري" },
  { icon: "✅", label: "آلاف العملاء الراضيين" },
  { icon: "🔄", label: "ضمان استرجاع" },
];

/* ═══════════════════════════════════════════════════════════════════ */
export default function RegionSelect() {
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'IBM Plex Sans Arabic', -apple-system, sans-serif",
        background: "#050508",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{GLOBAL_CSS}</style>

      {/* ── Animated star field ── */}
      <StarCanvas />

      {/* ── Radial glow layers ── */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse 80% 60% at 20% 50%, rgba(184,134,11,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 50%, rgba(255,0,85,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 100% 80% at 50% 100%, rgba(255,215,0,0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* ── Page wrapper ── */}
      <div
        style={{
          position: "relative", zIndex: 1,
          width: "100%", maxWidth: "1000px",
          padding: "40px 20px 60px",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}
      >

        {/* ── Brand ── */}
        <div className="fade-down-1" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "50px" }}>
          <img
            src="images/logo.png"
            alt="أحمد هيثم"
            onError={e => (e.currentTarget.style.display = "none")}
            style={{ height: "52px", width: "52px", borderRadius: "10px", boxShadow: "0 4px 20px rgba(255,215,0,0.4)" }}
          />
          <span style={{ fontSize: "1.35rem", fontWeight: 700, color: "#FFD700", letterSpacing: "0.5px" }}>
            أحمد هيثم
          </span>
        </div>

        {/* ── Headline ── */}
        <div className="fade-down-2" style={{ textAlign: "center", marginBottom: "18px" }}>
          <div className="kicker">⚡ عرض حصري محدود الوقت</div>

          <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.5px" }}>
            <span style={{ display: "block", color: "#fff" }}>اختار بلدك</span>
            <span className="shimmer-text">واحصل على العرض الأمثل ليك</span>
          </h1>

          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.55)", marginTop: "14px", lineHeight: 1.7, maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
            السعر والطريقة مخصصين حسب منطقتك — اختار دلوقتي واحجز مكانك
          </p>
        </div>

        {/* ── Divider ── */}
        <div
          className="fade-down-3"
          style={{ width: "60px", height: "3px", background: "linear-gradient(90deg,#FFD700,#FFA500)", borderRadius: "10px", margin: "28px auto 42px" }}
        />

        {/* ── Cards grid ── */}
        <div
          className="cards-grid fade-up-cards"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", width: "100%", maxWidth: "820px" }}
        >

          {/* Egypt card */}
          <RegionCard href="/bundle-offer-egypt" variant="egypt">
            <div className="float-1" style={{ marginBottom: "18px" }}>
              <img
                src="https://flagcdn.com/w160/eg.png"
                srcSet="https://flagcdn.com/w320/eg.png 2x"
                width={100} height={67}
                alt="Egypt Flag"
                style={{ borderRadius: "10px", boxShadow: "0 6px 24px rgba(0,0,0,0.55)", display: "block", margin: "0 auto" }}
              />
            </div>
            <div className="c-title" style={{ fontSize: "clamp(1.2rem,3vw,1.65rem)", fontWeight: 800, lineHeight: 1.3, marginBottom: "10px" }}>
              أنا من مصر
            </div>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "26px", minHeight: "52px" }}>
              فودافون كاش • انستاباي • تحويل حساب بنكي
            </p>
            <span className="c-btn">
              <span className="c-arrow">←</span>
              اشتري من مصر
            </span>
          </RegionCard>

          {/* World card */}
          <RegionCard href="/bundle-offer" variant="world">
            <div
              className="float-2"
              style={{ fontSize: "clamp(3.5rem,8vw,5rem)", marginBottom: "18px", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))", lineHeight: 1 }}
            >
              🌍
            </div>
            <div className="c-title" style={{ fontSize: "clamp(1.2rem,3vw,1.65rem)", fontWeight: 800, lineHeight: 1.3, marginBottom: "10px" }}>
              أنا من خارج مصر
            </div>
            <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "26px", minHeight: "52px" }}>
              PayPal • STC Pay • برق • انجاز • تحويل بنكي • Crypto
            </p>
            <span className="c-btn">
              <span className="c-arrow">←</span>
              اشتري من خارج مصر 🌍
            </span>
          </RegionCard>

        </div>

        {/* ── Trust row ── */}
        <div
          className="trust-row fade-up-trust"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginTop: "44px" }}
        >
          {TRUST.map((t, i) => (
            <div key={i} className="trust-item">
              <span>{t.icon}</span> {t.label}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
