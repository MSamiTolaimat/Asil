import { useEffect, useMemo, useRef, useState } from "react";
import { fetchThanks } from "../../data/thanks-data";
import {
  CENTER_THANKS,
  THANKS_LEAD,
  THANKS_MAX_LEAVES,
} from "../../config/config";
import { TREE, TREE_VIEW as V, placeLeaves } from "../../data/tree-layout";
import { ArchIcon } from "../shared/ArchMotif";
import SectionHead from "../shared/SectionHead";
import "./ThanksTree.css";

const DEPTH_COLORS = [
  "#8c7355",
  "#a58a48",
  "#bf9e3e",
  "#d4af37",
  "#e2c45c",
  "#f0d98a",
];

function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20 4C10 4 4 10 4 18c0 1 0 2 .5 2.5C12 21 20 16 20 4z"
        fill="currentColor"
      />
      <path
        d="M5 19C9 14 13 10 18 6"
        fill="none"
        stroke="#141416"
        strokeOpacity=".55"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Chevron({ dir }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dir === "right" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} />
    </svg>
  );
}

/** تُصبح true مرة واحدة حين يظهر العنصر على الشاشة (لتشغيل نموّ الشجرة) */
function useSeen(ref, threshold = 0.25) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen, threshold]);
  return seen;
}

/**
 * لوحة أصيل: شجرة الشكر.
 * كل رسالة معتمدة ورقة على الشجرة، والأحدث في القمة. اضغط ورقة لقراءة رسالتها.
 * formUrl: رابط Google Form لكتابة رسالة شكر.
 */
