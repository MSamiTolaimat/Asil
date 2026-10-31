import { Link } from "react-router-dom";
import Icon from "../shared/Icon";
import SectionHead from "../shared/SectionHead";
import { ArchPattern } from "../shared/ArchMotif";
import {
  BENEFITS,
  PILLARS,
  AUDIENCES,
  AUDIENCE_KEYS,
} from "../../data/audience-data";
import youthArt from "../../assets/audience/youth.svg";
import falconsArt from "../../assets/audience/falcons.svg";
import "./Audience.css";

/* رسمة كل بطاقة (يسار البطاقة) ونص زرّها.
   لاستبدال الرسمة بصورة أخرى: ضع الملف في src/assets/audience وغيّر الاستيراد أعلاه. */
const CARD_ART = { youth: youthArt, falcons: falconsArt };
/* أسطر البطاقة: قصيرة عمداً (٣ كحدٍّ أقصى). عدّلها هنا؛ وإن حذفت اسم القسم منها
   يعود النص إلى cardLines في audience-data.js. */
const CARD_LINES = {
  youth: ["مكان هادئ للدراسة.", "برامج بناء فكري وبدني.", "درب واضح للتطور."],
  falcons: ["مساحة آمنة ومحفزة.", "أنشطة لعب وتعلم.", "رحلة نحو القمة."],
};
const CARD_CTA = { youth: "اكتشف مسار الشباب", falcons: "اكتشف مسار الصقور" };

/* =====================================================
   ٢) ماذا نقدم — خط زمني أفقي (رأسي على الجوال)
   النصوص من BENEFITS في audience-data.js (text العنوان، desc وصف قصير اختياري)
   ===================================================== */
/**
 * أيقونات خطّ «ماذا نقدم» الزمني، مرسومة بحسب BENEFITS[i].icon:
 * moon · heart · growth · sport · shield. أي اسم آخر يستعمل أيقونة Icon العادية.
 */
const ART = {
  // كتاب مفتوح فوقه هلال: برامج شرعية وفكرية
  moon: (
    <>
      <path d="M2.5 9.5c3-1.4 6.8-1.2 9.5 1 2.7-2.2 6.5-2.4 9.5-1V21c-3-1.4-6.8-1.2-9.5 1-2.7-2.2-6.5-2.4-9.5-1z" />
      <path d="M12 10.5V22" />
      <path d="M14.4 2.4A3.2 3.2 0 1 0 14.4 7.6 2.6 2.6 0 0 1 14.4 2.4z" />
    </>
  ),
  // قلب فيه شرارة: بناء إيماني وشبابي
  heart: (
    <>
      <path d="M12 21s-8.5-4.9-8.5-11A4.6 4.6 0 0 1 12 7.6 4.6 4.6 0 0 1 20.5 10C20.5 16.1 12 21 12 21z" />
      <path d="M12 10.2l1.1 2.3 2.3 1.1-2.3 1.1L12 17l-1.1-2.3-2.3-1.1 2.3-1.1z" />
      <path d="M17 2.5v3M15.5 4h3" />
    </>
  ),
  // قبعة تخرج: المتابعة والتطوير الأكاديمي
  growth: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11.4v4.8c0 1.5 2.7 2.8 6 2.8s6-1.3 6-2.8v-4.8" />
      <path d="M22 9v6.5" />
    </>
  ),
  // كأس: فعاليات ترفيهية ورياضية
  sport: (
    <>
      <path d="M7.5 3.5h9V9a4.5 4.5 0 0 1-9 0z" />
      <path d="M7.5 5.5H4v1.8a3.5 3.5 0 0 0 3.7 3.5" />
      <path d="M16.5 5.5H20v1.8a3.5 3.5 0 0 1-3.7 3.5" />
      <path d="M12 13.5V18M8.5 21h7M9.5 18h5" />
    </>
  ),
  // إنترنت وكهرباء: خدمات مجانية
  shield: (
    <>
      <path d="M2.5 8.2a13.5 13.5 0 0 1 19 0" />
      <path d="M5.6 11.5a9 9 0 0 1 12.8 0" />
      <path d="M8.7 14.7a4.6 4.6 0 0 1 6.6 0" />
      <path d="M12.9 16.4l-2.5 3.2h2.3l-.7 3 2.6-3.6h-2.3z" />
    </>
  ),
};

