import { createFileRoute, redirect } from "@tanstack/react-router";

// Landing artık kökte (/). Eski /ana linkleri kırılmasın diye yönlendir.
export const Route = createFileRoute("/ana")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
