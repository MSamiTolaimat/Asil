/**
 * شجرة أصيل: توليد حتمي (نفس البذرة = نفس الشجرة في كل زيارة).
 * يُنتج الفروع والجذور ومواضع الأوراق المحتملة داخل مربع 800×800.
 * لا يعتمد على React، فيمكن اختباره أو تغيير شكل الشجرة بتبديل البذرة فقط.
 */

export const TREE_SIZE = 800;

// الإطار المعروض فعلاً (قصٌّ للهوامش الفارغة كي تكبر الشجرة على الجوال)
export const TREE_VIEW = { x: 60, y: 95, w: 680, h: 690 };

// كثافة الأوراق: أصغر/أكبر مسافة بين ورقتين (بوحدات المربع).
// قلّة الرسائل → مسافة واسعة وأوراق كبيرة، وكثرتها → تضيق المسافة وتصغر الأوراق تلقائياً.
export const MIN_LEAF_GAP = 7;
export const MAX_LEAF_GAP = 42;

const BASE_X = TREE_SIZE / 2;
const GROUND_Y = 650;
const MAX_DEPTH = 5;
const MIN_SPOT_GAP = 42; // (قديم) مواضع الأوراق الثابتة؛ التوزيع الفعلي صار عبر pool

// طول الفرع وسُمكه بحسب العمق (0 = الجذع)
const LENGTHS = [165, 125, 92, 68, 50, 36];
const WIDTHS = [17, 9.5, 5.4, 3.1, 1.8, 1.1];

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;
const clampAngle = (a) => Math.max(-1.4, Math.min(1.4, a));

