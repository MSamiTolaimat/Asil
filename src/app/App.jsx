import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Intro from "../components/intro/Intro";
import Home from "../pages/Home";
import AudiencePage from "../pages/AudiencePage";
import PrivacyPage from "../pages/PrivacyPage";
import NotFound from "../pages/NotFound";
import AmbientLight from "../components/shared/AmbientLight";

// ضع هنا روابط نماذج Google Form الحقيقية
const FORMS = {
  thanks: "#", // كتابة رسالة شكر (لوحة أصيل)
};

function HomeWrapper({ forms }) {
  // من يدخل على الرئيسية مع هاش أو من صفحة أخرى يتخطى المقدمة
  const seen = () => !!window.location.hash || sessionStorage.getItem("aseel-intro-seen") === "1";
  const [introOn, setIntroOn] = useState(() => !seen());
  const [homeMounted, setHomeMounted] = useState(() => seen());

  // الرئيسية تُركَّب تحت المقدمة لحظة بدء انتقال الشعار، فتظهر من خلف تلاشيها
  return (
    <>
      {homeMounted && <Home forms={forms} introActive={introOn} />}
      {introOn && (
        <Intro onReveal={() => setHomeMounted(true)} onEnter={() => setIntroOn(false)} />
      )}
    </>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // توافقية عكسية: لو وصل زائر عبر روابط الهاش القديمة (#/youth أو #/falcons أو #/home/id)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#/youth") || hash === "#youth") {
      navigate("/youth", { replace: true });
    } else if (hash.startsWith("#/falcons") || hash === "#falcons") {
      navigate("/falcons", { replace: true });
    } else if (hash.startsWith("#/privacy") || hash === "#privacy") {
      navigate("/privacy", { replace: true });
    } else if (hash.match(/^#\/home\/([\w-]+)$/)) {
      const id = hash.match(/^#\/home\/([\w-]+)$/)[1];
      navigate(`/#${id}`, { replace: true });
    }
  }, [navigate, location]);

  return (
    <>
      {/* ضوء الغروب: مرة واحدة خلف كل الصفحات */}
      <AmbientLight />
      <Routes>
        <Route path="/" element={<HomeWrapper forms={FORMS} />} />
        <Route path="/youth" element={<AudiencePage audience="youth" />} />
        <Route path="/falcons" element={<AudiencePage audience="falcons" />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
