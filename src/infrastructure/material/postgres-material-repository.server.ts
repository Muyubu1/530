import { sql } from "../db/client.server";
import type { Material, MaterialRepository } from "@/domain/material";

interface Row {
  id: string;
  lesson_id: string;
  title: string;
  file_url: string;
  file_type: string | null;
  file_size_bytes: string | null; // bigint arrives as string
}

export function makeMaterialRepository(): MaterialRepository {
  return {
    async listForLesson(lessonId: string): Promise<Material[]> {
      const rows = await sql<Row[]>`
        select id, lesson_id, title, file_url, file_type, file_size_bytes
        from lesson_materials
        where lesson_id = ${lessonId}
        order by order_index
      `;
      return rows.map((r) => ({
        id: r.id,
        lessonId: r.lesson_id,
        title: r.title,
        fileUrl: r.file_url,
        fileType: r.file_type,
        fileSizeBytes: r.file_size_bytes != null ? Number(r.file_size_bytes) : null,
      }));
    },
  };
}
