import Icon from "../shared/Icon";
import SectionHead from "../shared/SectionHead";
import { ABOUT } from "../../data/audience-data";
import { USE_SAMPLE_WHEN_EMPTY } from "../../config/config";
import "./About.css";

/**
 * من نحن: عنوان وتعريف في المنتصف، وتحتهما بطاقتان: الرؤية (كبيرة بجملة بارزة)
 * والقيم (مربعات 2×2، لكل قيمة رقم وأيقونة واسم وسطر)، ثم معنى الاسم إن كُتب.
 * كل الرسومات مصمّمة خصيصاً لأصيل (خطية بتعبئة خفيفة) ولا تستعمل أي نجمة.
 * النصوص من ABOUT في audience-data.js (definition وvision وvalues وnameMeaning).
 * أي نص فارغ تُخفى بطاقته أو سطره تلقائياً.
 * عند ترك الرؤية والقيم فارغتين وUSE_SAMPLE_WHEN_EMPTY = true تظهر نصوص تجريبية للمعاينة.
 */

/* نصوص تجريبية للمعاينة فقط (تختفي حين تكتب الرؤية والقيم الحقيقية) */
const SAMPLE = {
  vision: "هنا تُكتب رؤية أصيل في جملة واحدة واضحة، تصف المكان الذي نطمح أن نكون عليه.",
  values: [
    { icon: "roots", label: "القيمة الأولى", text: "سطر يشرح معناها." },
    { icon: "community", label: "القيمة الثانية", text: "سطر يشرح معناها." },
    { icon: "balance", label: "القيمة الثالثة", text: "سطر يشرح معناها." },
    { icon: "service", label: "القيمة الرابعة", text: "سطر يشرح معناها." },
  ],
};

/* ---------- الأيقونات (خطية دقيقة بتعبئة خفيفة، مرسومة على شبكة 24، بلا نجوم) ---------- */
const FILL = { fill: "currentColor", fillOpacity: 0.13 };

/* أسماء قديمة تُحوَّل تلقائياً إلى الأيقونات الجديدة، فلا تنكسر بيانات سابقة */
const ALIAS = { shield: "roots", link: "community", scales: "balance", star: "service" };

/* أيقونات القيم: roots | community | balance | service. أي اسم آخر يستعمل أيقونة Icon العادية */
function ValueIcon({ name }) {
  const p = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: "about-value__icon",
  };
  switch (ALIAS[name] ?? name) {
    case "roots": // برعم بجذور: أصالة وجذور ثابتة
      return (
        <svg {...p}>
          <path d="M3.6 13.2h16.8" opacity=".5" />
          <path d="M12 13.2V7.8" />
          <path d="M12 9.8C12 7 9.8 5.2 6.8 5.2c0 3 2.2 4.6 5.2 4.6z" {...FILL} />
          <path d="M12 7.8c0-2.6 1.9-4.4 4.8-4.4 0 2.8-1.9 4.4-4.8 4.4z" {...FILL} />
          <path d="M12 13.2v8M12 16.2c-2 0-3.4 1-4.2 2.6M12 16.2c2 0 3.4 1 4.2 2.6" />
          <path d="M12 19.2c-.9 0-1.7.4-2.2 1.2M12 19.2c.9 0 1.7.4 2.2 1.2" opacity=".6" />
        </svg>
      );
    case "community": // ثلاثة أشخاص: انتماء ومجتمع
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="2.8" {...FILL} />
          <path d="M6.4 19.4c0-3.2 2.5-5.5 5.6-5.5s5.6 2.3 5.6 5.5z" {...FILL} />
          <circle cx="4.7" cy="10.8" r="1.9" />
          <path d="M1.5 18.2c0-2.3 1.5-3.9 3.3-3.9.9 0 1.6.2 2.2.7" />
          <circle cx="19.3" cy="10.8" r="1.9" />
          <path d="M22.5 18.2c0-2.3-1.5-3.9-3.3-3.9-.9 0-1.6.2-2.2.7" />
          <path d="M3.6 21.5h16.8" opacity=".5" />
        </svg>
      );
    case "balance": // ميزان: توازن وعدل
      return (
        <svg {...p}>
          <path d="M12 5v15.6M7.8 20.8h8.4" />
          <path d="M3.8 7.6c2.6.9 5.2.7 8.2-.8 3 1.5 5.6 1.7 8.2.8" />
          <circle cx="12" cy="4.4" r="1.3" {...FILL} fillOpacity=".5" />
          <path d="M3.8 7.6 1.6 13.8M3.8 7.6l2.2 6.2M20.2 7.6l-2.2 6.2M20.2 7.6l2.2 6.2" opacity=".6" />
          <path d="M1.4 13.8h5.2a2.6 2.6 0 0 1-5.2 0zM17.4 13.8h5.2a2.6 2.6 0 0 1-5.2 0z" {...FILL} fillOpacity=".25" />
        </svg>
      );
    case "service": // يد تحمل قلباً: التزام وخدمة المحيط
      return (
        <svg {...p}>
          <path d="M12 6.4c-.9-1.7-4-1.6-4 1 0 1.8 2.2 3.3 4 4.4 1.8-1.1 4-2.6 4-4.4 0-2.6-3.1-2.7-4-1z" {...FILL} fillOpacity=".3" />
          <path d="M2 15.4h3.2c1 0 1.9.4 2.7 1l1.4 1h5.3c.9 0 1.5.9 1.1 1.7-.2.4-.6.6-1.1.6h-4" />
          <path d="m14.4 17.6 4.7-1.5c.7-.2 1.4.1 1.7.8.3.7 0 1.4-.7 1.8L13.6 21.6H2" />
          <path d="M2 14.4v7.2" />
        </svg>
      );
    default:
      return <Icon name={name} />;
  }
}

