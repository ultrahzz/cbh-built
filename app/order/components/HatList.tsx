"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Image from "next/image";
import { useOrder } from "../context/OrderContext";
import ImageModal from "./ImageModal";
import StockIndicator from "./StockIndicator";

// Stock buffer to prevent overselling
// Subtracts this amount from displayed stock to account for:
// - Multiple simultaneous orders
// - API delays
// - Warehouse counting variations
const STOCK_BUFFER = 99; // Only show in stock if SS has 100+ available
const LOW_STOCK_THRESHOLD = 50; // Show "Low Stock" warning when below this

// Context for sharing inventory data within a model section
interface ModelInventoryContextType {
  inventory: Record<string, number>;
  loading: boolean;
  hasFetchedInventory: boolean; // True if we've successfully fetched inventory for this model
}
const ModelInventoryContext = createContext<ModelInventoryContextType>({ inventory: {}, loading: false, hasFetchedInventory: false });

// Brand display order (fixed)
const BRAND_ORDER = ["Richardson", "Yupoong"] as const;

// Model order within each brand
const MODEL_ORDER: Record<string, string[]> = {
  Richardson: ["112", "112PFP", "168", "220", "256", "258"],
  Yupoong: ["6606", "6006", "6506"],
};

export type HatVariant = {
  id: string;
  brand: "Richardson" | "Yupoong";
  model: string;
  name: string;
  colorName: string;
  basePrice: number;
  image?: string;
  backImage?: string; // Optional back view image
  popular?: boolean; // Mark best sellers
  ssPartNumber?: string; // SS Activewear part number for inventory
};

