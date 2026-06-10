export interface UpdateItem {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
}

export interface UpdateRepository {
  listRecent(): Promise<UpdateItem[]>;
}