/* شارة الرؤية: عدسة/بوصلة (حلقات ونبضات دقيقة تدور ببطء) وقمة جبل عليها علم في الوسط */
function VisionBadge() {
  return (
    <span className="about-card__badge" aria-hidden="true">
      <svg className="about-card__lens" viewBox="-100 -100 200 200">
        <circle className="about-card__orbit" r="94" />
        <circle className="about-card__ticks" r="82" />
        <circle className="about-card__ring" r="66" />
        <circle className="about-card__dot" cx="0" cy="-94" r="4.5" />
        <circle className="about-card__dot" cx="94" cy="0" r="4.5" />
        <circle className="about-card__dot" cx="0" cy="94" r="4.5" />
        <circle className="about-card__dot" cx="-94" cy="0" r="4.5" />
      </svg>
      <svg
        className="about-card__glyph"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.4 20.2 9.4 8l3.7 6.3 2.2-3.3 6.3 9.2z" {...FILL} />
        <path d="M9.4 8 7.6 11.1l1.8-.9 1.4.9z" opacity=".55" />
        <path d="M9.4 8V2.9" />
        <path d="M9.4 2.9h5l-1.4 1.8 1.4 1.8h-5z" {...FILL} fillOpacity=".35" />
        <path d="M2 20.7h20" opacity=".5" />
      </svg>
    </span>
  );
}

/* فاصل زخرفي: خط ذهبي يتوسطه معيّن */
const Rule = ({ className = "" }) => <span className={`about__rule ${className}`} aria-hidden="true" />;

export default function About() {
  const real = ABOUT.vision || ABOUT.values?.length;
  const sample = USE_SAMPLE_WHEN_EMPTY && !real;
  const vision = sample ? SAMPLE.vision : ABOUT.vision;
  const values = sample ? SAMPLE.values : ABOUT.values ?? [];
  const hasCards = Boolean(vision) || values.length > 0;

  return (
    <section
      id="about"
      className="sec about"
      data-theme="base"
      style={{ "--prev-bg": "#141416" }}
      aria-labelledby="about-title"
    >
      <div className="sec__inner">
        <SectionHead
          id="about-title"
          className="about__head"
          title="من نحن؟"
          lead={ABOUT.definition}
        />

        {hasCards && (
          <div className="about__cards">
            {vision && (
              <article className="about-card about-card--vision" data-reveal style={{ "--i": 2 }}>
                {/* علامة مائية كبيرة في الزاوية */}
                <svg className="about-card__mark" viewBox="-100 -100 200 200" aria-hidden="true">
                  <circle r="92" />
                  <circle r="70" strokeDasharray="1.5 7" />
                  <circle r="48" />
                  <path d="M0-100V-82M0 100V82M-100 0H-82M100 0H82" />
                </svg>
                <VisionBadge />
                <h3 className="about-card__title">رؤيتنا</h3>
                <p className="about-card__vision">{vision}</p>
              </article>
            )}

            {values.length > 0 && (
              <article className="about-card about-card--values" data-reveal style={{ "--i": 3 }}>
                <h3 className="about-card__sr">قيمنا</h3>
                <ul className="about-values">
                  {values.map((v, i) => (
                    <li key={v.label} className="about-value" style={{ "--n": i }}>
                      <span className="about-value__num" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="about-value__ico">
                        <ValueIcon name={v.icon} />
                      </span>
                      <b>{v.label}</b>
                      {v.text && <span className="about-value__text">{v.text}</span>}
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </div>
        )}

        {sample && (
          <p className="about__sample">
            عرض تجريبي: اكتب الرؤية والقيم في ABOUT داخل data/audience-data.js.
          </p>
        )}

        {ABOUT.nameMeaning && (
          <figure className="about__name" data-reveal>
            <Rule />
            <figcaption>معنى اسم «أصيل»</figcaption>
            <blockquote>{ABOUT.nameMeaning}</blockquote>
          </figure>
        )}
      </div>
    </section>
  );
}
