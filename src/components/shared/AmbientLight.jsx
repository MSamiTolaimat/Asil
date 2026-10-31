import { useEffect, useRef } from "react";
import "./AmbientLight.css";

/**
 * ضوء الغروب: شعاع ذهبي عريض خافت يعبر خلف المحتوى ببطء كل دقيقة تقريباً،
 * فيكسر ثبات الخلفية دون أن يشتّت القراءة.
 * يُركَّب مرة واحدة في App فيغطي كل الصفحات (الرئيسية، القسمان، الخصوصية، 404).
 *
 * طبقة ثابتة (fixed) فوق خلفيات الأقسام وتحت محتواها (.sec__inner له z-index: 2)،
 * وحركتها transform فقط، وتتوقف حين يُخفى التبويب، وتُلغى مع «تقليل الحركة».
 */
export default function AmbientLight() {
  const ref = useRef(null);

  useEffect(() => {
    const sync = () => ref.current?.toggleAttribute("data-paused", document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <div className="ambient" ref={ref} aria-hidden="true">
      <span className="ambient__beam" />
      <span className="ambient__beam ambient__beam--thin" />
    </div>
  );
}
