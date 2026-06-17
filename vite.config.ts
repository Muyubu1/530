import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Clean TanStack Start setup — no Lovable wrapper.
// Plugin order: paths → tailwind → start → (nitro on Vercel) → react.
// On Vercel (VERCEL=1) the server build is routed through Nitro's `vercel` preset so it
// emits the Build Output API (.vercel/output) that Vercel serves as SSR functions. Locally
// the default TanStack build (dist/) is kept so dev / CI / the other workstream are unaffected.
export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    ...(process.env.VERCEL ? [nitro({ preset: "vercel" })] : []),
    viteReact(),
  ],
});
