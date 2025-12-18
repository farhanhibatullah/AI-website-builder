
export interface WebsiteSection {
  id: string;
  type: string;
  purpose: string;
  content?: string; // Cache for the generated code snippet
}

export interface WebsitePage {
  slug: string;
  title: string;
  goal: string;
  sections: WebsiteSection[];
  code?: string; // The full generated React code for the page
}

export interface GlobalStyle {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  tone: string;
}

export interface WebsiteBlueprint {
  website_goal: string;
  audience: string;
  pages: WebsitePage[];
  navigation: string[];
  global_style: GlobalStyle;
}

export type AppState = 'LANDING' | 'SETUP' | 'GENERATING' | 'EDITOR' | 'DEPLOY';
