import type { Material, MaterialRepository } from "@/domain/material";

export function listMaterials(repo: MaterialRepository, lessonId: string): Promise<Material[]> {
  return repo.listForLesson(lessonId);
}
