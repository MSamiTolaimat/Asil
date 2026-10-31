import { THANKS_CSV_URL, USE_SAMPLE_WHEN_EMPTY } from "../config/config";
import { parseCSV } from "./csv";

/* ---------- ما يُشكر عليه (الوسوم) ---------- */
// label: نص الخيار في Google Form (يجب أن يتطابق)، match: كلمات احتياطية للتعرّف عليه
export const TAGS = [
  { id: "service", label: "الإنترنت والكهرباء", match: ["إنترنت", "انترنت", "كهرباء", "wifi", "internet"] },
  { id: "mind", label: "العقل والقراءة", match: ["عقل", "قراءة", "حلق", "كتب"] },
  { id: "growth", label: "التنمية والمهارات", match: ["تنمية", "مهار", "دورة", "دورات", "ورش"] },
  { id: "sport", label: "الرياضة", match: ["رياض", "كرة", "لياقة"] },
  { id: "people", label: "القائمون على المكان", match: ["قائم", "متطوع", "مشرف", "فريق", "إدارة"] },
  { id: "calm", label: "الهدوء والأجواء", match: ["هدوء", "أجواء", "اجواء", "سكينة"] },
];

export const tagLabel = (id) => TAGS.find((t) => t.id === id)?.label ?? "";

function normalizeTag(raw) {
  const s = (raw || "").trim();
  if (!s) return "other";
  const lower = s.toLowerCase();
  const exact = TAGS.find((t) => t.label === s || t.id === lower);
  if (exact) return exact.id;
  const hit = TAGS.find((t) => t.match.some((m) => lower.includes(m)));
  return hit ? hit.id : "other";
}

/* ---------- تحويل الصفوف إلى رسائل ---------- */
const ALIASES = {
  name: ["name", "الاسم", "الاسم الأول"],
  text: ["text", "message", "الرسالة", "الشكر", "أصيل أعطاني"],
  tag: ["tag", "الوسم", "التصنيف", "على ماذا تشكر أصيل"],
  approved: ["approved", "موافق", "معتمد", "اعتماد"],
};
const APPROVED_VALUES = new Set(["نعم", "yes", "true", "1", "✓", "✔", "موافق", "approved", "y"]);

const MAX_TEXT = 200;
const MAX_NOTES = 300;
const NAME_PREFIXES = ["عبد", "أبو", "ابو", "أم", "ام", "ابن", "بنت"];

const toLatinDigits = (s) =>
  s
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));

function cleanText(raw) {
  const s = (raw || "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s.length > MAX_TEXT ? s.slice(0, MAX_TEXT - 1).trimEnd() + "…" : s;
}

/** خط دفاع ثانٍ بعد مراجعة المشرف: لا روابط ولا بريد ولا أرقام هواتف على اللوحة */
function looksUnsafe(text) {
  if (/(https?:\/\/|www\.|@\S+\.)/i.test(text)) return true;
  if (/\b[\w-]+\.(com|net|org|me|io|ly|info)\b/i.test(text)) return true;
  return /\d{8,}/.test(toLatinDigits(text).replace(/[\s-]/g, ""));
}

/** الاسم الأول فقط (مع مراعاة الأسماء المركّبة مثل «عبد الله») */
function firstName(raw) {
  const parts = (raw || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (!parts.length) return "طالب من أصيل";
  const take = NAME_PREFIXES.includes(parts[0]) && parts.length > 1 ? 2 : 1;
  return parts.slice(0, take).join(" ").slice(0, 24);
}

function normalize(rows) {
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim().toLowerCase().replace(/[….:؟?]+$/, ""));
  const col = {};
  for (const [key, names] of Object.entries(ALIASES)) {
    col[key] = headers.findIndex((h) => names.includes(h));
  }
  // فشل مغلق: بلا عمود «موافق» أو «الرسالة» لا يُعرض شيء
  if (col.text < 0 || col.approved < 0) return [];
  const get = (r, key) => (col[key] >= 0 ? (r[col[key]] || "").trim() : "");

  return rows
    .slice(1)
    .map((r, i) => ({
      id: i,
      name: firstName(get(r, "name")),
      text: cleanText(get(r, "text")),
      tag: normalizeTag(get(r, "tag")),
      approved: APPROVED_VALUES.has(get(r, "approved").toLowerCase()),
    }))
    .filter((n) => n.approved && n.text && !looksUnsafe(n.text))
    .reverse() // الأحدث أولاً: الصفوف تُضاف إلى آخر الجدول
    .slice(0, MAX_NOTES);
}

export const parseThanks = (csvText) => normalize(parseCSV(csvText));

/* ---------- رسائل تجريبية للمعاينة ---------- */
function sampleThanks() {
  const samples = [
    { name: "سلمى", tag: "calm", text: "مكاناً هادئاً أنهيتُ فيه بحث تخرّجي دون أن أقلق من شيء." },
    { name: "أحمد", tag: "service", text: "إنترنتاً مجانياً، وأصدقاء صاروا بمنزلة إخوتي." },
    { name: "ليلى", tag: "mind", text: "حلقةً أسبوعية تعلّمتُ فيها كيف أقرأ كتاباً كاملاً وأناقشه." },
    { name: "عمر", tag: "sport", text: "مباراةً أنتظرها كل أسبوع، وجسداً أنشط مما كان." },
    { name: "هدى", tag: "growth", text: "الثقة بأن أضع هدفاً وأخطو إليه خطوةً بعد خطوة." },
    { name: "يوسف", tag: "calm", text: "شعوراً بأن لي بيتاً ثانياً يستقبلني بلا مقابل." },
    { name: "مريم", tag: "people", text: "فريقاً يسأل عنّي إن غبتُ أياماً، ويفرح إن عدت." },
    { name: "خالد", tag: "service", text: "كهرباءً أشحن بها جهازي وأدرس حتى آخر الليل مطمئناً." },
  ];
  return Array.from({ length: 5 }, (_, i) => ({
    ...samples[i % samples.length],
    id: i,
  }))
    .reverse();
}

/* ---------- الجلب ---------- */
export async function fetchThanks(signal) {
  if (!THANKS_CSV_URL) {
    return USE_SAMPLE_WHEN_EMPTY
      ? { items: sampleThanks(), isSample: true }
      : { items: [], isSample: false };
  }
  const res = await fetch(THANKS_CSV_URL, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return { items: parseThanks(await res.text()), isSample: false };
}
