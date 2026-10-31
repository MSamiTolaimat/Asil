import "./SectionHead.css";

/**
 * رأس القسم: العنوان يظهر كلمةً كلمة، ثم يُرسم خط ذهبي من اليمين
 * يتوسّطه معيّن. بلا وسوم فوق العنوان.
 */
export default function SectionHead({ id, className = "", title, lead }) {
  const words = String(title).trim().split(/\s+/);

  return (
    <header
      className={`sec__head sec-head--alive${className ? ` ${className}` : ""}`}
      data-reveal
      style={{ "--words": words.length }}
    >
      <h2 id={id} className="sec__title">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="sec-title__word"
            style={{ "--w": i }}
          >
            {word}
          </span>
        ))}
      </h2>
      <span className="sec-title__rule" aria-hidden="true" />
      {lead ? <p className="sec__lead">{lead}</p> : null}
    </header>
  );
}