// مسار الخط المتعرّج (من اليمين إلى اليسار): العناصر الفردية أعلى والزوجية أسفل
const WAVE =
  "M90 31.4C80 31.4 80 68.6 70 68.6C60 68.6 60 31.4 50 31.4C40 31.4 40 68.6 30 68.6C20 68.6 20 31.4 10 31.4";

export function Offer() {
  return (
    <section
      id="offer"
      className="sec offer"
      data-theme="base"
      style={{ "--prev-bg": "#141416" }}
      aria-labelledby="offer-title"
    >
      <ArchPattern id="offer-arch" className="offer__pattern" />

      <div className="sec__inner">
        <SectionHead
          id="offer-title"
          className="offer__head"
          title="ماذا نقدم؟"
        />

        <ol className="tl" aria-label="ما نقدمه">
          {/* خط متعرّج يمرّ بمراكز الميداليات (الرقم 31.4 و68.6 من --med و--amp في CSS) */}
          <svg
            className="tl__wave"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="tl__wave-base" d={WAVE} />
            <path className="tl__wave-gold" d={WAVE} data-reveal />
          </svg>
          <span className="tl__line" data-reveal aria-hidden="true" />
          {BENEFITS.map((b, i) => (
            <li
              key={b.icon}
              className="tl__item"
              data-reveal
              style={{ "--i": i + 2 }}
            >
              <span className="tl__node">
                {ART[b.icon] ? (
                  <svg
                    className="tl__art"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {ART[b.icon]}
                  </svg>
                ) : (
                  <Icon name={b.icon} />
                )}
              </span>
              <div className="tl__body">
                <span className="tl__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{b.text}</h3>
                {b.desc && <p>{b.desc}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* =====================================================
   معرض الصور (صور بديلة إلى أن تُضاف الصور الحقيقية)
   ===================================================== */
export function Gallery({ items }) {
  return (
    <ul className="gallery">
      {items.map((g, i) => (
        <li key={g.caption} className="gallery__item" style={{ "--n": i }}>
          {g.src ? (
            <img src={g.src} alt={g.caption} loading="lazy" />
          ) : (
            <span className="gallery__ph" aria-hidden="true">
              <Icon name="image" />
            </span>
          )}
          <span className="gallery__cap">{g.caption}</span>
        </li>
      ))}
    </ul>
  );
}

/* =====================================================
   ٣) من نستهدف — بطاقتان، كل واحدة تفتح صفحة القسم المستقلة
   ===================================================== */
export default function Audience() {
  return (
    <section
      id="audience"
      className="sec audience"
      data-theme="base"
      aria-labelledby="audience-title"
    >
      <div className="sec__inner">
        <SectionHead
          id="audience-title"
          title="أقسامنا"
          lead="قسمان، لكل منهما روحه وبرنامجه. افتح صفحة القسم لتجد التفاصيل"
        />

        <div className="aud-cards">
          {AUDIENCE_KEYS.map((k, i) => {
            const a = AUDIENCES[k];
            return (
              <div
                key={k}
                id={`card-${k}`}
                className="aud-card"
                data-theme={k}
                data-reveal
                style={{ "--i": i + 1 }}
              >
                <img
                  className="aud-card__art"
                  src={CARD_ART[k]}
                  alt=""
                  width="360"
                  height="320"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  aria-hidden="true"
                />
                <div className="aud-card__body">
                  <h3 className="aud-card__name">{a.name}</h3>
                  <ol className="aud-card__list">
                    {(CARD_LINES[k] || a.cardLines).map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ol>
                  <Link className="aud-card__btn" to={`/${k}`}>
                    {CARD_CTA[k] || `افتح صفحة ${a.name}`}
                    <Icon name="arrow-left" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
