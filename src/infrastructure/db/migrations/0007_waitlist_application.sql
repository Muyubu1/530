-- 0007 — Waitlist becomes the landing "başvur" (application) sink.
-- The new application form collects name + contact (e-mail OR Instagram) + why.
-- Additive + relaxes the strict e-mail requirement so non-email contacts persist.

alter table public.waitlist alter column email drop not null;
alter table public.waitlist add column if not exists contact text;
alter table public.waitlist add column if not exists why text;

drop policy if exists "Anyone can join waitlist" on public.waitlist;
create policy "Anyone can join waitlist" on public.waitlist
  for insert to anon, authenticated
  with check (
    (email is null and contact is not null)
    or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );
