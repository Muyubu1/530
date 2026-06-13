export interface UpdateItem {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
}

export interface NewUpdate {
  title: string;
  content: string;
  publishedAt: Date;
}

export interface UpdateRepository {
  listRecent(): Promise<UpdateItem[]>;
  create(input: NewUpdate): Promise<UpdateItem>;
  update(id: string, input: NewUpdate): Promise<void>;
  delete(id: string): Promise<void>;
}
