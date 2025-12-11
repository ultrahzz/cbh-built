"use client";

import Button from "../../components/Button";
import { useOrder, EXTRA_LOCATION_PRICE, ARTWORK_SETUP_FEE } from "../context/OrderContext";

const frontLocationLabels: Record<string, string> = {
  "front-center": "Center",
  "front-left": "Over Left Eye",
  "front-right": "Over Right Eye",
};

const extraLocationLabels: Record<string, string> = {
  "left-side": "Left Side",
  "right-side": "Right Side",
  "back": "Back",
};

export default function ReviewPage() {
  const { cartItems, embroideryOptions, artworkFileName, calculateTotals, getTotalHatCount } = useOrder();
  const { 
    hatSubtotal, 
    volumeDiscount, 
    discountedHatSubtotal, 
    extraEmbroideryTotal,
    puffEmbroideryTotal,
    puffPricePerHat,
    artworkSetupFee,
    artworkSetupWaived,
    orderTotal, 
    discountPerHat 
  } = calculateTotals();
  const totalHats = getTotalHatCount();

  return (
    <div className="max-w-3xl mx-auto pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Review Your Order</h1>
        <p className="text-gray-600">
          Please review all details before proceeding to checkout.
        </p>
      </div>

      <div className="space-y-6">
        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h2 className="text-lg font-bold text-white">Hats in Your Order</h2>
            <p className="text-white/70 text-sm">{totalHats} items total</p>
          </div>
          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-royal/10 to-pink/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-text">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {discountPerHat > 0 ? (
                        <>
                          <span className="line-through">${item.unitPrice.toFixed(2)}</span>
                          <span className="text-green-600 ml-1">${(item.unitPrice - discountPerHat).toFixed(2)}</span>
                        </>
                      ) : (
                        <>${item.unitPrice.toFixed(2)}</>
                      )}
                      {" × "}{item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-primary">
                  ${((item.unitPrice - discountPerHat) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Embroidery Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-secondary px-6 py-4">
            <h2 className="text-lg font-bold text-white">Embroidery Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Embroidery Type</span>
              <span className="font-medium text-text">
                {embroideryOptions.type === "standard" ? "Standard Embroidery" : "3D Puff Embroidery"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Front Location</span>
              <span className="font-medium text-text">
                {frontLocationLabels[embroideryOptions.frontLocation]}
              </span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-gray-100">
              <span className="text-gray-600">Extra Locations</span>
              <div className="text-right">
                {embroideryOptions.extraLocations.length > 0 ? (
                  <div className="space-y-1">
                    {embroideryOptions.extraLocations.map((loc) => (
                      <div key={loc} className="flex items-center justify-end gap-2">
                        <span className="font-medium text-text">
                          {extraLocationLabels[loc]}
                        </span>
                        <span className="text-pink text-sm">
                          (+${EXTRA_LOCATION_PRICE}/hat)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">None selected</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Artwork File</span>
              <span className="font-medium text-text truncate max-w-[200px]">
                {artworkFileName || "No file uploaded"}
              </span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink to-magenta px-6 py-4">
            <h2 className="text-lg font-bold text-white">Price Breakdown</h2>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Hat Subtotal ({totalHats} hats)</span>
              <span className={`font-medium ${volumeDiscount > 0 ? "text-gray-400 line-through" : "text-text"}`}>
                ${hatSubtotal.toFixed(2)}
              </span>
            </div>
            {volumeDiscount > 0 && (
              <>
                <div className="flex justify-between items-center py-2 text-green-600">
                  <div>
                    <span>Volume Discount</span>
                    <p className="text-xs text-green-500">
                      ${discountPerHat} off × {totalHats} hats
                    </p>
                  </div>
                  <span className="font-medium">-${volumeDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Discounted Subtotal</span>
                  <span className="font-medium text-text">${discountedHatSubtotal.toFixed(2)}</span>
                </div>
              </>
            )}
            
            {/* Artwork Setup Fee */}
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Artwork Setup</span>
              {artworkSetupWaived ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through">${ARTWORK_SETUP_FEE.toFixed(2)}</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
              ) : (
                <span className="font-medium text-text">${artworkSetupFee.toFixed(2)}</span>
              )}
            </div>
            
            {puffEmbroideryTotal > 0 && (
              <div className="flex justify-between items-center py-2">
                <div>
                  <span className="text-gray-600">3D Puff Embroidery</span>
                  <p className="text-xs text-gray-400">
                    ${puffPricePerHat}/hat × {totalHats} hats
                  </p>
                </div>
                <span className="font-medium text-text">${puffEmbroideryTotal.toFixed(2)}</span>
              </div>
            )}
            {extraEmbroideryTotal > 0 && (
              <div className="flex justify-between items-center py-2">
                <div>
                  <span className="text-gray-600">Extra Embroidery</span>
                  <p className="text-xs text-gray-400">
                    {embroideryOptions.extraLocations.length} location(s) × {totalHats} hats × ${EXTRA_LOCATION_PRICE}
                  </p>
                </div>
                <span className="font-medium text-text">${extraEmbroideryTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-text">Order Total</span>
                <span className="text-2xl font-bold text-primary">${orderTotal.toFixed(2)}</span>
              </div>
              {(volumeDiscount > 0 || artworkSetupWaived) && (
                <p className="text-sm text-green-600 text-right mt-1">
                  You&apos;re saving ${(volumeDiscount + (artworkSetupWaived ? ARTWORK_SETUP_FEE : 0)).toFixed(2)}!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Estimate - Urgency */}
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-800">Estimated Delivery: 10-15 Business Days</p>
              <p className="text-sm text-green-600">Complete checkout today and your hats ship soon!</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button href="/order/artwork" variant="outline" className="flex-1">
            ← Back to Artwork
          </Button>
          <Button href="/order/checkout" className="flex-1">
            Proceed to Checkout →
          </Button>
        </div>
      </div>
    </div>
  );
}
