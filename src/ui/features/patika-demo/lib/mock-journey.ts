export type TaskIcon = "sunrise" | "move" | "read" | "water" | "reflect";

export interface DemoTask {
  id: string;
  title: string;
  detail: string;
  icon: TaskIcon;
}

export type ResourceKind = "video" | "audio" | "doc";

export interface DemoResource {
  kind: ResourceKind;
  title: string;
  /** Short meta shown under the title (duration, "PDF", etc.). */
  meta: string;
  /** Destination opened when the resource is selected. */
  url: string;
}

export interface DemoDay {
  day: number;
  theme: string;
  tasks: DemoTask[];
  /** Optional supporting material for the day (videos / audio / documents). */
  resources: DemoResource[];
}

export interface DemoBadge {
  id: string;
  day: number;
  name: string;
  desc: string;
}

const THEMES = ["Şafak", "Beden", "Zihin", "Sistem", "Dayanıklılık", "Odak", "Tazelenme"];

const T: Record<string, DemoTask> = {
  wake: {
    id: "wake",
    title: "5.30'da uyan",
    detail: "Alarmı erteleme — günün ilk zaferi.",
    icon: "sunrise",
  },
  move: { id: "move", title: "20 dk hareket", detail: "Yürüyüş ya da antrenman.", icon: "move" },
  read: { id: "read", title: "10 sayfa oku", detail: "Zihni besle.", icon: "read" },
  reflect: { id: "reflect", title: "Günü yansıt", detail: "Bir cümle not bırak.", icon: "reflect" },
};

// Sample supporting material. Deterministic per day so the panel demonstrates
// "active when present / disabled when absent" — real content swaps in later.
const SAMPLE = {
  video: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
  audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  pdf: "https://www.africau.edu/images/default/sample.pdf",
  slide: "https://picsum.photos/seed/530/1280/800.jpg",
};

function resourcesFor(day: number): DemoResource[] {
  const out: DemoResource[] = [];
  if (day % 4 !== 0)
    out.push({
      kind: "video",
      title: `Gün ${day} · Rehber video`,
      meta: "Video · 04:12",
      url: SAMPLE.video,
    });
  if (day % 2 === 1)
    out.push({
      kind: "audio",
      title: `Gün ${day} · Sesli anlatım`,
      meta: "Ses · 08:30",
      url: SAMPLE.audio,
    });
  if (day % 3 === 0)
    out.push({ kind: "doc", title: `Gün ${day} · Çalışma notu`, meta: "PDF", url: SAMPLE.pdf });
  // First days carry a concrete written resource (easy to try): a PDF and a slide image.
  if (day === 1) {
    out.push({
      kind: "doc",
      title: "Düşün ve Zengin Ol — Napoleon Hill",
      meta: "PDF · Kitap",
      url: "/resources/think-and-grow-rich.pdf",
    });
    out.push({ kind: "doc", title: "Başlangıç kılavuzu", meta: "PDF · 2 sayfa", url: SAMPLE.pdf });
  }
  if (day === 2)
    out.push({ kind: "doc", title: "Sabah rutini (slayt)", meta: "Görsel", url: SAMPLE.slide });
  return out;
}

export const DAYS: DemoDay[] = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1;
  const theme = THEMES[i % 7];
  const middle = i % 2 === 0 ? T.move : T.read;
  return { day, theme, tasks: [T.wake, middle, T.reflect], resources: resourcesFor(day) };
});

export const BADGES: DemoBadge[] = [
  { id: "b7", day: 7, name: "İlk Hafta", desc: "7 gün kesintisiz." },
  { id: "b14", day: 14, name: "Yarı Yol", desc: "14 günü devirdin." },
  { id: "b21", day: 21, name: "Alışkanlık", desc: "21 gün — artık bir huy." },
  { id: "b28", day: 28, name: "Dönüşüm", desc: "28 gün. Tamam." },
];

export const TOTAL_DAYS = DAYS.length;
