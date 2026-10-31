import { useEffect, useRef, useState } from "react";
import useReveal from "../hooks/useReveal";
import { NAV_ITEMS, NAV_CTA } from "../data/nav-items";
import Icon from "../components/shared/Icon";
import Audience, { Offer } from "../components/audience/Audience";
import About from "../components/about/About";
import Goals from "../components/goals/Goals";
import { GOALS } from "../data/audience-data";
import ThanksTree from "../components/thanks/ThanksTree";
import Contact from "../components/contact/Contact";
import PrivacyModal from "../components/privacy/PrivacyModal";
import { ArchEmblem, ArchPattern } from "../components/shared/ArchMotif";
import "./Home.css";

/**
 * الصفحة الرئيسية الواحدة: رحلة بالتمرير
 * المكان ← من نحن ← ما أهدافنا ← ماذا نقدم ← من نستهدف (شباب / صقور، كل قسم له صفحته) ← لوحة أصيل ← تواصل معنا
 */

const SECTIONS = [
  { id: "place", theme: "base", label: "المكان" },
  { id: "about", theme: "base", label: "من نحن" },
  { id: "goals", theme: "base", label: "أهدافنا" },
  { id: "offer", theme: "base", label: "ماذا نقدم" },
  { id: "audience", theme: "base", label: "أقسامنا" },
  { id: "thanks", theme: "base", label: "لوحة أصيل" },
  { id: "contact", theme: "base", label: "تواصل" },
];

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** أي قسم يعبر منتصف الشاشة الآن + تقدّم التمرير (يُخزَّن في --journey) */
function useJourney(homeRef) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(SECTIONS.findIndex((s) => s.id === e.target.id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        homeRef.current?.style.setProperty("--journey", p.toFixed(4));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [homeRef]);

  return active;
}

/**
 * forms: روابط نماذج Google Form
 *   forms.thanks → كتابة رسالة شكر على لوحة أصيل
 * (لا تسجيل عبر الموقع: التواصل من قسم «تواصل معنا»)
 */
