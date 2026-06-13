export interface Material {
  id: string;
  lessonId: string;
  title: string;
  fileUrl: string;
  fileType: string | null;
  fileSizeBytes: number | null;
}

export interface NewMaterial {
  lessonId: string;
  title: string;
  fileUrl: string;
  fileType: string | null;
  fileSizeBytes: number | null;
  orderIndex: number;
}

export interface MaterialRepository {
  listForLesson(lessonId: string): Promise<Material[]>;
  create(input: NewMaterial): Promise<Material>;
  update(id: string, input: Omit<NewMaterial, "lessonId">): Promise<void>;
  delete(id: string): Promise<void>;
}
