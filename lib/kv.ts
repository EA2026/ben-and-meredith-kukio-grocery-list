import { neon } from "@neondatabase/serverless";
import { GroceryItem, INITIAL_MASTER_LIST } from "./masterList";

// Vercel's Neon integration sets one of these automatically once connected.
const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.NEON_DATABASE_URL ??
  "";

function assertConfigured() {
  if (!connectionString) {
    throw new Error(
      "Shared storage isn't configured yet — connect Neon in Vercel's Storage tab, or make sure DATABASE_URL is set."
    );
  }
}

let tableReady = false;

async function getSql() {
  assertConfigured();
  const sql = neon(connectionString);
  if (!tableReady) {
    // Idempotent — safe to run on every cold start.
    await sql`
      CREATE TABLE IF NOT EXISTS kv_store (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL
      )
    `;
    tableReady = true;
  }
  return sql;
}

const CATALOG_KEY = "ben-meredith-catalog-v1";
const REQUESTS_KEY = "ben-meredith-requests-v1";

async function readKey<T>(key: string): Promise<T | null> {
  const sql = await getSql();
  const rows = await sql`SELECT value FROM kv_store WHERE key = ${key}`;
  if (rows.length === 0) return null;
  return rows[0].value as T;
}

async function writeKey(key: string, value: unknown): Promise<void> {
  const sql = await getSql();
  await sql`
    INSERT INTO kv_store (key, value)
    VALUES (${key}, ${JSON.stringify(value)}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
  `;
}

export async function getCatalog(): Promise<GroceryItem[]> {
  const existing = await readKey<GroceryItem[]>(CATALOG_KEY);
  if (existing && existing.length > 0) return existing;
  // First run — seed the shared catalog from the historical analysis.
  await writeKey(CATALOG_KEY, INITIAL_MASTER_LIST);
  return INITIAL_MASTER_LIST;
}

export async function saveCatalog(items: GroceryItem[]): Promise<void> {
  await writeKey(CATALOG_KEY, items);
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
  submittedBy?: string;
}

export async function getRequests(): Promise<VisitRequest[]> {
  const existing = await readKey<VisitRequest[]>(REQUESTS_KEY);
  return existing ?? [];
}

export async function addRequest(req: VisitRequest): Promise<VisitRequest[]> {
  const all = await getRequests();
  // Re-generating a list for a visit date that's already in history updates
  // that entry instead of piling up duplicates — only one record per date.
  const withoutSameDate = all.filter((r) => r.visitDate !== req.visitDate);
  const updated = [req, ...withoutSameDate];
  await writeKey(REQUESTS_KEY, updated);
  return updated;
}

export async function deleteRequest(id: string): Promise<VisitRequest[]> {
  const all = await getRequests();
  const updated = all.filter((r) => r.id !== id);
  await writeKey(REQUESTS_KEY, updated);
  return updated;
}

// The two real past visits pulled from the household's own grocery records
// (12/31/24 and 5/26/25). Only used to seed history the first time — never
// overwrites anything if requests already exist.
const HISTORICAL_VISITS: VisitRequest[] = [
  {
    id: "seed-2025-05-26",
    visitDate: "2025-05-26",
    createdAt: "2025-05-26T00:00:00.000Z",
    groceryNotes: "",
    submittedBy: "Imported record",
    items: [
      { name: "English muffins (Thomas' brand)", category: "Breakfast", qty: "2 boxes" },
      { name: "Coffeemate French Vanilla creamer", category: "Coffee & Tea" },
      { name: "Half and half", category: "Dairy & Eggs" },
      { name: "Pineapple", category: "Fruits", qty: "2" },
      { name: "Bananas", category: "Fruits", qty: "6" },
      { name: "Greek yogurt, coconut flavor (Dannon or Chobani)", category: "Dairy & Eggs", qty: "6" },
      { name: "Tortilla chips", category: "Snacks" },
      { name: "Salsa, medium", category: "Condiments" },
      { name: "Avocados", category: "Fruits", qty: "3" },
      { name: "Limes", category: "Fruits", qty: "5" },
      { name: "Kua Bay IPA (12 pack)", category: "Alcohol" },
      { name: "Big Wave (12 pack)", category: "Alcohol" },
      { name: "Sauvignon Blanc, Oyster Bay or similar (4 bottles)", category: "Alcohol" },
      { name: "Eggs (dozen)", category: "Dairy & Eggs" },
      { name: "Bacon (2 lbs)", category: "Meat" },
      { name: "La Croix or plain soda water (12 pack)", category: "Beverages" },
      { name: "Broccoli", category: "Vegetables", qty: "4 heads" },
    ],
  },
  {
    id: "seed-2024-12-31",
    visitDate: "2024-12-31",
    createdAt: "2024-12-31T00:00:00.000Z",
    groceryNotes: "",
    submittedBy: "Imported record",
    items: [
      { name: "Coffeemate French Vanilla creamer", category: "Coffee & Tea" },
      { name: "English muffins (Thomas' brand)", category: "Breakfast" },
      { name: "Bananas", category: "Fruits", qty: "6" },
      { name: "Pineapple", category: "Fruits", qty: "1" },
      { name: "Fuji apples", category: "Fruits", qty: "6" },
      { name: "POG juice (quart)", category: "Beverages" },
      { name: "Flour tortillas", category: "Pantry" },
      { name: "Cheddar cheese block (medium)", category: "Dairy & Eggs" },
      { name: "Sour cream (pint)", category: "Dairy & Eggs" },
      { name: "Refried beans (can)", category: "Pantry" },
      { name: "Taco seasoning (packet)", category: "Pantry" },
      { name: "Rotisserie chicken", category: "Meat" },
      { name: "Sliced almonds", category: "Snacks" },
      { name: "Annie's Asian salad dressing or similar", category: "Condiments" },
      { name: "Romaine lettuce", category: "Vegetables" },
      { name: "Wonton chips", category: "Snacks" },
      { name: "Green onions", category: "Vegetables" },
      { name: "Limes", category: "Fruits", qty: "5" },
      { name: "Avocados", category: "Fruits", qty: "3" },
      { name: "Salsa, medium", category: "Condiments", qty: "1" },
      { name: "Tortilla chips", category: "Snacks", qty: "1 bag" },
      { name: "Chicken breast, boneless skinless (1.5–2 lbs)", category: "Meat" },
      { name: "Teriyaki marinade", category: "Condiments" },
      { name: "Fettuccine pasta (box)", category: "Pantry" },
      { name: "Heavy cream (pint)", category: "Dairy & Eggs" },
      { name: "Garlic (head)", category: "Vegetables" },
      { name: "Parmesan cheese, grated", category: "Dairy & Eggs" },
      { name: "Broccoli", category: "Vegetables", qty: "florets" },
      { name: "Sourdough bread, sliced round", category: "Bakery" },
      { name: "Triscuits", category: "Snacks" },
      { name: "Potato chips", category: "Snacks" },
      { name: "Salami, sliced", category: "Meat" },
      { name: "String cheese", category: "Dairy & Eggs" },
    ],
  },
];

export async function seedHistoricalRequestsIfEmpty(): Promise<VisitRequest[]> {
  const existing = await getRequests();
  if (existing.length > 0) return existing;
  await writeKey(REQUESTS_KEY, HISTORICAL_VISITS);
  return HISTORICAL_VISITS;
}
