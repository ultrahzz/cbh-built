/**
 * SS Activewear API Client
 * Documentation: https://api.ssactivewear.com/V2/Default.aspx
 */

const SS_API_BASE = "https://api.ssactivewear.com/v2";

// Your SS Activewear credentials (store in .env.local)
const getAuthHeader = () => {
  const apiKey = process.env.SSACTIVEWEAR_API_KEY;
  const accountNumber = process.env.SSACTIVEWEAR_ACCOUNT_NUMBER || "";
  
  if (!apiKey) {
    throw new Error("SSACTIVEWEAR_API_KEY is not set in environment variables");
  }
  
  // SS Activewear uses Basic Auth: account_number:api_key
  const credentials = Buffer.from(`${accountNumber}:${apiKey}`).toString("base64");
  return `Basic ${credentials}`;
};

// Types for SS Activewear responses
export interface SSProduct {
  styleID: number;
  styleName: string;
  brandName: string;
  title: string;
  description: string;
  baseCategory: string;
  caseQty?: number;
  piecePrice?: number;
}

export interface SSStyle {
  styleID: number;
  partNumber: string;
  styleName: string;
  brandName: string;
  colorName: string;
  colorCode: string;
  sizeName: string;
  piecePrice: number;
  casePrice?: number;
  qty?: number; // Inventory quantity
}

export interface SSInventory {
  styleID: number;
  partNumber: string;
  colorName: string;
  sizeName: string;
  warehouseAbbr: string;
  qty: number;
}

// Fetch styles/products from SS Activewear
export async function fetchSSProducts(options?: {
  brandName?: string;
  styleID?: number;
  category?: string;
}): Promise<SSProduct[]> {
  let url = `${SS_API_BASE}/products/`;
  
  if (options?.styleID) {
    url += `?style=${options.styleID}`;
  } else if (options?.brandName) {
    url += `?brand=${encodeURIComponent(options.brandName)}`;
  } else if (options?.category) {
    url += `?category=${encodeURIComponent(options.category)}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SS Activewear API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Fetch styles (specific SKUs with colors/sizes)
export async function fetchSSStyles(options?: {
  styleID?: number;
  partNumber?: string;
  brandName?: string;
}): Promise<SSStyle[]> {
  let url = `${SS_API_BASE}/styles/`;
  
  if (options?.styleID) {
    url += `?style=${options.styleID}`;
  } else if (options?.partNumber) {
    url += `?partnumber=${encodeURIComponent(options.partNumber)}`;
  } else if (options?.brandName) {
    url += `?brand=${encodeURIComponent(options.brandName)}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SS Activewear API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Fetch real-time inventory levels
export async function fetchSSInventory(options?: {
  styleID?: number;
  styleName?: string;
  partNumbers?: string[];
}): Promise<SSInventory[]> {
  let url = `${SS_API_BASE}/inventory/`;
  
  if (options?.styleID) {
    url += `?style=${options.styleID}`;
  } else if (options?.styleName) {
    // Try querying by style name/number (e.g., "112" for Richardson 112)
    url += `?style=${encodeURIComponent(options.styleName)}`;
  } else if (options?.partNumbers && options.partNumbers.length > 0) {
    // Batch fetch by part numbers
    url += `?partnumbers=${options.partNumbers.join(",")}`;
  }

  console.log(`SS Activewear API request: ${url}`);

  const response = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
    next: { revalidate: 60 }, // Cache for 1 minute (inventory changes frequently)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`SS Activewear API error: ${response.status} - ${errorText}`);
    throw new Error(`SS Activewear API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(`SS Activewear returned ${Array.isArray(data) ? data.length : 0} items`);
  return data;
}

// Get total inventory across all warehouses for a part number
export async function getTotalInventory(partNumber: string): Promise<number> {
  try {
    const inventory = await fetchSSInventory({ partNumbers: [partNumber] });
    return inventory.reduce((total, item) => total + item.qty, 0);
  } catch (error) {
    console.error(`Error fetching inventory for ${partNumber}:`, error);
    return -1; // -1 indicates error
  }
}

// Batch get inventory for multiple part numbers
export async function getBatchInventory(
  partNumbers: string[]
): Promise<Record<string, number>> {
  try {
    const inventory = await fetchSSInventory({ partNumbers });
    
    // Group by part number and sum quantities
    const result: Record<string, number> = {};
    for (const item of inventory) {
      if (!result[item.partNumber]) {
        result[item.partNumber] = 0;
      }
      result[item.partNumber] += item.qty;
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching batch inventory:", error);
    return {};
  }
}

// Common SS Activewear style IDs for hats we carry
// These map to our internal hat variants
export const SS_STYLE_MAP = {
  // Richardson
  "Richardson 112": { styleID: 4379, brandName: "Richardson" },
  "Richardson 112PFP": { styleID: 4380, brandName: "Richardson" },
  "Richardson 220": { styleID: 4393, brandName: "Richardson" },
  "Richardson 256": { styleID: 4415, brandName: "Richardson" },
  "Richardson 258": { styleID: 4417, brandName: "Richardson" },
  // Yupoong
  "Yupoong 6606": { styleID: 1553, brandName: "Yupoong" },
  "Yupoong 6006": { styleID: 1545, brandName: "Yupoong" },
  "Yupoong 6506": { styleID: 1551, brandName: "Yupoong" },
};

// Search products by keyword
export async function searchSSProducts(query: string): Promise<SSProduct[]> {
  const url = `${SS_API_BASE}/products/?keyword=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: getAuthHeader(),
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SS Activewear API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

