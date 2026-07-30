export type ItemStatus = "standing" | "candidate";

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  defaultQty?: string;
  status: ItemStatus;
  note?: string;
  firstSeen?: string;
}

// Fixed category order — mirrors the order groceries would actually be
// gathered in on a supply run: produce first, cold case, then shelf-stable.
export const CATEGORY_ORDER = [
  "Fruits",
  "Vegetables",
  "Dairy & Eggs",
  "Meat",
  "Bakery",
  "Breakfast",
  "Coffee & Tea",
  "Beverages",
  "Alcohol",
  "Snacks",
  "Condiments",
  "Pantry",
];

// V1 master list for Ben & Meredith White, built from their 12/31/24 and
// 5/26/25 Kukio visits (Jack & Dossy's list is a separate household — this
// replaces the earlier draft that had been mislabeled).
// "standing" = confirmed on both visits. "candidate" = seen once, not yet confirmed.
export const INITIAL_MASTER_LIST: GroceryItem[] = [
  // Fruits
  {
    id: "pineapple",
    name: "Pineapple",
    category: "Fruits",
    defaultQty: "1",
    status: "standing",
    note: "2 pineapples on 5/26, 1 on 12/31 — confirm usual quantity.",
  },
  { id: "bananas", name: "Bananas", category: "Fruits", defaultQty: "6", status: "standing" },
  { id: "avocados", name: "Avocados", category: "Fruits", defaultQty: "3", status: "standing" },
  { id: "limes", name: "Limes", category: "Fruits", defaultQty: "5", status: "standing" },
  { id: "fuji-apples", name: "Fuji apples", category: "Fruits", defaultQty: "6", status: "candidate", firstSeen: "12/31" },

  // Vegetables
  {
    id: "broccoli",
    name: "Broccoli",
    category: "Vegetables",
    defaultQty: "4 heads",
    status: "standing",
    note: "Whole heads on 5/26, pre-cut florets on 12/31 — confirm preferred format.",
  },
  { id: "romaine-lettuce", name: "Romaine lettuce", category: "Vegetables", status: "candidate", firstSeen: "12/31" },
  { id: "green-onions", name: "Green onions", category: "Vegetables", status: "candidate", firstSeen: "12/31" },
  { id: "garlic", name: "Garlic (head)", category: "Vegetables", status: "candidate", firstSeen: "12/31" },

  // Dairy & Eggs
  { id: "half-and-half", name: "Half and half", category: "Dairy & Eggs", status: "candidate", firstSeen: "5/26" },
  {
    id: "greek-yogurt",
    name: "Greek yogurt, coconut flavor (Dannon or Chobani)",
    category: "Dairy & Eggs",
    defaultQty: "6",
    status: "candidate",
    firstSeen: "5/26",
  },
  { id: "eggs", name: "Eggs (dozen)", category: "Dairy & Eggs", status: "candidate", firstSeen: "5/26" },
  { id: "cheddar-cheese", name: "Cheddar cheese block (medium)", category: "Dairy & Eggs", status: "candidate", firstSeen: "12/31" },
  { id: "sour-cream", name: "Sour cream (pint)", category: "Dairy & Eggs", status: "candidate", firstSeen: "12/31" },
  { id: "heavy-cream", name: "Heavy cream (pint)", category: "Dairy & Eggs", status: "candidate", firstSeen: "12/31" },
  { id: "parmesan", name: "Parmesan cheese, grated", category: "Dairy & Eggs", status: "candidate", firstSeen: "12/31" },
  { id: "string-cheese", name: "String cheese", category: "Dairy & Eggs", status: "candidate", firstSeen: "12/31" },

  // Meat
  { id: "bacon", name: "Bacon (2 lbs)", category: "Meat", status: "candidate", firstSeen: "5/26" },
  { id: "rotisserie-chicken", name: "Rotisserie chicken", category: "Meat", status: "candidate", firstSeen: "12/31" },
  {
    id: "chicken-breast",
    name: "Chicken breast, boneless skinless (1.5–2 lbs)",
    category: "Meat",
    status: "candidate",
    firstSeen: "12/31",
  },
  { id: "salami", name: "Salami, sliced", category: "Meat", status: "candidate", firstSeen: "12/31" },

  // Bakery
  { id: "sourdough", name: "Sourdough bread, sliced round", category: "Bakery", status: "candidate", firstSeen: "12/31" },

  // Breakfast
  {
    id: "english-muffins",
    name: "English muffins (Thomas' brand)",
    category: "Breakfast",
    defaultQty: "2 boxes",
    status: "standing",
  },

  // Coffee & Tea
  { id: "coffee-creamer", name: "Coffeemate French Vanilla creamer", category: "Coffee & Tea", status: "standing" },

  // Beverages
  { id: "pog-juice", name: "POG juice (quart)", category: "Beverages", status: "candidate", firstSeen: "12/31" },
  { id: "la-croix", name: "La Croix or plain soda water (12 pack)", category: "Beverages", status: "candidate", firstSeen: "5/26" },

  // Alcohol
  { id: "kua-bay-ipa", name: "Kua Bay IPA (12 pack)", category: "Alcohol", status: "candidate", firstSeen: "5/26" },
  { id: "big-wave", name: "Big Wave (12 pack)", category: "Alcohol", status: "candidate", firstSeen: "5/26" },
  {
    id: "sauvignon-blanc",
    name: "Sauvignon Blanc, Oyster Bay or similar (4 bottles)",
    category: "Alcohol",
    status: "candidate",
    firstSeen: "5/26",
  },

  // Snacks
  { id: "tortilla-chips", name: "Tortilla chips", category: "Snacks", status: "standing" },
  { id: "wonton-chips", name: "Wonton chips", category: "Snacks", status: "candidate", firstSeen: "12/31" },
  { id: "triscuits", name: "Triscuits", category: "Snacks", status: "candidate", firstSeen: "12/31" },
  { id: "potato-chips", name: "Potato chips", category: "Snacks", status: "candidate", firstSeen: "12/31" },
  { id: "sliced-almonds", name: "Sliced almonds", category: "Snacks", status: "candidate", firstSeen: "12/31" },

  // Condiments
  {
    id: "salsa",
    name: "Salsa, medium",
    category: "Condiments",
    status: "standing",
    note: "\"Fresh medium salsa\" on 5/26 vs. \"pico de gallo, medium\" on 12/31 — likely the same, confirm.",
  },
  { id: "asian-dressing", name: "Annie's Asian salad dressing or similar", category: "Condiments", status: "candidate", firstSeen: "12/31" },
  { id: "teriyaki-marinade", name: "Teriyaki marinade", category: "Condiments", status: "candidate", firstSeen: "12/31" },

  // Pantry
  { id: "flour-tortillas", name: "Flour tortillas", category: "Pantry", status: "candidate", firstSeen: "12/31" },
  { id: "refried-beans", name: "Refried beans (can)", category: "Pantry", status: "candidate", firstSeen: "12/31" },
  { id: "taco-seasoning", name: "Taco seasoning (packet)", category: "Pantry", status: "candidate", firstSeen: "12/31" },
  { id: "fettuccine", name: "Fettuccine pasta (box)", category: "Pantry", status: "candidate", firstSeen: "12/31" },
];
