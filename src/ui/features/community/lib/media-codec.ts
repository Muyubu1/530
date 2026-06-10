const CANDIDATES: { mime: string; ext: string }[] = [
  { mime: "audio/webm;codecs=opus", ext: "webm" },
  { mime: "audio/webm", ext: "webm" },
  { mime: "audio/mp4", ext: "m4a" },
  { mime: "audio/ogg;codecs=opus", ext: "ogg" },
];

/** Picks a MediaRecorder mime the browser supports, with a file extension. */
export function pickAudioMime(): { mime: string; ext: string } {
  if (typeof MediaRecorder !== "undefined") {
    for (const c of CANDIDATES) {
      if (MediaRecorder.isTypeSupported(c.mime)) return c;
    }
  }
  return { mime: "", ext: "webm" };
}
