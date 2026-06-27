export type FaqItem = {
  id: number;
  category?: string | null;
  question: string;
  answer?: string | null;
  sort_order?: number;
};
