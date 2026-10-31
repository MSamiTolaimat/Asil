import { useEffect, useRef } from "react";
import Icon from "../shared/Icon";
import "./PrivacyModal.css";

export default function PrivacyModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    // منع تمرير الصفحة خلف المودال
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // نقل التركيز إلى زر الإغلاق داخل المودال
    const btn = modalRef.current?.querySelector("button");
    btn?.focus();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="p-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="p-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        dir="rtl"
        lang="ar"
      >
        <header className="p-modal__header">
          <div className="p-modal__title-wrap">
            <span className="p-modal__badge">أصيل</span>
            <h2 id="privacy-modal-title" className="p-modal__title">
              سياسة الخصوصية وشروط الاستخدام
            </h2>
          </div>
          <button
            type="button"
            className="p-modal__close"
            onClick={onClose}
            aria-label="إغلاق نافذة الخصوصية"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="p-modal__body">
          <div className="p-modal__intro">
            <p>
              أصيل هو مساحة مجتمعية وتربوية غير ربحية. نلتزم بأعلى معايير الأمانة والشفافية في حماية بيانات
              روادنا الكرام، ونولي خصوصية <strong>الأطفال والقاصرين</strong> اهتماماً استثنائياً وخاصاً.
            </p>
          </div>

          <section className="p-modal__sec">
            <h3>١. حماية خصوصية الأطفال والقاصرين (صقور أصيل)</h3>
            <ul>
              <li>
                <strong>تسجيل بإشراف وليّ الأمر:</strong> لا نقبل تسجيل أي طفل أو ناشئ (دون سن ١٨) إلا من خلال نموذج
                رسمي يملؤه ولي الأمر أو الوصي القانوني.
              </li>
              <li>
                <strong>حدود البيانات:</strong> نجمع فقط المعلومات الضرورية للتواصل مع الأهل وتنظيم المشاركة والأنشطة (مثل الاسم، المرحلة الدراسية، ورقم هاتف ولي الأمر).
              </li>
              <li>
                <strong>حظر المشاركة التجارية:</strong> لا تُباع بيانات الأطفال ولا تُشارك إطلاقاً مع أي جهة تجارية أو إعلانية أو خارجية.
              </li>
              <li>
                <strong>الصور والوسائط:</strong> لا يتم التقاط أو نشر صور الأطفال في أنشطة المركز دون موافقة مسبقة وصريحة من وليّ الأمر.
              </li>
            </ul>
          </section>

          <section className="p-modal__sec">
            <h3>٢. بيانات طلاب الجامعة والشباب (شباب أصيل)</h3>
            <ul>
              <li>
                البيانات المجمعة في استمارة التسجيل مخصصة لتمكين الطالب من الاستفادة من برامج أصيل وخدماته المجانية (البرامج الشرعية والفكرية، والمتابعة الأكاديمية، والفعاليات، وسائر خدمات مركز أصيل).
              </li>
              <li>
                نحافظ على سرية بيانات الاتصال والمعلومات الأكاديمية ونستخدمها حصراً للتنسيق الداخلي وإعلانات برامج أصيل.
              </li>
            </ul>
          </section>

          <section className="p-modal__sec">
            <h3>٣. لوحة أصيل (شجرة الشكر والثناء)</h3>
            <ul>
              <li>
                المشاركة في لوحة أصيل بإرسال عبارات الشكر والثناء هو عمل تطوعي يهدف لإشاعة ثقافة العرفان والتقدير في المجتمع.
              </li>
              <li>
                يُتاح لأي مشارك أو ولي أمر في أي وقت طلب تعديل أو حذف أي اسم أو رسالة منشورة فوراً عبر التواصل معنا.
              </li>
            </ul>
          </section>

          <section className="p-modal__sec">
            <h3>٤. استمارات المراسلة والتواصل</h3>
            <ul>
              <li>
                المعلومات المرسلة عبر نموذج التواصل (الاسم، البريد أو الهاتف، نص الرسالة) تُعامل بسرية وتُستخدم فقط للرد على استفسارك.
              </li>
              <li>
                الموقع لا يستخدم ملفات تعريف ارتباط (Cookies) تتبعية أو أدوات مراقبة تجارية.
              </li>
            </ul>
          </section>

          <section className="p-modal__sec">
            <h3>٥. حقوقك وطلب حذف البيانات</h3>
            <p>
              يحق لأي زائر، طالب، أو ولي أمر طلب مراجعة البيانات الخاصة به أو بأطفاله، أو طلب تصحيحها، أو شطبها نهائياً
              من سجلاتنا في أي وقت عبر الاتصال المباشر بنا أو إرسال رسالة إلى:
            </p>
            <div className="p-modal__contact-box">
              <span>الهاتف والواتساب المباشر: عبر أرقام المركز الموضحة في قسم التواصل</span>
              <span>أو زيارة مركز أصيل مباشرة خلال أوقات الدوام الرسمية</span>
            </div>
          </section>
        </div>

        <footer className="p-modal__footer">
          <p className="p-modal__update">آخر تحديث: شوال ١٤٤٧ هـ / ٢٠٢٦ م</p>
          <button type="button" className="btn-primary p-modal__ok" onClick={onClose}>
            فهمت ذلك
          </button>
        </footer>
      </div>
    </div>
  );
}
