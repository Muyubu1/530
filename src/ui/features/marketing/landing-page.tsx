import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Reveal,
  InkReveal,
  HandDrawnFrame,
  CinematicVideoFrame,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/design-system";
import type { WaitlistData, WaitlistResult } from "@/ui/shared/waitlist-form";

const N = 8;
const WORDS = ["", "DİPTE", "SABIR", "AZİM", "İNANÇ", "VARIŞ", "BİRLİK", "SIRA SENDE"];

// WhatsApp doğrudan mesaj — ŞİMDİLİK KAPALI. Açmak için bu 2 sabiti + aşağıdaki <a> butonunu yorumdan çıkar.
// Gerçek numarayla değiştir (uluslararası, + ve boşluk yok, örn. 905XXXXXXXXX)
// const WHATSAPP_NUMBER = "905555555555";
// const WHATSAPP_TEXT = "Merhaba, 5.30 hakkında bilgi almak istiyorum.";
// Pacing: a lead hold on the hero, one "beat" of scroll-time per image, trailing hold for the
// finale. BEAT spaces the story beats so each caption gets a clean, non-overlapping window.
const BEAT = 1.25;
const HOLD_LEAD = 0.6;
const HOLD_TAIL = 0.9;
const center = (i: number) => HOLD_LEAD + i * BEAT; // beat-time at which image i is sharp & centered
const TOTAL = HOLD_LEAD + (N - 1) * BEAT + HOLD_TAIL;

/**
 * The marketing landing — an immersive, scroll-driven cinematic climb followed
 * by the system / elimination / invite / application sections.
 *
 * The climb is one pinned GSAP timeline driven by ScrollTrigger (scrub): a
 * continuous camera dolly through 8 image planes with long overlapping
 * cross-dissolves, per-frame Ken Burns, layered parallax, a colour grade that
 * warms toward the summit, and synced light-leaks. Lenis drives smooth scroll
 * via the GSAP ticker. Motion degrades gracefully (touch / reduced-motion)
 * through gsap.matchMedia.
 */
