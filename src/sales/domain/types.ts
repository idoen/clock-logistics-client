export type SalesReportRow = {
  product_id: number;
  sku: string;
  name: string;
  category: string | null;
  list_price: number | null;
  currency: string;
  image_url: string | null;
  available: number;
  score: number;
};

export type SalesReportSort = {
  field: 'score' | 'available' | 'price' | 'name';
  direction: 'asc' | 'desc';
};

export type SalesReportFilters = {
  category?: string;
  brand?: string;
  gender?: string;
  material?: string;
  is_gold?: string;
};

export type SalesReportResponse = {
  rows: SalesReportRow[];
  total: number;
  appliedFilters: {
    budget?: number | null;
    filters?: SalesReportFilters | null;
    inStockOnly?: boolean;
    sort?: SalesReportSort | null;
    page?: number;
    pageSize?: number;
  };
};

export type SalesReportFilterOptions = {
  categories: string[];
  brands: string[];
  genders: string[];
  materials: string[];
  is_gold: string[];
};

export type SalesReportPreset = {
  id: number;
  name: string;
  budget?: number | null;
  filters?: SalesReportFilters | null;
  inStockOnly?: boolean | null;
  sort?: SalesReportSort | null;
  created_at: string;
};
