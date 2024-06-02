export interface LinkModel {
  id: number;
  slug: string;
  description: string;
  expire_at: string | undefined;
  target_url: string;
  created_at: string;
  updated_at: string;
}
