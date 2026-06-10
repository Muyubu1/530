import { format } from "date-fns";
import { tr } from "date-fns/locale";

// Server functions may deliver dates as ISO strings; normalise defensively.
const toDate = (x: Date | string): Date => (x instanceof Date ? x : new Date(x));

export const whenLine = (x: Date | string): string =>
  format(toDate(x), "d MMM yyyy · HH:mm", { locale: tr });

export const dayNum = (x: Date | string): string => format(toDate(x), "dd");

export const monthShort = (x: Date | string): string => format(toDate(x), "MMM", { locale: tr });
