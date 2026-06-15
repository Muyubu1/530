import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { WaitlistData, WaitlistResult } from "@/ui/shared/waitlist-form";

/**
 * The marketing landing — an immersive, scroll-driven cinematic climb followed
 * by the system / elimination / invite / application sections. Ported from the
 * standalone "530V2" design; the climb is animated imperatively in a single
 * rAF loop (see the mount effect), with Lenis for smooth scroll.
 */
export function LandingPage({
  onWaitlistSubmit,
}: {
  onWaitlistSubmit: (data: WaitlistData) => Promise<WaitlistResult>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [sending, setSending] = useState(false);

  // ── Cinematic engine: pinned 3D climb, parallax, motes, grain, reveal ──────
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const N = 8;
    const words = ["", "DİPTE", "SABIR", "AZİM", "İNANÇ", "VARIŞ", "KARDEŞLİK", "SIRA SENDE"];

    const cine = root.querySelector<HTMLElement>(".cine-section");
    const world = root.querySelector<HTMLElement>(".cine-world");
    const fx = root.querySelector<HTMLElement>(".cine-fx");
    const textWrap = root.querySelector<HTMLElement>(".cine-text");
    const layers = Array.from(root.querySelectorAll<HTMLElement>(".cine-layer"));
    const imgs = Array.from(root.querySelectorAll<HTMLImageElement>(".cine-img"));
    const segs = Array.from(root.querySelectorAll<HTMLElement>(".cine-seg"));
    const overlay = root.querySelector<HTMLElement>(".bright-overlay");
    const hud = root.querySelector<HTMLElement>(".cine-hud");
    const hudFill = root.querySelector<HTMLElement>(".hud-fill");
    const hudWord = root.querySelector<HTMLElement>(".hud-word");
    const hudNum = root.querySelector<HTMLElement>(".hud-num");
    const leak = root.querySelector<HTMLElement>(".light-leak");
    const segLines = segs.map((s) => Array.from(s.querySelectorAll<HTMLElement>(".ln")));
    const stairWords = segs.map((s) => s.querySelector<HTMLElement>(".stair-word"));
    if (!cine) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 760;

    imgs.forEach((im) => {
      const s = im.getAttribute("src");
      if (s) {
        const p = new Image();
        p.src = s;
      }
    });

    // lines start hidden (except the hero segment)
    segLines.forEach((lines, si) => {
      if (si === 0) return;
      lines.forEach((ln) => {
        ln.style.opacity = "0";
        ln.style.willChange = "opacity,transform,filter";
      });
    });

    let mx = 0,
      my = 0,
      cx = 0,
      cy = 0,
      raf = 0,
      hudIdx = -1;

    const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const ease = (t: number) => t * t * (3 - 2 * t);
    const easeOut = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(2, -9 * t));

    const layout = () => {
      const small = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 760;
      const factor = small ? 6.0 : 10.8;
      cine.style.height = Math.round(factor * window.innerHeight) + "px";
    };

    const buildMotes = () => {
      const host = root.querySelector<HTMLElement>(".motes");
      if (!host || reduce) return;
      const count = touch ? 14 : 34;
      let html = "";
      for (let i = 0; i < count; i++) {
        const x = (Math.random() * 120 - 10).toFixed(2);
        const y = (Math.random() * 120 - 10).toFixed(2);
        const zz = (Math.random() * 650 - 500).toFixed(0);
        const sz = (Math.random() * 2.4 + 1).toFixed(2);
        const dur = (Math.random() * 14 + 12).toFixed(1);
        const del = (-Math.random() * 20).toFixed(1);
        const op = (Math.random() * 0.4 + 0.18).toFixed(2);
        const mxx = (Math.random() * 40 - 20).toFixed(0);
        html +=
          '<span style="position:absolute;left:' +
          x +
          "%;top:" +
          y +
          "%;transform:translateZ(" +
          zz +
          'px);transform-style:preserve-3d;"><span style="display:block;width:' +
          sz +
          "px;height:" +
          sz +
          "px;border-radius:50%;background:radial-gradient(circle,#eaf2f6,rgba(234,242,246,0));--mo:" +
          op +
          ";--mx:" +
          mxx +
          "px;animation:cineMote " +
          dur +
          "s linear " +
          del +
          's infinite;"></span></span>';
      }
      host.innerHTML = html;
    };

    const frame = () => {
      const rect = cine.getBoundingClientRect();
      const total = cine.offsetHeight - window.innerHeight;
      let P = total > 0 ? -rect.top / total : 0;
      P = clamp(P);

      cx += (mx - cx) * 0.06;
      cy += (my - cy) * 0.06;
      const tt = (typeof performance !== "undefined" ? performance.now() : 0) / 1000;
      const bX = reduce ? 0 : Math.sin(tt * 0.16) * 0.55;
      const bY = reduce ? 0 : Math.cos(tt * 0.12) * 0.45;
      const bT = reduce ? 0 : Math.sin(tt * 0.2) * 5;
      if (world)
        world.style.transform =
          "rotateX(" +
          (-cy * 2.0 + bY).toFixed(3) +
          "deg) rotateY(" +
          (cx * 2.0 + bX).toFixed(3) +
          "deg) translate3d(" +
          (cx * 8).toFixed(2) +
          "px," +
          (cy * 8 + bT).toFixed(2) +
          "px,0)";
      if (fx)
        fx.style.transform =
          "translate3d(" + (cx * 28).toFixed(2) + "px," + (cy * 24).toFixed(2) + "px,0)";
      if (textWrap)
        textWrap.style.transform =
          "translate3d(" + (cx * -8).toFixed(2) + "px," + (cy * -8).toFixed(2) + "px,0)";

      const segW = 1 / (N - 1);
      for (let i = 0; i < N; i++) {
        const c = i / (N - 1);
        const rel = (P - c) / segW;

        const layer = layers[i];
        const a = Math.abs(rel);
        let op = clamp(1 - (a - 0.28) / 0.5);
        op = op * op * (3 - 2 * op);
        const blur = touch ? 0 : clamp(a / 0.7) * 5.5;
        const scale = 1.05 + 0.075 * clamp((rel + 0.85) / 1.7);
        const tx = rel * 5;
        const ty = rel * -7;
        if (layer) {
          layer.style.opacity = op.toFixed(3);
          layer.style.transform = reduce
            ? "none"
            : "translate3d(" +
              tx.toFixed(1) +
              "px," +
              ty.toFixed(1) +
              "px,0) scale(" +
              scale.toFixed(4) +
              ")";
          layer.style.filter =
            !reduce && blur > 0.05 && op > 0.02 ? "blur(" + blur.toFixed(2) + "px)" : "none";
        }

        const tOp = ease(clamp(1 - Math.abs(rel) / 0.62));
        const seg = segs[i];
        if (seg) {
          seg.style.opacity = tOp.toFixed(3);
          seg.style.pointerEvents = tOp > 0.5 ? "auto" : "none";
        }

        const sw = stairWords[i];
        if (sw && !reduce) {
          sw.style.transform =
            "translate(-50%,-50%) translate3d(" +
            (rel * 90).toFixed(1) +
            "px," +
            (rel * -26).toFixed(1) +
            "px,0) scale(" +
            (1.12 - rel * 0.1).toFixed(3) +
            ")";
        }

        if (i > 0) {
          const lines = segLines[i];
          for (let li = 0; li < lines.length; li++) {
            const ln = lines[li];
            if (reduce) {
              ln.style.opacity = tOp.toFixed(3);
              ln.style.transform = "none";
              ln.style.filter = "none";
              continue;
            }
            const dir = (i + li) % 2 === 0 ? -1 : 1;
            const lp = easeOut(clamp(1 - (Math.abs(rel) + li * 0.13) / 0.6));
            const inv = 1 - lp;
            const enterX = inv * dir * 150;
            const enterRot = inv * dir * 4.2;
            const driftX = rel * (li === 0 ? -46 : 60) * lp;
            const floatY = Math.sin(tt * 0.55 + i * 1.3 + li * 0.9) * 4 * lp;
            const lblur = inv * 9;
            ln.style.opacity = lp.toFixed(3);
            ln.style.transform =
              "translate3d(" +
              (enterX + driftX).toFixed(1) +
              "px," +
              floatY.toFixed(1) +
              "px,0) rotate(" +
              enterRot.toFixed(2) +
              "deg)";
            ln.style.filter = lblur > 0.05 ? "blur(" + lblur.toFixed(2) + "px)" : "none";
          }
        }
      }

      if (leak && !reduce) {
        const f = P * (N - 1);
        const frac = f - Math.floor(f);
        let lk = 1 - Math.abs(frac - 0.5) * 2;
        lk = ease(clamp(lk));
        const sweep = (frac - 0.5) * 150;
        leak.style.opacity = (lk * 0.55).toFixed(3);
        leak.style.transform =
          "translate3d(" +
          (40 + sweep).toFixed(1) +
          "%,0,0) rotate(" +
          (4 + lk * 3).toFixed(1) +
          "deg)";
      }

      const b = clamp(P / 0.72);
      if (overlay) overlay.style.opacity = (0.44 * (1 - b) + 0.04).toFixed(3);

      if (hud && hudFill && hudWord && hudNum) {
        const hudOp = ease(clamp((P - 0.015) / 0.05)) * ease(clamp((0.99 - P) / 0.04));
        hud.style.opacity = hudOp.toFixed(3);
        hudFill.style.height = (P * 100).toFixed(1) + "%";
        const idx = Math.round(P * (N - 1));
        if (hudIdx !== idx) {
          hudIdx = idx;
          hudWord.textContent = words[idx] || "";
          hudNum.textContent = "0" + (idx + 1) + " / 08";
        }
      }
    };

    buildMotes();
    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    let onMove: ((e: PointerEvent) => void) | undefined;
    if (!touch) {
      onMove = (e: PointerEvent) => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    if (!reduce && !touch) {
      const lenis = new Lenis({
        duration: 1.4,
        smoothWheel: true,
        wheelMultiplier: 0.88,
        lerp: 0.072,
      });
      lenisRef.current = lenis;
      const loop = (t: number) => {
        lenis.raf(t);
        frame();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    } else {
      const loop = () => {
        frame();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    frame();

    // scroll-reveal for the content sections below the climb
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    items.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition =
        "opacity 0.95s cubic-bezier(0.22,0.61,0.36,1), transform 0.95s cubic-bezier(0.22,0.61,0.36,1)";
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const sibs = Array.from(
            el.parentElement?.querySelectorAll<HTMLElement>(":scope > .reveal") ?? [],
          );
          const idx = sibs.indexOf(el);
          el.style.transitionDelay = Math.max(0, idx) * 0.08 + "s";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          io.unobserve(el);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (onMove) window.removeEventListener("pointermove", onMove);
      io.disconnect();
      if (lenisRef.current) {
        try {
          lenisRef.current.destroy();
        } catch {
          /* noop */
        }
        lenisRef.current = null;
      }
    };
  }, []);

  function acceptInvite() {
    if (accepted) return;
    setAccepted(true);
    const target = rootRef.current?.querySelector<HTMLElement>("#basvur");
    setTimeout(() => {
      if (!target) return;
      if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: 0, duration: 1.6 });
      else
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY,
          behavior: "smooth",
        });
    }, 480);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const why = String(data.get("why") ?? "").trim();
    if (!name || !contact) return;
    setSending(true);
    const result = await onWaitlistSubmit({ name, contact, why });
    setSending(false);
    if (result === "duplicate") return void toast.error("Bu iletişim zaten kayıtlı.");
    if (result === "error") return void toast.error("Bir şeyler ters gitti. Lütfen tekrar dene.");
    setSubmitted(true);
  }

  const lnStyle: React.CSSProperties = {
    fontFamily: "'Archivo',sans-serif",
    fontWeight: 600,
    fontSize: "clamp(24px,3.7vw,50px)",
    lineHeight: 1.14,
    letterSpacing: "-0.012em",
    color: "#EAEEF1",
    textWrap: "balance",
  };
  const stairWordStyle: React.CSSProperties = {
    fontFamily: "'Anton',sans-serif",
    color: "rgba(230,235,238,0.045)",
    WebkitTextStroke: "1.2px rgba(233,238,241,0.2)",
    textShadow: "0 2px 30px rgba(7,10,14,0.45)",
    whiteSpace: "nowrap",
  };
  const eyebrowStyle: React.CSSProperties = {
    fontFamily: "'Space Mono',monospace",
    fontSize: 12,
    letterSpacing: "0.34em",
    textTransform: "uppercase",
    color: "#8593A0",
  };

  return (
    <div
      ref={rootRef}
      className="cine-landing"
      style={{ background: "#0B0F14", color: "#E6EBEE", fontFamily: "'Archivo',sans-serif" }}
    >
      {/* Discreet member access — the immersive page has no site header */}
      <Link
        to="/login"
        style={{
          position: "fixed",
          top: 22,
          right: 26,
          zIndex: 50,
          fontFamily: "'Space Mono',monospace",
          fontSize: 10,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(185,198,207,0.75)",
          textDecoration: "none",
          border: "1px solid rgba(230,235,238,0.22)",
          padding: "8px 16px",
          borderRadius: 999,
          backdropFilter: "blur(6px)",
        }}
      >
        giriş
      </Link>

      {/* ============ CINEMATIC PINNED CLIMB ============ */}
      <section
        className="cine-section"
        style={{ position: "relative", height: "1080vh", background: "#0B0F14" }}
      >
        <div
          className="cine-stage"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            background: "#070A0E",
            perspective: "1500px",
            perspectiveOrigin: "50% 45%",
          }}
        >
          <div
            className="cine-world"
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => (
              <div
                key={n}
                className="cine-layer"
                data-i={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: i === 0 ? 1 : 0,
                  backfaceVisibility: "hidden",
                  willChange: "transform,opacity,filter",
                }}
              >
                <img
                  className="cine-img"
                  src={`/landing/${n}.jpeg`}
                  decoding="async"
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transform: "scale(1)",
                  }}
                />
              </div>
            ))}

            {/* volumetric fog sheets */}
            <div
              style={{
                position: "absolute",
                inset: "-16%",
                transform: "translateZ(-230px)",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(60% 55% at 50% 46%, rgba(150,170,184,0.22), transparent 68%)",
                  filter: "blur(26px)",
                  animation: "cineFogA 28s ease-in-out infinite",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: "-22%",
                transform: "translateZ(-560px)",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "radial-gradient(64% 60% at 52% 50%, rgba(120,140,156,0.2), transparent 66%)",
                  filter: "blur(34px)",
                  animation: "cineFogB 34s ease-in-out infinite",
                }}
              />
            </div>

            <div
              className="motes"
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* ATMOSPHERE: god-ray */}
          <div
            className="cine-fx"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              willChange: "transform",
            }}
          >
            <div
              className="ray"
              style={{
                position: "absolute",
                top: "-22%",
                left: "50%",
                width: "62%",
                height: "120%",
                transform: "translateX(-50%)",
                background:
                  "radial-gradient(48% 60% at 50% 0%, rgba(220,234,242,0.5), rgba(185,198,207,0.14) 38%, transparent 66%)",
                mixBlendMode: "screen",
                filter: "blur(8px)",
                animation: "cineRayPulse 9s ease-in-out infinite",
              }}
            />
          </div>

          {/* mood / readability overlays */}
          <div
            className="bright-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: "#070A0E",
              opacity: 0.4,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(130% 120% at 50% 40%, transparent 48%, rgba(7,10,14,0.7) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "30%",
              pointerEvents: "none",
              background: "linear-gradient(to bottom, rgba(7,10,14,0.55), transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "58%",
              pointerEvents: "none",
              background:
                "linear-gradient(to top, rgba(7,10,14,0.94) 0%, rgba(7,10,14,0.5) 24%, transparent 50%)",
            }}
          />

          {/* LIGHT LEAK */}
          <div
            className="light-leak"
            style={{
              position: "absolute",
              top: "-30%",
              left: 0,
              width: "46%",
              height: "160%",
              pointerEvents: "none",
              opacity: 0,
              mixBlendMode: "screen",
              background:
                "linear-gradient(105deg, transparent 0%, rgba(150,178,196,0.16) 34%, rgba(214,230,238,0.5) 50%, rgba(150,178,196,0.16) 66%, transparent 100%)",
              filter: "blur(26px)",
              willChange: "transform,opacity",
            }}
          />

          {/* GRAIN */}
          <div
            className="grain"
            style={{
              position: "absolute",
              inset: "-14%",
              pointerEvents: "none",
              opacity: 0.07,
              mixBlendMode: "overlay",
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              backgroundSize: "200px 200px",
              animation: "cineGrainShift 1.4s steps(4) infinite",
            }}
          />

          {/* TEXT layers */}
          <div
            className="cine-text"
            style={{ position: "absolute", inset: 0, willChange: "transform" }}
          >
            {/* SEG 0 : HERO */}
            <div
              className="cine-seg"
              data-i={0}
              style={{ position: "absolute", inset: 0, opacity: 1, willChange: "opacity" }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 30,
                  left: 34,
                  ...eyebrowStyle,
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  animation: "cineHeroIn 1.4s 0.2s both cubic-bezier(0.22,0.61,0.36,1)",
                }}
              >
                DİSİPLİN · İNANÇ · KARDEŞLİK
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 30,
                  right: 34,
                  ...eyebrowStyle,
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  animation: "cineHeroIn 1.4s 0.3s both cubic-bezier(0.22,0.61,0.36,1)",
                }}
              >
                BECOME THE MAN
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: 34,
                  ...eyebrowStyle,
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  animation: "cineHeroIn 1.4s 0.4s both cubic-bezier(0.22,0.61,0.36,1)",
                }}
              >
                05:30 — OLUŞUM
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "0 20px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Anton',sans-serif",
                    fontSize: "clamp(120px,23vw,360px)",
                    lineHeight: 0.86,
                    letterSpacing: "0.01em",
                    color: "#F1F5F7",
                    textShadow: "0 18px 80px rgba(0,0,0,0.6)",
                    animation: "cineHeroIn 1.8s 0.45s both cubic-bezier(0.16,0.84,0.3,1)",
                  }}
                >
                  5.30
                </div>
                <div
                  style={{
                    marginTop: 26,
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "clamp(11px,1.4vw,15px)",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#B9C6CF",
                    animation: "cineHeroIn 1.6s 0.95s both cubic-bezier(0.22,0.61,0.36,1)",
                  }}
                >
                  Sıradan bir adamdan, sıra dışı bir adama.
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  animation: "cineHeroIn 1.6s 1.3s both ease",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 10,
                    letterSpacing: "0.42em",
                    textTransform: "uppercase",
                    color: "#8593A0",
                  }}
                >
                  AŞAĞI KAYDIR
                </div>
                <div
                  style={{
                    width: 11,
                    height: 11,
                    borderRight: "1.5px solid #8593A0",
                    borderBottom: "1.5px solid #8593A0",
                    transform: "rotate(45deg)",
                    animation: "cineScrollHint 2.4s ease-in-out infinite",
                  }}
                />
              </div>
            </div>

            {/* SEG 1 : Dipte */}
            <div
              className="cine-seg"
              data-i={1}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "0 24px 14vh",
              }}
            >
              <div style={{ maxWidth: 880, textAlign: "center" }}>
                <div className="ln" data-li={0} style={lnStyle}>
                  Bir yerde tıkandın.
                </div>
                <div className="ln" data-li={1} style={lnStyle}>
                  Önün uçurum, ardın boşluk.
                </div>
              </div>
            </div>

            {/* SEG 2 : Zorlanma */}
            <div
              className="cine-seg"
              data-i={2}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "0 24px 14vh",
              }}
            >
              <div
                className="stair-word"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "40%",
                  transform: "translate(-50%,-50%)",
                  ...stairWordStyle,
                  fontSize: "clamp(56px,13vw,190px)",
                  letterSpacing: "0.12em",
                }}
              >
                SABIR
              </div>
              <div style={{ maxWidth: 880, textAlign: "center", position: "relative" }}>
                <div className="ln" data-li={0} style={lnStyle}>
                  İlk adım en ağırıdır.
                </div>
                <div className="ln" data-li={1} style={lnStyle}>
                  Çünkü onu tek başına atarsın.
                </div>
              </div>
            </div>

            {/* SEG 3 : Ayaga kalkis */}
            <div
              className="cine-seg"
              data-i={3}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "0 24px 14vh",
              }}
            >
              <div
                className="stair-word"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "38%",
                  transform: "translate(-50%,-50%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "center",
                  ...stairWordStyle,
                  fontSize: "clamp(42px,9vw,134px)",
                  letterSpacing: "0.1em",
                  lineHeight: 0.95,
                }}
              >
                <span>DİSİPLİN</span>
                <span>AZİM</span>
              </div>
              <div style={{ maxWidth: 880, textAlign: "center", position: "relative" }}>
                <div className="ln" data-li={0} style={lnStyle}>
                  Sonra bir gün, “yeter” dersin.
                </div>
                <div className="ln" data-li={1} style={lnStyle}>
                  Ve doğrulursun.
                </div>
              </div>
            </div>

            {/* SEG 4 : Doruk guc */}
            <div
              className="cine-seg"
              data-i={4}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "0 24px 14vh",
              }}
            >
              <div
                className="stair-word"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "38%",
                  transform: "translate(-50%,-50%)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "center",
                  ...stairWordStyle,
                  fontSize: "clamp(40px,8vw,120px)",
                  letterSpacing: "0.08em",
                  lineHeight: 0.95,
                }}
              >
                <span>DÜRÜSTLÜK</span>
                <span>İNANÇ</span>
              </div>
              <div style={{ maxWidth: 900, textAlign: "center", position: "relative" }}>
                <div className="ln" data-li={0} style={lnStyle}>
                  Her basamak seni değiştirir.
                </div>
                <div className="ln" data-li={1} style={lnStyle}>
                  Çıkan adam, başlayan adam değildir.
                </div>
              </div>
            </div>

            {/* SEG 5 : Varis */}
            <div
              className="cine-seg"
              data-i={5}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "0 24px 14vh",
              }}
            >
              <div style={{ maxWidth: 880, textAlign: "center" }}>
                <div className="ln" data-li={0} style={lnStyle}>
                  Ve bir gün, zirveye varırsın.
                </div>
                <div className="ln" data-li={1} style={lnStyle}>
                  Artık o adam değilsin.
                </div>
              </div>
            </div>

            {/* SEG 6 : Kardeslik */}
            <div
              className="cine-seg"
              data-i={6}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "0 24px 14vh",
              }}
            >
              <div style={{ maxWidth: 940, textAlign: "center" }}>
                <div className="ln" data-li={0} style={lnStyle}>
                  Ama orada yalnız değilsin.
                </div>
                <div className="ln" data-li={1} style={lnStyle}>
                  Senin gibi uyanan, sözünü tutan kardeşlerin var.
                </div>
              </div>
            </div>

            {/* SEG 7 : Sira sende */}
            <div
              className="cine-seg"
              data-i={7}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 24px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(60% 50% at 50% 50%, rgba(7,10,14,0.55), transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", textAlign: "center", maxWidth: 1040 }}>
                <div
                  className="ln"
                  data-li={0}
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "clamp(12px,1.5vw,16px)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#B9C6CF",
                  }}
                >
                  Bu, bir adamın hikâyesiydi.
                </div>
                <div
                  className="ln"
                  data-li={1}
                  style={{
                    marginTop: 22,
                    fontFamily: "'Anton',sans-serif",
                    fontSize: "clamp(54px,11vw,156px)",
                    lineHeight: 0.92,
                    letterSpacing: "0.01em",
                    color: "#F1F5F7",
                    textShadow: "0 10px 60px rgba(0,0,0,0.55)",
                  }}
                >
                  Sıradaki sensin.
                </div>
              </div>
            </div>
          </div>

          {/* HUD */}
          <div
            className="cine-hud"
            style={{
              position: "absolute",
              right: 30,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              pointerEvents: "none",
              opacity: 0,
            }}
          >
            <div
              className="hud-word"
              style={{
                writingMode: "vertical-rl",
                fontFamily: "'Space Mono',monospace",
                fontSize: 11,
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: "#B9C6CF",
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <div
              style={{
                position: "relative",
                width: 2,
                height: 180,
                background: "rgba(230,235,238,0.14)",
              }}
            >
              <div
                className="hud-fill"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "0%",
                  background: "#E6EBEE",
                  willChange: "height",
                }}
              />
            </div>
            <div
              className="hud-num"
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "#8593A0",
                writingMode: "vertical-rl",
              }}
            >
              01 / 08
            </div>
          </div>
        </div>
      </section>

      {/* ============ BÖLÜM 8 — 5.30 NEDİR ============ */}
      <section
        className="reveal-sec"
        style={{
          position: "relative",
          background: "#0B0F14",
          padding: "clamp(110px,16vh,200px) 24px",
          borderTop: "1px solid rgba(230,235,238,0.10)",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="reveal" style={eyebrowStyle}>
            08 — SİSTEM
          </div>
          <div
            className="reveal"
            style={{
              marginTop: 18,
              fontFamily: "'Playfair Display',serif",
              fontStyle: "italic",
              fontSize: "clamp(20px,2.6vw,30px)",
              color: "#B9C6CF",
            }}
          >
            5.30 nedir?
          </div>
          <h2
            className="reveal"
            style={{
              margin: "14px 0 0",
              fontFamily: "'Archivo',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(34px,5.4vw,72px)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              color: "#E6EBEE",
              maxWidth: "16ch",
              textWrap: "balance",
            }}
          >
            5.30 bir motivasyon değil. Bir sistemdir.
          </h2>

          <div
            style={{
              marginTop: "clamp(56px,8vh,96px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 1,
              background: "rgba(230,235,238,0.10)",
              border: "1px solid rgba(230,235,238,0.10)",
            }}
          >
            {[
              { n: "01", t: "DİSİPLİN", d: "Sözünü tut, erken kalk." },
              { n: "02", t: "İNANÇ", d: "Kendinden büyük bir şeye bağlan." },
              { n: "03", t: "KARDEŞLİK", d: "Yalnız yürüme." },
            ].map((p) => (
              <div
                key={p.n}
                className="reveal"
                style={{ background: "#0B0F14", padding: "40px 34px" }}
              >
                <div
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 12,
                    letterSpacing: "0.28em",
                    color: "#8593A0",
                  }}
                >
                  {p.n}
                </div>
                <div
                  style={{
                    marginTop: 22,
                    fontFamily: "'Anton',sans-serif",
                    fontSize: "clamp(26px,3vw,36px)",
                    letterSpacing: "0.04em",
                    color: "#E6EBEE",
                  }}
                >
                  {p.t}
                </div>
                <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.6, color: "#8593A0" }}>
                  {p.d}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ marginTop: "clamp(56px,8vh,90px)" }}>
            <div style={eyebrowStyle}>NE ALIYORSUN</div>
            <div
              style={{
                marginTop: 26,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 14,
              }}
            >
              {[
                "5.30 protokolü",
                "Kardeşlik topluluğu",
                "Hesap verme sistemi",
                "Eğitim & görev takibi",
              ].map((t) => (
                <div
                  key={t}
                  style={{
                    border: "1px solid rgba(230,235,238,0.12)",
                    padding: "22px 22px",
                    fontSize: 17,
                    color: "#E6EBEE",
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ BÖLÜM 9 — ELEME ============ */}
      <section
        className="reveal-sec"
        style={{
          position: "relative",
          background: "#11161C",
          padding: "clamp(110px,16vh,200px) 24px",
          borderTop: "1px solid rgba(230,235,238,0.10)",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div className="reveal" style={eyebrowStyle}>
            09 — ELEME
          </div>
          <h2
            className="reveal"
            style={{
              margin: "18px 0 0",
              fontFamily: "'Archivo',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(34px,5.4vw,72px)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              color: "#E6EBEE",
            }}
          >
            Bu herkes için değil.
          </h2>

          <div
            style={{
              marginTop: "clamp(50px,7vh,84px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 48,
            }}
          >
            <div className="reveal">
              <div
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 12,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#B9C6CF",
                  paddingBottom: 18,
                  borderBottom: "1px solid rgba(230,235,238,0.16)",
                }}
              >
                İÇİN
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  "Sorumluluk alanlar.",
                  "Söz verip tutanlar.",
                  "Dibe vurmuş ama bırakmamış olanlar.",
                ].map((t, idx, arr) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "baseline",
                      padding: "20px 0",
                      borderBottom:
                        idx < arr.length - 1 ? "1px solid rgba(230,235,238,0.08)" : "none",
                    }}
                  >
                    <span style={{ fontFamily: "'Space Mono',monospace", color: "#B9C6CF" }}>
                      +
                    </span>
                    <span style={{ fontSize: "clamp(18px,2.2vw,24px)", color: "#E6EBEE" }}>
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal">
              <div
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 12,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#5b6772",
                  paddingBottom: 18,
                  borderBottom: "1px solid rgba(230,235,238,0.10)",
                }}
              >
                İÇİN DEĞİL
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  "Bahane arayanlar.",
                  "İlk zorlukta kaçanlar.",
                  "Kalabalıkta kaybolmak isteyenler.",
                ].map((t, idx, arr) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "baseline",
                      padding: "20px 0",
                      borderBottom:
                        idx < arr.length - 1 ? "1px solid rgba(230,235,238,0.05)" : "none",
                    }}
                  >
                    <span style={{ fontFamily: "'Space Mono',monospace", color: "#5b6772" }}>
                      —
                    </span>
                    <span style={{ fontSize: "clamp(18px,2.2vw,24px)", color: "#5b6772" }}>
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BÖLÜM 10 — DAVET ============ */}
      <section
        className="reveal-sec"
        style={{
          position: "relative",
          background: "#0B0F14",
          padding: "clamp(110px,16vh,210px) 24px",
          borderTop: "1px solid rgba(230,235,238,0.10)",
          overflow: "hidden",
        }}
      >
        <div
          className="reveal"
          style={{
            maxWidth: 680,
            margin: "0 auto",
            position: "relative",
            background: "linear-gradient(180deg,#12171E,#0E1318)",
            border: "1px solid rgba(230,235,238,0.14)",
            padding: "clamp(44px,7vw,80px) clamp(28px,6vw,72px)",
            textAlign: "center",
            boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 10,
              border: "1px solid rgba(230,235,238,0.06)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 11,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#8593A0",
            }}
          >
            10 — DAVET
          </div>
          <h2
            style={{
              margin: "26px 0 0",
              fontFamily: "'Anton',sans-serif",
              fontSize: "clamp(38px,6.5vw,68px)",
              lineHeight: 0.98,
              letterSpacing: "0.01em",
              color: "#E6EBEE",
            }}
          >
            5.30'a davet edildin.
          </h2>
          <p
            style={{
              margin: "26px auto 0",
              maxWidth: "30ch",
              fontFamily: "'Playfair Display',serif",
              fontStyle: "italic",
              fontSize: "clamp(18px,2.4vw,26px)",
              lineHeight: 1.4,
              color: "#B9C6CF",
            }}
          >
            Kalabalığa değil — kendine hesap veren bir hayata.
          </p>
          <button
            type="button"
            className="cine-btn"
            onClick={acceptInvite}
            disabled={accepted}
            style={{
              marginTop: 40,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "20px 40px",
              border: "none",
              cursor: accepted ? "default" : "pointer",
              background: "#E6EBEE",
              color: "#0B0F14",
              fontFamily: "'Space Mono',monospace",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {accepted ? "DAVET KABUL EDİLDİ ✓" : "DAVETİ KABUL ET"}
          </button>
        </div>
      </section>

      {/* ============ BÖLÜM 11 — BAŞVUR ============ */}
      <section
        id="basvur"
        style={{
          position: "relative",
          background: "#0B0F14",
          padding: "clamp(110px,16vh,210px) 24px clamp(70px,10vh,120px)",
          borderTop: "1px solid rgba(230,235,238,0.10)",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div className="reveal" style={{ ...eyebrowStyle, textAlign: "center" }}>
            11 — BAŞVUR
          </div>

          {!submitted ? (
            <>
              <h2
                className="reveal"
                style={{
                  margin: "18px 0 0",
                  fontFamily: "'Archivo',sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(30px,4.6vw,52px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "#E6EBEE",
                  textAlign: "center",
                }}
              >
                Kardeşliğe başvur.
              </h2>
              <form
                onSubmit={handleSubmit}
                style={{
                  marginTop: "clamp(44px,6vh,72px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 36,
                }}
              >
                <label
                  className="reveal"
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 11,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "#8593A0",
                    }}
                  >
                    Ad Soyad
                  </span>
                  <input name="name" required autoComplete="name" style={fieldStyle} />
                </label>
                <label
                  className="reveal"
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 11,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "#8593A0",
                    }}
                  >
                    İletişim — e-posta veya Instagram
                  </span>
                  <input name="contact" required style={fieldStyle} />
                </label>
                <label
                  className="reveal"
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 11,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "#8593A0",
                    }}
                  >
                    Neden buradasın?
                  </span>
                  <textarea
                    name="why"
                    rows={3}
                    style={{ ...fieldStyle, resize: "none", lineHeight: 1.5 }}
                  />
                </label>
                <button
                  type="submit"
                  className="cine-btn reveal"
                  disabled={sending}
                  style={{
                    marginTop: 8,
                    alignSelf: "flex-start",
                    padding: "20px 46px",
                    border: "none",
                    cursor: sending ? "default" : "pointer",
                    background: "#E6EBEE",
                    color: "#0B0F14",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                  }}
                >
                  {sending ? "GÖNDERİLİYOR…" : "BAŞVUR"}
                </button>
              </form>
            </>
          ) : (
            <div
              style={{
                marginTop: 48,
                textAlign: "center",
                padding: "60px 24px",
                border: "1px solid rgba(230,235,238,0.14)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Anton',sans-serif",
                  fontSize: "clamp(40px,7vw,72px)",
                  color: "#E6EBEE",
                }}
              >
                5.30
              </div>
              <p
                style={{
                  margin: "28px auto 0",
                  maxWidth: "26ch",
                  fontFamily: "'Archivo',sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(20px,2.6vw,28px)",
                  lineHeight: 1.4,
                  color: "#E6EBEE",
                  textWrap: "balance",
                }}
              >
                Başvurun alındı.
                <br />
                Kardeşliğe bir adım daha yakınsın.
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "clamp(70px,12vh,130px)",
            textAlign: "center",
            fontFamily: "'Space Mono',monospace",
            fontSize: 11,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "#5b6772",
          }}
        >
          5.30 — DİSİPLİN · İNANÇ · KARDEŞLİK
        </div>
      </section>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(230,235,238,0.22)",
  padding: "12px 2px",
  fontFamily: "'Archivo',sans-serif",
  fontSize: 20,
  color: "#E6EBEE",
  transition: "border-color .3s ease",
};