export function LandingPage({
  onWaitlistSubmit,
}: {
  onWaitlistSubmit: (data: WaitlistData) => Promise<WaitlistResult>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      gsap.registerPlugin(ScrollTrigger, useGSAP);

      const q = gsap.utils.selector(root);
      const layers = gsap.utils.toArray<HTMLElement>(q(".cine-layer"));
      const imgs = gsap.utils.toArray<HTMLElement>(q(".cine-img"));
      const segs = gsap.utils.toArray<HTMLElement>(q(".cine-seg"));
      const hudFill = q(".hud-fill")[0] as HTMLElement | undefined;
      const hud = q(".cine-hud")[0] as HTMLElement | undefined;
      const hudWord = q(".hud-word")[0] as HTMLElement | undefined;
      const hudNum = q(".hud-num")[0] as HTMLElement | undefined;
      const leak = q(".light-leak")[0] as HTMLElement | undefined;
      const bright = q(".bright-overlay")[0] as HTMLElement | undefined;
      const warm = q(".cine-grade-warm")[0] as HTMLElement | undefined;
      const world = q(".cine-world")[0] as HTMLElement | undefined;
      const fx = q(".cine-fx")[0] as HTMLElement | undefined;
      const textWrap = q(".cine-text")[0] as HTMLElement | undefined;

      const clamp01 = gsap.utils.clamp(0, 1);

      /** HUD chapter / progress — discrete word + fill, driven from scroll progress. */
      let hudIdx = -1;
      const updateHud = (p: number) => {
        if (hudFill) hudFill.style.height = (p * 100).toFixed(1) + "%";
        if (hud) {
          const inA = clamp01((p - 0.015) / 0.05);
          const outA = clamp01((0.99 - p) / 0.04);
          hud.style.opacity = (inA * outA).toFixed(3);
        }
        const idx = Math.round(p * (N - 1));
        if (idx !== hudIdx && hudWord && hudNum) {
          hudIdx = idx;
          hudWord.textContent = WORDS[idx] || "";
          hudNum.textContent = "0" + (idx + 1) + " / 0" + N;
        }
      };

      /**
       * Build the pinned climb timeline. `motion` controls fidelity:
       *  full   → dolly + Ken Burns + blur + parallax + leak + grade
       *  lite   → dolly + crossfade + grade (no blur/parallax/leak, touch)
       *  reduced→ plain opacity cross-dissolves only
       */
      const buildClimb = (motion: "full" | "lite" | "reduced", vhPerBeat: number) => {
        const rich = motion !== "reduced";
        const heavy = motion === "full";

        // Initial states (also what no-JS users see is the SSR markup; set before paint).
        // Segment containers stay visible; their LINES carry visibility so only one caption
        // is ever readable at a time (no cross-segment text collision during transitions).
        layers.forEach((l, i) => gsap.set(l, { opacity: i === 0 ? 1 : 0 }));
        segs.forEach((s, i) => {
          if (i === 0) return;
          gsap.set(s, { opacity: 1 });
          gsap.set(s.querySelectorAll(".ln"), { opacity: 0 });
          const sw = s.querySelector(".stair-word");
          if (sw) gsap.set(sw, { opacity: 0 });
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".cine-section",
            start: "top top",
            // beat-normalised length → consistent, comfortable pace regardless of beat spacing
            end: () => "+=" + Math.round(TOTAL * vhPerBeat * window.innerHeight),
            // Pin the SECTION itself (not the inner stage): ScrollTrigger then adds a correct
            // pin-spacer at the root so the content sections below are pushed past the whole
            // climb — otherwise the section's fixed 100vh clips the spacer and content paints
            // over the pinned stage (wrong order + "fast" tail).
            pin: true,
            anticipatePin: 1,
            scrub: heavy ? 0.8 : 0.9,
            invalidateOnRefresh: true,
            onUpdate: (self) => updateHud(self.progress),
          },
        });

        // ── Continuous camera dolly — never resets across the whole climb. ──
        if (rich && world) {
          tl.fromTo(
            world,
            { scale: 1.06, yPercent: 2 },
            { scale: heavy ? 1.34 : 1.24, yPercent: -3, duration: TOTAL },
            0,
          );
        }

        // ── Colour grade: cold/dark at the base → brighter, warmer at the summit. ──
        if (bright) tl.fromTo(bright, { opacity: 0.42 }, { opacity: 0.05, duration: TOTAL }, 0);
        if (rich && warm) tl.fromTo(warm, { opacity: 0 }, { opacity: 0.22, duration: TOTAL }, 0);

        // ── Per-image cross-dissolve with push-through (the anti-slideshow core). ──
        layers.forEach((layer, i) => {
          const t = center(i);
          if (i > 0) {
            // rushes toward camera, settles sharp
            tl.fromTo(
              layer,
              {
                opacity: 0,
                scale: heavy ? 1.18 : 1.1,
                yPercent: rich ? 3 : 0,
                filter: heavy ? "blur(14px)" : "blur(0px)",
              },
              {
                opacity: 1,
                scale: heavy ? 1.06 : 1.04,
                yPercent: 0,
                filter: "blur(0px)",
                duration: 0.7,
                ease: rich ? "power2.out" : "none",
              },
              t - 0.7,
            );
          }
          if (i < N - 1) {
            // keeps moving + blurs out as the next plane arrives (overlap ≈ 0.7 beat)
            tl.to(
              layer,
              {
                opacity: 0,
                scale: heavy ? 1.24 : 1.12,
                yPercent: rich ? -5 : 0,
                filter: heavy ? "blur(18px)" : "blur(0px)",
                duration: 0.9,
                ease: rich ? "power2.in" : "none",
              },
              t + 0.25,
            );
          }
        });

        // ── Per-frame Ken Burns — held frames stay alive (ambient, infinite). ──
        if (heavy) {
          imgs.forEach((img, i) => {
            gsap.to(img, {
              scale: 1.08,
              xPercent: i % 2 ? -2.5 : 2.5,
              yPercent: i % 2 ? 2 : -2,
              duration: 16 + i,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
          });
        }

        // ── Text segments — SEQUENTIAL captions. The lines (not the seg container) carry
        //    visibility, and each caption fully clears before the next enters, so two
        //    captions never overlap. Image cross-dissolves still overlap (cinematic). ──
        segs.forEach((seg, i) => {
          if (i === 0) {
            // hero handled by CSS entrance; just dissolve it out as the climb begins
            tl.to(seg, { opacity: 0, duration: 0.5, ease: "power2.in" }, center(0) + 0.45);
            return;
          }
          const t = center(i);
          const lines = gsap.utils.toArray<HTMLElement>(seg.querySelectorAll(".ln"));
          // lines flow in (blur + scale + slide from alternating sides)
          lines.forEach((ln, li) => {
            const dir = (i + li) % 2 === 0 ? -1 : 1;
            tl.fromTo(
              ln,
              {
                opacity: 0,
                xPercent: rich ? dir * 24 : 0,
                yPercent: rich ? 16 : 0,
                scale: rich ? 0.965 : 1,
                filter: heavy ? "blur(10px)" : "blur(0px)",
              },
              {
                opacity: 1,
                xPercent: 0,
                yPercent: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.5,
                ease: rich ? "expo.out" : "none",
              },
              t - 0.42 + li * 0.06,
            );
          });
          // lines clear (opacity only — no drift into the neighbour) before the next caption
          if (i < N - 1) {
            lines.forEach((ln) => {
              tl.to(
                ln,
                {
                  opacity: 0,
                  filter: heavy ? "blur(6px)" : "blur(0px)",
                  duration: 0.22,
                  ease: "power2.in",
                },
                t + 0.42,
              );
            });
          }

          // giant stair-word: fades in with the caption, drifts past, clears with it
          if (heavy) {
            const sw = seg.querySelector<HTMLElement>(".stair-word");
            if (sw) {
              tl.fromTo(
                sw,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: "power1.out" },
                t - 0.5,
              );
              tl.fromTo(
                sw,
                { xPercent: 8, scale: 1.14 },
                { xPercent: -8, scale: 1.04, duration: 1.05, ease: "none" },
                t - 0.5,
              );
              if (i < N - 1) tl.to(sw, { opacity: 0, duration: 0.25, ease: "power1.in" }, t + 0.42);
            }
          }
        });

        // ── Light-leak flares at each transition midpoint, sweeping across. ──
        if (heavy && leak) {
          for (let j = 0; j < N - 1; j++) {
            const mid = (center(j) + center(j + 1)) / 2;
            tl.fromTo(
              leak,
              { opacity: 0, xPercent: -30, rotate: 2 },
              { opacity: 0.5, xPercent: 8, rotate: 5, duration: 0.35, ease: "power1.in" },
              mid - 0.35,
            ).to(leak, { opacity: 0, xPercent: 42, duration: 0.4, ease: "power1.out" }, mid);
          }
        }

        updateHud(0);
        return tl;
      };

      // ── Responsive / accessible fidelity tiers ──────────────────────────────
      const mm = gsap.matchMedia(root);

      mm.add("(prefers-reduced-motion: reduce)", () => {
        buildClimb("reduced", 1.2);
      });

      mm.add("(min-width: 760px) and (prefers-reduced-motion: no-preference)", () => {
        buildClimb("full", 1.3);

        // Lenis smooth scroll, driven by the GSAP ticker (single rAF source).
        const lenis = new Lenis({
          duration: 1.1,
          smoothWheel: true,
          wheelMultiplier: 1.0,
          lerp: 0.1,
        });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        // Pointer parallax — buttery micro-motion layered over the scroll dolly.
        const setWorldRX = world
          ? gsap.quickTo(world, "rotationX", { duration: 0.8, ease: "power3" })
          : null;
        const setWorldRY = world
          ? gsap.quickTo(world, "rotationY", { duration: 0.8, ease: "power3" })
          : null;
        const setFxX = fx ? gsap.quickTo(fx, "xPercent", { duration: 0.9, ease: "power3" }) : null;
        const setFxY = fx ? gsap.quickTo(fx, "yPercent", { duration: 0.9, ease: "power3" }) : null;
        const setTxtX = textWrap
          ? gsap.quickTo(textWrap, "xPercent", { duration: 1, ease: "power3" })
          : null;
        const onMove = (e: PointerEvent) => {
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          setWorldRY?.(nx * 2.2);
          setWorldRX?.(-ny * 2.0);
          setFxX?.(nx * 2.4);
          setFxY?.(ny * 2.0);
          setTxtX?.(nx * -1.2);
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        // Subtle 3D tilt on the invite card.
        const card = root.querySelector<HTMLElement>(".cine-invite-card");
        let cardMove: ((e: PointerEvent) => void) | undefined;
        let cardLeave: (() => void) | undefined;
        if (card) {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
          cardMove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
            ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          };
          cardLeave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", cardMove);
          card.addEventListener("pointerleave", cardLeave);
          gsap.set(card, { transformPerspective: 900 });
        }

        return () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          lenisRef.current = null;
          window.removeEventListener("pointermove", onMove);
          if (card && cardMove) card.removeEventListener("pointermove", cardMove);
          if (card && cardLeave) card.removeEventListener("pointerleave", cardLeave);
        };
      });

      mm.add("(max-width: 759px) and (prefers-reduced-motion: no-preference)", () => {
        buildClimb("lite", 1.0);
      });

      // ── Lower sections: gentle background parallax via scrubbed ScrollTriggers. ──
      gsap.utils.toArray<HTMLElement>(q(".parallax-slow")).forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      // Hairlines draw in under section eyebrows.
      gsap.utils.toArray<HTMLElement>(q(".hairline")).forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });

      // Hand-drawn invite frame: set up HERE (same context as the pin) so its position is
      // measured against the pin-spacer correctly. A sibling-owned ScrollTrigger mis-fires
      // (draws early) under the pinned climb above. Triggers on the section (a stable block,
      // not the absolute SVG); scrubbed so it draws as you arrive and un-draws on scroll back.
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const framePath = gsap.utils.toArray<SVGPathElement>(q(".frame-path"))[0];
      const frameGlow = gsap.utils.toArray<SVGPathElement>(q(".frame-glow"))[0];
      const frameSection = framePath?.closest("section");
      if (framePath && frameSection) {
        if (reducedMotion) {
          gsap.set(framePath, { strokeDashoffset: 0 });
          if (frameGlow) gsap.set(frameGlow, { opacity: 0 });
        } else {
          gsap.set(framePath, { strokeDashoffset: 1 });
          // Wide scroll window → slow, deliberate draw. A bright dash (frameGlow) rides the
          // tip with a bloom, fading in at the start and out as the line completes.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: frameSection,
              start: "top 62%",
              end: "center 36%",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(
            framePath,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, ease: "none", duration: 1 },
            0,
          );
          if (frameGlow) {
            // dashoffset 0.06 → -0.94 keeps the bright 6% segment sitting on the drawn tip.
            tl.fromTo(
              frameGlow,
              { strokeDashoffset: 0.06 },
              { strokeDashoffset: -0.94, ease: "none", duration: 1 },
              0,
            );
            tl.fromTo(frameGlow, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.08 }, 0);
            tl.to(frameGlow, { opacity: 0, ease: "none", duration: 0.12 }, 0.88);
          }
        }
      }

      // Recompute pin-spacing / start-end once layout (fonts, images) has settled.
      ScrollTrigger.refresh();
    },
    { scope: rootRef },
  );

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
    if (result === "error") return void toast.error("Bir şeyler ters gitti. Tekrar dene.");
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
    willChange: "transform,opacity,filter",
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
          top: 64,
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

      {/* Floating WhatsApp FAB — ŞİMDİLİK KAPALI. Açmak için bu yorumu kaldır (+ üstteki WHATSAPP_* sabitleri).
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp'tan yaz"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 40,
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 999,
          background: "#25D366",
          color: "#fff",
          boxShadow: "0 10px 30px -6px rgba(37,211,102,0.55), 0 4px 14px rgba(0,0,0,0.35)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.07)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
      */}

      {/* ============ CINEMATIC PINNED CLIMB ============ */}
      <section
        className="cine-section"
        style={{ position: "relative", height: "100vh", background: "#0B0F14" }}
      >
        <div
          className="cine-stage"
          style={{
            position: "relative",
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
              filter: "contrast(1.08) saturate(0.86) brightness(0.97)",
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
                  src={`/landing/${n}.webp`}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "auto"}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    // 5.jpeg (seg 4) is framed low — pull it up so the man's head shows
                    objectPosition: n === 5 ? "center 22%" : "center",
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

          {/* colour grade + readability overlays */}
          <div
            className="bright-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: "#070A0E",
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />
          <div
            className="cine-grade-warm"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              pointerEvents: "none",
              mixBlendMode: "soft-light",
              background:
                "radial-gradient(120% 90% at 50% 18%, rgba(255,226,180,0.5), rgba(214,180,140,0.12) 45%, transparent 72%)",
            }}
          />
          <div
            className="cine-vignette"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(125% 115% at 50% 42%, transparent 44%, rgba(7,10,14,0.78) 100%)",
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
                DİSİPLİN · İNANÇ · BİRLİK
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
                  Aynada gördüğünüz kişiye
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
                  aşık olmaya hazır mısınız?
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
                  Sadece 28 günde,
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
                  aynada gördüğünüz adama
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
                  aşık olacaksınız.
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
            ></div>

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
                    marginTop: 22,
                    fontFamily: "'Anton',sans-serif",
                    fontSize: "clamp(54px,11vw,156px)",
                    lineHeight: 0.92,
                    letterSpacing: "0.01em",
                    color: "#F1F5F7",
                    textShadow: "0 10px 60px rgba(0,0,0,0.55)",
                    willChange: "transform,opacity,filter",
                  }}
                >
                  Sıra sende.
                </div>
              </div>
            </div>
          </div>

          {/* INK REVEAL — dark discovery veil over the whole climb; the hand carves it open */}
          <InkReveal style={{ zIndex: 30 }} />

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
          overflow: "hidden",
        }}
      >
        <div className="parallax-slow" style={sectionGhost}>
          09
        </div>
        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal variant="fade-down" style={eyebrowStyle}>
            09 — SİSTEM
          </Reveal>
          <div className="hairline" style={hairlineStyle} />
          <Reveal
            variant="blur-in"
            delay={80}
            style={{
              marginTop: 18,
              fontFamily: "'Playfair Display',serif",
              fontStyle: "italic",
              fontSize: "clamp(20px,2.6vw,30px)",
              color: "#B9C6CF",
            }}
          >
            5.30 nedir?
          </Reveal>
          <Reveal
            variant="letter-rise"
            delay={140}
            as="h2"
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
          </Reveal>

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
              { n: "01", t: "DİSİPLİN", d: "Sözünü tut. Erken kalk." },
              { n: "02", t: "İNANÇ", d: "Kendinden büyüğüne bağlan." },
              { n: "03", t: "BİRLİK", d: "Yalnız yürüme." },
            ].map((p, i) => (
              <Reveal
                key={p.n}
                variant="fade-up"
                delay={i * 110}
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BÖLÜM 10 — PROGRAM (video) ============ */}
      <section
        className="reveal-sec"
        style={{
          position: "relative",
          background: "#11161C",
          padding: "clamp(110px,16vh,200px) 24px",
          borderTop: "1px solid rgba(230,235,238,0.10)",
          overflow: "hidden",
        }}
      >
        <div className="parallax-slow" style={sectionGhost}>
          10
        </div>
        <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal variant="fade-down" style={eyebrowStyle}>
            10 — PROGRAM
          </Reveal>
          <div className="hairline" style={hairlineStyle} />
          <Reveal
            variant="letter-rise"
            delay={120}
            as="h2"
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
            28 günlük yolculuk.
          </Reveal>
          <Reveal variant="fade-up" delay={120} style={{ marginTop: "clamp(44px,7vh,80px)" }}>
            <CinematicVideoFrame
              src="/media/p28-1a7ab4.mp4"
              poster="/media/p28-poster.jpg"
              caption="28 günlük program · önizleme"
            />
          </Reveal>
        </div>
      </section>

      {/* ============ BÖLÜM 11 — KİM İÇİN ============ */}
      <section
        className="reveal-sec"
        style={{
          position: "relative",
          background: "#0B0F14",
          padding: "clamp(110px,16vh,200px) 24px",
          borderTop: "1px solid rgba(230,235,238,0.10)",
          overflow: "hidden",
        }}
      >
        <div className="parallax-slow" style={sectionGhost}>
          11
        </div>
        <div style={{ maxWidth: 980, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Reveal variant="fade-down" style={eyebrowStyle}>
            11 — KİM İÇİN
          </Reveal>
          <div className="hairline" style={hairlineStyle} />

          <div
            style={{
              marginTop: "clamp(44px,7vh,84px)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(22px,3.4vh,40px)",
            }}
          >
            {[
              "Aynada gördüğüm kişiye aşık olmak istiyorum diyenler…",
              "Kendime verdiğim sözleri tutmak istiyorum diyenler…",
              "Hayatımı yoluna koymak istiyorum diyenler…",
              "Değişim yolunda, daha önceden yürümüş birine ihtiyacım var diyenler…",
            ].map((line, i) => (
              <Reveal
                key={line}
                variant="fade-up"
                delay={i * 110}
                style={{ display: "flex", gap: 18, alignItems: "baseline" }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "clamp(13px,1.6vw,18px)",
                    color: "#8593A0",
                    flexShrink: 0,
                  }}
                >
                  —
                </span>
                <span
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontStyle: "italic",
                    fontSize: "clamp(21px,3.1vw,38px)",
                    lineHeight: 1.3,
                    color: "#E6EBEE",
                    textWrap: "balance",
                  }}
                >
                  {line}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal
            variant="letter-rise"
            delay={120}
            as="p"
            style={{
              margin: "clamp(48px,7vh,84px) 0 0",
              fontFamily: "'Anton',sans-serif",
              fontSize: "clamp(30px,5vw,60px)",
              lineHeight: 1.02,
              letterSpacing: "0.01em",
              color: "#E6EBEE",
            }}
          >
            Bu program size göredir.
          </Reveal>
        </div>
      </section>

      {/* ============ BÖLÜM 12 — DAVET ============ */}
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
        {/* Hand-drawn circle framing the invite — drawn by the main useGSAP (see .frame-path) */}
        <HandDrawnFrame
          shape="circle"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "min(94vw, 980px)",
            zIndex: 0,
          }}
        />

        <Reveal
          variant="scale-in"
          style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", padding: "clamp(20px,5vh,56px) 0" }}>
            <div
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 11,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#8593A0",
              }}
            >
              12 — DAVET
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
              Kalabalığa değil. Kendine.
            </p>

            {/* "Daveti kabul et" → başvuru popup'ı */}
            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="cine-btn"
                  style={{
                    marginTop: 40,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    padding: "20px 40px",
                    border: "none",
                    cursor: "pointer",
                    background: "#E6EBEE",
                    color: "#0B0F14",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                  }}
                >
                  DAVETİ KABUL ET
                </button>
              </DialogTrigger>
              <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-md">
                {!submitted ? (
                  <>
                    <DialogHeader>
                      <DialogTitle
                        style={{
                          fontFamily: "'Archivo',sans-serif",
                          fontWeight: 800,
                          fontSize: "clamp(24px,3vw,32px)",
                          letterSpacing: "-0.02em",
                          color: "#E6EBEE",
                        }}
                      >
                        Birliğe başvur.
                      </DialogTitle>
                      <DialogDescription
                        style={{
                          fontFamily: "'Space Mono',monospace",
                          fontSize: 11,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "#8593A0",
                        }}
                      >
                        Birkaç soru. Sonra konuşuruz.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={handleSubmit}
                      style={{
                        marginTop: 18,
                        display: "flex",
                        flexDirection: "column",
                        gap: 22,
                        textAlign: "left",
                      }}
                    >
                      <label style={dialogFieldWrap}>
                        <span style={dialogFieldLabel}>Ad Soyad</span>
                        <input
                          className="cine-field"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          placeholder="Ad Soyad"
                          style={fieldStyle}
                        />
                      </label>
                      <label style={dialogFieldWrap}>
                        <span style={dialogFieldLabel}>Telefon</span>
                        <input
                          className="cine-field"
                          name="contact"
                          type="tel"
                          required
                          autoComplete="tel"
                          inputMode="tel"
                          placeholder="05__ ___ __ __"
                          style={fieldStyle}
                        />
                      </label>
                      <button
                        type="submit"
                        className="cine-btn"
                        disabled={sending}
                        style={{
                          marginTop: 4,
                          alignSelf: "flex-start",
                          padding: "16px 40px",
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
                  <div style={{ textAlign: "center", padding: "20px 8px 8px" }}>
                    <DialogTitle
                      style={{
                        fontFamily: "'Anton',sans-serif",
                        fontSize: "clamp(40px,7vw,64px)",
                        color: "#E6EBEE",
                      }}
                    >
                      5.30
                    </DialogTitle>
                    <p
                      style={{
                        margin: "20px auto 0",
                        maxWidth: "26ch",
                        fontFamily: "'Archivo',sans-serif",
                        fontWeight: 600,
                        fontSize: "clamp(18px,2.4vw,24px)",
                        lineHeight: 1.4,
                        color: "#E6EBEE",
                        textWrap: "balance",
                      }}
                    >
                      Başvurun alındı.
                      <br />
                      Bir adım daha yakınsın.
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </Reveal>
      </section>

      {/* ============ FOOTER ============ */}
      <footer
        style={{
          background: "#0B0F14",
          borderTop: "1px solid rgba(230,235,238,0.10)",
          padding: "clamp(48px,8vh,90px) 24px",
          textAlign: "center",
          fontFamily: "'Space Mono',monospace",
          fontSize: 11,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: "#5b6772",
        }}
      >
        5.30 — DİSİPLİN · İNANÇ · BİRLİK
      </footer>
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

const dialogFieldWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const dialogFieldLabel: React.CSSProperties = {
  fontFamily: "'Space Mono',monospace",
  fontSize: 11,
  letterSpacing: "0.26em",
  textTransform: "uppercase",
  color: "#8593A0",
};

/** Oversized faint section index that drifts slower than content (parallax depth). */
const sectionGhost: React.CSSProperties = {
  position: "absolute",
  bottom: "-8%",
  right: "1%",
  fontFamily: "'Anton',sans-serif",
  fontSize: "clamp(120px,20vw,300px)",
  lineHeight: 0.8,
  color: "rgba(230,235,238,0.016)",
  pointerEvents: "none",
  userSelect: "none",
  zIndex: 0,
  willChange: "transform",
};

const hairlineStyle: React.CSSProperties = {
  height: 1,
  width: 120,
  marginTop: 18,
  background: "linear-gradient(to right, rgba(230,235,238,0.5), transparent)",
  transform: "scaleX(0)",
  transformOrigin: "left center",
};
