export interface NewsItem {
  id: string;
  title: string;
  text: string;
  date: Date;
  category: string;
  image: string;
  isPublished: boolean;
  isTopNews: boolean;
}

export interface NewsCreateInput {
  title: string;
  text: string;
  category: string;
  image: string;
  date: string;
  isTopNews?: boolean;
}

export interface NewsUpdateInput extends Partial<NewsCreateInput> {
  isPublished?: boolean;
  isTopNews?: boolean;
}
