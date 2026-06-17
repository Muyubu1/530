import { createFileRoute, redirect } from "@tanstack/react-router";

// Members land on the journey. /uye → /uye/patika.
export const Route = createFileRoute("/uye/")({
  beforeLoad: () => {
    throw redirect({ to: "/uye/patika" });
  },
});
