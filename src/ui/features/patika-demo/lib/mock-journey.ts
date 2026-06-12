export type TaskIcon = "sunrise" | "move" | "read" | "water" | "reflect";

export interface DemoTask {
  id: string;
  title: string;
  detail: string;
  icon: TaskIcon;
}

export interface DemoDay {
  day: number;
  theme: string;
  tasks: DemoTask[];
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

export const DAYS: DemoDay[] = Array.from({ length: 28 }, (_, i) => {
  const day = i + 1;
  const theme = THEMES[i % 7];
  const middle = i % 2 === 0 ? T.move : T.read;
  return { day, theme, tasks: [T.wake, middle, T.reflect] };
});

export const BADGES: DemoBadge[] = [
  { id: "b7", day: 7, name: "İlk Hafta", desc: "7 gün kesintisiz." },
  { id: "b14", day: 14, name: "Yarı Yol", desc: "14 günü devirdin." },
  { id: "b21", day: 21, name: "Alışkanlık", desc: "21 gün — artık bir huy." },
  { id: "b28", day: 28, name: "Dönüşüm", desc: "28 gün. Tamam." },
];

export const TOTAL_DAYS = DAYS.length;
