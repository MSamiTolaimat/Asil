import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArchEmblem, ArchPattern } from "../components/shared/ArchMotif";
import Icon from "../components/shared/Icon";
import "./NotFound.css";

export default function NotFound() {
  useEffect(() => {
    const prev = document.title;
    document.title = "الصفحة غير موجودة (٤٠٤) | أصيل";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="not-found" dir="rtl" lang="ar">
      <div className="not-found__glow" aria-hidden="true" />
      <ArchPattern id="nf-arch" className="not-found__pattern" stroke="#d4af37" />

      <main className="not-found__inner" id="main-content">
        <div className="not-found__visual">
          <ArchEmblem className="not-found__arch" />
          <span className="not-found__code">٤٠٤</span>
        </div>

        <p className="eyebrow">خطأ في العنوان</p>
        <h1 className="not-found__title">
          الصفحة <span>غير موجودة</span>
        </h1>
        <p className="not-found__lead">
          عذراً، الرابط الذي حاولت الوصول إليه غير متوفر أو ربما تم نقله.
          يمكنك العودة إلى الواجهة الرئيسية أو استكشاف مسارات أصيل.
        </p>

        <div className="not-found__actions">
          <Link to="/" className="btn-primary">
            العودة إلى الرئيسية
          </Link>
          <Link to="/youth" className="btn-ghost">
            شباب أصيل
          </Link>
          <Link to="/falcons" className="btn-ghost">
            صقور أصيل
          </Link>
        </div>
      </main>

      <footer className="join__foot" role="contentinfo">
        <p>© أصيل - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
