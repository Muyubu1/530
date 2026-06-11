import { createServerFn } from "@tanstack/react-start";
import { listMaterials } from "@/application/list-materials";
import { makeMaterialRepository } from "@/infrastructure/material/postgres-material-repository.server";

export const listMaterialsFn = createServerFn({ method: "GET" })
  .validator((d: { lessonId: string }) => d)
  .handler(({ data }) => listMaterials(makeMaterialRepository(), data.lessonId));
