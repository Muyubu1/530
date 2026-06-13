import { sql } from "../db/client.server";
import type { Material, MaterialRepository, NewMaterial } from "@/domain/material";

interface Row {
  id: string;
  lesson_id: string;
  title: string;
  file_url: string;
  file_type: string | null;
  file_size_bytes: string | null; // bigint arrives as string
}

const COLS = sql`id, lesson_id, title, file_url, file_type, file_size_bytes`;

const toMaterial = (r: Row): Material => ({
  id: r.id,
  lessonId: r.lesson_id,
  title: r.title,
  fileUrl: r.file_url,
  fileType: r.file_type,
  fileSizeBytes: r.file_size_bytes != null ? Number(r.file_size_bytes) : null,
});

export function makeMaterialRepository(): MaterialRepository {
  return {
    async listForLesson(lessonId: string) {
      const rows = await sql<Row[]>`
        select ${COLS} from lesson_materials where lesson_id = ${lessonId} order by order_index
      `;
      return rows.map(toMaterial);
    },

    async create(input: NewMaterial) {
      const [r] = await sql<Row[]>`
        insert into lesson_materials (lesson_id, title, file_url, file_type, file_size_bytes, order_index)
        values (${input.lessonId}, ${input.title}, ${input.fileUrl}, ${input.fileType}, ${input.fileSizeBytes}, ${input.orderIndex})
        returning ${COLS}
      `;
      return toMaterial(r);
    },

    async update(id, input) {
      await sql`
        update lesson_materials set
          title = ${input.title}, file_url = ${input.fileUrl},
          file_type = ${input.fileType}, file_size_bytes = ${input.fileSizeBytes},
          order_index = ${input.orderIndex}
        where id = ${id}
      `;
    },

    async delete(id) {
      await sql`delete from lesson_materials where id = ${id}`;
    },
  };
}
