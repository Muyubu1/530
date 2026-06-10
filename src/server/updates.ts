import { createServerFn } from "@tanstack/react-start";
import { listUpdates } from "@/application/list-updates";
import { makeUpdateRepository } from "@/infrastructure/update/postgres-update-repository.server";

export const listUpdatesFn = createServerFn({ method: "GET" }).handler(() =>
  listUpdates(makeUpdateRepository()),
);
