import { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/shared/Icon";
import "./Home.css";
import "../components/privacy/PrivacyModal.css";

export default function PrivacyPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = "سياسة الخصوصية والشروط | أصيل";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="home" dir="rtl" lang="ar" data-theme="base">
      <header className="topbar">
        <Link className="topbar__brand" to="/" aria-label="أصيل | الصفحة الرئيسية">
          <img src="/logo.png" alt="أصيل" />
        </Link>
        <Link to="/" className="topbar__cta">
          العودة للرئيسية
        </Link>
      </header>

      <main id="main-content" tabIndex="-1" className="sec" style={{ minHeight: "80vh", paddingBlock: "60px" }}>
        <div className="sec__inner" style={{ maxWidth: "800px" }}>
          <nav className="crumbs" aria-label="مسار الصفحة" style={{ marginBottom: "24px" }}>
            <Link to="/">الرئيسية</Link>
            <Icon name="arrow-left" />
            <span aria-current="page">سياسة الخصوصية</span>
          </nav>

          <header className="sec__head">
            <p className="eyebrow">أصيل | الشفافية والأمانة</p>
            <h1 className="sec__title">
              سياسة الخصوصية <span>وشروط الاستخدام</span>
            </h1>
          </header>

          <div
            style={{
              padding: "clamp(20px, 4vw, 36px)",
              background: "var(--surface)",
              borderRadius: "var(--radius-l)",
              border: "1px solid var(--line)",
              lineHeight: 1.9,
              color: "var(--text)",
            }}
          >
            <div className="p-modal__intro" style={{ marginBottom: "26px" }}>
              <p>
                أصيل هو مساحة مجتمعية وتربوية غير ربحية. نلتزم بأعلى معايير الأمانة والشفافية في حماية بيانات روادنا
                الكرام، ونولي خصوصية <strong>الأطفال والقاصرين</strong> اهتماماً استثنائياً وخاصاً.
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
                من سجلاتنا في أي وقت عبر الاتصال المباشر بنا أو زيارة المركز خلال أوقات الدوام.
              </p>
            </section>

            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <Link to="/" className="btn-primary">
                العودة إلى الصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="join__foot" role="contentinfo">
        <p>© أصيل - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
