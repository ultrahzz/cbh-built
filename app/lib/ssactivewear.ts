/**
 * SS Activewear API Client
 * Documentation: https://api.ssactivewear.com/V2/Default.aspx
 * 
 * Authentication: Basic Auth
 *   - Username: Account Number
 *   - Password: API Key (request from api@ssactivewear.com)
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
  styleID?: number;
  sku?: string;
  partNumber: string;
  colorName: string;
  sizeName: string;
  qty: number;
  warehouses?: Array<{
    warehouseAbbr: string;
    qty: number;
  }>;
}

// Raw product response from SS Activewear Products API
interface SSProductInventoryResponse {
  sku?: string;
  partNumber?: string;
  colorName?: string;
  sizeName?: string;
  qty?: number;
  warehouses?: Array<{
    warehouseAbbr: string;
    qty: number;
  }>;
}

// Fetch styles/products from SS Activewear
// URL format: https://api.ssactivewear.com/v2/products/?style=39
export async function fetchSSProducts(options?: {
  brandName?: string;
  styleID?: number;
  category?: string;
}): Promise<SSProduct[]> {
  let url = `${SS_API_BASE}/products/`;
  
  if (options?.styleID) {
    // Products API uses query parameter for style
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

// Fetch styles (style-level info like brand, category, etc.)
// URL format: https://api.ssactivewear.com/v2/styles/39 (styleID in path)
export async function fetchSSStyles(options?: {
  styleID?: number;
  partNumber?: string;
  brandName?: string;
}): Promise<SSStyle[]> {
  let url: string;
  
  if (options?.styleID) {
    // Styles API uses styleID in URL path
    url = `${SS_API_BASE}/styles/${options.styleID}`;
  } else if (options?.partNumber) {
    url = `${SS_API_BASE}/styles/?partnumber=${encodeURIComponent(options.partNumber)}`;
  } else if (options?.brandName) {
    url = `${SS_API_BASE}/styles/?brand=${encodeURIComponent(options.brandName)}`;
  } else {
    url = `${SS_API_BASE}/styles/`;
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
// Per SS Activewear docs: Use Products API with query parameters
// URL format: https://api.ssactivewear.com/v2/products/?style=39&fields=skuid,qty,warehouses
export async function fetchSSInventory(options?: {
  styleID?: number;
  styleName?: string;
  partNumbers?: string[];
}): Promise<SSInventory[]> {
  let url: string;
  
  if (options?.styleID) {
    // Products API uses query parameter for style, with fields filter for inventory
    url = `${SS_API_BASE}/products/?style=${options.styleID}&fields=skuid,qty,warehouses,partNumber,colorName,sizeName`;
  } else if (options?.styleName) {
    // Try querying by style name/number
    url = `${SS_API_BASE}/products/?style=${encodeURIComponent(options.styleName)}&fields=skuid,qty,warehouses,partNumber,colorName,sizeName`;
  } else if (options?.partNumbers && options.partNumbers.length > 0) {
    // Batch fetch by part numbers
    url = `${SS_API_BASE}/products/?partnumbers=${options.partNumbers.join(",")}&fields=skuid,qty,warehouses,partNumber,colorName,sizeName`;
  } else {
    throw new Error("Must provide styleID, styleName, or partNumbers");
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

  const data: SSProductInventoryResponse[] = await response.json();
  console.log(`SS Activewear returned ${Array.isArray(data) ? data.length : 0} items`);
  
  // Transform Products API response to SSInventory format
  // Sum qty across all warehouses for each product
  const inventory: SSInventory[] = data.map((item) => {
    // Total qty is either provided directly or sum of warehouse quantities
    let totalQty = item.qty ?? 0;
    if (item.warehouses && item.warehouses.length > 0) {
      totalQty = item.warehouses.reduce((sum, wh) => sum + (wh.qty || 0), 0);
    }
    
    return {
      sku: item.sku,
      partNumber: item.partNumber || "",
      colorName: item.colorName || "",
      sizeName: item.sizeName || "",
      qty: totalQty,
      warehouses: item.warehouses,
    };
  });
  
  return inventory;
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
// These are numeric STYLEIDs used to query the Products API
// Verified from SS Activewear API on 2024-12-10
export const SS_STYLE_MAP: Record<string, { styleID: number; brandName: string }> = {
  // Richardson
  "Richardson 112": { styleID: 4332, brandName: "Richardson" },
  "Richardson 112PFP": { styleID: 12234, brandName: "Richardson" },
  "Richardson 168": { styleID: 2130, brandName: "Richardson" },
  "Richardson 220": { styleID: 15650, brandName: "Richardson" },
  "Richardson 256": { styleID: 8151, brandName: "Richardson" },
  "Richardson 258": { styleID: 12237, brandName: "Richardson" },
  // Yupoong (YP Classics)
  "Yupoong 6606": { styleID: 3783, brandName: "YP Classics" },
  "Yupoong 6006": { styleID: 2523, brandName: "YP Classics" },
  "Yupoong 6506": { styleID: 5768, brandName: "YP Classics" },
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

