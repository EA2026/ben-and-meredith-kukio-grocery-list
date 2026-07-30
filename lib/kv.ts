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

// The two real past visits pulled from the household's own grocery records
// (12/31/24 and 5/26/25). Only used to seed history the first time — never
// overwrites anything if requests already exist.
const HISTORICAL_VISITS: VisitRequest[] = [
  {
    id: "seed-2025-05-26",
    visitDate: "2025-05-26",
    createdAt: "2025-05-26T00:00:00.000Z",
    groceryNotes: "",
    amenityNotes: "",
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
    amenityNotes: "",
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
  await redis.set(REQUESTS_KEY, HISTORICAL_VISITS);
  return HISTORICAL_VISITS;
}