export function buildTree(seed = 11) {
  const rand = mulberry32(seed);
  const branches = [];
  const candidates = [];
  const segs = []; // مقاطع الفروع الدقيقة، لبناء مجمّع المواضع الكثيف
  function grow(x, y, angle, depth) {
    const len = LENGTHS[depth] * (0.9 + rand() * 0.2);
    const bend = (rand() - 0.5) * 0.45;
    const x2 = x + Math.sin(angle + bend) * len;
    const y2 = y - Math.cos(angle + bend) * len;
    const cx = x + Math.sin(angle - bend * 0.6) * len * 0.55;
    const cy = y - Math.cos(angle - bend * 0.6) * len * 0.55;

    branches.push({
      d: `M${r1(x)} ${r1(y)}Q${r1(cx)} ${r1(cy)} ${r1(x2)} ${r1(y2)}`,
      w: WIDTHS[depth],
      depth,
    });

    if (depth >= 2) {
      segs.push({
        x,
        y,
        cx,
        cy,
        x2,
        y2,
        len,
        depth,
        deg: ((angle + bend) * 180) / Math.PI,
      });
    }

    // نقاط محتملة للأوراق على الفروع الدقيقة (نقطة على المنحنى التربيعي)
    if (depth >= 2) {
      for (const t of [0.5, 0.8, 1]) {
        const u = 1 - t;
        candidates.push({
          x: u * u * x + 2 * u * t * cx + t * t * x2,
          y: u * u * y + 2 * u * t * cy + t * t * y2,
          deg: ((angle + bend) * 180) / Math.PI,
        });
      }
    }

    if (depth >= MAX_DEPTH) return;
    const offsets =
      depth === 0
        ? [-0.8, 0.05, 0.8]
        : rand() < 0.45
          ? [-0.65, 0, 0.65]
          : [-0.5, 0.5];
    for (const off of offsets) {
      const jitter = (rand() - 0.5) * 0.3;
      grow(x2, y2, clampAngle(angle + bend + off + jitter), depth + 1);
    }
  }

  grow(BASE_X, GROUND_Y, 0, 0);

  // اختيار مواضع الأوراق: عشوائي حتمي مع حدّ أدنى للمسافة بين الورقتين
  const shuffled = candidates
    .map((c) => ({ c, k: rand() }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.c);
  const spots = [];
  for (const c of shuffled) {
    if (spots.every((s) => Math.hypot(s.x - c.x, s.y - c.y) >= MIN_SPOT_GAP)) {
      spots.push({
        x: r1(c.x),
        y: r1(c.y),
        // الورقة المرسومة تتجه إلى أعلى اليمين (45°)، فنطرحها ثم نضيف ميلاً بسيطاً
        rot: Math.round(c.deg - 45 + (rand() - 0.5) * 40),
      });
    }
  }
  spots.sort((a, b) => a.y - b.y); // من القمة إلى الأسفل

  // الجذور: تحت خط الأرض
  const roots = [];
  for (let i = -3; i <= 3; i++) {
    const x2 = BASE_X + i * 48 + (rand() - 0.5) * 30;
    const y2 = GROUND_Y + 70 + rand() * 55 + (3 - Math.abs(i)) * 8;
    roots.push({
      d: `M${BASE_X} ${GROUND_Y}Q${r1(BASE_X + i * 14)} ${GROUND_Y + 40} ${r1(x2)} ${r1(y2)}`,
      w: r1(4 - Math.abs(i) * 0.45),
    });
  }

  // مجمّع مواضع كثيف (بمولّد أرقام مستقل كي لا يتغيّر شكل الفروع والجذور القائم)
  const pool = buildPool(segs, seed + 97);

  return {
    size: TREE_SIZE,
    ground: GROUND_Y,
    baseX: BASE_X,
    branches,
    roots,
    spots,
    pool,
  };
}

/**
 * مجمّع المواضع: نقاط على الفروع الدقيقة + نقاط متناثرة حولها كالمظلّة،
 * بحيث تتّسع الشجرة لمئات الأوراق دون أن تتغير فروعها.
 */
function buildPool(segs, seed) {
  const rand = mulberry32(seed);
  const pts = [];
  for (const sg of segs) {
    const steps = Math.max(3, Math.round(sg.len / 7));
    for (let k = 1; k <= steps; k++) {
      const t = k / steps;
      const u = 1 - t;
      const bx = u * u * sg.x + 2 * u * t * sg.cx + t * t * sg.x2;
      const by = u * u * sg.y + 2 * u * t * sg.cy + t * t * sg.y2;
      pts.push({ x: bx, y: by, deg: sg.deg });
      if (sg.depth >= 3) {
        const R = sg.depth >= 4 ? 30 : 18;
        for (let j = 0; j < 3; j++) {
          const a = rand() * Math.PI * 2;
          const r = Math.sqrt(rand()) * R;
          pts.push({
            x: bx + Math.cos(a) * r,
            y: by + Math.sin(a) * r,
            deg: sg.deg,
          });
        }
      }
    }
  }
  const inView = pts.filter(
    (p) =>
      p.x > TREE_VIEW.x + 12 &&
      p.x < TREE_VIEW.x + TREE_VIEW.w - 12 &&
      p.y > TREE_VIEW.y + 12 &&
      p.y < GROUND_Y - 60,
  );
  return inView
    .map((p) => ({ p, k: rand() }))
    .sort((a, b) => a.k - b.k)
    .map(({ p }) => ({
      x: r1(p.x),
      y: r1(p.y),
      rot: Math.round(p.deg - 45 + (rand() - 0.5) * 40),
    }));
}

export const TREE = buildTree(11);

/** اختيار مواضع بينها مسافة لا تقل عن gap (شبكة تجزئة: زمن خطي تقريباً) */
function pick(pool, gap) {
  const grid = new Map();
  const out = [];
  for (const c of pool) {
    const cx = Math.floor(c.x / gap);
    const cy = Math.floor(c.y / gap);
    let ok = true;
    for (let i = cx - 1; i <= cx + 1 && ok; i++) {
      for (let j = cy - 1; j <= cy + 1; j++) {
        const cell = grid.get(i * 100003 + j);
        if (cell && cell.some((p) => Math.hypot(p.x - c.x, p.y - c.y) < gap)) {
          ok = false;
          break;
        }
      }
    }
    if (ok) {
      out.push(c);
      const key = cx * 100003 + cy;
      if (grid.has(key)) grid.get(key).push(c);
      else grid.set(key, [c]);
    }
  }
  return out;
}

/** أقصى عدد أوراق تتّسع له الشجرة عند أضيق مسافة مسموحة */
TREE.capacity = pick(TREE.pool, MIN_LEAF_GAP).length;

/** حجم الورقة (بوحدات المربع) بحسب المسافة المتاحة بين الأوراق */
export const leafUnits = (gap) => Math.min(33, gap * 0.82);

/**
 * يوزّع n ورقة على الشجرة: يبحث عن أوسع مسافة تتّسع معها n ورقة، فتكبر الأوراق
 * حين تقلّ الرسائل وتصغر حين تكثر. الناتج مرتّب من القمة إلى الأسفل، فتُعطى الرسالة
 * الأحدث (الفهرس 0) أعلى موضع: الشجرة تنمو إلى الأعلى مع الزمن.
 * يعيد أيضاً gap (لحساب حجم الورقة) وبراعم للمواضع الفارغة حين يكون العدد قليلاً.
 */
export function placeLeaves(pool, n) {
  if (n <= 0) return { spots: [], buds: [], gap: MAX_LEAF_GAP };
  let gap = MAX_LEAF_GAP;
  let best = pick(pool, gap);
  if (best.length < n) {
    gap = MIN_LEAF_GAP;
    best = pick(pool, gap);
    if (best.length >= n) {
      let lo = MIN_LEAF_GAP;
      let hi = MAX_LEAF_GAP;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        const p = pick(pool, mid);
        if (p.length >= n) {
          best = p;
          gap = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }
    }
  }
  const sorted = [...best].sort((a, b) => a.y - b.y);
  const count = Math.min(n, sorted.length);
  const chosen = new Set();
  for (let i = 0; i < count; i++) {
    chosen.add(Math.floor(((i + 0.5) * sorted.length) / count));
  }
  const spots = [];
  const buds = [];
  sorted.forEach((c, idx) => (chosen.has(idx) ? spots.push(c) : buds.push(c)));
  return { spots, buds: buds.slice(0, 40), gap };
}
