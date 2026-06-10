import { useRef, useState } from "react";
import { pickAudioMime } from "./lib/media-codec";

const MIN_AUDIO_BYTES = 1024;

/** Microphone recording via MediaRecorder. `stop()` resolves with the clip. */
export function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const extRef = useRef("webm");
  const resolveRef = useRef<((v: { blob: Blob; ext: string } | null) => void) | null>(null);

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function teardownStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const { mime, ext } = pickAudioMime();
      extRef.current = ext;
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        teardownStream();
        resolveRef.current?.(blob.size > MIN_AUDIO_BYTES ? { blob, ext: extRef.current } : null);
        resolveRef.current = null;
      };
      recorderRef.current = rec;
      rec.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      teardownStream();
      setRecording(false);
    }
  }

  function stop(): Promise<{ blob: Blob; ext: string } | null> {
    return new Promise((resolve) => {
      stopTimer();
      setRecording(false);
      const rec = recorderRef.current;
      if (!rec || rec.state === "inactive") {
        teardownStream();
        resolve(null);
        return;
      }
      resolveRef.current = resolve;
      rec.stop();
    });
  }

  function cancel() {
    stopTimer();
    setRecording(false);
    resolveRef.current = null;
    try {
      recorderRef.current?.stop();
    } catch {
      /* ignore */
    }
    teardownStream();
  }

  return { recording, seconds, start, stop, cancel };
}
