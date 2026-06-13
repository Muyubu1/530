import { Eyebrow, Heading } from "@/ui/design-system";

export function AdminComingSoon({ title }: { title: string }) {
  return (
    <div>
      <Eyebrow size="sm">yönetim · {title.toLowerCase()}</Eyebrow>
      <Heading as="h1" size="xl" className="mt-4">
        {title}
      </Heading>
      <p className="mt-4 text-sm text-muted-foreground/60">İçerik yönetimi hazırlanıyor…</p>
    </div>
  );
}
