/**
 * زخرفة «القوس وشمس الأصيل»
 * قوس (محراب/باب) وفيه نصف شمس تغيب.
 *
 * لهجتان من الشكل نفسه:
 *   variant="pointed" ← قوس مدبّب حاد (شباب أصيل)
 *   variant="round"   ← قوس مدوّر (صقور أصيل)
 *
 * الهندسة: القوس المدبّب قوسان دائريان نصف قطر كلٍّ منهما R، مركزاهما على
 * خط الانطلاق ومزاحان عن المحور بمقدار c. حين c = 0 يصبح القوس نصف دائرة.
 * تُولَّد الأقواس المتداخلة بإنقاص R مع تثبيت c، فتبقى متوازية تماماً.
 */

const SHAPES = {
  pointed: { c: 1 }, // نسبة c إلى نصف العرض الخارجي (1 = قوس متساوي الأضلاع)
  round: { c: 0 },
};

/** مسار قوس مفتوح من الأسفل: عمودان ثم قوسان يلتقيان في القمة */
export function archPath({ c, R, ys, yb }) {
  const a = R - c; // نصف العرض عند الانطلاق
  const h = Math.sqrt(R * R - c * c); // ارتفاع القوس فوق خط الانطلاق
  const f = (n) => +n.toFixed(2);
  return `M${f(a)} ${yb}V${ys}A${R} ${R} 0 0 0 0 ${f(ys - h)}A${R} ${R} 0 0 0 ${f(-a)} ${ys}V${yb}`;
}

/** أقواس متداخلة متوازية؛ تعيد قائمة مسارات */
function nested({ variant, outerHalf, step, count, ys, yb }) {
  const c = SHAPES[variant].c * outerHalf;
  const R0 = outerHalf + c;
  return Array.from({ length: count }, (_, i) =>
    archPath({ c, R: R0 - i * step, ys, yb })
  );
}

/* ------------------------------------------------------------------ */
/* ١) نمط متكرر: أقواس متداخلة بخطوط رفيعة (خلفية القسم والمقدّمة)      */
/* ------------------------------------------------------------------ */

const TILE_W = 64;
const TILE_H = 88;

export const ARCH_TILE = { w: TILE_W, h: TILE_H };

export function ArchPattern({ id, className, stroke = "currentColor", variant = "pointed" }) {
  const paths = nested({
    variant,
    outerHalf: 28,
    step: 8,
    count: 3,
    ys: variant === "round" ? 60 : 54,
    yb: TILE_H,
  });
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern id={id} width={TILE_W} height={TILE_H} patternUnits="userSpaceOnUse">
          <g fill="none" stroke={stroke} strokeWidth="1" transform={`translate(${TILE_W / 2} 0)`}>
            {paths.map((d) => (
              <path key={d} d={d} />
            ))}
            <path d={`M${-TILE_W / 2} ${TILE_H}H${TILE_W / 2}`} />
            <path d={`M0 ${TILE_H - 14}l2.4 2.4L0 ${TILE_H - 9.2}l-2.4-2.4z`} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* ٢) الشعار الكبير: قوس متداخل + نصف شمس تغيب على الأفق               */
/* ------------------------------------------------------------------ */

const SUN_RAYS = [30, 60, 90, 120, 150].map((deg) => {
  const t = (deg * Math.PI) / 180;
  const p = (r) => [+(r * Math.cos(t)).toFixed(2), +(88 - r * Math.sin(t)).toFixed(2)];
  const [x1, y1] = p(31);
  const [x2, y2] = p(43);
  return `M${x1} ${y1}L${x2} ${y2}`;
});

export function ArchEmblem({ className, variant = "pointed" }) {
  const round = variant === "round";
  const paths = nested({
    variant,
    outerHalf: 62,
    step: 9,
    count: 4,
    ys: round ? -20 : 20,
    yb: 88,
  });
  return (
    <svg className={className} viewBox="-100 -100 200 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <g strokeWidth="0.8">
          {paths.map((d, i) => (
            <path key={d} d={d} opacity={1 - i * 0.16} />
          ))}
        </g>
        <path d="M-70 88H70" strokeWidth="0.8" />
        <g className="arch__sun" strokeWidth="1">
          <path d="M-26 88A26 26 0 0 1 26 88" />
          <path className="arch__rays" d={SUN_RAYS.join("")} strokeWidth="0.9" />
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* ٣) أيقونة صغيرة (بطاقة «من أصيل إليكم»)                              */
/* ------------------------------------------------------------------ */

export function ArchIcon({ variant = "pointed" }) {
  const c = variant === "round" ? 0 : 6;
  const R = 6 + c;
  const d = archPath({ c, R, ys: variant === "round" ? -3 : 1, yb: 10 });
  return (
    <svg
      viewBox="-12 -12 24 24"
      className="icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
      <path d="M-9.5 10H9.5" />
      <path d="M-3 10A3 3 0 0 1 3 10" />
    </svg>
  );
}
