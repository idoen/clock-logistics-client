import { z } from 'zod';

const toNumber = (value: unknown) => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string' && value.trim() !== '') return Number(value);
  return value;
};

const numberish = z.preprocess(toNumber, z.number());
const numberishNullable = z.preprocess(toNumber, z.number().nullable());

export const salesReportRowSchema = z.object({
  product_id: numberish,
  sku: z.string(),
  name: z.string(),
  category: z.string().nullable(),
  list_price: numberishNullable,
  currency: z.string(),
  image_url: z.string().nullable().optional(),
  available: numberish,
  score: numberish,
});

export const salesReportResponseSchema = z.object({
  rows: z.array(salesReportRowSchema),
  total: numberish,
  appliedFilters: z
    .object({
      budget: numberish.nullable().optional(),
      filters: z
        .object({
          category: z.string().optional(),
          brand: z.string().optional(),
          gender: z.string().optional(),
          material: z.string().optional(),
          is_gold: z.string().optional(),
        })
        .nullable()
        .optional(),
      inStockOnly: z.boolean().optional(),
      sort: z
        .object({
          field: z.enum(['score', 'available', 'price', 'name']),
          direction: z.enum(['asc', 'desc']),
        })
        .nullable()
        .optional(),
      page: numberish.optional(),
      pageSize: numberish.optional(),
    })
    .default({}),
});

export const salesReportFiltersSchema = z.object({
  categories: z.array(z.string()),
  brands: z.array(z.string()),
  genders: z.array(z.string()),
  materials: z.array(z.string()),
  is_gold: z.array(z.string()),
});

export const salesReportPresetSchema = z.object({
  id: numberish,
  name: z.string(),
  budget: numberish.nullable().optional(),
  filters: z
    .object({
      category: z.string().optional(),
      brand: z.string().optional(),
      gender: z.string().optional(),
      material: z.string().optional(),
      is_gold: z.string().optional(),
    })
    .nullable()
    .optional(),
  inStockOnly: z.boolean().nullable().optional(),
  sort: z
    .object({
      field: z.enum(['score', 'available', 'price', 'name']),
      direction: z.enum(['asc', 'desc']),
    })
    .nullable()
    .optional(),
  created_at: z.string(),
});

export const salesReportPresetsSchema = z.array(salesReportPresetSchema);
