import { useEffect } from "react";

/** إظهار العناصر ذات [data-reveal] عند وصولها إلى الشاشة */
export default function useReveal(rootRef) {
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll("[data-reveal]");
    if (!els?.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-in", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}