export default function Home({ introActive = false, forms = { thanks: "#" } }) {
  const homeRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(
    () => window.location.hash === "#privacy",
  );
  const active = useJourney(homeRef);
  useReveal(homeRef);

  useEffect(() => {
    document.title = "أصيل";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "أصيل مكان للطلاب في حمص، يعمّق فهم الطالب بواقعه المعاصر، ويرسّخ انتماءه لحضارة الأمة، ويبني شخصيته بناءً متوازناً. شباب أصيل للجامعيين، وصقور أصيل للأطفال.",
      );
    }
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h === "privacy") {
        setShowPrivacy(true);
      } else if (h && h !== "main-content") {
        const el = document.getElementById(h);
        if (el) {
          el.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
          });
        }
      }
    };

    // التمرير للقسم المشترك في الرابط عند أول تحميل
    if (window.location.hash) {
      setTimeout(handleHash, 100);
    }

    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const scrollTo = (id) => (e) => {
    e?.preventDefault();
    setMenuOpen(false);
    // تحديث الرابط في المتصفح ليتمكن الزائر من مشاركة قسم محدد
    if (window.history.pushState) {
      window.history.pushState(null, "", `#${id}`);
    } else {
      window.location.hash = id;
    }
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <div
      className={`home${introActive ? " home--intro" : ""}`}
      ref={homeRef}
      dir="rtl"
      lang="ar"
      data-theme={SECTIONS[active].theme}
    >
      <a href="#main-content" className="skip-link">
        تخطَّ إلى المحتوى
      </a>

      {/* ===== الترويسة (تتلوّن بحسب القسم الحالي) ===== */}
      <header className="topbar">
        <a
          className="topbar__brand"
          href="#place"
          onClick={scrollTo("place")}
          aria-label="أصيل — أعلى الصفحة"
        >
          <img src="/logo.png" alt="أصيل" />
        </a>

        <nav
          id="main-nav"
          className={`topbar__nav${menuOpen ? " is-open" : ""}`}
          aria-label="التنقل الرئيسي"
        >
          {NAV_ITEMS.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={scrollTo(n.id)}
              className="topbar__link"
              data-current={SECTIONS[active].id === n.id || undefined}
            >
              {n.label}
            </a>
          ))}
          <a
            href={`#${NAV_CTA.id}`}
            onClick={scrollTo(NAV_CTA.id)}
            className="topbar__cta"
          >
            {NAV_CTA.label}
          </a>
        </nav>

        <button
          type="button"
          className="topbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </header>

      {/* ===== شريط الرحلة الجانبي ===== */}
      <nav className="rail" aria-label="محطات الصفحة">
        <ol>
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={scrollTo(s.id)}
                className="rail__dot"
                data-active={i === active || undefined}
                aria-label={s.label}
                aria-current={i === active ? "true" : undefined}
              >
                <span className="rail__label">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ===== المحتوى الرئيسي ===== */}
      <main id="main-content" tabIndex="-1">
        {/* ===== ١) المكان — مشترك ===== */}
        <section
          id="place"
          className="sec hero"
          data-theme="base"
          aria-labelledby="place-title"
        >
          <div className="hero__glow" aria-hidden="true" />
          <ArchPattern id="home-arch" className="hero__pattern" />

          <div className="hero__inner">
            <div className="hero__copy">
              <h1
                id="place-title"
                className="hero__title rise"
                style={{ "--i": 1 }}
              >
                بناء ثقافي
                <span> بهوية اسلامية </span>
              </h1>

              <p className="hero__lead rise" style={{ "--i": 2 }}>
                بهويتنا الإسلامية، نرافق الطالب ليكون أصيلاً في فكره وانتمائه
                وشخصيته.
              </p>

              <ul
                className="chips rise"
                style={{ "--i": 3 }}
                aria-label="أهدافنا"
              >
                {GOALS.map((b) => (
                  <li key={b.icon}>
                    <Icon name={b.icon} />
                    {b.label}
                  </li>
                ))}
              </ul>

              <div className="hero__actions rise" style={{ "--i": 4 }}>
                <a
                  href="#offer"
                  className="btn-primary"
                  onClick={scrollTo("offer")}
                >
                  ابدأ الرحلة
                </a>
                <a
                  href="#contact"
                  className="btn-ghost"
                  onClick={scrollTo("contact")}
                >
                  تواصل معنا
                </a>
              </div>
            </div>

            <div
              className="hero__visual rise"
              style={{ "--i": 2 }}
              aria-hidden="true"
            >
              <ArchEmblem className="hero__arch" />
              {/* صورة المكان: ضع الملف في public/hero.jpg (يُفضّل ١٢٠٠px عرضاً فأكثر).
                إن لم يوجد يبقى القوس والشمس وحدهما. الشعار في الشريط العلوي فقط. */}
              <svg
                width="0"
                height="0"
                aria-hidden="true"
                focusable="false"
                style={{ position: "absolute" }}
              >
                <clipPath id="hero-arch-clip" clipPathUnits="objectBoundingBox">
                  <path d="M0 1V0.4C0 0.2 0.3 0.07 0.5 0C0.7 0.07 1 0.2 1 0.4V1Z" />
                </clipPath>
              </svg>
              {/* إطار مؤقت يظهر حتى تُوضع الصورة (يختفي خلفها تلقائياً) */}
              <div className="hero__placeholder">
                <Icon name="image" />
                <span>مكان صورة المكان</span>
              </div>
              <img
                className="hero__photo"
                src="/hero.jpg"
                alt=""
                draggable="false"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          </div>
        </section>

        {/* ===== ٢) من نحن — التعريف وبطاقتا الرؤية والقيم ===== */}
        <About />

        {/* ما أهدافنا — ثلاثة أقواس */}
        <Goals />

        {/* ===== ٣) ماذا نقدم — ميزات المنحة ===== */}
        <Offer />

        {/* ===== ٣) من نستهدف — بطاقتان تفتحان صفحتي #/youth و #/falcons ===== */}
        <Audience />

        {/* ===== ٤) لوحة أصيل — شجرة الشكر، تقرأ من Google Sheet ===== */}
        <ThanksTree formUrl={forms.thanks} />

        {/* ===== ٦) تواصل معنا — نموذج + معلومات الاتصال والدوام والموقع ===== */}
        <Contact />
      </main>

      <footer className="site-foot" role="contentinfo">
        <div className="site-foot__grid">
          <div className="site-foot__about">
            <a className="site-foot__brand" href="#place" onClick={scrollTo("place")}>
              أصيل
            </a>
            <p>
              مساحة تربوية وثقافية للطلاب، نبني فيها فكراً أصيلاً وشخصية متوازنة.
            </p>
          </div>

          <nav className="site-foot__nav" aria-label="روابط التذييل">
            <h2>روابط الموقع</h2>
            <div className="site-foot__links">
              {NAV_ITEMS.map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={scrollTo(item.id)}>
                  {item.label}
                </a>
              ))}
              <a href="#contact" onClick={scrollTo("contact")}>
                تواصل معنا
              </a>
              <button type="button" onClick={() => setShowPrivacy(true)}>
                سياسة الخصوصية والشروط
              </button>
            </div>
          </nav>

          <div className="site-foot__social">
            <h2>تابعنا</h2>
            <div className="site-foot__socials" aria-label="حسابات التواصل الاجتماعي">
              {[
                ["instagram", "إنستغرام"],
                ["facebook", "فيسبوك"],
                ["whatsapp", "واتساب"],
              ].map(([icon, label]) => (
                <a
                  key={icon}
                  href="#"
                  className="site-foot__social-link"
                  aria-label={`${label} — رابط مؤقت`}
                  onClick={(event) => event.preventDefault()}
                >
                  <Icon name={icon} />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="site-foot__bottom">
          <small>© أصيل — جميع الحقوق محفوظة</small>
          <a
            href="https://t.me/Sami_Tulaimat"
            target="_blank"
            rel="noreferrer"
          >
            created by sami tolaimat
          </a>
        </div>
      </footer>

      <PrivacyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </div>
  );
}
