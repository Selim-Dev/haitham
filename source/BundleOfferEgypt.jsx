import { useState, useEffect } from "react";

/* ─── Global CSS: fonts, keyframes, CTA classes ─── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body, html { font-family: 'IBM Plex Sans Arabic', -apple-system, sans-serif; direction: rtl; overflow-x: hidden; }

@keyframes pulse {
  0%,100% { transform: scale(1);    box-shadow: 0 10px 30px rgba(255,215,0,.5); }
  50%      { transform: scale(1.03); box-shadow: 0 15px 40px rgba(255,215,0,.7); }
}
@keyframes shimmer {
  0%   { transform: translateX(-100%) translateY(-100%) rotate(30deg); }
  100% { transform: translateX(100%)  translateY(100%)  rotate(30deg); }
}
@keyframes shine {
  0%      { left:-100%; }
  20%,100%{ left: 100%; }
}
@keyframes bounce {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-8px); }
}
@keyframes flash {
  0%,100% { opacity:1; }
  50%     { opacity:.45; }
}

/* ── Gold CTA ── */
.cta-hover {
  display: inline-block;
  background: linear-gradient(135deg,#FFD700,#FFA500);
  color: #000; font-size:1.3rem; font-weight:700;
  padding:20px 50px; border-radius:50px;
  text-decoration:none; cursor:pointer;
  box-shadow:0 10px 30px rgba(255,215,0,.5);
  border:2px solid rgba(255,255,255,.3);
  position:relative; overflow:hidden;
  animation: pulse 2s ease-in-out infinite;
  will-change:transform; transition:all .3s ease;
}
.cta-hover::before {
  content:''; position:absolute; top:-50%; left:-50%;
  width:200%; height:200%;
  background:linear-gradient(45deg,transparent 30%,rgba(255,255,255,.4) 50%,transparent 70%);
  animation:shimmer 3s infinite linear; pointer-events:none;
}
.cta-hover::after {
  content:''; position:absolute; top:0; left:-100%;
  width:50%; height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);
  animation:shine 3s infinite; pointer-events:none;
}
.cta-hover:hover {
  transform:translateY(-3px) scale(1.02);
  box-shadow:0 20px 50px rgba(255,215,0,.8);
  background:linear-gradient(135deg,#FFA500,#FFD700);
  animation:none;
}

/* ── Green CTA ── */
.cta-green {
  display:block; text-align:center;
  background:linear-gradient(135deg,rgb(5,150,105),rgb(16,185,129));
  color:#fff; font-size:1.1rem; font-weight:600;
  padding:18px 40px; border-radius:12px;
  text-decoration:none; cursor:pointer;
  box-shadow:0 8px 25px rgba(5,150,105,.4);
  border:2px solid rgba(255,255,255,.2);
  position:relative; overflow:hidden;
  transition:all .3s ease;
}
.cta-green::before {
  content:''; position:absolute; top:-50%; left:-50%;
  width:200%; height:200%;
  background:linear-gradient(45deg,transparent 30%,rgba(255,255,255,.3) 50%,transparent 70%);
  animation:shimmer 3s infinite linear; pointer-events:none;
}
.cta-green::after {
  content:''; position:absolute; top:0; left:-100%;
  width:50%; height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);
  animation:shine 3.5s infinite; pointer-events:none;
}
.cta-green:hover {
  transform:translateY(-2px) scale(1.02);
  box-shadow:0 15px 40px rgba(5,150,105,.6);
}

.bounce-anim { animation:bounce 2s ease-in-out infinite; will-change:transform; }
.flash-anim  { animation:flash 1.5s ease-in-out infinite; }
.pulse-anim  { animation:pulse 2s ease-in-out infinite; will-change:transform; }
.card-hover  { transition:transform .3s ease, box-shadow .3s ease; }
.card-hover:hover { transform:translateY(-5px); }