export default function ThanksTree({ formUrl = "#" }) {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [notes, setNotes] = useState([]);
  const [isSample, setIsSample] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const treeRef = useRef(null);
  const grown = useSeen(treeRef);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchThanks(ctrl.signal)
      .then(({ items, isSample }) => {
        setNotes(items);
        setIsSample(isSample);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });
    return () => ctrl.abort();
  }, []);

  // كل الرسائل تظهر، والرسالة الحالية هي المحددة (الأحدث افتراضياً)
  const visible = notes;
  const current =
    visible.find((n) => n.id === selectedId) ?? visible[0] ?? null;
  const currentIndex = current ? visible.indexOf(current) : -1;

  // توزيع الأوراق على الشجرة، والبراعم لما بقي من مواضع فارغة
  const { leaves, buds } = useMemo(() => {
    const onTree = notes.slice(
      0,
      Math.min(THANKS_MAX_LEAVES, TREE.capacity),
    );
    const { spots, buds } = placeLeaves(TREE.pool, onTree.length);
    return {
      leaves: onTree.map((note, i) => ({ note, spot: spots[i] })),
      buds,
    };
  }, [notes]);

  const step = (delta) => {
    if (!visible.length) return;
    const next = (currentIndex + delta + visible.length) % visible.length;
    setSelectedId(visible[next].id);
  };

  const left = (x) => `${((x - V.x) / V.w) * 100}%`;
  const top = (y) => `${((y - V.y) / V.h) * 100}%`;

  return (
    <section
      id="thanks"
      className="sec thanks"
      data-theme="base"
      style={{ "--prev-bg": "#141416" }}
      aria-labelledby="thanks-title"
    >
      <div className="sec__inner">
        <SectionHead
          id="thanks-title"
          title="لوحة اصيل"
          lead="هذه شهادات طلبتنا بكلماتهم. كل ورقة رسالة شكرك كتبت لتنمو شجرة اصيل ويمتد الاثر باكبر قدر"
        />

        <div className="thx-board">
          {/* ===== الرسالة (يمين): البطاقة وتحتها شريط التحكم ===== */}
          <div className="thx-card-area" data-reveal style={{ "--i": 1 }}>
            <div className="thx-live" aria-live="polite">
              {status === "loading" && (
                <div className="thx-skeleton" aria-hidden="true" />
              )}

              {status === "error" && (
                <p className="thx-empty" role="alert">
                  تعذّر تحميل الرسائل الآن. حاول مرة أخرى بعد قليل.
                </p>
              )}

              {status === "ready" && !current && (
                <p className="thx-empty">
                  الشجرة بانتظار أول ورقة. كن أنت من يبدأ، فكلمتك تهمّنا.
                </p>
              )}

              {status === "ready" && current && (
                <figure
                  className="thx-card"
                  key={current.id}
                  data-tag={current.tag}
                >
                  <span className="thx-card__mark" aria-hidden="true">
                    “
                  </span>
                  <blockquote className="thx-card__quote">
                    {THANKS_LEAD && (
                      <span className="thx-card__lead">{THANKS_LEAD} </span>
                    )}
                    {current.text}
                  </blockquote>
                  <figcaption>
                    <span className="thx-card__leaf" aria-hidden="true">
                      <LeafIcon />
                    </span>
                    <span className="thx-card__name">{current.name}</span>
                  </figcaption>
                </figure>
              )}
            </div>

            {/* شريط التحكم: التنقل في بداية السطر، والزر في نهايته */}
            <div className="thx-bar">
              {status === "ready" && visible.length > 1 ? (
                <div className="thx-nav">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="الرسالة السابقة"
                  >
                    <Chevron dir="right" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="الرسالة التالية"
                  >
                    <Chevron dir="left" />
                  </button>
                  <span className="thx-nav__count" aria-hidden="true">
                    {currentIndex + 1} من {visible.length}
                  </span>
                </div>
              ) : (
                <span />
              )}
              <a
                className="thx-add"
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="thx-add__leaf" aria-hidden="true">
                  <LeafIcon />
                </span>
                اكتب ورقتك
              </a>
            </div>
          </div>

          {/* ===== الشجرة (يسار) ===== */}
          <div className="thx-stage" data-reveal>
            <div
              className="thx-tree"
              ref={treeRef}
              data-grown={grown || undefined}
              style={{ aspectRatio: `${V.w} / ${V.h}` }}
            >
              <svg
                className="thx-svg"
                viewBox={`${V.x} ${V.y} ${V.w} ${V.h}`}
                aria-hidden="true"
              >
                <line
                  className="thx-ground"
                  x1={TREE.baseX - 280}
                  x2={TREE.baseX + 280}
                  y1={TREE.ground}
                  y2={TREE.ground}
                />
                {TREE.roots.map((r, i) => (
                  <path
                    key={i}
                    className="thx-root"
                    d={r.d}
                    strokeWidth={r.w}
                  />
                ))}
                {TREE.branches.map((b, i) => (
                  <path
                    key={i}
                    className="thx-branch"
                    d={b.d}
                    pathLength="1"
                    stroke={DEPTH_COLORS[b.depth]}
                    strokeWidth={b.w}
                    style={{ "--delay": `${b.depth * 0.34}s` }}
                  />
                ))}
                {buds.map((s, i) => (
                  <circle key={i} className="thx-bud" cx={s.x} cy={s.y} r="3" />
                ))}
              </svg>

              <ul className="thx-leaves" aria-label="رسائل الشكر">
                {leaves.map(({ note, spot }, i) => {
                  const active = note.id === current?.id;
                  return (
                    <li
                      key={note.id}
                      style={{ left: left(spot.x), top: top(spot.y) }}
                    >
                      <button
                        type="button"
                        className="thx-leaf"
                        data-tag={note.tag}
                        data-active={active || undefined}
                        style={{ "--rot": `${spot.rot}deg`, "--k": i }}
                        aria-pressed={active}
                        aria-label={`رسالة شكر من ${note.name}`}
                        onClick={() => setSelectedId(note.id)}
                      >
                        {i === 0 && (
                          <span className="thx-leaf__halo" aria-hidden="true" />
                        )}
                        <LeafIcon />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
