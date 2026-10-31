import { useState } from "react";
import {
  CONTACT,
  CONTACT_FORM_ENDPOINT,
  USE_SAMPLE_WHEN_EMPTY,
} from "../../config/config";
import { ArchPattern } from "../shared/ArchMotif";
import SectionHead from "../shared/SectionHead";
import "./Contact.css";

/** بيانات تجريبية للمعاينة فقط، تظهر حين تكون إعدادات CONTACT فارغة كلها */
const SAMPLE = {
  phone: "+963 000 000 000",
  whatsapp: "",
  email: "hello@example.com",
  address: "العنوان .......",
  mapUrl: "",
  mapEmbedUrl: "",
  hours: [
    { days: "السبت - الخميس", time: "٩ صباحاً - ١٠ مساءً" },
    { days: "الجمعة", time: "٤ عصراً - ١٠ مساءً" },
  ],
};

const isEmpty = (c) =>
  !c.phone &&
  !c.whatsapp &&
  !c.email &&
  !c.address &&
  !c.mapUrl &&
  !c.mapEmbedUrl &&
  !c.hours?.length;

const TOPICS = ["استفسار", "اقتراح", "ملاحظة"];
const MAX_MESSAGE = 600;
const INITIAL = { name: "", contact: "", message: "" };

/* ---------- أيقونات ---------- */
function Svg({ children, className = "ct-icon" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
const PhoneIcon = () => (
  <Svg>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </Svg>
);
const ChatIcon = () => (
  <Svg>
    <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
  </Svg>
);
const MailIcon = () => (
  <Svg>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);
const PinIcon = () => (
  <Svg>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
);
const ClockIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);
const CheckIcon = () => (
  <Svg className="ct-icon ct-icon--lg">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

/* ---------- التحقق ---------- */
function validate(field, value) {
  const v = (value || "").trim();
  if (field === "name") {
    if (!v) return "يرجى إدخال اسمك الكريم.";
    if (v.length < 2) return "الاسم يجب أن يتكون من حرفين على الأقل.";
    return "";
  }
  if (field === "contact") {
    if (!v)
      return "يرجى إدخال رقم الهاتف أو البريد الإلكتروني لنتمكن من الرد عليك.";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const digits = v.replace(/\D/g, "");
    const isPhone =
      /^[\d\s\-+().]+$/.test(v) && digits.length >= 7 && digits.length <= 15;
    if (!isEmail && !isPhone) {
      return "يرجى إدخال بريد إلكتروني صحيح (مثال: name@example.com) أو رقم هاتف صالح.";
    }
    return "";
  }
  if (field === "message") {
    if (!v) return "يرجى كتابة نص رسالتك.";
    if (v.length < 5) return "نص الرسالة قصير جداً (٥ أحرف على الأقل).";
    return "";
  }
  return "";
}

/* ---------- صف معلومة (أيقونة + عنوان صغير + القيمة) ---------- */
function Row({ icon, label, children }) {
  return (
    <li className="ct-item">
      <span className="ct-item__icon">{icon}</span>
      <div className="ct-item__body">
        <span className="ct-item__label">{label}</span>
        {children}
      </div>
    </li>
  );
}

/**
 * قسم التواصل: بقدر شاشة واحدة على الحاسوب.
 * عمودان: بطاقة النموذج (استفسار / اقتراح / ملاحظة) وبطاقة معلومات واحدة فيها
 * الاتصال والبريد والدوام والعنوان ثم لوحة الخريطة. على الجوال تتقدّم أزرار سريعة (اتصال، واتساب، الخريطة).
 * لا طلبات انضمام ولا تسجيل عبر هذا النموذج.
 */
export default function Contact() {
  const sample = USE_SAMPLE_WHEN_EMPTY && isEmpty(CONTACT);
  const info = sample ? SAMPLE : CONTACT;

  const [values, setValues] = useState(INITIAL);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [via, setVia] = useState("endpoint"); // endpoint | whatsapp | mailto
  const [mapOn, setMapOn] = useState(false); // تفعيل الخريطة المضمّنة بنقرة (حتى لا تلتقط تمرير الصفحة)

  const handleChange = (k) => (e) => {
    const val = e.target.value;
    setValues((v) => ({ ...v, [k]: val }));
    if (touched[k]) setErrors((prev) => ({ ...prev, [k]: validate(k, val) }));
  };
  const handleBlur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((prev) => ({ ...prev, [k]: validate(k, values[k]) }));
  };

  const text = `السلام عليكم، أنا ${values.name.trim()}${
    values.contact.trim() ? ` (${values.contact.trim()})` : ""
  }.\n[${topic}]\n${values.message.trim()}`;

  // ما سيحدث عند الإرسال: خادم، أو واتساب، أو بريد
  const mode = CONTACT_FORM_ENDPOINT
    ? "endpoint"
    : info.whatsapp
      ? "whatsapp"
      : info.email
        ? "mailto"
        : "none";
  const submitLabel =
    status === "sending"
      ? "جارٍ الإرسال…"
      : mode === "whatsapp"
        ? "إرسال عبر واتساب"
        : mode === "mailto"
          ? "إرسال عبر البريد"
          : "إرسال";

  const reset = () => {
    setValues(INITIAL);
    setErrors({});
    setTouched({});
    setTopic(TOPICS[0]);
    setStatus("idle");
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;

    const newErrors = {
      name: validate("name", values.name),
      contact: validate("contact", values.contact),
      message: validate("message", values.message),
    };
    setTouched({ name: true, contact: true, message: true });
    setErrors(newErrors);

    const firstInvalid = ["name", "contact", "message"].find(
      (k) => newErrors[k],
    );
    if (firstInvalid) {
      document.getElementById(`ct-${firstInvalid}`)?.focus();
      return;
    }

    if (mode === "endpoint") {
      setStatus("sending");
      try {
        const res = await fetch(CONTACT_FORM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: values.name.trim(),
            contact: values.contact.trim(),
            topic,
            message: values.message.trim(),
          }),
        });
        if (!res.ok) throw new Error("bad status");
        setVia("endpoint");
        setStatus("sent");
      } catch {
        setStatus("error");
      }
      return;
    }

    // دون خادم: نفتح واتساب أو البريد برسالة جاهزة
    if (mode === "whatsapp") {
      window.open(
        `https://wa.me/${info.whatsapp}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      );
      setVia("whatsapp");
      setStatus("sent");
    } else if (mode === "mailto") {
      window.location.href = `mailto:${info.email}?subject=${encodeURIComponent(
        `${topic} — رسالة من موقع أصيل`,
      )}&body=${encodeURIComponent(text)}`;
      setVia("mailto");
      setStatus("sent");
    } else {
      setStatus("error");
    }
  }

  const hasHours = info.hours?.length > 0;
  const hasCall = info.phone || info.whatsapp;
  const field = (k) => (touched[k] && errors[k] ? " has-error" : "");

  const hasMapBlock = info.mapEmbedUrl || info.mapUrl || info.address;
  const hasInfo = hasCall || info.email || hasHours || info.address;

  return (
    <section
      id="contact"
      className="sec contact"
      data-theme="base"
      style={{ "--prev-bg": "#141416" }}
      aria-labelledby="contact-title"
    >
      <ArchPattern id="contact-arch" className="ct-pattern" variant="round" />

      <div className="sec__inner ct-inner">
        <SectionHead
          id="contact-title"
          className="ct-head"
          title="تواصل معنا"
          lead="لأي سؤال أو اقتراح، اكتب لنا أو مرّ علينا في المكان. يسعدنا أن نسمع منك."
        />

        {/* أزرار سريعة: تظهر على الجوال فقط */}
        {(info.phone || info.whatsapp || info.mapUrl) && (
          <div className="ct-quick" data-reveal style={{ "--i": 2 }}>
            {info.phone && (
              <a
                className="ct-quick__btn"
                href={`tel:${info.phone.replace(/\s/g, "")}`}
              >
                <PhoneIcon /> اتصال
              </a>
            )}
            {info.whatsapp && (
              <a
                className="ct-quick__btn"
                href={`https://wa.me/${info.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChatIcon /> واتساب
              </a>
            )}
            {info.mapUrl && (
              <a
                className="ct-quick__btn"
                href={info.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PinIcon /> الخريطة
              </a>
            )}
          </div>
        )}

        <div className="ct-grid">
          {/* ===== النموذج ===== */}
          <div className="ct-formwrap" data-reveal style={{ "--i": 3 }}>
            {status === "sent" ? (
              <div className="ct-card ct-done" role="status">
                <span className="ct-done__check">
                  <CheckIcon />
                </span>
                <h3>{via === "endpoint" ? "وصلتنا رسالتك" : "رسالتك جاهزة"}</h3>
                <p>
                  {via === "endpoint" &&
                    "شكراً لك. سنقرأ رسالتك ونرد عليك قريباً بإذن الله."}
                  {via === "whatsapp" &&
                    "فتحنا لك واتساب برسالة جاهزة، اضغط «إرسال» هناك لتصلنا."}
                  {via === "mailto" &&
                    "فتحنا لك برنامج البريد برسالة جاهزة، اضغط «إرسال» هناك لتصلنا."}
                </p>
                <button
                  type="button"
                  className="btn-ghost ct-done__again"
                  onClick={reset}
                >
                  رسالة أخرى
                </button>
              </div>
            ) : (
              <form className="ct-card ct-form" onSubmit={onSubmit} noValidate>
                <div
                  className="ct-topics"
                  role="radiogroup"
                  aria-label="موضوع الرسالة"
                >
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={topic === t}
                      className="ct-topic"
                      onClick={() => setTopic(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="ct-row">
                  <label
                    className={`ct-field${field("name")}`}
                    htmlFor="ct-name"
                  >
                    <span className="ct-field__label">الاسم</span>
                    <input
                      id="ct-name"
                      type="text"
                      name="name"
                      required
                      maxLength={60}
                      autoComplete="name"
                      value={values.name}
                      onChange={handleChange("name")}
                      onBlur={handleBlur("name")}
                      aria-invalid={touched.name && !!errors.name}
                      aria-describedby={
                        touched.name && errors.name
                          ? "ct-name-error"
                          : undefined
                      }
                    />
                    {touched.name && errors.name && (
                      <span
                        id="ct-name-error"
                        className="ct-field__error"
                        role="alert"
                      >
                        {errors.name}
                      </span>
                    )}
                  </label>

                  <label
                    className={`ct-field${field("contact")}`}
                    htmlFor="ct-contact"
                  >
                    <span className="ct-field__label">هاتف أو بريد</span>
                    <input
                      id="ct-contact"
                      type="text"
                      name="contact"
                      required
                      maxLength={80}
                      autoComplete="off"
                      inputMode="email"
                      dir="auto"
                      placeholder="name@mail.com"
                      value={values.contact}
                      onChange={handleChange("contact")}
                      onBlur={handleBlur("contact")}
                      aria-invalid={touched.contact && !!errors.contact}
                      aria-describedby={
                        touched.contact && errors.contact
                          ? "ct-contact-error"
                          : undefined
                      }
                    />
                    {touched.contact && errors.contact && (
                      <span
                        id="ct-contact-error"
                        className="ct-field__error"
                        role="alert"
                      >
                        {errors.contact}
                      </span>
                    )}
                  </label>
                </div>

                <label
                  className={`ct-field${field("message")}`}
                  htmlFor="ct-message"
                >
                  <span className="ct-field__label">رسالتك</span>
                  <textarea
                    id="ct-message"
                    name="message"
                    required
                    rows={4}
                    maxLength={MAX_MESSAGE}
                    value={values.message}
                    onChange={handleChange("message")}
                    onBlur={handleBlur("message")}
                    aria-invalid={touched.message && !!errors.message}
                    aria-describedby={
                      touched.message && errors.message
                        ? "ct-message-error"
                        : undefined
                    }
                  />
                  <small className="ct-count" aria-hidden="true">
                    {values.message.length} / {MAX_MESSAGE}
                  </small>
                  {touched.message && errors.message && (
                    <span
                      id="ct-message-error"
                      className="ct-field__error"
                      role="alert"
                    >
                      {errors.message}
                    </span>
                  )}
                </label>

                <button
                  type="submit"
                  className="btn-primary ct-submit"
                  disabled={status === "sending"}
                >
                  {submitLabel}
                </button>

                <p
                  className="ct-status"
                  role="status"
                  aria-live="polite"
                  data-state={status}
                >
                  {status === "error" &&
                    "تعذّر الإرسال الآن. جرّب الاتصال بنا مباشرة."}
                </p>
              </form>
            )}
          </div>

          {/* ===== المعلومات: بطاقة واحدة وتحتها لوحة الخريطة ===== */}
          {hasInfo && (
            <aside
              className="ct-card ct-info"
              data-reveal
              style={{ "--i": 4 }}
              aria-label="معلومات التواصل"
            >
              <ul className="ct-list">
                {hasCall && (
                  <Row icon={<PhoneIcon />} label="اتصل بنا">
                    {info.phone && (
                      <a
                        href={`tel:${info.phone.replace(/\s/g, "")}`}
                        dir="ltr"
                        className="ct-link"
                      >
                        {info.phone}
                      </a>
                    )}
                    {info.whatsapp && (
                      <a
                        href={`https://wa.me/${info.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ct-link ct-link--sub"
                      >
                        <ChatIcon /> واتساب
                      </a>
                    )}
                  </Row>
                )}

                {info.email && (
                  <Row icon={<MailIcon />} label="البريد">
                    <a
                      href={`mailto:${info.email}`}
                      dir="ltr"
                      className="ct-link"
                    >
                      {info.email}
                    </a>
                  </Row>
                )}

                {hasHours && (
                  <Row icon={<ClockIcon />} label="أوقات الدوام">
                    <ul className="ct-hours">
                      {info.hours.map((h) => (
                        <li key={h.days}>
                          <span>{h.days}</span>
                          <b>{h.time}</b>
                        </li>
                      ))}
                    </ul>
                  </Row>
                )}

                {info.address && (
                  <Row icon={<PinIcon />} label="العنوان">
                    <span className="ct-value">{info.address}</span>
                    {/* يظهر فقط على الشاشات القصيرة حيث تُخفى لوحة الخريطة */}
                    {info.mapUrl && (
                      <a
                        href={info.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ct-link ct-link--sub ct-maplink"
                      >
                        افتح الخريطة
                      </a>
                    )}
                  </Row>
                )}
              </ul>

              {hasMapBlock && (
                <div className="ct-map">
                  {info.mapEmbedUrl ? (
                    <>
                      <iframe
                        className={mapOn ? "is-on" : undefined}
                        title="موقع أصيل على الخريطة"
                        src={info.mapEmbedUrl}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                      {!mapOn && (
                        <button
                          type="button"
                          className="ct-map__hint"
                          onClick={() => setMapOn(true)}
                        >
                          انقر لتفعيل الخريطة
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <ArchPattern
                        id="ct-map-arch"
                        className="ct-map__pattern"
                        variant="round"
                      />
                      <span className="ct-map__pin">
                        <PinIcon />
                      </span>
                    </>
                  )}
                  {info.mapUrl && (
                    <a
                      href={info.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ct-map__open"
                    >
                      افتح الخريطة
                    </a>
                  )}
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