/* footer link hover */
.foot-link { color:#fff; text-decoration:none; transition:color .3s; font-size:1rem; }
.foot-link:hover { color:#FFD700; }
`;

/* ─── Egypt variant: all purchases go through Tally, no PayPal ─── */
const TALLY_URL = "https://tally.so/r/eqDaOo";

/* ─── Data ─── */
const FAQS = [
  { q: "إزاي بيوصلي كتاب لعبة الاختبارات؟", a: "كتاب لعبة الاختبارات الكتروني فقط بيوصل على إيميلك أو الواتساب أو التليجرام. كتاب النكش وكتاب فتح المواضيع بيوصلوا مرفقين في نفس الملف." },
  { q: "هل الكتاب للعلاقات مع البنات فقط؟", a: "كتاب لعبة الاختبارات يكشف لك أسرار ديناميكيات العلاقات البشرية بأكملها. الاختبارات لا تقتصر على النساء فحسب، بل تحدث مع كل إنسان في حياتك. وفي الفصل السادس، ستجد تطبيقات عملية مفصله تمكنك من إتقان هذه المهارة الحياتية في أي علاقة." },
  { q: "اشتريت كتاب لعبة الاختبارات وموصلش على إيميلي؟", a: "شوف البريد الغير مرغوب فيه أو فولدر السبام هتلاقيه موجود. للأسف، ساعات الكتاب بيوصل في الملف ده." },
  { q: "هل فيه ضمان استرجاع المبلغ؟", a: "نعم، في ضمان استرجاع كامل لمدة 14 يوم. أنا واثق في جودة المحتوى، وعشان كده أنا بشيل عنك أي مخاطرة. لو طبقت المعلومات ومفادتكش، هرجلعك فلوسك. للتفاصيل الكاملة، راجع سياسة الاسترداد." },
  { q: "هل الكتاب ينفع للمتزوجين؟", a: "طبعًا! الكتاب مخصص لاستعادة الهيبة والسيطرة في الجواز وإزاي تحمي بيتك من الانهيار." },
];

const CHAPTERS = [
  { icon: "📖", title: "البداية والفصل الأول", body: "<strong>قصتي الشخصية</strong> وإزاي تحولت من الطرف الأقوى لمجرد اختيار، <strong>غلطة الـ 99%</strong> وليه طيبتك بتقتل شغفها، <strong>الرادار البيولوجي</strong> وإزاي بتختبر رجولتك 24 ساعة، <strong>نظرية القطة والحواجز</strong> عشان تخليها تجري وراك." },
  { icon: "⚡", title: "الفصل التاني والتالت", body: "<strong>الـ Frame (الإطار)</strong> ومين بيحط قوانين اللعبة، ليه <strong>إرضاءها بيضعف الانجذاب</strong> والبديل الصح، <strong>معادلة الهوس</strong> عشان تخليها تدمن وجودك، <strong>قلب الترابيزة وتوقيت الرد</strong> المناسب." },
  { icon: "🔥", title: "الفصل الرابع والخامس", body: "<strong>الصمت المحسوب</strong> أقوى من 100 كلمة، <strong>الحل النووي</strong> لاستعادة الكرامة، الخروج من <strong>الفريندزون</strong> والبرود العاطفي، <strong>استعادة السيطرة والهيبة</strong> بعد ما خسرتها." },
  { icon: "💪", title: "الفصل السادس والسابع", body: "<strong>الاختبارات في الشغل</strong> ومع مديرك، <strong>8 اختبارات نووية</strong> بتدمر العلاقة، <strong>مولد الردود الذكية</strong> لأي موقف، <strong>عقدة أرملة الألفا</strong> وإزاي تمسح صورته من خيالها." },
];

const BUNDLE_ITEMS = [
  { img: "images/game-of-tests.webp", badge: null, title: "📚 الكتاب الأساسي: لعبة الاختبارات", titleColor: "#FFD700", desc: "الخلاصة اللي اتعلمتها في سنين عشان متغلطش غلطاتي. هندسة عكسية لكل موقف ممكن تتحط فيه." },
  { img: "images/topics.webp", badge: "🎁 بونص", title: "💬 الهدية الأولى: فتح المواضيع", titleColor: "#1a1a1a", desc: "150+ سؤال لفتح مواضيع وبناء الراحة.. هتحكيلك عن أسرار عمرها ما قالتها لحد." },
  { img: "images/naksh.webp", badge: "🎁 بونص", title: "😄 الهدية الثانية: النكش", titleColor: "#1a1a1a", desc: "+70 نكشة لخلق انجذاب قوي جدًا من العدم.. هتخليها تفكر فيك طول الوقت." },
];

const PACKAGE_ITEMS = [
  { title: "الكتاب الأساسي: لعبة الاختبارات", price: "(200 جنيه)", desc: "الخريطة النفسية اللي بتفك "شفرة" دماغها وتخليك تنجح في أصعب اختباراتها بثقة وذكاء.", delay: "0s" },
  { title: "كتاب النكش", price: "(100 جنيه)", desc: "اكسر الحواجز في ثواني.. ضحكها، استفزها بذكاء، وخليك دايمًا جوا دماغها بكل هيبة وكاريزما.", delay: "0.2s" },
  { title: "كتاب فتح المواضيع", price: "(100 جنيه)", desc: "150 سؤال جاهز يخلي الكلام بينكوا مايخلصش أبداً ويعمق العلاقة بشكل طبيعي ويخليها مرتاحة معاك.", delay: "0.4s" },
];

const PROBLEM_CARDS = [
  { title: '❌ لو أنت لسه بتبدأ (فخ "الراجل اللطيف"):', body: 'تفضل باصص للموبايل مستني "نظرة" أو رد منها، وهي "أونلاين" ومطنشاك عشان عارفة إنك مضمون. تبقى أنت "حمال الأسية" اللي بتشتكيله همومها وتعيش دور "الأخ" أو "البيست فريند" بينما هي بتروح للي بيعرف يخليها تجري وراه.' },
  { title: '❌ لو أنت في علاقة أو خطوبة (فخ "التقلب"):', body: 'يوم تعاملك كأنك ملك، وعشرة تعاملك ببرود يجننك. فجأة تتغير عليك من غير سبب، وتحس إنك بتقدم تنازلات عشان ترضيها، وهي بتزيد فيها وتدوس على كرامتك.' },
  { title: '❌ لو أنت متجوز أو في علاقة طويلة (فخ "انعدام الهيبة"):', body: 'تحولت في نظرها لـ "ATM" وتلبي طلبات البيت، بس مفيش أي تقدير. صوتها بدأ يعلى، "اختباراتها" بقت نووية، وبقيت حاسس إنك ضيف في بيتك مش "سيد الموقف".' },
];

const FEEDBACK_IMGS = [
  "images/bookfeedback4.jpg", "images/bookfeedback3.jpg",
  "images/bookfeedback2.jpg", "images/bookfeedback1.jpg",
  "images/bookfeedback8.jpg", "images/bookfeedback7.jpg",
  "images/bookfeedback6.jpg", "images/bookfeedback4.jpg",
];

const FOOTER_LINKS = [
  { href: "shipping-policy",      label: "سياسة التسليم" },
  { href: "privacy-policy",       label: "سياسة الخصوصية" },
  { href: "terms-and-conditions", label: "شروط الاستخدام" },
  { href: "refund-policy",        label: "سياسة الاسترجاع" },
  { href: "contact",              label: "تواصل معنا" },
];

const SOCIAL = [
  { href: "https://instagram.com/ahaitham74",          icon: "📸", label: "Instagram" },
  { href: "https://www.youtube.com/@AHaitham74",       icon: "▶️",  label: "YouTube"   },
  { href: "https://www.tiktok.com/@ahaitham74",        icon: "🎵", label: "TikTok"    },
  { href: "https://www.facebook.com/AHaitham74/",      icon: "📘", label: "Facebook"  },
];

/* ─── Small shared pieces ─── */
const SubCaption = () => (
  <p style={{ fontSize: "0.85rem", color: "#CCCCCC", textAlign: "center", margin: "10px 0 0", fontStyle: "italic", fontWeight: 500 }}>
    احصل على الهدايا قبل فصلها عن العرض
  </p>
);

const SectionHeading = ({ children, light = false }) => (
  <h2 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: 700, color: light ? "#FFD700" : "#1a1a1a" }}>
    {children}
  </h2>
);

/* ═══════════════════════════════════════════════════ */
export default function BundleOfferEgypt() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Fixed Progress Bar ── */}
      <div style={{ position: "fixed", top: 0, right: 0, width: "100%", height: "4px", background: "linear-gradient(90deg,#FFD700,#FFA500,#ff0055)", zIndex: 9999 }} />

      {/* ════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(180deg,#fff 0%,#fffef8 100%)", position: "relative", overflow: "hidden", paddingBottom: "1.5rem" }}>
        {/* ambient orbs */}
        <div style={{ position: "absolute", top: "-100px", left: "-100px", width: "300px", height: "300px", background: "radial-gradient(circle,rgba(255,215,0,.1) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-150px", right: "-150px", width: "400px", height: "400px", background: "radial-gradient(circle,rgba(255,165,0,.08) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div className="max-w-6xl mx-auto px-5 py-14" style={{ position: "relative", zIndex: 1 }}>
          <div className="flex flex-col lg:flex-row items-center gap-10">

            {/* Text column */}
            <div className="flex-1 text-right order-2 lg:order-1">
              <span className="bounce-anim" style={{ display: "inline-block", background: "linear-gradient(135deg,#ff0055,#ff3377)", color: "#fff", padding: "8px 20px", borderRadius: "30px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "15px", boxShadow: "0 5px 15px rgba(255,0,85,.3)" }}>
                🔥 عرض فترة محدودة
              </span>

              <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.25, marginBottom: "1rem", textAlign: "right" }}>
                ليه البنت بتتقفل منك فجأة حتى لو{" "}
                <span style={{ color: "#ff0055", position: "relative", display: "inline-block" }}>
                  كانت هتموت عليك
                  <span style={{ position: "absolute", bottom: "-5px", right: 0, width: "100%", height: "3px", background: "linear-gradient(90deg,#ff0055,#ff3377)", borderRadius: "2px" }} />
                </span>{" "}في الأول؟
              </h1>

              <p style={{ fontSize: "1.2rem", color: "#ff0055", fontWeight: 600, fontStyle: "italic", marginBottom: "20px" }}>
                (السر اللي محدش هيقولهولك غير هنا)
              </p>

              <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#1a1a1a", marginBottom: "15px" }}>
                أنت كنت فاكرها{" "}
                <strong style={{ background: "linear-gradient(135deg,#fff3cd,#ffe8a1)", padding: "3px 8px", borderRadius: "5px" }}>"ظروف"</strong>
                .. بس الحقيقة إنك{" "}
                <span style={{ color: "#ff0055", fontWeight: 700 }}>وقعت في اختباراتها</span>.
              </p>

              <div style={{ background: "linear-gradient(135deg,#e3f2fd,#bbdefb)", padding: "25px", borderRadius: "15px", borderRight: "5px solid #0066ff", boxShadow: "0 10px 30px rgba(0,102,255,.15)", position: "relative", overflow: "hidden" }}>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.7, margin: 0, color: "#1a1a1a", fontWeight: 600 }}>
                  <strong style={{ color: "#0066ff", fontSize: "1.2rem" }}>✨ كتاب لعبة الاختبارات</strong> هو الكود السري لتعطيل الرادار ده.. هيخليك تقرأ أفكارها، هتخلي البنت تتشدلك، وتخليها هي اللي تدور على رضاك عشان خايفة تخسرك.
                </p>
              </div>
            </div>

            {/* Book cover */}
            <div className="flex-1 flex justify-center order-1 lg:order-2">
              <div style={{ position: "relative" }}>
                <span className="bounce-anim" style={{ position: "absolute", top: "-20px", left: "-20px", background: "linear-gradient(135deg,#FFD700,#FFA500)", color: "#000", padding: "12px 20px", borderRadius: "50px", fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 8px 25px rgba(255,215,0,.5)", zIndex: 10 }}>
                  💎 الأكثر مبيعاً
                </span>
                <img
                  src="images/game-of-tests.webp" alt="كتاب لعبة الاختبارات"
                  width={600} height={800}
                  fetchpriority="high"
                  style={{ maxWidth: "100%", height: "auto", borderRadius: "20px", boxShadow: "rgba(0,0,0,.25) 0 20px 60px", transform: "perspective(1000px) rotateY(5deg)", transition: "0.5s" }}
                  onMouseOver={e => (e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) scale(1.05)")}
                  onMouseOut={e  => (e.currentTarget.style.transform = "perspective(1000px) rotateY(5deg)")}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2 — ABOUT AUTHOR
      ════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "80px 20px", position: "relative", overflow: "hidden" }}>
        <div className="max-w-4xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
          <SectionHeading>مين أنا وليه لازم تسمع الكلام ده؟</SectionHeading>

          <div className="flex flex-col lg:flex-row items-center gap-10 mt-10">
            {/* Author photo */}
            <div className="text-center lg:w-1/3">
              <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ position: "absolute", inset: "-10px", background: "linear-gradient(135deg,#FFD700,#FFA500)", borderRadius: "20px", opacity: .3, filter: "blur(20px)" }} />
                <img
                  src="images/ahmedhaitham-efham.webp" alt="أحمد هيثم"
                  width={400} height={400}
                  style={{ width: "100%", maxWidth: "300px", borderRadius: "20px", boxShadow: "0 15px 40px rgba(0,0,0,.25)", position: "relative", border: "4px solid #fff", transition: "all .4s ease" }}
                  onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05) rotate(2deg)")}
                  onMouseOut={e  => (e.currentTarget.style.transform = "scale(1) rotate(0deg)")}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="lg:w-2/3 text-right">
              <h3 style={{ fontSize: "1.8rem", fontWeight: 700, background: "linear-gradient(135deg,#FFD700,#FFA500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: "20px" }}>
                أحمد هيثم - خبير علاقات وتطوير ذاتي
              </h3>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#333", paddingRight: "15px", borderRight: "3px solid #FFD700" }}>
                <strong style={{ color: "#000", fontSize: "1.3rem" }}>+10 سنين</strong> دراسة وتجربة في فهم ديناميكيات العلاقات والسيكولوجي النسائي.
              </p>
              <div style={{ background: "linear-gradient(135deg,#f9f9f9,#f0f0f0)", borderRight: "4px solid #FFD700", padding: "25px", borderRadius: "12px", marginTop: "25px", boxShadow: "0 8px 20px rgba(0,0,0,.08)" }}>
                <p style={{ fontSize: "1rem", color: "#666", margin: 0, lineHeight: 1.6 }}>
                  <strong style={{ color: "#000", fontSize: "1.1rem" }}>"الكتاب ده مش مجرد نظريات.. ده خلاصة 10 سنين أخطاء وتجارب عشان متغلطش غلطاتي."</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 text-center">
            {[
              { value: "+102 ألف", label: "متابع عبر المنصات" },
              { value: "+19 مليون", label: "مشاهدة للمحتوى" },
              { value: "آلاف", label: "العملاء الناجحين" },
            ].map((s, i) => (
              <div key={i} style={{ background: "linear-gradient(135deg,#fff9e6,#ffe8b3)", padding: "30px", borderRadius: "15px", boxShadow: "0 8px 25px rgba(255,215,0,.15)", border: "2px solid #FFD700" }}>
                <p style={{ fontSize: "2.8rem", fontWeight: 700, color: "#FFD700", margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: "1rem", color: "#666", margin: "5px 0 0", fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href={TALLY_URL} target="_blank" rel="noreferrer" className="cta-hover"><span>ابدأ رحلة التغيير دلوقتي! 🚀</span></a>
            <SubCaption />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 3 — PROBLEM (dark)
      ════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(135deg,#1a1a1a,#000)", color: "#fff", padding: "80px 20px", position: "relative", overflow: "hidden" }}>
        <div className="max-w-6xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#FFD700", textAlign: "center", lineHeight: 1.3, marginBottom: "15px", textShadow: "2px 2px 4px rgba(0,0,0,.3)" }}>
            اسأل نفسك بصدق..<br />
            <span style={{ fontSize: "3rem", color: "#fff" }}>هتستحمل تعيش كده لحد امتى؟</span>
          </h2>
          <p style={{ fontSize: "1.3rem", fontWeight: 600, textAlign: "center", marginBottom: "50px", color: "#e0e0e0", lineHeight: 1.6 }}>
            أنت مش بس بتخسر بنات.. أنت بتخسر{" "}
            <span style={{ color: "#ff0055", background: "rgba(255,255,255,.15)", padding: "5px 12px", borderRadius: "8px", boxShadow: "0 4px 15px rgba(255,0,85,.3)", fontWeight: 700 }}>"احترامك لنفسك"</span>{" "}
            كل يوم بتسمح فيه باللي بيحصل ده:
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problem cards */}
            <div className="flex flex-col gap-6">
              {PROBLEM_CARDS.map((c, i) => (
                <div key={i} className="card-hover" style={{ background: "rgba(255,255,255,.08)", padding: "35px", borderRadius: "15px", borderRight: "6px solid #FFD700", boxShadow: "0 8px 20px rgba(0,0,0,.3)", backdropFilter: "blur(10px)", textAlign: "right" }}>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFD700", marginBottom: "15px" }}>{c.title}</h3>
                  <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#e0e0e0", margin: 0 }}>{c.body}</p>
                </div>
              ))}
            </div>

            {/* Bundle image */}
            <div className="text-center flex items-center justify-center">
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: "-15px", background: "linear-gradient(135deg,rgba(255,215,0,.4),rgba(255,165,0,.4))", borderRadius: "20px", filter: "blur(30px)" }} />
                <img
                  src="images/bundle.webp" alt="احمد هيثم"
                  width={500} height={400}
                  style={{ maxWidth: "100%", height: "auto", borderRadius: "20px", boxShadow: "rgba(255,215,0,.4) 0 15px 50px", position: "relative", border: "5px solid #FFD700", transition: "0.5s" }}
                  onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05) rotate(2deg)")}
                  onMouseOut={e  => (e.currentTarget.style.transform = "scale(1) rotate(0deg)")}
                />
              </div>
            </div>
          </div>

          {/* Warning box */}
          <div style={{ background: "rgba(255,215,0,.1)", border: "4px solid #FFD700", padding: "40px", borderRadius: "20px", textAlign: "center", marginTop: "50px", boxShadow: "0 15px 40px rgba(255,215,0,.2)" }}>
            <p style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "20px", color: "#FFD700", lineHeight: 1.7 }}>
              ⚠ المشكلة مش في "الظروف" ولا إن "البنات اتغيرت"..
            </p>
            <p style={{ fontSize: "1.2rem", lineHeight: 1.8, margin: 0, color: "#fff" }}>
              المشكلة إنك بتلعب{" "}
              <strong style={{ color: "#FFD700" }}>لعبة قوانينها صارمة</strong> وأنت{" "}
              <span style={{ background: "rgba(255,215,0,.2)", padding: "5px 12px", borderRadius: "8px", fontWeight: 700, color: "#FFD700" }}>مش عارف الكتالوج بتاعها</span>.
              والأنثى -بفطرتها-{" "}
              <span style={{ fontWeight: 700, textDecoration: "underline", textDecorationColor: "#ff0055", textDecorationThickness: "3px", color: "#ff0055" }}>مستحيل تحب أو تحترم راجل أضعف منها</span>.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4 — BOOK CHAPTERS
      ════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(180deg,#fff 0%,#f9f9f9 100%)", padding: "80px 20px" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading>هتتعلم إيه جوا كتاب لعبة الاختبارات؟</SectionHeading>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-14">
            {CHAPTERS.map((ch, i) => (
              <div key={i} className="card-hover" style={{ background: "linear-gradient(135deg,#fff,#f9f9f9)", border: "2px solid #e0e0e0", borderRadius: "15px", padding: "35px", boxShadow: "0 8px 25px rgba(0,0,0,.08)", position: "relative", overflow: "hidden", textAlign: "right" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100px", height: "100px", background: "linear-gradient(135deg,#FFD700,#FFA500)", opacity: .1, borderRadius: "0 15px 0 100%" }} />
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFD700", borderRight: "4px solid #FFD700", paddingRight: "15px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
                  {ch.icon} {ch.title}
                </h3>
                <p style={{ lineHeight: 1.7, color: "#333", margin: 0 }} dangerouslySetInnerHTML={{ __html: ch.body }} />
              </div>
            ))}
          </div>

          {/* Bonus banner */}
          <div style={{ background: "linear-gradient(135deg,#fff9e6,#ffe8b3)", border: "4px solid #FFD700", borderRadius: "20px", padding: "40px", textAlign: "center", boxShadow: "0 15px 40px rgba(255,215,0,.25)", position: "relative", overflow: "hidden", marginTop: "30px" }}>
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle,rgba(255,215,0,.3) 0%,transparent 70%)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: "-50px", left: "-50px", width: "150px", height: "150px", background: "radial-gradient(circle,rgba(255,165,0,.3) 0%,transparent 70%)", borderRadius: "50%" }} />
            <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "15px", color: "#000", position: "relative", zIndex: 1 }}>🎁 BONUS: أسلحتك السرية</h3>
            <p style={{ lineHeight: 1.7, color: "#1a1a1a", fontWeight: 600, margin: 0, fontSize: "1.2rem", position: "relative", zIndex: 1 }}>
              🎁 <strong>150+ سؤال</strong> لخلق انجذاب وفتح مواضيع &nbsp;•&nbsp; 🎁 <strong>كتاب النكش</strong> إزاي تضحكها وتعلّقها بيك
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 5 — BUNDLE CARDS
      ════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(180deg,#f9f9f9 0%,#fff 100%)", padding: "80px 20px" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading>محتوى العرض الشامل</SectionHeading>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {BUNDLE_ITEMS.map((b, i) => (
              <div key={i} className="card-hover" style={{ background: "#fff", borderRadius: "25px", overflow: "hidden", boxShadow: "0 15px 40px rgba(0,0,0,.1)", border: "2px solid #f0f0f0", position: "relative" }}>
                {b.badge && (
                  <div style={{ position: "absolute", top: "20px", right: "20px", background: "linear-gradient(135deg,#ff0055,#ff3377)", color: "#fff", padding: "8px 18px", borderRadius: "25px", fontWeight: 700, fontSize: "0.9rem", zIndex: 10, boxShadow: "0 5px 15px rgba(255,0,85,.4)" }}>
                    {b.badge}
                  </div>
                )}
                <div style={{ height: "300px", overflow: "hidden", background: "linear-gradient(180deg,#fff 0%,#f9f9f9 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                  <img
                    src={b.img} alt={b.title} loading="lazy"
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", transition: "all .5s ease" }}
                    onMouseOver={e => (e.currentTarget.style.transform = "scale(1.1) rotate(5deg)")}
                    onMouseOut={e  => (e.currentTarget.style.transform = "scale(1) rotate(0deg)")}
                  />
                </div>
                <div style={{ padding: "30px", textAlign: "center", background: "linear-gradient(180deg,#fff 0%,#fffef8 100%)" }}>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: b.titleColor, marginBottom: "15px" }}>{b.title}</h3>
                  <p style={{ color: "#666", fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href={TALLY_URL} target="_blank" rel="noreferrer" className="cta-hover"><span>هتستخسر في نفسك ثمن قهوة؟ ☕</span></a>
            <SubCaption />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 6 — PACKAGE SUMMARY + PRICE
      ════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(180deg,#fff 0%,#fffef8 100%)", padding: "60px 20px", textAlign: "center" }}>
        <div className="max-w-2xl mx-auto">
          <h2 style={{ fontWeight: 700, fontSize: "2.2rem", marginBottom: "40px", color: "#1a1a1a" }}>
            🎯 باقة "لعبة العلاقات" الكاملة
          </h2>

          <div style={{ textAlign: "right", marginBottom: "50px" }}>
            {PACKAGE_ITEMS.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "25px", padding: "25px", background: "linear-gradient(135deg,#f9f9f9,#fff)", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,.08)" }}>
                <span className="bounce-anim" style={{ color: "#28a745", fontSize: "2rem", lineHeight: 1, animationDelay: p.delay }}>✓</span>
                <p style={{ margin: 0, fontSize: "1.15rem", lineHeight: 1.5, textAlign: "right" }}>
                  <strong style={{ color: "#000" }}>{p.title}</strong>{" "}
                  <span style={{ color: "#ff0055", fontWeight: 700, fontSize: "0.95rem" }}>{p.price}</span><br />
                  <span style={{ color: "#666", fontSize: "0.95rem" }}>{p.desc}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Price box */}
          <div style={{ position: "relative", marginTop: "50px" }}>
            <div style={{ position: "absolute", inset: "-15px", background: "linear-gradient(135deg,#FFD700,#FFA500)", borderRadius: "20px", opacity: .2, filter: "blur(25px)" }} />
            <div style={{ position: "relative", background: "linear-gradient(135deg,#fff9e6,#ffe8b3)", padding: "40px", borderRadius: "20px", border: "3px solid #FFD700", boxShadow: "0 15px 40px rgba(255,215,0,.3)" }}>
              <p style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0 0 10px", color: "#000" }}>
                <span style={{ fontSize: "1rem", color: "#666", textDecoration: "line-through", display: "block", marginBottom: "6px" }}>السعر الأصلي: 400 جنيه</span>
                ⚡ سعر الباقة الكاملة:{" "}
                <span style={{ color: "#ff0055", fontSize: "2.5rem" }}>350 جنيه</span>{" "}
                <span style={{ background: "#28a745", color: "#fff", fontSize: "0.9rem", padding: "4px 10px", borderRadius: "12px", marginRight: "8px" }}>وفّر 50 جنيه 🎉</span>
              </p>
              <p className="flash-anim" style={{ fontSize: "1rem", color: "#ff0055", fontWeight: 700, marginTop: "15px", marginBottom: 0 }}>
                ⏰ العرض ينتهي قريباً!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 7 — REFUND GUARANTEE
      ════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "60px 20px" }}>
        <div className="max-w-2xl mx-auto">
          <div style={{ padding: "40px", background: "#fff", border: "3px solid #FFD700", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,.1)", overflow: "hidden", textAlign: "center" }}>
            <div className="pulse-anim" style={{ display: "inline-block", marginBottom: "16px" }}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCutK-XdYtKcPKFEbKEKUAjZZqsf2QISjGyA&s" alt="refund guarantee" style={{ width: "60px", height: "60px", filter: "drop-shadow(0 4px 12px rgba(255,215,0,.5))" }} />
            </div>
            <h2 style={{ fontSize: "clamp(1.2rem,5vw,1.4rem)", fontWeight: 700, marginBottom: "20px", color: "#000", lineHeight: 1.3 }}>
              ضمان استرجاع 100% لمدة 14 يوم
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#1a1a1a", margin: "0 0 16px", padding: "0 8px" }}>
              واثق مليون المية في المعلومات اللي في الكتاب ده. جرب "لعبة الاختبارات" بنفسك.
            </p>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "#1a1a1a", margin: "0 0 24px", padding: "0 8px", fontWeight: 600 }}>
              لو مفادتكش؟ ابعتلي وهرجعلك فلوسك كاملة.
            </p>
            <div
              style={{ background: "linear-gradient(135deg,rgb(26,26,26),rgb(0,0,0))", color: "rgb(255,215,0)", padding: "14px 20px", borderRadius: "12px", boxShadow: "rgba(0,0,0,.3) 0 4px 12px", cursor: "pointer", transition: "0.3s", transform: "scale(1)" }}
              onMouseOver={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,215,0,.4)"; }}
              onMouseOut={e  => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "rgba(0,0,0,.3) 0 4px 12px"; }}
            >
              <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", lineHeight: 1.4 }}>
                يا إما هتفهم دماغها صح، يا إما فلوسك هترجعلك
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 8 — SECONDARY HERO + CHECKOUT
      ════════════════════════════════════════════ */}
      <section id="hero" style={{ background: "linear-gradient(180deg,#fffef8 0%,#fff 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 py-14">
          {/* Trust strip */}
          <div style={{ background: "linear-gradient(135deg,#fff9e6,#ffe8b3)", padding: "15px 25px", borderRadius: "15px", marginBottom: "20px", border: "2px solid #FFD700", boxShadow: "0 5px 15px rgba(255,215,0,.2)" }}>
            <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, textAlign: "center" }}>
              ⭐ يثق في محتوانا{" "}
              <span style={{ color: "#ff0055", fontSize: "1.1rem" }}>آلاف المتابعين</span>
            </p>
          </div>

          <h1 style={{ fontSize: "2.2rem", fontWeight: 700, margin: "20px 0", color: "#1a1a1a", textAlign: "right" }}>
            كتاب لعبة الاختبارات
          </h1>

          {/* Urgency banner */}
          <div style={{ background: "#FF4C4C", color: "#fff", padding: "12px 20px", borderRadius: "10px", textAlign: "center", marginBottom: "20px", boxShadow: "0 5px 15px rgba(255,76,76,.4)" }}>
            <p style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
              🚨 سعر الإطلاق الخاص (350 جنيه) متاح لأول 100 نسخة فقط.
            </p>
            <p style={{ fontSize: "0.9rem", margin: "5px 0 0", opacity: .95, fontWeight: 500 }}>
              أنت تحصل على 3 كتب بسعر أقل من قهوتك! هذا السعر غير منطقي ومتاح لفترة محدودة فقط.
            </p>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexDirection: "row-reverse", justifyContent: "flex-end" }}>
            <h4 style={{ fontSize: "3rem", fontWeight: 700, color: "#FFD700", margin: 0, textShadow: "2px 2px 4px rgba(0,0,0,.1)" }}>350 جنيه</h4>
          </div>

          {/* Description */}
          <div style={{ fontSize: "1rem", lineHeight: 1.7, color: "#666", marginBottom: "25px", padding: "20px", background: "linear-gradient(135deg,#f9f9f9,#fff)", borderRadius: "12px", borderRight: "3px solid #FFD700", boxShadow: "0 5px 15px rgba(0,0,0,.05)", textAlign: "right" }}>
            كتاب لعبة الاختبارات هو الكود السري لتعطيل "الرادار البيولوجي" اللي عند البنات. هيخليك تقرأ أفكارها، تقلب الترابيزة عليها، وتخليها هي اللي تدور على رضاك عشان خايفة تخسرك.
          </div>

          {/* ── Checkout box ── */}
          <div id="x-checkout" style={{ background: "linear-gradient(135deg,#fff9e6,#fffef8)", borderRadius: "20px", padding: "40px 35px", margin: "20px 0", boxShadow: "0 15px 40px rgba(255,215,0,.2)", border: "3px solid #FFD700" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "10px" }}>🎁 احصل على الباقة الكاملة الآن</h3>
              <p style={{ fontSize: "1rem", color: "#666", margin: 0 }}>دفع آمن 100% • استلام عبر الإيميل أو واتساب أو تليجرام</p>
            </div>

            <div style={{ maxWidth: "400px", margin: "15px auto 0" }}>
              <a href={TALLY_URL} className="cta-hover" target="_blank" rel="noreferrer">
                <span>💳 اشتري دلوقتي (فودافون كاش، انستاباي، تحويل بنكي) 🚀</span>
              </a>
            </div>

            {/* Trust badges */}
            <div style={{ marginTop: "25px", paddingTop: "20px", borderTop: "1px solid #e0e0e0", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>✓ فودافون كاش</span>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>✓ انستاباي</span>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>✓ تحويل بنكي</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#999", margin: 0, fontStyle: "italic" }}>🔒 جميع المعاملات مشفرة ومحمية بالكامل</p>
            </div>
          </div>
          <SubCaption />
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 9 — CUSTOMER REVIEWS
      ════════════════════════════════════════════ */}
      <section id="Customer-Reviews" style={{ background: "#f9f9f9", padding: "80px 20px" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading>شوف اللي قالوه العملاء</SectionHeading>
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666", margin: "15px auto 60px", maxWidth: "700px" }}>
            نتائج حقيقية من رجال غيروا حياتهم بالكامل
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEEDBACK_IMGS.map((img, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.06)", border: "1px solid #e8e8e8" }}>
                <img src={img} alt="مراجعة عميل" style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href={TALLY_URL} target="_blank" rel="noreferrer" className="cta-hover"><span>انضم لآلاف الرجال الناجحين 💪</span></a>
            <SubCaption />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 10 — MOTIVATIONAL QUOTE BANNER
      ════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(135deg,#FFD700 0%,#FFA500 100%)", padding: "60px 20px", textAlign: "center" }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontSize: "1.8rem", fontWeight: 700, lineHeight: 1.8, color: "#1a1a1a", margin: 0, textShadow: "1px 1px 2px rgba(255,255,255,.2)" }}>
            الفرصة قدامك دلوقتي تغير حياتك وتنهي "عصر المعاناة" للأبد. الفلوس دي هتصرفهم في مواصلات أو أكل وتنساهم.. لكن الكتاب ده هيفضل معاك طول العمر ينقذك في كل موقف.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 11 — FAQ ACCORDION
      ════════════════════════════════════════════ */}
      <section id="services" style={{ background: "#fff" }}>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <SectionHeading>الأسئلة الشائعة</SectionHeading>
            <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: "600px", margin: "15px auto 0" }}>
              كل اللي محتاج تعرفه قبل ما تبدأ رحلتك
            </p>
          </div>

          <div style={{ maxWidth: "900px", width: "100%", margin: "0 auto" }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "12px", marginBottom: "15px", border: "1px solid #e0e0e0", overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "#fff", border: "none", cursor: "pointer", textAlign: "right", font: "inherit" }}
                >
                  <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1a1a1a", textAlign: "right", flex: 1 }}>{faq.q}</span>
                  <span style={{ fontSize: "1.5rem", color: "#FFD700", transition: "transform .3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", marginRight: "12px" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 20px", background: "#fff", textAlign: "right" }}>
                    <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#555", margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer style={{ background: "#1a1a1a", color: "#fff", padding: "50px 20px", textAlign: "center", marginTop: "80px" }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#FFD700", marginBottom: "30px" }}>أحمد هيثم</div>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "30px" }}>
            {FOOTER_LINKS.map((l, i) => (
              <li key={i}>
                <a href={l.href} className="foot-link">{l.label}</a>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", justifyContent: "center", gap: "20px", margin: "20px 0" }}>
            {SOCIAL.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" title={s.label} style={{ color: "#fff", fontSize: "1.5rem", textDecoration: "none", transition: "color .3s" }}
                onMouseOver={e => (e.currentTarget.style.color = "#FFD700")}
                onMouseOut={e  => (e.currentTarget.style.color = "#fff")}
              >{s.icon}</a>
            ))}
          </div>

          <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #333", color: "#888", fontSize: "0.9rem" }}>
            <p style={{ margin: 0 }}>© 2026 أحمد هيثم. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
