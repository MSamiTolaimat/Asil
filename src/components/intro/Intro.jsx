import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LOGO_PATHS, LOGO_VIEWBOX } from "../../data/logoPaths";
import { ArchPattern } from "../shared/ArchMotif";
import "./Intro.css";

const SEEN_KEY = "aseel-intro-seen";
const FLY_MS = 1300; // مدة انتقال الشعار إلى الشريط العلوي
const REVEAL_MS = 900; // ظهور الصفحة الرئيسية بعد وصول الشعار

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* التخزين غير متاح (وضع خاص مثلاً): لا مشكلة */
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * يحسب إزاحة الشعار وتصغيره ليستقر تماماً فوق شعار الشريط العلوي.
 * يرجع null إن لم يتوفر الهدف (فنكتفي بتلاشي المقدمة).
 */
function measureFlight(logoEl) {
  const img = logoEl?.querySelector(".intro__logo-fill");
  const target = document.querySelector(".topbar__brand img");
  if (!img || !target || !img.naturalWidth) return null;

  const c = logoEl.getBoundingClientRect();
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  // الصورة داخل الحاوية بوضع contain: الحجم الفعلي للرسم أصغر من الحاوية
  const contentH = nh * Math.min(c.width / nw, c.height / nh);

  const t = target.getBoundingClientRect();
  if (!t.height) return null;
  const tw = t.width || (t.height * nw) / nh; // لو لم تُحمَّل الصورة بعد
  const cx = t.width ? t.left + t.width / 2 : t.right - tw / 2; // RTL: الحافة اليمنى ثابتة
  const cy = t.top + t.height / 2;

  return {
    x: cx - (c.left + c.width / 2),
    y: cy - (c.top + c.height / 2),
    s: t.height / contentH,
  };
}

/**
 * صفحة الافتتاح: الشعار يرسم نفسه بخط ذهبي ثم يمتلئ بلونه،
 * ثم ينتقل تلقائياً إلى الشريط العلوي ويصغر تدريجياً؛
 * وبعد وصوله فقط تظهر الصفحة الرئيسية من تحته بسلاسة (لا أزرار).
 *
 * onReveal(): تُستدعى لحظة بدء الانتقال، ليركّب الأب الصفحة الرئيسية تحت المقدمة.
 * onEnter():  تُستدعى بعد استقرار الشعار في الشريط، ليزيل الأب المقدمة.
 * skipIfSeen: لا تظهر الصفحة مرة ثانية في نفس الجلسة.
 */
export default function Intro({
  onReveal,
  onEnter,
  tagline = "بيتك وعائلتك ومنزلك الثاني",
  logoSrc = "/logo.png",
  skipIfSeen = true,
}) {
  const [skip] = useState(() => skipIfSeen && readSeen());
  const [reduced] = useState(prefersReducedMotion);
  const [phase, setPhase] = useState(reduced ? "ready" : "draw"); // draw → fill → ready → fly → reveal
  const [flight, setFlight] = useState(null);
  const logoRef = useRef(null);
  const flyingRef = useRef(false);
  const timers = useRef([]);

  // توقيت رسم كل مسار: الأطول يأخذ وقتاً أطول، والبدء من اليمين كما تُكتب العربية
  const timing = useMemo(() => {
    const maxLen = Math.max(...LOGO_PATHS.map((d) => d.length));
    const items = LOGO_PATHS.map((d, i) => ({
      d,
      dur: 1.4 + 1.8 * (d.length / maxLen),
      delay: 0.5 + i * 0.28,
    }));
    const end = Math.max(...items.map((x) => x.delay + x.dur));
    return { items, end };
  }, []);

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };

  // بدء الانتقال: الرئيسية تُركَّب تحتنا، ثم يطير الشعار إلى الشريط
  const startFlight = useCallback(() => {
    if (flyingRef.current) return;
    flyingRef.current = true;
    timers.current.forEach(clearTimeout);
    markSeen();
    onReveal?.();

    if (reduced) {
      onEnter?.();
      return;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    // إطاران: ننتظر أن ترسم الرئيسية شريطها العلوي لنقيس موضع الشعار فيه
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const f = measureFlight(logoRef.current);
        setFlight(f);
        setPhase("fly");
        // الصفحة لا تظهر إلا بعد وصول الشعار إلى الأعلى
        const arrive = f ? FLY_MS + 40 : 0;
        later(() => setPhase("reveal"), arrive);
        later(() => onEnter?.(), arrive + REVEAL_MS + 60);
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReveal, onEnter, reduced]);

  // الجدول الزمني: رسم الخط ← امتلاء الشعار ← ظهور الشعار الفرعي ← الانتقال
  useEffect(() => {
    if (skip || reduced) return;
    later(() => setPhase("fill"), (timing.end - 0.3) * 1000);
    later(() => setPhase("ready"), (timing.end + 0.4) * 1000);
    later(startFlight, (timing.end + 1.6) * 1000);
    const list = timers.current;
    return () => list.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, reduced, timing.end]);

  // مع تقليل الحركة: نعرض الشعار مكتملاً لحظة ثم ندخل
  useEffect(() => {
    if (skip || !reduced) return;
    later(startFlight, 900);
    const list = timers.current;
    return () => list.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, reduced]);

  // إن سبق أن رأى الزائر الصفحة في هذه الجلسة، ندخل مباشرة
  useEffect(() => {
    if (skip) {
      onReveal?.();
      onEnter?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // نمنع تمرير الصفحة الرئيسية الظاهرة تحتنا أثناء المقدمة
  useEffect(() => {
    if (skip) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [skip]);

  // لوحة المفاتيح (لمن لا يستعمل الفأرة): Esc أو Enter يختصران الرسم
  useEffect(() => {
    if (skip) return;
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Enter") {
        if (!e.target.closest?.("button, a")) startFlight();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip, startFlight]);

  if (skip) return null;

  const flightStyle = flight
    ? {
        "--fly-x": `${flight.x}px`,
        "--fly-y": `${flight.y}px`,
        "--fly-s": flight.s,
      }
    : undefined;

  return (
    <section
      className="intro"
      data-phase={phase}
      data-flight={
        flight
          ? "to-nav"
          : phase === "fly" || phase === "reveal"
            ? "fade"
            : undefined
      }
      style={flightStyle}
      dir="rtl"
      lang="ar"
      aria-label="مرحباً بك في أصيل"
    >
      {/* خلفية: توهّج الأصيل + نمط الأقواس المتداخلة */}
      <div className="intro__glow" aria-hidden="true" />
      <ArchPattern
        id="intro-arch"
        className="intro__pattern"
        stroke="#d4af37"
      />

      <div className="intro__stage">
        {/* الشعار: صورة الذهب تحتها/فوقها خط يُرسم */}
        <div
          className="intro__logo"
          ref={logoRef}
          role="img"
          aria-label="شعار أصيل"
        >
          <img
            className="intro__logo-fill"
            src={logoSrc}
            alt=""
            draggable="false"
          />
          <svg
            className="intro__logo-line"
            viewBox={LOGO_VIEWBOX}
            aria-hidden="true"
          >
            {timing.items.map((it, i) => (
              <path
                key={i}
                d={it.d}
                pathLength="1"
                fillRule="evenodd"
                style={{ "--delay": `${it.delay}s`, "--dur": `${it.dur}s` }}
              />
            ))}
          </svg>
        </div>

        <p className="intro__tagline reveal" style={{ "--i": 0 }}>
          {tagline}
        </p>
      </div>
    </section>
  );
}
