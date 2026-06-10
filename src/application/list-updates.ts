import type { UpdateItem, UpdateRepository } from "@/domain/update";

export function listUpdates(repo: UpdateRepository): Promise<UpdateItem[]> {
  return repo.listRecent();
}
