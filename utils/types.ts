interface WpRendered {
  rendered: string;
}

interface WpMediaDetails {
  width: number;
  height: number;
  file: string;
}

interface WpFeaturedMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details: WpMediaDetails;
}

interface WpAuthor {
  id: number;
  name: string;
}

export interface AlmaUPost {
  id: number;
  date: string;
  date_gmt: string;
  link: string;
  title: WpRendered;
  content: WpRendered;
  excerpt: WpRendered;
  featured_media: number;
  author: number; 
}

export type AlmaUPostsResponse = AlmaUPost[];