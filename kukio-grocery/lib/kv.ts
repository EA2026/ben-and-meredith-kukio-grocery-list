import { Redis } from "@upstash/redis";
import { GroceryItem, INITIAL_MASTER_LIST } from "./masterList";

// Vercel's Upstash Redis integration sets UPSTASH_REDIS_REST_URL / TOKEN.
// Some setups (or older KV migrations) instead expose KV_REST_API_URL / TOKEN
// — support both so this works regardless of which naming Vercel gives you.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? "";
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";

const redis = new Redis({ url, token });

const CATALOG_KEY = "ben-meredith-catalog-v1";
const REQUESTS_KEY = "ben-meredith-requests-v1";

export async function getCatalog(): Promise<GroceryItem[]> {
  const existing = await redis.get<GroceryItem[]>(CATALOG_KEY);
  if (existing && existing.length > 0) return existing;
  // First run — seed the shared catalog from the historical analysis.
  await redis.set(CATALOG_KEY, INITIAL_MASTER_LIST);
  return INITIAL_MASTER_LIST;
}

export async function saveCatalog(items: GroceryItem[]): Promise<void> {
  await redis.set(CATALOG_KEY, items);
}

export interface RequestItem {
  name: string;
  category: string;
  qty?: string;
}

export interface VisitRequest {
  id: string;
  visitDate: string; // YYYY-MM-DD, the date they're actually arriving
  createdAt: string; // ISO timestamp of when the request was submitted
  items: RequestItem[];
  groceryNotes: string;
  amenityNotes: string;
}

export async function getRequests(): Promise<VisitRequest[]> {
  const existing = await redis.get<VisitRequest[]>(REQUESTS_KEY);
  return existing ?? [];
}

export async function addRequest(req: VisitRequest): Promise<VisitRequest[]> {
  const all = await getRequests();
  const updated = [req, ...all];
  await redis.set(REQUESTS_KEY, updated);
  return updated;
}
