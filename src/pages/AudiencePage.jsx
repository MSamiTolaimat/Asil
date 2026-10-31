import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/shared/Icon";
import { PILLARS, AUDIENCES } from "../data/audience-data";
import { Gallery } from "../components/audience/Audience";
import useReveal from "../hooks/useReveal";
import { NAV_ITEMS, NAV_CTA } from "../data/nav-items";
import PrivacyModal from "../components/privacy/PrivacyModal";
import "./Home.css";
import "../components/audience/Audience.css";
import "./AudiencePage.css";

/**
 * صفحة مستقلة لكل قسم (/youth و /falcons) بمسار متصفح حقيقي وعناوين مخصصة
 */

const reduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function AudiencePage({ audience }) {
  const data = AUDIENCES[audience];
  const ref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  useReveal(ref);

  useEffect(() => {
    const prev = document.title;
    document.title = `${data.name} — ${data.title} | أصيل`;

    // تحديث وصف الصفحة للمشاركة والفهرسة
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content");
    if (metaDesc && data.lead) {
      metaDesc.setAttribute("content", `${data.name}: ${data.lead}`);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const prevOg = ogTitle?.getAttribute("content");
    if (ogTitle) {
      ogTitle.setAttribute("content", `${data.name} — أصيل`);
    }

    window.scrollTo({ top: 0, behavior: "instant" });

    return () => {
      document.title = prev;
      if (metaDesc && prevDesc) metaDesc.setAttribute("content", prevDesc);
      if (ogTitle && prevOg) ogTitle.setAttribute("content", prevOg);
    };
  }, [data.name, data.title, data.lead]);

  const goTo = (id) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" });
  };


  return (
    <div className="ap" ref={ref} dir="rtl" lang="ar" data-theme={audience}>
      <a href="#main-content" className="skip-link">
        تخطَّ إلى المحتوى
      </a>

      {/* ===== الترويسة ===== */}
      <header className="topbar">
        <Link className="topbar__brand" to="/" aria-label="أصيل — الصفحة الرئيسية">
          <img src="/logo.png" alt="أصيل" />
        </Link>

        <nav id="ap-nav" className={`topbar__nav${menuOpen ? " is-open" : ""}`} aria-label="التنقل">
          {NAV_ITEMS.map((n) => (
            <Link key={n.id} to={`/#${n.id}`} className="topbar__link">
              {n.label}
            </Link>
          ))}
          <Link to={`/#${NAV_CTA.id}`} className="topbar__cta">
            {NAV_CTA.label}
          </Link>
        </nav>

        <button
          type="button"
          className="topbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="ap-nav"
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </header>

      {/* ===== المحتوى الرئيسي ===== */}
      <main id="main-content" tabIndex="-1">
        {/* ===== المقدمة ===== */}
        <section className="sec ap-hero" aria-labelledby="ap-title">
        <div className="ap-hero__glow" aria-hidden="true" />
        <div className="sec__inner ap-hero__inner">
          <div className="ap-hero__copy">
            <nav className="crumbs" aria-label="مسار الصفحة">
              <Link to="/">الرئيسية</Link>
              <Icon name="arrow-left" />
              <span aria-current="page">{data.name}</span>
            </nav>

            <p className="eyebrow rise" style={{ "--i": 0 }}>
              {data.name} · {data.who}
            </p>
            <h1 id="ap-title" className="ap-hero__title rise" style={{ "--i": 1 }}>
              {data.title} <span>{data.titleAccent}</span>
            </h1>
            <p className="sec__lead rise" style={{ "--i": 2 }}>
              {data.lead}
            </p>

            <ul className="ap-tags rise" style={{ "--i": 3 }} aria-label="أبرز ما يميزنا">
              {data.highlights.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            <div className="hero__actions rise" style={{ "--i": 4 }}>
              <Link className="btn-primary" to="/#contact">
                تواصل معنا
              </Link>
              <a className="btn-ghost" href="#week" onClick={goTo("week")}>
                جدول الأسبوع
              </a>
            </div>
          </div>

          <figure className="ap-hero__visual rise" style={{ "--i": 2 }}>
            {data.heroImage ? (
              <img src={data.heroImage} alt={data.heroCaption} />
            ) : (
              <span className="ap-hero__ph" aria-hidden="true">
                <Icon name={data.icon} />
              </span>
            )}
            <figcaption>{data.heroCaption}</figcaption>
          </figure>
        </div>
      </section>

      {/* ===== ماذا نقدم ===== */}
      <section id="what" className="sec ap-sec ap-sec--alt" aria-labelledby="what-title">
        <div className="sec__inner">
          <header className="sec__head">
            <p className="eyebrow" data-reveal>ماذا نقدم</p>
            <h2 id="what-title" className="sec__title" data-reveal style={{ "--i": 1 }}>
              أربعة محاور، <span>بناءٌ واحد.</span>
            </h2>
          </header>
          <div className="cols">
            {PILLARS.map((p, i) => (
              <div key={p.id} className="col" data-reveal style={{ "--i": i }}>
                <span className="col__icon"><Icon name={p.icon} /></span>
                <h5>{p.title}</h5>
                <p className="col__text">{p.text}</p>
                <ul>
                  {data.pillars[p.id].map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== الدرب ===== */}
      <section id="path" className="sec ap-sec" aria-labelledby="path-title">
        <div className="sec__inner">
          <header className="sec__head">
            <p className="eyebrow" data-reveal>الرحلة</p>
            <h2 id="path-title" className="sec__title" data-reveal style={{ "--i": 1 }}>
              {data.journeyTitle}
            </h2>
          </header>
          <ol className="journey">
            {data.journey.map((s, i) => (
              <li key={s.title} className="journey__step" style={{ "--n": i }} data-reveal>
                <div className="journey__card">
                  <span className="journey__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <span className="journey__icon"><Icon name={s.icon} /></span>
                  <h5>{s.title}</h5>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== الصور ===== */}
      <section id="gallery" className="sec ap-sec ap-sec--alt" aria-labelledby="gallery-title">
        <div className="sec__inner">
          <header className="sec__head">
            <p className="eyebrow" data-reveal>المعرض</p>
            <h2 id="gallery-title" className="sec__title" data-reveal style={{ "--i": 1 }}>
              لقطات <span>من المكان.</span>
            </h2>
          </header>
          <div data-reveal><Gallery items={data.gallery} /></div>
        </div>
      </section>

      {/* ===== الزر الختامي ===== */}
      <section className="sec ap-sec ap-sec--alt ap-join" aria-label="التواصل">
        <div className="sec__inner ap-join__inner">
          <div className="detail__cta" data-reveal style={{ "--i": 2 }}>
            <Link className="detail__join" to="/#contact">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
      </main>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
}
