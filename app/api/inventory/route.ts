import { NextRequest, NextResponse } from "next/server";
import { fetchSSInventory } from "@/app/lib/ssactivewear";

// Style ID mapping for hat models
// These are numeric STYLEIDs used to query the SS Activewear Products API
// Verified from SS Activewear API on 2024-12-10
const STYLE_IDS: Record<string, number> = {
  // Richardson models
  "112": 4332,
  "112PFP": 12234,
  "168": 2130,
  "220": 15650,
  "256": 8151,
  "258": 12237,
  // Yupoong (YP Classics) models
  "6606": 3783,
  "6006": 2523,
  "6506": 5768,
};

// Cache inventory by styleID (refresh every 5 minutes)
const inventoryCache: Map<number, { data: Record<string, number>; timestamp: number }> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getStyleInventory(styleID: number): Promise<Record<string, number>> {
  const cached = inventoryCache.get(styleID);
  const now = Date.now();
  
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    console.log(`Fetching inventory for styleID: ${styleID}`);
    const inventory = await fetchSSInventory({ styleID });
    console.log(`Got ${inventory.length} inventory items for styleID ${styleID}`);
    
    // Group by color code and sum quantities across warehouses
    // Also track by full part number for flexible matching
    const result: Record<string, number> = {};
    
    for (const item of inventory) {
      // Store by full partNumber (normalized to uppercase without spaces)
      const fullKey = item.partNumber.toUpperCase().replace(/\s+/g, "");
      if (!result[fullKey]) {
        result[fullKey] = 0;
      }
      result[fullKey] += item.qty;
      
      // Also store by just the color portion (after last dash or number)
      // Part numbers can be: "112-BLK", "112BLK", "R112-BLK", etc.
      const colorMatch = item.partNumber.match(/[-]?([A-Z]+(?:[-/][A-Z]+)*)$/i);
      if (colorMatch) {
        const colorCode = colorMatch[1].toUpperCase();
        if (!result[colorCode]) {
          result[colorCode] = 0;
        }
        result[colorCode] += item.qty;
      }
      
      // Store by colorName too (for flexible matching)
      if (item.colorName) {
        const colorNameKey = item.colorName.toUpperCase().replace(/[\s/]+/g, "");
        if (!result[colorNameKey]) {
          result[colorNameKey] = 0;
        }
        result[colorNameKey] += item.qty;
      }
    }
    
    inventoryCache.set(styleID, { data: result, timestamp: now });
    return result;
  } catch (error) {
    console.error(`Error fetching inventory for styleID ${styleID}:`, error);
    return {};
  }
}

// GET /api/inventory?styleID=4379 (by style ID)
// or /api/inventory?model=112&colorCode=BLK (by model and color)
// or /api/inventory?model=112 (get all colors for a model)
// or /api/inventory?debug=true (show config status)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Debug endpoint to check configuration
  if (searchParams.get("debug") === "true") {
    return NextResponse.json({
      configured: !!process.env.SSACTIVEWEAR_API_KEY,
      hasAccountNumber: !!process.env.SSACTIVEWEAR_ACCOUNT_NUMBER,
      accountNumberLength: process.env.SSACTIVEWEAR_ACCOUNT_NUMBER?.length || 0,
      apiKeyLength: process.env.SSACTIVEWEAR_API_KEY?.length || 0,
    });
  }

  // Test endpoint to try fetching directly
  // Usage: /api/inventory?test=true&styleID=4387 (or use model name)
  // Products: /v2/products/?style=39&fields=skuid,qty,warehouses
  // Styles: /v2/styles/39 (styleID in path)
  if (searchParams.get("test") === "true") {
    const testStyleID = searchParams.get("styleID") || searchParams.get("style");
    const testModel = searchParams.get("model");
    const endpoint = searchParams.get("endpoint") || "products";
    
    // Resolve model name to styleID if provided
    let styleID = testStyleID;
    if (testModel && STYLE_IDS[testModel]) {
      styleID = String(STYLE_IDS[testModel]);
    }
    if (!styleID) {
      styleID = "4387"; // Default to Richardson 168
    }
    
    try {
      const SS_API_BASE = "https://api.ssactivewear.com/v2";
      const apiKey = process.env.SSACTIVEWEAR_API_KEY;
      const accountNumber = process.env.SSACTIVEWEAR_ACCOUNT_NUMBER || "";
      const credentials = Buffer.from(`${accountNumber}:${apiKey}`).toString("base64");
      
      // Build URL based on endpoint type
      let url: string;
      if (endpoint === "styles") {
        // Get style info: /v2/styles/{styleID} (path parameter)
        url = `${SS_API_BASE}/styles/${styleID}`;
      } else if (endpoint === "styles-brand") {
        // Get all styles for a brand
        url = `${SS_API_BASE}/styles/?brand=${styleID}`;
      } else if (endpoint === "products-full") {
        // Get full product info
        url = `${SS_API_BASE}/products/?style=${styleID}`;
      } else {
        // Default: Get inventory via Products API (query parameter + fields)
        url = `${SS_API_BASE}/products/?style=${styleID}&fields=skuid,qty,warehouses,partNumber,colorName,sizeName`;
      }
      
      console.log(`Testing SS API: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${credentials}`,
          Accept: "application/json",
        },
      });
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }
      
      return NextResponse.json({ 
        success: response.ok, 
        status: response.status,
        endpoint,
        styleID,
        model: testModel,
        url: url.replace(credentials, "***"),
        itemCount: Array.isArray(data) ? data.length : null,
        sample: Array.isArray(data) ? data.slice(0, 5) : data
      });
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        styleID,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  // Check if API is configured
  if (!process.env.SSACTIVEWEAR_API_KEY) {
    return NextResponse.json({ qty: null, inventory: {}, error: "API not configured" });
  }

  const styleIDParam = searchParams.get("styleID");
  const model = searchParams.get("model");
  const colorCode = searchParams.get("colorCode");
  
  // For backwards compatibility with old partNumber format
  const partNumber = searchParams.get("partNumber");

  try {
    // Handle old part number format (e.g., "112-BLK")
    if (partNumber) {
      const parts = partNumber.split("-");
      const modelFromPart = parts[0];
      const colorFromPart = parts.slice(1).join("-");
      const styleID = STYLE_IDS[modelFromPart];
      
      if (!styleID) {
        return NextResponse.json({ partNumber, qty: null });
      }
      
      const inventory = await getStyleInventory(styleID);
      const qty = inventory[colorFromPart] ?? null;
      return NextResponse.json({ partNumber, qty });
    }

    // Fetch by styleID directly
    if (styleIDParam) {
      const styleID = parseInt(styleIDParam, 10);
      const inventory = await getStyleInventory(styleID);
      return NextResponse.json({ styleID, inventory });
    }

    // Fetch by model name (e.g., "112", "6606")
    if (model) {
      const styleID = STYLE_IDS[model];
      if (!styleID) {
        return NextResponse.json({ error: `Unknown model: ${model}` }, { status: 400 });
      }
      
      const inventory = await getStyleInventory(styleID);
      
      // If colorCode specified, return just that color's qty
      if (colorCode) {
        const qty = inventory[colorCode] ?? null;
        return NextResponse.json({ model, colorCode, qty });
      }
      
      // Return all colors for the model
      return NextResponse.json({ model, inventory });
    }

    return NextResponse.json(
      { error: "Please provide model, styleID, or partNumber parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Inventory API error:", error);
    return NextResponse.json({ qty: null, inventory: {} });
  }
}

