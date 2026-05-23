"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./eternal-game.module.css";

// Self-contained Eternal Game landing — markup, scroll-reveal, and the
// small set of perf nudges that live in the source HTML (animation pause
// when off-screen, touch feedback, orientation-change repaint). The page
// is intentionally outside the (public) layout so the brand-wide navbar
// and footer don't appear — the source HTML has its own header/footer.

const FEEDBACK_INDEXES = [1, 2, 3, 4, 5, 6, 7, 8];

export function Landing() {
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // 1. Scroll reveal — one IO instance, fire-once
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.visible);
            revealIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -20px 0px" },
    );

    // 2. Stagger transition-delay among siblings within the same parent
    // (capped at the 3rd sibling so deep lists don't end up with huge waits)
    const reveals = Array.from(
      root.querySelectorAll<HTMLElement>(`.${styles.reveal}`),
    );
    const groups = new Map<Element, HTMLElement[]>();
    reveals.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const list = groups.get(parent) ?? [];
      list.push(el);
      groups.set(parent, list);
    });
    groups.forEach((list) => {
      list.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i * 0.07, 0.21)}s`;
      });
    });
    reveals.forEach((el) => revealIO.observe(el));

    // 3. Pause cover-card float when off-screen
    const coverCard = root.querySelector<HTMLElement>(`.${styles["cover-card"]}`);
    let floatIO: IntersectionObserver | null = null;
    if (coverCard) {
      floatIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            coverCard.style.animationPlayState = e.isIntersecting
              ? "running"
              : "paused";
          });
        },
        { threshold: 0 },
      );
      floatIO.observe(coverCard);
    }

    // 4. Pause pulsing animations when off-screen
    const pulseIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          (e.target as HTMLElement).style.animationPlayState = e.isIntersecting
            ? "running"
            : "paused";
        });
      },
      { threshold: 0 },
    );
    const pulseTargets = root.querySelectorAll<HTMLElement>(
      `.${styles["btn-primary"]}, .${styles.badge}`,
    );
    pulseTargets.forEach((el) => pulseIO.observe(el));

    // 5. Touch-feedback on primary buttons
    const primaryBtns = Array.from(
      root.querySelectorAll<HTMLElement>(`.${styles["btn-primary"]}`),
    );
    const onTouchStart = (e: TouchEvent) =>
      ((e.currentTarget as HTMLElement).style.transform = "scale(0.97)");
    const onTouchClear = (e: TouchEvent) =>
      ((e.currentTarget as HTMLElement).style.transform = "");
    primaryBtns.forEach((btn) => {
      btn.addEventListener("touchstart", onTouchStart, { passive: true });
      btn.addEventListener("touchend", onTouchClear, { passive: true });
      btn.addEventListener("touchcancel", onTouchClear, { passive: true });
    });

    // 6. iOS Safari orientation-change repaint nudge
    const onOrientationChange = () => {
      document.body.style.display = "none";
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      document.body.offsetHeight;
      document.body.style.display = "";
    };
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      revealIO.disconnect();
      floatIO?.disconnect();
      pulseIO.disconnect();
      primaryBtns.forEach((btn) => {
        btn.removeEventListener("touchstart", onTouchStart);
        btn.removeEventListener("touchend", onTouchClear);
        btn.removeEventListener("touchcancel", onTouchClear);
      });
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      {/* Member login button — fixed top-left */}
      <div className={styles["member-bar"]}>
        <Link href="/login" className={styles["btn-member"]}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          منطقة الأعضاء
        </Link>
      </div>

      <main>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={`${styles.container} ${styles["hero-wrap"]}`}>
            <div className={styles["hero-text"]}>
              <div className={styles.badge}>الدليل الشامل لبناء العلاقات</div>

              <h1 className={styles.h1}>
                إنت بتلعب بقواعد اجتماعية مصممة تخليك{" "}
                <span className={styles.rd}>راجل ضعيف</span>
                <br />
                <span className={styles.accent}>
                  لكن البنات{" "}
                  <span className={styles.hl}>مبرمجة فطرياً</span> تنجذب للراجل
                  اللي بيمثل تحدي
                </span>
              </h1>

              <p className={styles["hero-sub"]}>
                في الكورس ده أنا مش هعلمك{" "}
                <span className={styles.rd}>تجري وراها</span>، أنا هعلمك إزاي{" "}
                <span className={styles.hl}>
                  تقلب الآية وتخليها هي اللي بتسعى
                </span>{" "}
                عشان تكسب اهتمامك. انت محتاج بس تفهم{" "}
                <span className={styles.pw}>
                  قوانين اللعبة اللي محدش علمهالك.
                </span>
              </p>

              <div className={styles.whisper}>
                أنا هكون معاك في كل مرحلة.. وهغير{" "}
                <span className={styles.ul}>كل حاجة غلط انت اتعلمتها.</span>
              </div>

              <div className={styles["hero-btns"]}>
                <Link
                  href="/register"
                  className={`${styles.btn} ${styles["btn-primary"]}`}
                >
                  قدّم طلب الانضمام الآن
                </Link>
                <a
                  href="#curriculum"
                  className={`${styles.btn} ${styles["btn-ghost"]}`}
                >
                  شاهد محتوى المنهج
                </a>
              </div>
              <div className={styles["hero-note"]}>
                الانضمام بالقبول فقط — طلبك يُراجع خلال ٢٤ ساعة
              </div>

              <div className={styles["hero-stats"]}>
                <span className={styles.hstat}>♾ وصول دائم</span>
                <span className={styles.hstat}>💬 مجتمع خاص</span>
                <span className={styles.hstat}>🛡 ضمان استرداد كامل</span>
              </div>
            </div>

            <div className={`${styles["cover-card"]} ${styles["hero-image"]}`}>
              <Image
                src="/eternal-game-cover.jpeg"
                alt="غلاف كورس افهم دماغ البنات اللعبة الأزلية"
                width={600}
                height={800}
                priority
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* BREAK QUOTE */}
        <div className={`${styles["break-strip"]} ${styles.reveal}`}>
          <div className={styles.container}>
            <blockquote>
              &quot;إنت{" "}
              <span className={styles.rd}>
                مش ناقص طول أو فلوس أو شكل حلو.
              </span>
              <br />
              إللي ناقصك فعلًا إنك تفهم{" "}
              <span className={styles.hl}>لعبة العلاقات الأزلية</span>.. وده
              اللي هعلمهولك&quot;
            </blockquote>
            <small>— أحمد هيثم</small>
          </div>
        </div>

        {/* PROBLEM */}
        <section className={`${styles.section} ${styles.reveal}`} id="problem">
          <div className={styles.container}>
            <div className={styles["sec-label"]}>المشكلة الحقيقية</div>
            <h2 className={styles["sec-h"]}>
              إنت مالكش ذنب.. للأسف محدش قالك الحقيقة
            </h2>

            <p className={styles["problem-lede"]}>
              نصايح عيلتك، الكورسات الدينية الفقهية، كلام &quot;خليك صريح في
              مشاعرك وحنين وماتسيبهاش لدماغها&quot;…{" "}
              <strong>
                <span className={styles.hl}>
                  نتيجته كانت إنك مش قادر تبدأ علاقة
                </span>
                ، أو لو بدأت علاقة بتبقى{" "}
                <span className={styles.rd}>مجرد أخ وصديق</span>، أو بتدخل علاقة
                كلها نكد.. بدون مشاعر ورغبة حارقة حقيقية
              </strong>{" "}
              وأنت مش فاهم ليه كل ده بيحصل.
            </p>

            <div className={styles["grid-2"]}>
              <div className={`${styles.card} ${styles.reveal}`}>
                <h3>😰 &quot;أقول إيه؟!&quot;</h3>
                <p>
                  أكتر سؤال بيتكرر: &quot;أدخل أقولها إيه؟&quot;{" "}
                  <span className={styles.hl}>الرهبة بتشلك.</span> مش قادر
                  تتعرف عليها..{" "}
                  <span className={styles.rd}>
                    خايف تترفض، خايف تبان تقيل، خايف تبقى &quot;غريب&quot;.
                  </span>{" "}
                  وفي الآخر مبتقولش حاجة.
                </p>
              </div>
              <div className={`${styles.card} ${styles.reveal}`}>
                <h3>🤫 نجاح العلاقات مش في شكلك ولا فلوسك</h3>
                <p>
                  <span className={styles.pw}>
                    الانجذاب له قوانين فطرية ثابتة أزلية.
                  </span>{" "}
                  البنات كلها بتلعب اللعبة حتى لو مش واعيين بده. كل اللي انت
                  محتاج تتعلمه هو{" "}
                  <span className={styles["em-box"]}>قوانين اللعبة الأزلية</span>
                  ، وهتلاقي حلول لكل مشاكل التعارف والعلاقات اللي بتمر بيها.
                </p>
              </div>
              <div className={`${styles.card} ${styles.reveal}`}>
                <h3>📵 التجاهل وال&quot;كرف&quot;</h3>
                <p>
                  خدت الرقم وبعت رسايل ومحصلش حاجة. البنت &quot;
                  <span className={styles.rd}>اختفت</span>&quot; أو &quot;
                  <span className={styles.rd}>كرفت</span>&quot;. لأن في{" "}
                  <span className={styles.ul}>
                    أخطاء محددة بتخلي ده يحصل
                  </span>{" "}
                  وإنت مش عارفها.
                </p>
              </div>
              <div className={`${styles.card} ${styles.reveal}`}>
                <h3>💔 علاقات بتفشل لنفس السبب</h3>
                <p>
                  بعض الناس وصلوا لمرحلة متقدمة.. وهناك اكتشفوا مشكلة تانية.
                  البنت بدأت تتردد، تعمل مشاكل، تتعطل على كل قرار. فهمك لمباديء
                  اللعبة الأزلية هيعلمك اساليب التعامل مع{" "}
                  <span className={styles.hl}>
                    &quot;تردد اللحظة الأخيرة&quot;
                  </span>
                  ، وهتعرف إزاي تخرج بالعلاقة{" "}
                  <span className={styles.pw}>لبر الأمان.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REASSURE STRIP */}
        <div className={`${styles.reassure} ${styles.reveal}`}>
          <div className={`${styles.container} ${styles["reassure-inner"]}`}>
            <p>
              أنا عارف إنك{" "}
              <span className={styles.ul}>
                جربت تسمع كلامهم وتكون واضح وصريح وحنين
              </span>{" "}
              وتقول كلام حلو وتجيب هدايا بدون ما الوضع يتحسن..
              <br />
              <span className={styles.hl}>وتعبت.. وحقك تتعب.</span>
            </p>
            <p>
              <span className={styles.rd}>مفيش سمكة هتعلمك إزاي تصطاد.</span>
              <br />
              <span className={styles.pw}>
                أنا هنا عشان أفتح عينيك على اللعبة اللي كان لازم تتعلمها من
                زمان.
              </span>
            </p>
          </div>
        </div>

        {/* CURRICULUM */}
        <section
          className={`${styles.section} ${styles.reveal}`}
          id="curriculum"
          style={{
            background: "linear-gradient(180deg, #0d1310 0%, #111915 100%)",
          }}
        >
          <div className={styles.container}>
            <div
              className={styles["sec-label"]}
              style={{
                background: "rgba(23,177,79,0.18)",
                color: "#b8f1cd",
                borderColor: "rgba(23,177,79,0.22)",
              }}
            >
              هتتعلم إيه؟
            </div>
            <h2 className={styles["sec-h"]} style={{ color: "#f8fffb" }}>
              سيستم كامل مترتب خطوة بخطوة مناسب ليك حتى لو كنت خام.
            </h2>
            <p
              className={styles["sec-sub"]}
              style={{ color: "rgba(244,251,247,0.78)" }}
            >
              رحلة من أول الدخلة وبداية التعارف لحد ما البنت{" "}
              <span className={styles.hl}>تحبك وتتعلق بيك</span>..مفيش ضربات قلب
              سريعة، مفيش تردد..{" "}
              <span className={styles.pw}>عقلك بيشتغل اوتوماتيك</span>،
              خطواتك واثقة، بتروح تفتح معاها كلام بكل هدوء وذكاء، اجتماعي وفي
              أقل من دقيقتين{" "}
              <span className={styles["em-box"]}>
                بتخليها منجذبة ليك وعايزاك تكمل كلام معاها!
              </span>
            </p>

            <div className={styles.modules}>
              <CurriculumModule
                num="العقلية"
                title="إيه هدفك من اللعبة؟"
                items={[
                  <>
                    تحديد الهدف: إيجاد شريكة{" "}
                    <span className={styles.pw}>بنية حلال</span>، مش مجرد{" "}
                    <span className={styles.rd}>&quot;شقط&quot;</span>
                  </>,
                  <>
                    الفرق بين منهجي، المحتوى الغربي للعلاقات المحرمة العابرة،
                    والكورسات الإسلامية الغير واقعية
                  </>,
                  <>
                    إزاي تتحرر من{" "}
                    <span className={styles.hl}>
                      سجن الدايرة الاجتماعية المملة
                    </span>{" "}
                    وتتعرف على أي بنت تشوفها بحرية
                  </>,
                ]}
              />

              <CurriculumModule
                num="الجزء الأول"
                title="ما قبل الدخلات"
                items={[
                  <>
                    <span className={styles.hl}>
                      70–80% من تأثيرك مش في الكلام
                    </span>{" "}
                    ولكن في الطريقة اللي بيتقال بيها
                  </>,
                  <>
                    إزاي تتكلم مع أي بنت أول مرة أكنك{" "}
                    <span className={styles.pw}>تعرفها من سنين</span>
                  </>,
                  <>
                    <span className={styles["em-box"]}>
                      الكود السري لتعطيل الرهبة والخوف
                    </span>{" "}
                    من بداية الكلام
                  </>,
                  <>
                    <span className={styles.ul}>
                      نبرة الصوت الذكوري، لغة الجسد القوية المطمئنة
                    </span>
                    ، وإزاي تدخل على &quot;شلة&quot; بنات وتكسبهم كلهم
                  </>,
                ]}
              />

              <CurriculumModule
                num="الجزء الثاني"
                title="سيستم الدخلات"
                items={[
                  <>
                    في الجزء الثاني:
                    <br />
                    <span className={styles["em-box"]}>
                      المعادلة السرية للدخلات
                    </span>
                    : إزاي تفتح كلام مع أي بنت بثقة ورقي تام، ومن غير ما تبان{" "}
                    <span className={styles.rd}>
                      غريب (Weird)، أو ملزق (Creepy)
                    </span>
                    ، أو تخترق مساحتها الشخصية بأي شكل.
                  </>,
                  <>
                    شرح شامل لأنواع الدخلات المباشرة والغير مباشرة وقعدات
                    التعارف والدخلات الأونلاين
                  </>,
                  <>
                    إزاي تتعامل مع{" "}
                    <span className={styles.hl}>
                      حائط الصد الدفاعي للبنت
                    </span>{" "}
                    وتفككه بمعلمه
                  </>,
                ]}
              />

              <CurriculumModule
                num="الجزء الثالث"
                title="الفاصل الزمني المزيف"
                items={[
                  <>
                    إيه{" "}
                    <span className={styles["em-box"]}>
                      الفاصل الزمني المزيف
                    </span>{" "}
                    وليه بيلغي إنك تبان{" "}
                    <span className={styles.rd}>غريب وتقيل</span> عليها
                  </>,
                  <>تطبيقاته اللفظية والجسدية بشرح عملي ومفصل</>,
                  <>
                    إزاي تستخدمه كثواب وعقاب عشان{" "}
                    <span className={styles.hl}>
                      &quot;تبرمج&quot; دماغ البنت على حبك
                    </span>
                  </>,
                ]}
              />

              <CurriculumModule
                num="الجزء الرابع"
                title="الانجذاب مش اختيار"
                items={[
                  <>
                    مستشعرات الإعجاب وإزاي تعرف إن البنت عايزاك تكمل كلام معاها
                  </>,
                  <>
                    <span className={styles.pw}>مفاتيح الانجذاب الشاملة</span>{" "}
                    وإزاي تخليها{" "}
                    <span className={styles.hl}>
                      مشدودة ليك بدون ما هي تكون عارفه السبب
                    </span>
                  </>,
                  <>
                    <span className={styles["em-box"]}>سر اللسان الحلو</span>{" "}
                    وإزاي الكلام مايبقاش ممل أبدًا
                  </>,
                ]}
              />

              <CurriculumModule
                num="الجزء الخامس"
                title="بناء الراحة"
                items={[
                  <>
                    مفاتيح الراحة، المكعب، و
                    <span className={styles["em-box"]}>
                      أسئلة سرية بتأهل البنت نفسيًا لك
                    </span>
                  </>,
                  <>
                    <span className={styles.hl}>تكنيك رسم المستقبل</span> لخلق
                    ذكريات لحظية مع أي بنت في ٥ دقايق
                  </>,
                  <>
                    الروابط السرية عشان{" "}
                    <span className={styles.pw}>
                      تزرع نفسك في عقلها وأفكارها
                    </span>
                  </>,
                ]}
              />

              <CurriculumModule
                num="الجزء السادس"
                title="البناء الداخلي واللعبة النفسية"
                items={[
                  <>
                    <span className={styles["em-box"]}>الإطار القوي</span>:
                    إزاي تخليها مطيعة ليك من أول تعامل
                  </>,
                  <>
                    التعامل مع المتنمرين و&quot;الأشباح&quot; والناس اللي
                    هتعاكس البنت وهي معاك
                  </>,
                  <>
                    <span className={styles.pw}>الاستحقاقية العالية</span>: ليه
                    مهم توصل لأعلى مستوى استحقاقية وإزاي توصله
                  </>,
                  <>
                    إزاي <span className={styles.hl}>تخرج برا دماغك</span>{" "}
                    وتتعامل بكل أريحية مع أي بنت
                  </>,
                ]}
              />

              <CurriculumModule
                num="الجزء السابع"
                title="افهم دماغ البنات"
                items={[
                  <>
                    ليه أسلوب{" "}
                    <span className={styles.hl}>النرجسية الكدابة</span> بيجيب
                    نتايج خرافية مع البنات
                  </>,
                  <>
                    مؤشرات الصحة: إزاي البنت بتقيم شكلك ومظهرك وصحتك النفسية
                    والجسدية من أول ما تشوفك
                  </>,
                  <>
                    إزاي تتخطى حاجز{" "}
                    <span className={styles.pw}>&quot;مجرد صديق&quot; للأبد</span>
                  </>,
                  <>
                    شرح{" "}
                    <span className={styles["em-box"]}>
                      تردد اللحظة الأخيرة
                    </span>{" "}
                    وإزاي تتعامل معاه
                  </>,
                ]}
              />

              <CurriculumModule
                num="الجزء الثامن"
                title="مرحلة القفلة"
                items={[
                  <>إزاي تاخد رقم البنت بعد أول تعارف</>,
                  <>
                    لعبة الرسايل بعد التعارف: إزاي{" "}
                    <span className={styles.pw}>متكونش ممل</span>
                  </>,
                  <>
                    <span className={styles["em-box"]}>مضاد الكرف</span>: إزاي
                    تمنع التجاهل والتأخير في الرد
                  </>,
                  <>
                    <span className={styles.hl}>
                      أفضل أماكن التعارف على بنات قيمتها عالية
                    </span>{" "}
                    تنفع تكون خطيبتك ثم مراتك
                  </>,
                ]}
              />

              <CurriculumModule
                num="الجزء التاسع"
                title="تطبيقات عملية"
                items={[
                  <>فيديوهات عملية من أرض الواقع</>,
                  <>شرح عملي شامل للعبة المكعب وتطبيقه العملي مع بنت</>,
                  <>
                    <span className={styles.hl}>تسجيلات حقيقية لمحادثات وشات</span>
                  </>,
                ]}
              />
            </div>

            <div
              className={`${styles["secret-box"]} ${styles.reveal}`}
              style={{
                background:
                  "linear-gradient(135deg, rgba(23,177,79,0.14), rgba(255,255,255,0.06))",
                color: "#f5fff9",
                borderColor: "rgba(23,177,79,0.28)",
                boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
              }}
            >
              🎯 الخلاصة اللي{" "}
              <span className={styles.ul}>مش في أي كورس تاني</span>:{" "}
              <span className={styles.gold}>&quot;ليفل المعلمة&quot;</span>{" "}
              هتتعلم إزاي ما تلعبش الجيم كتيكنيك، بل تعيشه كـ &quot;فن
              مستمر&quot; وإزاي توصل لمستوى &quot;المعلمة&quot;.. هتطبق جميع
              قوانين اللعبة الأزلية تلقائي بدون مجهود أو تفكير.
            </div>
          </div>
        </section>

        {/* AUTHOR */}
        <section
          className={`${styles.section} ${styles.reveal}`}
          id="author"
          style={{
            background:
              "linear-gradient(135deg, #e9fbf0 0%, #f7fff9 100%)",
          }}
        >
          <div className={styles.container}>
            <div
              className={styles["sec-label"]}
              style={{
                background: "#dff7e8",
                color: "#124224",
                borderColor: "rgba(23,177,79,0.24)",
              }}
            >
              من بيقدم المنهج
            </div>
            <h2 className={styles["sec-h"]} style={{ color: "#102f1b" }}>
              مفيش حاجة متقدرش تتعلمها
            </h2>

            <div className={styles["author-wrap"]}>
              <div className={`${styles["author-left"]} ${styles.reveal}`}>
                <blockquote>
                  &quot;فن العلاقات زيه زي أي مهارة.. ليها طرقها وقوانينها.{" "}
                  <span className={styles.hl}>
                    مينفعش تخش امتحان وانت مش مذاكر.
                  </span>
                  <br />
                  <br />
                  أنا هنا جنبك.. هعلمك من الصفر.. مهما كنت &quot;خام&quot; أو
                  معندكش خبرة لأن{" "}
                  <span className={styles.pw}>
                    اللي عمل اللعبة الأزلية هما البنات
                  </span>
                  ، وانا دوري أعلمك لعبتهم بشكل كامل ومتكامل من الصفر.&quot;
                </blockquote>
                <p className={styles["author-note"]}>
                  هذا ليس تمثيلًا ولا تلاعبًا إنما هو فهم حقيقي للطبيعة البشرية.
                </p>
              </div>
              <div className={`${styles["author-right"]} ${styles.reveal}`}>
                <h3>أحمد هيثم</h3>
                <p>
                  مؤلف ومدرب متخصص في ديناميكيات العلاقات وعلم نفس الجذب. صاحب
                  كتب &quot;لعبة الاختبارات&quot; و&quot;النكش&quot; و&quot;فتح
                  المواضيع&quot;.
                </p>
                <p>
                  السيستم ده حصيلة ألم.. وجع قلب وخذلان.. وقت ومجهود وخسارة
                  لسنين لحد ما قدرت أفهم القوانين الأزلية والفطرية اللي بتحكم
                  التفاعل بين الراجل والبنت، انت مش مجبر تتعب زيي.. ولا تشوف
                  البنت اللي بتحبها بتسيبك وتروح لراجل غيرك مع إنه هو أقل منك..
                  أنا جاي اختصر عليك الوقت والمجهود واحافظ على فرصتك مع البنت
                  اللي نفسك فيها.
                </p>
                <div className={styles.tags}>
                  <span className={styles.tag}>مؤلف ومدرب</span>
                  <span className={styles.tag}>
                    سيستم عملي مثبت غيّر حياة مئات الشباب وساعدهم يوصلوا
                    لعلاقات حقيقية.
                  </span>
                  <span className={styles.tag}>
                    أكثر من ٧ سنوات من البحث والتطبيق الحقيقي
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <div className={styles.container}>
            <div className={styles["sec-label"]}>كلام الطلاب</div>
            <h2 className={styles["sec-h"]}>ناس لعبت وفازت</h2>
            <p className={styles["sec-sub"]}>
              نتايج حقيقية من رجال طبقوا المنهج بشكل عملي.
            </p>

            <div className={styles["testimonials-img-grid"]}>
              {FEEDBACK_INDEXES.map((i) => (
                <div
                  key={i}
                  className={`${styles["testi-img-card"]} ${styles.reveal}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/feedbacks/feedback${i}.jpg`}
                    alt={`تقييم طالب ${i}`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PERKS */}
        <section
          className={`${styles.section} ${styles.reveal}`}
          id="perks"
          style={{
            background: "linear-gradient(180deg, #0d1310 0%, #101813 100%)",
          }}
        >
          <div className={styles.container}>
            <div
              className={styles["sec-label"]}
              style={{
                background: "rgba(23,177,79,0.18)",
                color: "#b8f1cd",
                borderColor: "rgba(23,177,79,0.22)",
              }}
            >
              سيستم كامل خطوة بخطوة
            </div>
            <h2 className={styles["sec-h"]} style={{ color: "#f8fffb" }}>
              هتحصل على إيه بالظبط؟
            </h2>
            <p
              className={styles["sec-sub"]}
              style={{ color: "rgba(244,251,247,0.78)" }}
            >
              كل اللي هتحتاجه عشان تطبّق وتشوف نتايج حقيقية من أول يوم.
            </p>

            <div className={styles["perks-grid"]}>
              <div className={`${styles["perk-card"]} ${styles.reveal}`}>
                <div className={styles["perk-icon"]}>⏱</div>
                <h4>
                  <span className={styles.hl}>٥ ساعات ونص</span> من المحتوى
                  المتخصص
                </h4>
                <p>
                  كورس كامل مبني على الترتيب الصح مش فيديوهات عشوائية. كل دقيقة
                  فيه ليها هدف واضح وتطبيق مباشر.
                </p>
              </div>

              <div className={`${styles["perk-card"]} ${styles.reveal}`}>
                <div className={styles["perk-icon"]}>💬</div>
                <h4>مجتمع خاص لطلاب البرنامج</h4>
                <p>
                  مجموعة{" "}
                  <span className={styles.hl}>
                    مقفولة بتضم بس الطلاب اللي اتقبلوا
                  </span>
                  . تبادل تجارب حقيقية، أسئلة وإجابات، ومتابعة مستمرة.
                </p>
              </div>

              <div className={`${styles["perk-card"]} ${styles.reveal}`}>
                <div className={styles["perk-icon"]}>🎙</div>
                <h4>لايفات حصرية للمناقشة ومشاركة التقنيات</h4>
                <p>
                  <span className={styles.pw}>
                    جلسات مباشرة دورية مع أحمد هيثم
                  </span>{" "}
                  لمناقشة التقدم، مشاركة تكنيكات جديدة، والإجابة على أسئلة
                  الطلاب.
                </p>
              </div>

              <div className={`${styles["perk-card"]} ${styles.reveal}`}>
                <div className={styles["perk-icon"]}>🔒</div>
                <h4>حفظ آمن لبياناتك بالكامل</h4>
                <p>
                  بياناتك الشخصية وتفاصيل طلبك محمية ومش بتتشارك مع أي طرف تالت.{" "}
                  <span className={styles["em-box"]}>
                    خصوصيتك خط أحمر.
                  </span>
                </p>
              </div>

              <div className={`${styles["perk-card"]} ${styles.reveal}`}>
                <div className={styles["perk-icon"]}>🛡</div>
                <h4>
                  <span className={styles.pw}>ضمان استرداد كامل</span>
                </h4>
                <p>لو دخلت البرنامج ومش عاجبك لأي سبب هنرجعلك فلوسك كاملة.</p>
              </div>

              <div className={`${styles["perk-card"]} ${styles.reveal}`}>
                <div className={styles["perk-icon"]}>✨</div>
                <h4>محتوي حقيقي</h4>
                <p>
                  تطبيقات عملية وحقيقية من أرض الواقع و
                  <span className={styles.hl}>
                    تسجيل لردود أفعال البنات الحقيقية
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className={`${styles.section} ${styles.reveal}`} id="apply">
          <div className={styles.container}>
            <div className={styles["sec-label"]}>الانضمام للكورس</div>
            <h2 className={styles["sec-h"]}>الاستثمار في نفسك</h2>

            <div className={styles["pricing-wrap"]}>
              <div className={`${styles["price-box"]} ${styles.reveal}`}>
                <span className={styles["price-label"]}>
                  سعر الإطلاق للدفعة الأولى فقط
                </span>
                <div className={styles["price-old"]}>
                  القيمة الحقيقية: لا تقدر بثمن
                </div>
                <div className={styles["price-now"]}>سعر خاص يُعلن عند القبول</div>
                <p className={styles["price-note"]}>
                  مفيش زر شراء مباشر هنا.{" "}
                  <span className={styles["em-box"]}>
                    الكورس بالقبول بس
                  </span>{" "}
                  لأننا عايزين المنهج ده يوصل لراجل جاد فعلًا، مش لحد عايز
                  يستخدمه بشكل غير أخلاقي.
                </p>

                <Link
                  href="/register"
                  className={`${styles.btn} ${styles["btn-primary"]}`}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    minHeight: "58px",
                  }}
                >
                  قدّم طلب الانضمام الآن
                </Link>

                <div className={styles["refund-badge"]}>
                  <span className={styles["rbadge-icon"]}>🛡</span>
                  <div>
                    <strong>ضمان استرداد كامل</strong>
                    لو دخلت البرنامج ومش عاجبك لأي سبب، هنرجعلك فلوسك كاملة. أنا
                    واثق في سيستم اللعبة الأزلية.
                  </div>
                </div>

                <div className={styles.ethical}>
                  أنا بحترم وقتي ومجهودي والسيستم بتاعي.. آخر حاجه عايز أعملها
                  إني أساعد حد يكون علاقة محرمة. أكاديمية أحمد هيثم مختلفة عن
                  أي حاجة هتشوفها لأنها مصممة للراجل اللي عايز يدخل علاقة بنية
                  حلال فقط.
                </div>
              </div>

              <div className={`${styles["steps-box"]} ${styles.reveal}`}>
                <h3>طريقة الإنضمام</h3>
                <ol className={styles["steps-list"]}>
                  <li>
                    <span className={styles.snum}>1</span>
                    <span className={styles.stext}>
                      املأ طلب الأنضمام لـ أكاديمية أحمد هيثم بصدق
                    </span>
                  </li>
                  <li>
                    <span className={styles.snum}>2</span>
                    <span className={styles.stext}>
                      فريقنا بيراجع إجاباتك ويقيّم جديتك واستعدادك للتغيير
                    </span>
                  </li>
                  <li>
                    <span className={styles.snum}>3</span>
                    <span className={styles.stext}>
                      لو تم قبولك، يوصلك خلال{" "}
                      <span className={styles.pw}>٢٤ ساعة</span> رابط دفع لبرنامج
                      اللعبة الأزلية وتفاصيل الدخول
                    </span>
                  </li>
                  <li>
                    <span className={styles.snum}>4</span>
                    <span className={styles.stext}>
                      بعد الدفع،{" "}
                      <span className={styles.ul}>
                        وصول دائم للمحتوى مع كل التحديثات القادمة مجانًا
                      </span>
                    </span>
                  </li>
                </ol>
                <div className={styles.tags} style={{ marginTop: 18 }}>
                  <span className={styles.tag}>جميع طرق الدفع متاحة</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={`${styles.section} ${styles.reveal}`} id="faq">
          <div className={styles.container}>
            <div className={styles["sec-label"]}>أسئلة شائعة</div>

            <div className={styles.faq}>
              <details open>
                <summary>
                  برنامج اللعبة الأزلية مناسب للمبتدئ ولا لازم يكون عندي خبرة؟
                </summary>
                <p>
                  المنهج مبني من الصفر تمامًا.. من لغة الجسد وطريقة التفكير
                  والدخلات وصولًا لإدارة التفاعل والرسايل وبناء العلاقة الجادة.
                  هتتعلم كل حاجة حتى لو كنت خام.
                </p>
              </details>
              <details>
                <summary>الكورس ده بيعلمني أتلاعب بالبنات؟</summary>
                <p>
                  بكل تأكيد لأ. الكورس مصمم للراجل اللي عايز يفهم الديناميكيات
                  الحقيقية ويبني علاقة قوية وصحية بنية حلال. التلاعب والاستغلال
                  مش جزء من منهجي.
                </p>
              </details>
              <details>
                <summary>الوصول للمحتوى دائم؟</summary>
                <p>
                  نعم، وصول دائم + التحديثات المستقبلية مجانًا طول ما الكورس
                  موجود.
                </p>
              </details>
              <details>
                <summary>الفرق بين الكورس والكتب اللي اشتريتها؟</summary>
                <p>
                  لعبة الاختبارات هي جزء مهم من العلاقة.. ولكن اللعبة الأزلية
                  بتشرح التعامل من البداية وما قبل التعارف. اللعبة الأزلية بتشرح
                  مفاتيح الانجذاب ومفاتيح تكوين الراحة بشكل مختلف عن الاختبارات.
                </p>
              </details>
              <details>
                <summary>الكورس لمين بالظبط؟</summary>
                <p>
                  الراجل اللي عايز يقدر يتعرف على بنت من الصفر، أو الراجل اللي
                  عايز يسترجع الانجذاب والراحة وحب البنت له، مع فهم حقيقي
                  للتعارف والانجذاب وبناء العلاقة بشكل سليم. مش للي عايز
                  &quot;يشقط&quot;.
                </p>
              </details>
              <details>
                <summary>فيه ضمان استرداد ولا لأ؟</summary>
                <p>
                  نعم. لو اشتركت في البرنامج ومش عاجبك لأي سبب كان هنرجعلك
                  فلوسك كاملة. أنا واثق في السيستم ده وعايش بيه، وواثق إنه 100%
                  هيفيدك ويحققلك علاقات ناجحة.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className={`${styles.section} ${styles.reveal}`}>
          <div className={styles.container}>
            <div className={styles["cta-final"]}>
              <h2>
                اللعبة الأزلية موجوده من زمان
                <br />
                وهتفضل مستمرة
              </h2>
              <p>
                السؤال الحقيقي: هتفضل تدخل علاقاتك الجاية{" "}
                <span className={styles.rd}>بنفس الأخطاء القديمة</span>، ولا
                هتتعلم{" "}
                <span className={styles.hl}>
                  القوانين اللي بتغير النتيجة من جذورها؟
                </span>
              </p>
              <p
                style={{
                  color: "var(--green)",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  marginBottom: 28,
                }}
              >
                أنا جنبك. خطوة بخطوة. من البداية لحد ما{" "}
                <span className={styles.ul}>
                  تخليها هي اللي بتطلب منك تحبها.
                </span>
              </p>
              <Link
                href="/register"
                className={`${styles.btn} ${styles["btn-primary"]}`}
                style={{
                  fontSize: "1.1rem",
                  minHeight: "58px",
                  padding: "0 40px",
                }}
              >
                تقدّم للانضمام الآن
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles["footer-top"]}`}>
          {/* Brand + Social */}
          <div className={styles["footer-brand-col"]}>
            <div className={styles["footer-logo"]}>
              <span className={styles["footer-logo-dot"]}></span>
              أحمد هيثم | اللعبة الأزلية
            </div>
            <p className={styles["footer-tagline"]}>
              برنامج متخصص في ديناميكيات العلاقات وقوانين الانجذاب لبناء العلاقة
              الجادة الصحيحة.
            </p>
            <div className={styles["footer-social"]}>
              <a
                href="https://www.tiktok.com/@ahaitham74"
                target="_blank"
                rel="noopener noreferrer"
                className={styles["social-icon"]}
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.53V6.79a4.85 4.85 0 0 1-1.02-.1z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@AHaitham74"
                target="_blank"
                rel="noopener noreferrer"
                className={styles["social-icon"]}
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.5V8.5l6.25 3.5-6.25 3.5z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/AHaitham74/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles["social-icon"]}
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/ahaitham74"
                target="_blank"
                rel="noopener noreferrer"
                className={styles["social-icon"]}
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Policies */}
          <div>
            <div className={styles["footer-col-title"]}>السياسات</div>
            <ul className={styles["footer-links"]}>
              <li><Link href="/terms">شروط الاستخدام</Link></li>
              <li><Link href="/privacy">سياسة الخصوصية</Link></li>
              <li><Link href="/refund">سياسة الاسترجاع</Link></li>
              <li><Link href="/delivery">سياسة التسليم</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className={styles["footer-col-title"]}>تواصل</div>
            <ul className={styles["footer-links"]}>
              <li><Link href="/about">عن أحمد هيثم</Link></li>
              <li><Link href="/contact">تواصل معنا</Link></li>
              <li><Link href="/login">منطقة الأعضاء</Link></li>
              <li><Link href="/register">تقدّم للانضمام</Link></li>
            </ul>
          </div>
        </div>

        <div className={`${styles.container} ${styles["footer-bottom"]}`}>
          <p className={styles["footer-copy"]}>
            © 2026 أحمد هيثم. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Curriculum module card — kept inline below the main component so all the
// page markup is in one file (matches the source HTML's single-file shape).
function CurriculumModule({
  num,
  title,
  items,
}: {
  num: string;
  title: string;
  items: React.ReactNode[];
}) {
  return (
    <div className={`${styles.module} ${styles.reveal}`}>
      <span className={styles["mod-num"]}>{num}</span>
      <h3>{title}</h3>
      <ul>
        {items.map((node, i) => (
          <li key={i}>{node}</li>
        ))}
      </ul>
    </div>
  );
}
