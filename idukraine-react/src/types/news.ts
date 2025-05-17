export interface NewsItem {
  id: string;
  titleEn: string;
  titleUk: string;
  textEn: string;
  textUk: string;
  date: Date;
  categoryEn: string;
  categoryUk: string;
  image: string;
  isPublished: boolean;
  isTopNews: boolean;
}

export interface NewsCreateInput {
  titleEn: string;
  titleUk: string;
  textEn: string;
  textUk: string;
  categoryEn: string;
  categoryUk: string;
  image: string;
  date: string;
  isTopNews?: boolean;
}

export interface NewsUpdateInput extends Partial<NewsCreateInput> {
  isPublished?: boolean;
  isTopNews?: boolean;
}