// Richardson 112 variants - images in /hats/richardson-112/
// SS Activewear part numbers added for real-time inventory
const richardson112Variants: HatVariant[] = [
  { id: "richardson-112-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Black_Front_High.jpg", backImage: "/hats/Richardson_112_Black_Back_High.jpg", popular: true, ssPartNumber: "112-BLK" },
  { id: "richardson-112-black-charcoal", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Black/Charcoal", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Black-_Charcoal_Front_High.jpg", popular: true, ssPartNumber: "112-BLKCH" },
  { id: "richardson-112-charcoal-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Black_Front_High.jpg", ssPartNumber: "112-CHBLK" },
  { id: "richardson-112-heather-grey-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Heather Grey/Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Heather_Grey-_Black_Front_High.jpg", popular: true, ssPartNumber: "112-HGBLK" },
  { id: "richardson-112-heather-grey-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Heather Grey/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Heather_Grey-_White_Front_High.jpg", ssPartNumber: "112-HGWHT" },
  { id: "richardson-112-black-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Black/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Black-_White_Front_High.jpg", popular: true, ssPartNumber: "112-BLKWHT" },
  { id: "richardson-112-charcoal-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_White_Front_High.jpg", popular: true, ssPartNumber: "112-CHWHT" },
  { id: "richardson-112-charcoal-neon-yellow", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Neon Yellow", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Neon_Yellow_Front_High.jpg", ssPartNumber: "112-CHNYEL" },
  { id: "richardson-112-charcoal-neon-green", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Neon Green", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Neon_Green_Front_High.jpg", ssPartNumber: "112-CHNGRN" },
  { id: "richardson-112-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_White_Front_High.jpg", popular: true, ssPartNumber: "112-WHT" },
  { id: "richardson-112-charcoal-neon-orange", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Neon Orange", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Neon_Orange_Front_High.jpg", ssPartNumber: "112-CHNORG" },
  { id: "richardson-112-royal-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Royal/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Royal-_White_Front_High.jpg", popular: true, ssPartNumber: "112-RYLWHT" },
  { id: "richardson-112-heather-grey-royal", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Heather Grey/Royal", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Heather_Grey-_Royal_Front_High.jpg", ssPartNumber: "112-HGRYL" },
  { id: "richardson-112-grey-charcoal-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Grey/Charcoal/Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Grey-_Charcoal-_Black_Front_High.jpg", ssPartNumber: "112-GRYCHBLK" },
  { id: "richardson-112-charcoal-neon-blue", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Neon Blue", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Neon_Blue_Front_High.jpg", ssPartNumber: "112-CHNBLU" },
  { id: "richardson-112-charcoal-red", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Red", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Red_Front_High.jpg", ssPartNumber: "112-CHRED" },
  { id: "richardson-112-charcoal-neon-pink", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Neon Pink", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Neon_Pink_Front_High.jpg", ssPartNumber: "112-CHNPNK" },
  { id: "richardson-112-charcoal-kelly", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Kelly", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Kelly_Front_High.jpg", ssPartNumber: "112-CHKEL" },
  { id: "richardson-112-white-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "White/Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_White-_Black_Front_High.jpg", ssPartNumber: "112-WHTBLK" },
  { id: "richardson-112-charcoal-royal", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Royal", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Royal_Front_High.jpg", ssPartNumber: "112-CHRYL" },
  { id: "richardson-112-navy", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Navy", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Navy_Front_High.jpg", popular: true, ssPartNumber: "112-NVY" },
  { id: "richardson-112-red-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Red/Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Red-_Black_Front_High.jpg", ssPartNumber: "112-REDBLK" },
  { id: "richardson-112-black-white-red", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Black/White/Red", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Black-_White-_Red_Front_High.jpg", ssPartNumber: "112-BLKWHTRED" },
  { id: "richardson-112-royal-white-red", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Royal/White/Red", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Royal-_White-_Red_Front_High.jpg", ssPartNumber: "112-RYLWHTRED" },
  { id: "richardson-112-red-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Red/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Red-_White_Front_High.jpg", ssPartNumber: "112-REDWHT" },
  { id: "richardson-112-maroon-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Maroon/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Maroon-_White_Front_High.jpg", ssPartNumber: "112-MRNWHT" },
  { id: "richardson-112-col-blue-white-navy", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Columbia Blue/White/Navy", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Columbia_Blue-_White-_Navy_Front_High.jpg", ssPartNumber: "112-COLWHTNVY" },
  { id: "richardson-112-hot-pink-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Hot Pink/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Hot_Pink-_White_Front_High.jpg", ssPartNumber: "112-HPNKWHT" },
  { id: "richardson-112-royal-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Royal/Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Royal-_Black_Front_High.jpg", ssPartNumber: "112-RYLBLK" },
  { id: "richardson-112-black-gold", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Black/Gold", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Black-_Gold_Front_High.jpg", ssPartNumber: "112-BLKGLD" },
  { id: "richardson-112-orange-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Orange/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Orange-_White_Front_High.jpg", ssPartNumber: "112-ORGWHT" },
  { id: "richardson-112-hot-pink-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Hot Pink/Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Hot_Pink-_Black_Front_High.jpg", ssPartNumber: "112-HPNKBLK" },
  { id: "richardson-112-navy-orange", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Navy/Orange", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Navy-_Orange_Front_High.jpg", ssPartNumber: "112-NVYORG" },
  // Additional colors from uploaded images
  { id: "richardson-112-cardinal", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Cardinal", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Cardinal_Front_High.jpg", ssPartNumber: "112-CAR" },
  { id: "richardson-112-cardinal-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Cardinal/Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Cardinal-_Black_Front_High.jpg", ssPartNumber: "112-CARBLK" },
  { id: "richardson-112-cardinal-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Cardinal/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Cardinal-_White_Front_High.jpg", ssPartNumber: "112-CARWHT" },
  { id: "richardson-112-columbia-blue", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Columbia Blue", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Columbia_Blue_Front_High.jpg", ssPartNumber: "112-COL" },
  { id: "richardson-112-columbia-blue-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Columbia Blue/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Columbia_Blue-_White_Front_High.jpg", ssPartNumber: "112-COLWHT" },
  { id: "richardson-112-dark-green", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Dark Green", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Dark_Green_Front_High.jpg", ssPartNumber: "112-DKG" },
  { id: "richardson-112-dark-green-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Dark Green/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Dark_Green-_White_Front_High.jpg", ssPartNumber: "112-DKGWHT" },
  { id: "richardson-112-kelly-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Kelly/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Kelly-_White_Front_High.jpg", ssPartNumber: "112-KELWHT" },
  { id: "richardson-112-loden", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Loden", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Loden_Front_High.jpg", ssPartNumber: "112-LOD" },
  { id: "richardson-112-loden-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Loden/Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Loden-_Black_Front_High.jpg", ssPartNumber: "112-LODBLK" },
  { id: "richardson-112-navy-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Navy/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Navy-_White_Front_High.jpg", popular: true, ssPartNumber: "112-NVYWHT" },
  { id: "richardson-112-orange", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Orange", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Orange_Front_High.jpg", ssPartNumber: "112-ORG" },
  { id: "richardson-112-orange-black", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Orange/Black", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Orange-_Black_Front_High.jpg", ssPartNumber: "112-ORGBLK" },
  { id: "richardson-112-purple", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Purple", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Purple_Front_High.jpg", ssPartNumber: "112-PRP" },
  { id: "richardson-112-purple-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Purple/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Purple-_White_Front_High.jpg", ssPartNumber: "112-PRPWHT" },
  { id: "richardson-112-red", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Red", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Red_Front_High.jpg", ssPartNumber: "112-RED" },
  { id: "richardson-112-royal", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Royal", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Royal_Front_High.jpg", ssPartNumber: "112-RYL" },
  { id: "richardson-112-brown-khaki", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Brown/Khaki", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Brown-_Khaki_Front_High.jpg", ssPartNumber: "112-BRNKHI" },
  { id: "richardson-112-khaki-coffee", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Khaki/Coffee", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Khaki-_Coffee_Front_High.jpg", ssPartNumber: "112-KHICOF" },
  { id: "richardson-112-khaki-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Khaki/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Khaki-_White_Front_High.jpg", ssPartNumber: "112-KHIWHT" },
  { id: "richardson-112-navy-khaki", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Navy/Khaki", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Navy-_Khaki_Front_High.jpg", ssPartNumber: "112-NVYKHI" },
  { id: "richardson-112-charcoal-navy", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Navy", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Navy_Front_High.jpg", ssPartNumber: "112-CHNVY" },
  { id: "richardson-112-charcoal-columbia-blue", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Columbia Blue", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Columbia_Blue_Front_High.jpg", ssPartNumber: "112-CHCOL" },
  { id: "richardson-112-charcoal-orange", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Charcoal/Orange", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Charcoal-_Orange_Front_High.jpg", ssPartNumber: "112-CHORG" },
  { id: "richardson-112-cyan-white", brand: "Richardson", model: "112", name: "Richardson 112", colorName: "Cyan/White", basePrice: 22, image: "/hats/richardson-112/Richardson_112_Cyan-_White_Front_High.jpg", ssPartNumber: "112-CYNWHT" },
];

// Richardson 112PFP (Camo/Pattern) variants - images in /hats/richardson-112pfp/
// SS Activewear part numbers added for real-time inventory
const richardson112PFPVariants: HatVariant[] = [
  { id: "richardson-112pfp-realtree-edge-brown", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Realtree Edge/Brown", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Realtree_Edge-_Brown_Front_High.jpg", ssPartNumber: "112PFP-RTEDGBRN" },
  { id: "richardson-112pfp-mossy-oak-country-dna-black", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Mossy Oak Country DNA/Black", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Mossy_Oak_Country_DNA-_Black_Front_High.jpg", ssPartNumber: "112PFP-MOCDNABLK" },
  { id: "richardson-112pfp-kryptek-typhon-black", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Kryptek Typhon/Black", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Kryptek_Typhon-_Black_Front_High.jpg", ssPartNumber: "112PFP-KRYTYPBLK" },
  { id: "richardson-112pfp-admiral-duck-camo-black", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Admiral Duck Camo/Black", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Admiral_Duck_Camo-_Black_Front_High.jpg", ssPartNumber: "112PFP-ADCDBLK" },
  { id: "richardson-112pfp-bark-duck-camo-brown", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Bark Duck Camo/Brown", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Bark_Duck_Camo-_Brown_Front_High.jpg", ssPartNumber: "112PFP-BKDCBRN" },
  { id: "richardson-112pfp-blaze-duck-camo-blaze", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Blaze Duck Camo/Blaze", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Blaze_Duck_Camo-_Blaze_Front_High.jpg", ssPartNumber: "112PFP-BZDCBLZ" },
  { id: "richardson-112pfp-desert-camo-brown", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Desert Camo/Brown", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Desert_Camo-_Brown_Front_High.jpg", ssPartNumber: "112PFP-DESCBRN" },
  { id: "richardson-112pfp-digital-camo-light-green", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Digital Camo/Light Green", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Digital_Camo-_Light_Green_Front_High.jpg", ssPartNumber: "112PFP-DIGCLGRN" },
  { id: "richardson-112pfp-green-camo-black", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Green Camo/Black", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Green_Camo-_Black_Front_High.jpg", ssPartNumber: "112PFP-GRNCBLK" },
  { id: "richardson-112pfp-green-camo-white", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Green Camo/White", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Green_Camo-_White_Front_High.jpg", ssPartNumber: "112PFP-GRNCWHT" },
  { id: "richardson-112pfp-kryptek-highlander-buck", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Kryptek Highlander/Buck", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Kryptek_Highlander-_Buck_Front_High.jpg", ssPartNumber: "112PFP-KRYHIBRN" },
  { id: "richardson-112pfp-kryptek-inferno-black", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Kryptek Inferno/Black", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Kryptek_Inferno-_Black_Front_High.jpg", ssPartNumber: "112PFP-KRYINFBLK" },
  { id: "richardson-112pfp-kryptek-inferno-blaze-orange", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Kryptek Inferno/Blaze Orange", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Kryptek_Inferno-_Blaze_Orange_Front_High.jpg", ssPartNumber: "112PFP-KRYINFBLZ" },
  { id: "richardson-112pfp-kryptek-neptune-black", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Kryptek Neptune/Black", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Kryptek_Neptune-_Black_Front_High.jpg", ssPartNumber: "112PFP-KRYNEPBLK" },
  { id: "richardson-112pfp-kryptek-neptune-white", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Kryptek Neptune/White", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Kryptek_Neptune-_White_Front_High.jpg", ssPartNumber: "112PFP-KRYNEPWHT" },
  { id: "richardson-112pfp-kryptek-pontus-white", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Kryptek Pontus/White", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Kryptek_Pontus-_White_Front_High.jpg", ssPartNumber: "112PFP-KRYPONWHT" },
  { id: "richardson-112pfp-kryptek-typhon-neon-orange", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Kryptek Typhon/Neon Orange", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Kryptek_Typhon-_Neon_Orange_Front_High.jpg", ssPartNumber: "112PFP-KRYTYPNORG" },
  { id: "richardson-112pfp-kryptek-typhon-neon-pink", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Kryptek Typhon/Neon Pink", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Kryptek_Typhon-_Neon_Pink_Front_High.jpg", ssPartNumber: "112PFP-KRYTYPNPNK" },
  { id: "richardson-112pfp-kryptek-typhon-neon-yellow", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Kryptek Typhon/Neon Yellow", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Kryptek_Typhon-_Neon_Yellow_Front_High.jpg", ssPartNumber: "112PFP-KRYTYPNYEL" },
  { id: "richardson-112pfp-marsh-duck-camo-loden", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Marsh Duck Camo/Loden", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Marsh_Duck_Camo-_Loden_Front_High.jpg", backImage: "/hats/Richardson_112PFP_Marsh_Duck_Camo-_Loden_Back_High.jpg", popular: true, ssPartNumber: "112PFP-MRDCLOD" },
  { id: "richardson-112pfp-mossy-oak-bottomland-loden", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Mossy Oak Bottomland/Loden", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Mossy_Oak_Bottomland-_Loden_Front_High.jpg", ssPartNumber: "112PFP-MOBLLOD" },
  { id: "richardson-112pfp-mossy-oak-elements-blacktip-charcoal", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Mossy Oak Elements Blacktip/Charcoal", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Mossy_Oak_Elements_Blacktip-_Charcoal_Front_High.jpg", ssPartNumber: "112PFP-MOEBCH" },
  { id: "richardson-112pfp-mossy-oak-elements-bonefish-light-grey", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Mossy Oak Elements Bonefish/Light Grey", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Mossy_Oak_Elements_Bonefish-_Light_Grey_Front_High.jpg", ssPartNumber: "112PFP-MOEBFLGY" },
  { id: "richardson-112pfp-mossy-oak-habitat-brown", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Mossy Oak Habitat/Brown", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Mossy_Oak_Habitat-_Brown_Front_High.jpg", ssPartNumber: "112PFP-MOHBRN" },
  { id: "richardson-112pfp-realtree-edge-neon-orange", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Realtree Edge/Neon Orange", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Realtree_Edge-_Neon_Orange_Front_High.jpg", ssPartNumber: "112PFP-RTEDGNORG" },
  { id: "richardson-112pfp-realtree-edge-neon-pink", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Realtree Edge/Neon Pink", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Realtree_Edge-_Neon_Pink_Front_High.jpg", ssPartNumber: "112PFP-RTEDGNPNK" },
  { id: "richardson-112pfp-realtree-edge-neon-yellow", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Realtree Edge/Neon Yellow", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Realtree_Edge-_Neon_Yellow_Front_High.jpg", ssPartNumber: "112PFP-RTEDGNYEL" },
  { id: "richardson-112pfp-realtree-escape-black", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Realtree Escape/Black", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Realtree_Escape-_Black_Front_High.jpg", ssPartNumber: "112PFP-RTESCBLK" },
  { id: "richardson-112pfp-realtree-max1-brown", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Realtree Max-1/Brown", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Realtree_Max-1-_Brown_Front_High.jpg", ssPartNumber: "112PFP-RTM1BRN" },
  { id: "richardson-112pfp-realtree-max7-buck", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Realtree Max-7/Buck", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Realtree_Max-7-_Buck_Front_High.jpg", ssPartNumber: "112PFP-RTM7BRN" },
  { id: "richardson-112pfp-realtree-original-black", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Realtree Original/Black", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Realtree_Original-_Black_Front_High.jpg", ssPartNumber: "112PFP-RTOGBLK" },
  { id: "richardson-112pfp-realtree-timber-black", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Realtree Timber/Black", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Realtree_Timber-_Black_Front_High.jpg", ssPartNumber: "112PFP-RTTMBLK" },
  { id: "richardson-112pfp-sable-duck-camo-black", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Sable Duck Camo/Black", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Sable_Duck_Camo-_Black_Front_High.jpg", ssPartNumber: "112PFP-SBDCBLK" },
  { id: "richardson-112pfp-saltwater-duck-camo-charcoal", brand: "Richardson", model: "112PFP", name: "Richardson 112PFP", colorName: "Saltwater Duck Camo/Charcoal", basePrice: 24, image: "/hats/richardson-112pfp/Richardson_112PFP_Saltwater_Duck_Camo-_Charcoal_Front_High.jpg", ssPartNumber: "112PFP-SWDCCH" },
];

// Richardson 168 variants - images in /hats/richardson-168/
// SS Activewear part numbers added for real-time inventory
const richardson168Variants: HatVariant[] = [
  { id: "richardson-168-black", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Black", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Black_Front_High.jpg", backImage: "/hats/Richardson_168_Black_Back_High.jpg", popular: true, ssPartNumber: "168-BLK" },
  { id: "richardson-168-black-camo-loden", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Black/Camo/Loden", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Black-_Camo-_Loden_Front_High.jpg", ssPartNumber: "168-BLKCAMLOD" },
  { id: "richardson-168-brown-khaki", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Brown/Khaki", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Brown-_Khaki_Front_High.jpg", ssPartNumber: "168-BRNKHI" },
  { id: "richardson-168-caramel", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Caramel", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Caramel_Front_High.jpg", ssPartNumber: "168-CAR" },
  { id: "richardson-168-charcoal", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Charcoal", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Charcoal_Front_High.jpg", popular: true, ssPartNumber: "168-CHAR" },
  { id: "richardson-168-charcoal-black", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Charcoal/Black", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Charcoal-_Black_Front_High.jpg", popular: true, ssPartNumber: "168-CHBLK" },
  { id: "richardson-168-charcoal-black-white", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Charcoal/Black/White", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Charcoal-_Black-_White_Front_High.jpg", ssPartNumber: "168-CHBLKWHT" },
  { id: "richardson-168-charcoal-burnt-orange-black", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Charcoal/Burnt Orange/Black", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Charcoal-_Burnt_Orange-_Black_Front_High.jpg", ssPartNumber: "168-CHBORGBLK" },
  { id: "richardson-168-charcoal-old-gold", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Charcoal/Old Gold", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Charcoal-_Old_Gold_Front_High.jpg", ssPartNumber: "168-CHOGLD" },
  { id: "richardson-168-dark-green-black", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Dark Green/Black", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Dark_Green-_Black_Front_High.jpg", ssPartNumber: "168-DKGBLK" },
  { id: "richardson-168-heather-grey-black", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Heather Grey/Black", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Heather_Grey-_Black_Front_High.jpg", popular: true, ssPartNumber: "168-HGBLK" },
  { id: "richardson-168-loden-green", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Loden Green", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Loden_Green_Front_High.jpg", ssPartNumber: "168-LODGRN" },
  { id: "richardson-168-navy", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Navy", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Navy_Front_High.jpg", popular: true, ssPartNumber: "168-NVY" },
  { id: "richardson-168-pale-khaki-loden-green", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Pale Khaki/Loden Green", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Pale_Khaki-_Loden_Green_Front_High.jpg", ssPartNumber: "168-PKHILODGRN" },
  { id: "richardson-168-red-black", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Red/Black", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Red-_Black_Front_High.jpg", ssPartNumber: "168-REDBLK" },
  { id: "richardson-168-royal-black", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "Royal/Black", basePrice: 24, image: "/hats/richardson-168/Richardson_168_Royal-_Black_Front_High.jpg", ssPartNumber: "168-RYLBLK" },
  { id: "richardson-168-white", brand: "Richardson", model: "168", name: "Richardson 168", colorName: "White", basePrice: 24, image: "/hats/richardson-168/Richardson_168_White_Front_High.jpg", ssPartNumber: "168-WHT" },
];

// Richardson 220 variants - images in /hats/richardson-220/
// SS Activewear part numbers added for real-time inventory
const richardson220Variants: HatVariant[] = [
  { id: "richardson-220-black", brand: "Richardson", model: "220", name: "Richardson 220", colorName: "Black", basePrice: 25, image: "/hats/richardson-220/Richardson_220_Black_Front_High.jpg", backImage: "/hats/Richardson_220_Black_Back_High.jpg", popular: true, ssPartNumber: "220-BLK" },
  { id: "richardson-220-navy", brand: "Richardson", model: "220", name: "Richardson 220", colorName: "Navy", basePrice: 25, image: "/hats/richardson-220/Richardson_220_Navy_Front_High.jpg", popular: true, ssPartNumber: "220-NVY" },
  { id: "richardson-220-charcoal", brand: "Richardson", model: "220", name: "Richardson 220", colorName: "Charcoal", basePrice: 25, image: "/hats/richardson-220/Richardson_220_Charcoal_Front_High.jpg", popular: true, ssPartNumber: "220-CHAR" },
  { id: "richardson-220-white", brand: "Richardson", model: "220", name: "Richardson 220", colorName: "White", basePrice: 25, image: "/hats/richardson-220/Richardson_220_White_Front_High.jpg", ssPartNumber: "220-WHT" },
  { id: "richardson-220-dark-green", brand: "Richardson", model: "220", name: "Richardson 220", colorName: "Dark Green", basePrice: 25, image: "/hats/richardson-220/Richardson_220_Dark_Green_Front_High.jpg", ssPartNumber: "220-DKG" },
  { id: "richardson-220-maroon", brand: "Richardson", model: "220", name: "Richardson 220", colorName: "Maroon", basePrice: 25, image: "/hats/richardson-220/Richardson_220_Maroon_Front_High.jpg", ssPartNumber: "220-MRN" },
  { id: "richardson-220-red", brand: "Richardson", model: "220", name: "Richardson 220", colorName: "Red", basePrice: 25, image: "/hats/richardson-220/Richardson_220_Red_Front_High.jpg", ssPartNumber: "220-RED" },
  { id: "richardson-220-stone", brand: "Richardson", model: "220", name: "Richardson 220", colorName: "Stone", basePrice: 25, image: "/hats/richardson-220/Richardson_220_Stone_Front_High.jpg", ssPartNumber: "220-STN" },
];

// Richardson 258 variants - images in /hats/richardson-258/
// SS Activewear part numbers added for real-time inventory
const richardson258Variants: HatVariant[] = [
  { id: "richardson-258-black-white", brand: "Richardson", model: "258", name: "Richardson 258", colorName: "Black/White", basePrice: 28, image: "/hats/richardson-258/Richardson_258_Black-_White_Front_High.jpg", popular: true, ssPartNumber: "258-BLKWHT" },
  { id: "richardson-258-navy-white", brand: "Richardson", model: "258", name: "Richardson 258", colorName: "Navy/White", basePrice: 28, image: "/hats/richardson-258/Richardson_258_Navy-_White_Front_High.jpg", popular: true, ssPartNumber: "258-NVYWHT" },
  { id: "richardson-258-white-black", brand: "Richardson", model: "258", name: "Richardson 258", colorName: "White/Black", basePrice: 28, image: "/hats/richardson-258/Richardson_258_White-Black_Front_High.jpg", popular: true, ssPartNumber: "258-WHTBLK" },
  { id: "richardson-258-dark-grey-white", brand: "Richardson", model: "258", name: "Richardson 258", colorName: "Dark Grey/White", basePrice: 28, image: "/hats/richardson-258/Richardson_258_Dark_Grey-_White_Front_High.jpg", ssPartNumber: "258-DKGWHT" },
  { id: "richardson-258-dark-olive-green-white", brand: "Richardson", model: "258", name: "Richardson 258", colorName: "Dark Olive Green/White", basePrice: 28, image: "/hats/richardson-258/Richardson_258_Dark_Olive_Green-_White_Front_High.jpg", ssPartNumber: "258-DOLVWHT" },
  { id: "richardson-258-light-blue-white", brand: "Richardson", model: "258", name: "Richardson 258", colorName: "Light Blue/White", basePrice: 28, image: "/hats/richardson-258/Richardson_258_Light_Blue-_White_Front_High.jpg", ssPartNumber: "258-LTBLWHT" },
  { id: "richardson-258-light-grey-white", brand: "Richardson", model: "258", name: "Richardson 258", colorName: "Light Grey/White", basePrice: 28, image: "/hats/richardson-258/Richardson_258_Light_Grey-_White_Front_High.jpg", ssPartNumber: "258-LTGWHT" },
  { id: "richardson-258-red-white", brand: "Richardson", model: "258", name: "Richardson 258", colorName: "Red/White", basePrice: 28, image: "/hats/richardson-258/Richardson_258_Red-_White_Front_High.jpg", ssPartNumber: "258-REDWHT" },
  { id: "richardson-258-white-navy", brand: "Richardson", model: "258", name: "Richardson 258", colorName: "White/Navy", basePrice: 28, image: "/hats/richardson-258/Richardson_258_White-_Navy_Front_High.jpg", ssPartNumber: "258-WHTNVY" },
];

// Richardson 256 variants - images in /hats/richardson-256/
// SS Activewear part numbers added for real-time inventory
const richardson256Variants: HatVariant[] = [
  { id: "richardson-256-black-black", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Black/Black", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Black-_Black_Front_High.jpg", popular: true, ssPartNumber: "256-BLKBLK" },
  { id: "richardson-256-charcoal-white", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Charcoal/White", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Charcoal-_White_Front_High.jpg", popular: true, ssPartNumber: "256-CHARWHT" },
  { id: "richardson-256-navy-white", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Navy/White", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Navy-_White_Front_High.jpg", popular: true, ssPartNumber: "256-NVYWHT" },
  { id: "richardson-256-birch-black", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Birch/Black", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Birch-_Black_Front_High.jpg", ssPartNumber: "256-BIRBLK" },
  { id: "richardson-256-biscuit-black", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Biscuit/Black", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Biscuit-_Black_Front_High.jpg", ssPartNumber: "256-BISBLK" },
  { id: "richardson-256-cardinal-white", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Cardinal/White", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Cardinal-_White_Front_High.jpg", ssPartNumber: "256-CARWHT" },
  { id: "richardson-256-dark-orange-black", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Dark Orange/Black", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Dark_Orange-_Black_Front_High.jpg", ssPartNumber: "256-DORGBLK" },
  { id: "richardson-256-loden-amber-gold", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Loden/Amber Gold", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Loden-_Amber_Gold_Front_High.jpg", ssPartNumber: "256-LODAMB" },
  { id: "richardson-256-navy-red", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Navy/Red", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Navy-_Red_Front_High.jpg", ssPartNumber: "256-NVYRED" },
  { id: "richardson-256-pale-peach-maroon", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Pale Peach/Maroon", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Pale_Peach-_Maroon_Front_High.jpg", ssPartNumber: "256-PLPMRN" },
  { id: "richardson-256-red-white", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "Red/White", basePrice: 25, image: "/hats/richardson-256/Richardson_256_Red-_White_Front_High.jpg", ssPartNumber: "256-REDWHT" },
  { id: "richardson-256-white-black", brand: "Richardson", model: "256", name: "Richardson 256", colorName: "White/Black", basePrice: 25, image: "/hats/richardson-256/Richardson_256_White-_Black_Front_High.jpg", ssPartNumber: "256-WHTBLK" },
];

// Yupoong 6606 variants - images in /hats/yupoong-6606/
// SS Activewear part numbers added for real-time inventory
const yupoong6606Variants: HatVariant[] = [
  // Popular colors
  { id: "yupoong-6606-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Black", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Black_Front_High.jpg", popular: true, ssPartNumber: "6606-BLK" },
  { id: "yupoong-6606-black-white", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Black/White", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Black-_White_Front_High.jpg", popular: true, ssPartNumber: "6606-BLKWHT" },
  { id: "yupoong-6606-navy", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Navy", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Navy_Front_High.jpg", popular: true, ssPartNumber: "6606-NVY" },
  { id: "yupoong-6606-heather-grey-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Heather Grey/Black", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Heather_Grey-_Black_Front_High.jpg", popular: true, ssPartNumber: "6606-HGBLK" },
  // Solid colors
  { id: "yupoong-6606-black-white-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Black/White/Black", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Black-_White-_Black_Front_High.jpg", ssPartNumber: "6606-BLKWHTBLK" },
  { id: "yupoong-6606-brown-khaki", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Brown/Khaki", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Brown-_Khaki_Front_High.jpg", ssPartNumber: "6606-BRNKHI" },
  { id: "yupoong-6606-caramel", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Caramel", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Caramel_Front_High.jpg", ssPartNumber: "6606-CAR" },
  { id: "yupoong-6606-caramel-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Caramel/Black", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Caramel-_Black_Front_High.jpg", ssPartNumber: "6606-CARBLK" },
  { id: "yupoong-6606-charcoal", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Charcoal", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Charcoal_Front_High.jpg", ssPartNumber: "6606-CHAR" },
  { id: "yupoong-6606-charcoal-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Charcoal/Black", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Charcoal-_Black_Front_High.jpg", ssPartNumber: "6606-CHARBLK" },
  { id: "yupoong-6606-charcoal-navy", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Charcoal/Navy", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Charcoal-_Navy_Front_High.jpg", ssPartNumber: "6606-CHARNVY" },
  { id: "yupoong-6606-charcoal-neon-green", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Charcoal/Neon Green", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Charcoal-_Neon_Green_Front_High.jpg", ssPartNumber: "6606-CHARNGRN" },
  { id: "yupoong-6606-charcoal-neon-orange", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Charcoal/Neon Orange", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Charcoal-_Neon_Orange_Front_High.jpg", ssPartNumber: "6606-CHARNORG" },
  { id: "yupoong-6606-charcoal-white", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Charcoal/White", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Charcoal-_White_Front_High.jpg", ssPartNumber: "6606-CHARWHT" },
  { id: "yupoong-6606-coyote-brown-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Coyote Brown/Black", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Coyote_Brown-_Black_Front_High.jpg", ssPartNumber: "6606-COYBLK" },
  { id: "yupoong-6606-cranberry", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Cranberry", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Cranberry_Front_High.jpg", ssPartNumber: "6606-CRAN" },
  { id: "yupoong-6606-dark-heather-grey", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Dark Heather Grey", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Dark_Heather_Grey_Front_High.jpg", ssPartNumber: "6606-DKHG" },
  { id: "yupoong-6606-evergreen", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Evergreen", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Evergreen_Front_High.jpg", ssPartNumber: "6606-EGRN" },
  { id: "yupoong-6606-evergreen-white", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Evergreen/White", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Evergreen-_White_Front_High.jpg", ssPartNumber: "6606-EGRNWHT" },
  { id: "yupoong-6606-heather-grey-white", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Heather Grey/White", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Heather_Grey-_White_Front_High.jpg", ssPartNumber: "6606-HGWHT" },
  { id: "yupoong-6606-khaki", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Khaki", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Khaki_Front_High.jpg", ssPartNumber: "6606-KHI" },
  { id: "yupoong-6606-maroon-grey", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Maroon/Grey", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Maroon-_Grey_Front_High.jpg", ssPartNumber: "6606-MRNGRY" },
  { id: "yupoong-6606-moss-khaki", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Moss/Khaki", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Moss-_Khaki_Front_High.jpg", ssPartNumber: "6606-MOSSKHI" },
  { id: "yupoong-6606-navy-silver", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Navy/Silver", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Navy-_Silver_Front_High.jpg", ssPartNumber: "6606-NVYSLV" },
  { id: "yupoong-6606-navy-white", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Navy/White", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Navy-_White_Front_High.jpg", ssPartNumber: "6606-NVYWHT" },
  { id: "yupoong-6606-navy-white-navy", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Navy/White/Navy", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Navy-_White-_Navy_Front_High.jpg", ssPartNumber: "6606-NVYWHTNVY" },
  { id: "yupoong-6606-pink", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Pink", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Pink_Front_High.jpg", ssPartNumber: "6606-PNK" },
  { id: "yupoong-6606-poseidon-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Poseidon/Black", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Poseidon_Black_Front_High.jpg", ssPartNumber: "6606-POSBLK" },
  { id: "yupoong-6606-red", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Red", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Red_Front_High.jpg", ssPartNumber: "6606-RED" },
  { id: "yupoong-6606-red-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Red/Black", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Red-_Black_Front_High.jpg", ssPartNumber: "6606-REDBLK" },
  { id: "yupoong-6606-red-white", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Red/White", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Red-_White_Front_High.jpg", ssPartNumber: "6606-REDWHT" },
  { id: "yupoong-6606-royal-white", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Royal/White", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Royal-_White_Front_High.jpg", ssPartNumber: "6606-RYLWHT" },
  { id: "yupoong-6606-rustic-orange-khaki", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Rustic Orange/Khaki", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Rustic_Orange-_Khaki_Front_High.jpg", ssPartNumber: "6606-RORGKHI" },
  { id: "yupoong-6606-silver", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Silver", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Silver_Front_High.jpg", ssPartNumber: "6606-SLV" },
  { id: "yupoong-6606-steel-blue-silver", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Steel Blue/Silver", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Steel_Blue-_Silver_Front_High.jpg", ssPartNumber: "6606-STBSLV" },
  { id: "yupoong-6606-turquoise-white", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Turquoise/White", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_Turquoise-_White_Front_High.jpg", ssPartNumber: "6606-TRQWHT" },
  { id: "yupoong-6606-white", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "White", basePrice: 21, image: "/hats/yupoong-6606/YP_Classics_6606_White_Front_High.jpg", ssPartNumber: "6606-WHT" },
  // Camo patterns (+$2)
  { id: "yupoong-6606-green-camo-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Green Camo/Black", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Green_Camo-_Black_Front_High.jpg", ssPartNumber: "6606-GCBLK" },
  { id: "yupoong-6606-kryptek-highlander", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Kryptek Highlander", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Kryptek_Highlander_Front_High.jpg", ssPartNumber: "6606-KRYHI" },
  { id: "yupoong-6606-kryptek-pontus", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Kryptek Pontus", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Kryptek_Pontus_Front_High.jpg", ssPartNumber: "6606-KRYPON" },
  { id: "yupoong-6606-kryptek-raid", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Kryptek Raid", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Kryptek_Raid_Front_High.jpg", ssPartNumber: "6606-KRYRAID" },
  { id: "yupoong-6606-kryptek-typhon", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Kryptek Typhon", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Kryptek_Typhon_Front_High.jpg", ssPartNumber: "6606-KRYTYP" },
  { id: "yupoong-6606-kryptek-wraith", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Kryptek Wraith", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Kryptek_Wraith_Front_High.jpg", ssPartNumber: "6606-KRYWRA" },
  { id: "yupoong-6606-multicam-alpine-white", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Multicam Alpine/White", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Multicam_Alpine-_White_Front_High.jpg", ssPartNumber: "6606-MCALPWHT" },
  { id: "yupoong-6606-multicam-arid-brown", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Multicam Arid/Brown", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Multicam_Arid-_Brown_Front_High.jpg", ssPartNumber: "6606-MCARIBRN" },
  { id: "yupoong-6606-multicam-arid-tan", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Multicam Arid/Tan", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Multicam_Arid-_Tan_Front_High.jpg", ssPartNumber: "6606-MCARITAN" },
  { id: "yupoong-6606-multicam-black-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Multicam Black/Black", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Multicam_Black-_Black_Front_High.jpg", ssPartNumber: "6606-MCBLKBLK" },
  { id: "yupoong-6606-multicam-green-black", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Multicam Green/Black", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Multicam_Green-_Black_Front_High.jpg", ssPartNumber: "6606-MCGRNBLK" },
  { id: "yupoong-6606-multicam-green-khaki", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Multicam Green/Khaki", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Multicam_Green-_Khaki_Front_High.jpg", ssPartNumber: "6606-MCGRNKHI" },
  { id: "yupoong-6606-multicam-tropic-green", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Multicam Tropic/Green", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Multicam_Tropic-_Green_Front_High.jpg", ssPartNumber: "6606-MCTROPGRN" },
  { id: "yupoong-6606-realtree-edge-brown", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Realtree Edge/Brown", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Realtree_Edge-_Brown_Front_High.jpg", ssPartNumber: "6606-RTEDGBRN" },
  { id: "yupoong-6606-realtree-max7-brown", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Realtree Max7/Brown", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Realtree_Max7-_Brown_Front_High.jpg", ssPartNumber: "6606-RTM7BRN" },
  { id: "yupoong-6606-veil-wideland", brand: "Yupoong", model: "6606", name: "Yupoong 6606", colorName: "Veil Wideland", basePrice: 23, image: "/hats/yupoong-6606/YP_Classics_6606_Veil_Wideland_Front_High.jpg", ssPartNumber: "6606-VEILWL" },
];

// Yupoong 6006 variants - images in /hats/yupoong-6006/
// SS Activewear part numbers added for real-time inventory
const yupoong6006Variants: HatVariant[] = [
  { id: "yupoong-6006-black", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Black", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Black_Front_High.jpg", popular: true, ssPartNumber: "6006-BLK" },
  { id: "yupoong-6006-black-white", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Black/White", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Black-_White_Front_High.jpg", popular: true, ssPartNumber: "6006-BLKWHT" },
  { id: "yupoong-6006-navy", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Navy", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Navy_Front_High.jpg", popular: true, ssPartNumber: "6006-NVY" },
  { id: "yupoong-6006-charcoal", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Charcoal", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Charcoal_Front_High.jpg", ssPartNumber: "6006-CHAR" },
  { id: "yupoong-6006-white", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "White", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_White_Front_High.jpg", ssPartNumber: "6006-WHT" },
  { id: "yupoong-6006-black-white-black", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Black/White/Black", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Black-_White-_Black_Front_High.jpg", ssPartNumber: "6006-BLKWHTBLK" },
  { id: "yupoong-6006-brown-white", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Brown/White", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Brown-_White_Front_High.jpg", ssPartNumber: "6006-BRNWHT" },
  { id: "yupoong-6006-brown-white-brown", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Brown/White/Brown", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Brown-_White-_Brown_Front_High.jpg", ssPartNumber: "6006-BRNWHTBRN" },
  { id: "yupoong-6006-carolina-blue-white", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Carolina Blue/White/Carolina Blue", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Carolina_Blue-_White-_Caroline_Blue_Front_High.jpg", ssPartNumber: "6006-CBWHTCB" },
  { id: "yupoong-6006-charcoal-black", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Charcoal/Black", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Charcoal-_Black_Front_High.jpg", ssPartNumber: "6006-CHARBLK" },
  { id: "yupoong-6006-charcoal-white", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Charcoal/White", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Charcoal-_White_Front_High.jpg", ssPartNumber: "6006-CHARWHT" },
  { id: "yupoong-6006-green-camo-black", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Green Camo/Black", basePrice: 23, image: "/hats/yupoong-6006/YP_Classics_6006_Green_Camo-_Black_Front_High.jpg", ssPartNumber: "6006-GCBLK" },
  { id: "yupoong-6006-heather-black", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Heather/Black", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Heather-_Black_Front_High.jpg", ssPartNumber: "6006-HGBLK" },
  { id: "yupoong-6006-heather-white", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Heather/White", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Heather-_White_Front_High.jpg", ssPartNumber: "6006-HGWHT" },
  { id: "yupoong-6006-kelly-white-kelly", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Kelly/White/Kelly", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Kelly-_White-_Kelly_Front_High.jpg", ssPartNumber: "6006-KELWHTKEL" },
  { id: "yupoong-6006-multicam-alpine-white", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Multicam Alpine/White", basePrice: 23, image: "/hats/yupoong-6006/YP_Classics_6006_Multicam_Alpine-_White_Front_High.jpg", ssPartNumber: "6006-MCALPWHT" },
  { id: "yupoong-6006-multicam-arid-brown", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Multicam Arid/Brown", basePrice: 23, image: "/hats/yupoong-6006/YP_Classics_6006_Multicam_Arid-_Brown_Front_High.jpg", ssPartNumber: "6006-MCARIBRN" },
  { id: "yupoong-6006-multicam-arid-tan", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Multicam Arid/Tan", basePrice: 23, image: "/hats/yupoong-6006/YP_Classics_6006_Multicam_Arid-_Tan_Front_High.jpg", ssPartNumber: "6006-MCARITAN" },
  { id: "yupoong-6006-multicam-black-black", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Multicam Black/Black", basePrice: 23, image: "/hats/yupoong-6006/YP_Classics_6006_Multicam_Black-_Black_Front_High.jpg", ssPartNumber: "6006-MCBLKBLK" },
  { id: "yupoong-6006-multicam-green-black", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Multicam Green/Black", basePrice: 23, image: "/hats/yupoong-6006/YP_Classics_6006_Multicam_Green-_Black_Front_High.jpg", ssPartNumber: "6006-MCGRNBLK" },
  { id: "yupoong-6006-multicam-tropic-green", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Multicam Tropic/Green", basePrice: 23, image: "/hats/yupoong-6006/YP_Classics_6006_Multicam_Tropic-_Green_Front_High.jpg", ssPartNumber: "6006-MCTROPGRN" },
  { id: "yupoong-6006-navy-white", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Navy/White", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Navy-_White_Front_High.jpg", ssPartNumber: "6006-NVYWHT" },
  { id: "yupoong-6006-navy-white-navy", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Navy/White/Navy", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Navy-_White-_Navy_Front_High.jpg", ssPartNumber: "6006-NVYWHTNVY" },
  { id: "yupoong-6006-pink", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Pink", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Pink_Front_High.jpg", ssPartNumber: "6006-PNK" },
  { id: "yupoong-6006-pink-white-pink", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Pink/White/Pink", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Pink-_White-_Pink_Front_High.jpg", ssPartNumber: "6006-PNKWHTPNK" },
  { id: "yupoong-6006-red", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Red", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Red_Front_High.jpg", ssPartNumber: "6006-RED" },
  { id: "yupoong-6006-red-black", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Red/Black", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Red-_Black_Front_High.jpg", ssPartNumber: "6006-REDBLK" },
  { id: "yupoong-6006-red-white-red", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Red/White/Red", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Red-_White-_Red_Front_High.jpg", ssPartNumber: "6006-REDWHTRED" },
  { id: "yupoong-6006-royal-white", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Royal/White", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Royal-_White_Front_High.jpg", ssPartNumber: "6006-RYLWHT" },
  { id: "yupoong-6006-royal-white-royal", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Royal/White/Royal", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Royal-_White-_Royal_Front_High.jpg", ssPartNumber: "6006-RYLWHTRYL" },
  { id: "yupoong-6006-silver-black", brand: "Yupoong", model: "6006", name: "Yupoong 6006", colorName: "Silver/Black", basePrice: 21, image: "/hats/yupoong-6006/YP_Classics_6006_Silver-_Black_Front_High.jpg", ssPartNumber: "6006-SLVBLK" },
];

// Yupoong 6506 variants - images in /hats/yupoong-6506/
// SS Activewear part numbers added for real-time inventory
const yupoong6506Variants: HatVariant[] = [
  { id: "yupoong-6506-black", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Black", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Black_Front_High.jpg", popular: true, ssPartNumber: "6506-BLK" },
  { id: "yupoong-6506-black-white", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Black/White", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Black-_White_Front_High.jpg", popular: true, ssPartNumber: "6506-BLKWHT" },
  { id: "yupoong-6506-navy", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Navy", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Navy_Front_High.jpg", popular: true, ssPartNumber: "6506-NVY" },
  { id: "yupoong-6506-brown-khaki", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Brown/Khaki", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Brown-_Khaki_Front_High.jpg", ssPartNumber: "6506-BRNKHI" },
  { id: "yupoong-6506-charcoal", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Charcoal", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Charcoal_Front_High.jpg", ssPartNumber: "6506-CHAR" },
  { id: "yupoong-6506-charcoal-white", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Charcoal/White", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Charcoal-_White_Front_High.jpg", ssPartNumber: "6506-CHARWHT" },
  { id: "yupoong-6506-heather-black", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Heather/Black", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Heather-_Black_Front_High.jpg", ssPartNumber: "6506-HGBLK" },
  { id: "yupoong-6506-heather-white", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Heather/White", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Heather-_White_Front_High.jpg", ssPartNumber: "6506-HGWHT" },
  { id: "yupoong-6506-khaki", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Khaki", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Khaki_Front_High.jpg", ssPartNumber: "6506-KHI" },
  { id: "yupoong-6506-navy-white", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Navy/White", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Navy-_White_Front_High.jpg", ssPartNumber: "6506-NVYWHT" },
  { id: "yupoong-6506-red", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Red", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Red_Front_High.jpg", ssPartNumber: "6506-RED" },
  { id: "yupoong-6506-red-white", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "Red/White", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_Red-_White_Front_High.jpg", ssPartNumber: "6506-REDWHT" },
  { id: "yupoong-6506-white", brand: "Yupoong", model: "6506", name: "Yupoong 6506", colorName: "White", basePrice: 21, image: "/hats/yupoong-6506/YP_Classics_6506_White_Front_High.jpg", ssPartNumber: "6506-WHT" },
];


export const hatVariants: HatVariant[] = [
  ...richardson112Variants,
  ...richardson112PFPVariants,
  ...richardson168Variants,
  ...richardson220Variants,
  ...richardson258Variants,
  ...richardson256Variants,
  ...yupoong6606Variants,
  ...yupoong6006Variants,
  ...yupoong6506Variants,
];

function groupHatsByBrandAndModel(hats: HatVariant[]) {
  const grouped: Record<string, Record<string, HatVariant[]>> = {
    Richardson: {},
    Yupoong: {},
  };

  hats.forEach((hat) => {
    if (!grouped[hat.brand][hat.model]) {
      grouped[hat.brand][hat.model] = [];
    }
    grouped[hat.brand][hat.model].push(hat);
  });

  return grouped;
}

// Try multiple strategies to find stock for a hat
// Returns: number if found in inventory (with buffer applied), null if can't determine stock
function getStockForHat(hat: HatVariant, inventory: Record<string, number>, hasFetchedInventory: boolean): number | null {
  // If we haven't fetched inventory yet, return null (unknown)
  if (!hasFetchedInventory) return null;
  
  // If no part number, can't look up
  if (!hat.ssPartNumber) return null;
  
  // If inventory is empty, API might not be configured - return null (allow selection)
  if (Object.keys(inventory).length === 0) return null;
  
  let rawStock: number | null = null;
  
  // Try full part number (uppercase)
  const fullKey = hat.ssPartNumber.toUpperCase().replace(/\s+/g, "");
  if (inventory[fullKey] !== undefined) {
    rawStock = inventory[fullKey];
  }
  
  // Try color code portion (after the dash)
  if (rawStock === null) {
    const parts = hat.ssPartNumber.split("-");
    if (parts.length > 1) {
      const colorCode = parts.slice(1).join("-").toUpperCase();
      if (inventory[colorCode] !== undefined) {
        rawStock = inventory[colorCode];
      }
    }
  }
  
  // Try color name (normalized)
  if (rawStock === null) {
    const colorNameKey = hat.colorName.toUpperCase().replace(/[\s/]+/g, "");
    if (inventory[colorNameKey] !== undefined) {
      rawStock = inventory[colorNameKey];
    }
  }
  
  // If we found stock, apply the buffer
  if (rawStock !== null) {
    // Apply buffer - never show negative stock
    return Math.max(0, rawStock - STOCK_BUFFER);
  }
  
  // Couldn't find a match - return null (unknown, allow selection)
  return null;
}

// Compact hat card with instant cart sync and stock awareness
function HatCard({ hat }: { hat: HatVariant }) {
  const { cartItems, addToCart, updateQuantity, removeFromCart, calculateTotals } = useOrder();
  const { discountPerHat } = calculateTotals();
  
  // Get inventory from context (provided by model section)
  const { inventory, loading: stockLoading, hasFetchedInventory } = useContext(ModelInventoryContext);
  
  // Get stock using multiple matching strategies
  // If inventory was fetched but item not found, returns 0 (out of stock)
  const stock = getStockForHat(hat, inventory, hasFetchedInventory);

  const cartItem = cartItems.find((item) => item.id === hat.id);
  const quantity = cartItem?.quantity || 0;

  const discountedPrice = hat.basePrice - discountPerHat;
  const hasDiscount = discountPerHat > 0;

  // Check if out of stock - only if we have inventory data
  const isOutOfStock = stock !== null && stock === 0;
  const maxQuantity = stock !== null ? stock : Infinity;

  const handleQuantityChange = (newQty: number) => {
    // Don't allow selecting more than available stock
    if (stock !== null && newQty > stock) {
      newQty = stock;
    }
    
    if (newQty <= 0) {
      if (cartItem) removeFromCart(hat.id);
    } else if (cartItem) {
      updateQuantity(hat.id, newQty);
    } else {
      addToCart({
        id: hat.id,
        name: `${hat.name} - ${hat.colorName}`,
        unitPrice: hat.basePrice,
        quantity: newQty,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") return;
    const newQty = parseInt(val, 10);
    if (!isNaN(newQty) && newQty >= 0) {
      // Clamp to max stock
      handleQuantityChange(Math.min(newQty, maxQuantity));
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || parseInt(val, 10) < 0) handleQuantityChange(0);
  };

  // Can we add more?
  const canAddMore = !isOutOfStock && (stock === null || quantity < stock);

  return (
    <div
      className={`relative rounded-lg p-3 border transition-all ${
        isOutOfStock
          ? "bg-gray-100 border-gray-200 opacity-60"
          : quantity > 0
          ? "bg-primary/5 border-primary shadow-sm"
          : "bg-white border-gray-100 hover:border-gray-200"
      }`}
    >
      {/* Out of stock overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="bg-gray-800/80 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            OUT OF STOCK
          </span>
        </div>
      )}

      {/* Popular badge */}
      {hat.popular && !isOutOfStock && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="bg-gradient-to-r from-pink to-magenta text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            POPULAR
          </span>
        </div>
      )}

      {/* Hat image - always show front image only in cards for consistent layout */}
      {hat.image && (
        <ImageModal src={hat.image} alt={`${hat.name} - ${hat.colorName}`}>
          <div className={`relative w-full aspect-[4/3] mb-3 rounded-lg overflow-hidden bg-gray-50 group ${isOutOfStock ? "grayscale opacity-40" : ""}`}>
            <Image
              src={hat.image}
              alt={`${hat.name} - ${hat.colorName}`}
              fill
              unoptimized
              className="object-contain p-1 transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
            {/* Zoom icon on hover */}
            {!isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-70 transition-opacity drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            )}
          </div>
        </ImageModal>
      )}

      {/* Color name - truncated */}
      <p className={`font-medium text-xs leading-tight mb-1 truncate ${isOutOfStock ? "text-gray-400" : "text-text"}`} title={hat.colorName}>
        {hat.colorName}
      </p>

      {/* Price row */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className={`font-bold text-sm ${isOutOfStock ? "text-gray-400" : "text-primary"}`}>
          ${discountedPrice.toFixed(2)}
        </span>
        {hasDiscount && !isOutOfStock && (
          <span className="text-gray-400 text-[10px] line-through">${hat.basePrice.toFixed(2)}</span>
        )}
      </div>

      {/* Stock indicator */}
      {hat.ssPartNumber && (
        <div className="mb-2">
          <StockIndicator qty={stock} loading={stockLoading} />
          {/* Low stock warning */}
          {stock !== null && stock > 0 && stock <= LOW_STOCK_THRESHOLD && (
            <p className="text-[10px] text-amber-600 font-medium mt-0.5">
              ⚠️ Low stock - order soon!
            </p>
          )}
        </div>
      )}

      {/* Quantity controls - disabled when out of stock */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity === 0 || isOutOfStock}
          className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors ${
            quantity === 0 || isOutOfStock
              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 text-text"
          }`}
        >
          −
        </button>
        <input
          type="number"
          min="0"
          max={stock !== null ? stock : undefined}
          value={quantity}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={isOutOfStock}
          className={`w-10 h-7 px-1 border rounded text-center font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-primary ${
            isOutOfStock
              ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
              : quantity > 0
              ? "border-primary bg-white"
              : "border-gray-200 bg-gray-50"
          }`}
        />
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={!canAddMore}
          className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors ${
            !canAddMore
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-secondary text-white"
          }`}
          title={!canAddMore && stock !== null ? `Max ${stock} available` : undefined}
        >
          +
        </button>
      </div>

      {/* Stock warning when near limit */}
      {stock !== null && quantity > 0 && quantity >= stock && !isOutOfStock && (
        <p className="text-[10px] text-amber-600 font-medium mt-1 text-center">
          Max quantity reached
        </p>
      )}

      {/* Line total */}
      {quantity > 0 && !isOutOfStock && (
        <p className="text-[10px] text-green-600 font-medium mt-1.5 text-center">
          = ${(discountedPrice * quantity).toFixed(2)}
        </p>
      )}
    </div>
  );
}

// Model Section component with inventory fetching
function ModelSection({ 
  brand, 
  model, 
  variants: rawVariants, 
  isExpanded, 
  onToggle,
  cartItems
}: {
  brand: string;
  model: string;
  variants: HatVariant[];
  isExpanded: boolean;
  onToggle: () => void;
  cartItems: { id: string; quantity: number }[];
}) {
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [hasFetchedInventory, setHasFetchedInventory] = useState(false); // Successfully fetched inventory data

  // Sort variants: popular first, then alphabetically by color
  const variants = [...rawVariants].sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return a.colorName.localeCompare(b.colorName);
  });

  // Fetch inventory when section is expanded (only once)
  useEffect(() => {
    if (isExpanded && !hasFetched) {
      setLoading(true);
      setHasFetched(true);
      
      fetch(`/api/inventory?model=${model}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.inventory) {
            setInventory(data.inventory);
            setHasFetchedInventory(true); // Mark that we successfully got inventory
          }
        })
        .catch((err) => console.error(`Error fetching inventory for ${model}:`, err))
        .finally(() => setLoading(false));
    }
  }, [isExpanded, model, hasFetched]);

  const cartCount = variants.reduce((total, hat) => {
    const cartItem = cartItems.find((item) => item.id === hat.id);
    return total + (cartItem?.quantity || 0);
  }, 0);

  // Get the first variant's images for preview
  const previewFront = variants[0]?.image;
  const previewBack = variants[0]?.backImage;

  return (
    <div className="overflow-hidden">
      {/* Model Header - Clickable */}
      <div
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {/* Preview images of the hat style - front and back */}
          {previewFront && (
            <div className="flex gap-1 flex-shrink-0">
              <ImageModal src={previewFront} alt={`${brand} ${model} Front`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in hover:ring-2 hover:ring-primary transition-all">
                  <Image
                    src={previewFront}
                    alt={`${brand} ${model} front`}
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
              </ImageModal>
              {previewBack && (
                <ImageModal src={previewBack} alt={`${brand} ${model} Back`}>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in hover:ring-2 hover:ring-primary transition-all">
                    <Image
                      src={previewBack}
                      alt={`${brand} ${model} back`}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  </div>
                </ImageModal>
              )}
            </div>
          )}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded">
                {model}
              </span>
              <span className="text-xs text-gray-400">({variants.length} colors)</span>
            </div>
            {cartCount > 0 && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cartCount} in cart
              </span>
            )}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Collapsible Content with Inventory Context */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-none opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ModelInventoryContext.Provider value={{ inventory, loading, hasFetchedInventory }}>
          <div className="p-3 pt-0">
            {/* 4-column grid on large screens for larger cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
              {variants.map((hat) => (
                <HatCard key={hat.id} hat={hat} />
              ))}
            </div>
          </div>
        </ModelInventoryContext.Provider>
      </div>
    </div>
  );
}

export default function HatList() {
  const groupedHats = groupHatsByBrandAndModel(hatVariants);
  const { cartItems } = useOrder();
  
  // Track collapsed state for each model - default to collapsed
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  const toggleModel = (key: string) => {
    setExpandedModels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      {BRAND_ORDER.map((brand) => {
        const models = groupedHats[brand];
        // Sort models according to MODEL_ORDER
        const modelNames = Object.keys(models).sort((a, b) => {
          const orderA = MODEL_ORDER[brand]?.indexOf(a) ?? 999;
          const orderB = MODEL_ORDER[brand]?.indexOf(b) ?? 999;
          return orderA - orderB;
        });

        if (modelNames.length === 0) return null;

        return (
          <section key={brand} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {/* Brand Header - Compact */}
            <div className="bg-primary px-3 py-2">
              <h2 className="text-base font-bold text-white">{brand}</h2>
            </div>

            <div className="divide-y divide-gray-50">
              {modelNames.map((model) => (
                <ModelSection 
                  key={`${brand}-${model}`}
                  brand={brand}
                  model={model}
                  variants={models[model]}
                  isExpanded={expandedModels.has(`${brand}-${model}`)}
                  onToggle={() => toggleModel(`${brand}-${model}`)}
                  cartItems={cartItems}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
