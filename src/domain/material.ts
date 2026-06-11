export interface Material {
  id: string;
  lessonId: string;
  title: string;
  fileUrl: string;
  fileType: string | null;
  fileSizeBytes: number | null;
}

export interface MaterialRepository {
  listForLesson(lessonId: string): Promise<Material[]>;
}
