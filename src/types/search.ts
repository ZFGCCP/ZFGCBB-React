export type SearchHit = {
  type: string;
  title: string;
  snippet: string | null;
  context: string | null;
  url: string;
};

export type SearchGroup = {
  type: string;
  label: string;
  total: number;
  hits: SearchHit[];
};

export type SearchResults = {
  query: string;
  total: number;
  groups: SearchGroup[];
};

export type SearchRealm = {
  type: string;
  label: string;
};
