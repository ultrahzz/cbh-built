"use client";

import { useState, useRef } from "react";
import Button from "../../components/Button";
import { useOrder, EmbroideryType, FrontLocation, ExtraLocation, EXTRA_LOCATION_PRICE, get3DPuffPricePerHat } from "../context/OrderContext";

export default function ArtworkPage() {
  const { 
    embroideryOptions, 
    setEmbroideryOptions, 
    artworkFile, 
    artworkFileName, 
    setArtworkFile,
    additionalFile,
    additionalFileName,
    setAdditionalFile,
    specialInstructions,
    setSpecialInstructions,
    getTotalHatCount 
  } = useOrder();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [additionalPreviewUrl, setAdditionalPreviewUrl] = useState<string | null>(null);

  const handleEmbroideryTypeChange = (type: EmbroideryType) => {
    setEmbroideryOptions({ type });
  };

  const handleFrontLocationChange = (frontLocation: FrontLocation) => {
    setEmbroideryOptions({ frontLocation });
  };

  const handleExtraLocationToggle = (location: ExtraLocation) => {
    const currentLocations = embroideryOptions.extraLocations;
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter((l) => l !== location)
      : [...currentLocations, location];
    setEmbroideryOptions({ extraLocations: newLocations });
  };

  const handleArtworkRightsChange = (confirmed: boolean) => {
    setEmbroideryOptions({ artworkRightsConfirmed: confirmed });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setArtworkFile(file);

    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setArtworkFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAdditionalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAdditionalFile(file);

    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setAdditionalPreviewUrl(url);
    } else {
      setAdditionalPreviewUrl(null);
    }
  };

  const handleRemoveAdditionalFile = () => {
    setAdditionalFile(null);
    setAdditionalPreviewUrl(null);
    if (additionalFileInputRef.current) {
      additionalFileInputRef.current.value = "";
    }
  };

  const totalHats = getTotalHatCount();
  const extraLocationCost = embroideryOptions.extraLocations.length * EXTRA_LOCATION_PRICE * totalHats;
  const puffPricePerHat = get3DPuffPricePerHat(totalHats);
  const puffTotalCost = puffPricePerHat * totalHats;

  // Required: Artwork rights, front location selected, and artwork uploaded
  const hasFrontLocation = !!embroideryOptions.frontLocation;
  const hasArtworkRights = embroideryOptions.artworkRightsConfirmed;
  const hasArtwork = !!artworkFile;
  const canProceed = hasArtworkRights && hasFrontLocation && hasArtwork;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Artwork & Embroidery</h1>
        <p className="text-gray-600">
          Configure your embroidery options and upload your logo or artwork.
        </p>
      </div>

      <div className="space-y-8">
        {/* Embroidery Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Embroidery Type</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="embroideryType"
                value="standard"
                checked={embroideryOptions.type === "standard"}
                onChange={() => handleEmbroideryTypeChange("standard")}
                className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-text">Standard Embroidery</p>
                <p className="text-sm text-gray-500">Classic flat embroidery, great for most logos</p>
              </div>
              <span className="text-green-600 font-semibold">Included</span>
            </label>
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="embroideryType"
                value="puff"
                checked={embroideryOptions.type === "puff"}
                onChange={() => handleEmbroideryTypeChange("puff")}
                className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
              />
              <div className="flex-1">
                <p className="font-medium text-text">3D Puff Embroidery</p>
                <p className="text-sm text-gray-500">Raised, textured look for bold designs</p>
              </div>
              <span className="text-pink font-semibold">+${puffPricePerHat}/hat</span>
            </label>
          </div>
          
          {/* 3D Puff pricing breakdown */}
          {embroideryOptions.type === "puff" && totalHats > 0 && (
            <div className="mt-4 p-4 bg-pink/10 rounded-lg">
              <p className="text-primary font-medium">
                3D Puff cost: ${puffTotalCost.toFixed(2)}
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({totalHats} hats × ${puffPricePerHat}/hat)
                </span>
              </p>
            </div>
          )}

          {/* Volume pricing guide for 3D Puff */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">3D Puff Volume Pricing:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className={`p-2 rounded ${totalHats >= 1 && totalHats < 12 ? 'bg-primary text-white' : 'bg-white border border-gray-200'}`}>
                <span className="font-semibold">1-11:</span> $7/hat
              </div>
              <div className={`p-2 rounded ${totalHats >= 12 && totalHats < 24 ? 'bg-primary text-white' : 'bg-white border border-gray-200'}`}>
                <span className="font-semibold">12+:</span> $6/hat
              </div>
              <div className={`p-2 rounded ${totalHats >= 24 && totalHats < 48 ? 'bg-primary text-white' : 'bg-white border border-gray-200'}`}>
                <span className="font-semibold">24+:</span> $5/hat
              </div>
              <div className={`p-2 rounded ${totalHats >= 48 && totalHats < 96 ? 'bg-primary text-white' : 'bg-white border border-gray-200'}`}>
                <span className="font-semibold">48+:</span> $4/hat
              </div>
              <div className={`p-2 rounded ${totalHats >= 96 && totalHats < 188 ? 'bg-primary text-white' : 'bg-white border border-gray-200'}`}>
                <span className="font-semibold">96+:</span> $3/hat
              </div>
              <div className={`p-2 rounded ${totalHats >= 188 ? 'bg-primary text-white' : 'bg-white border border-gray-200'}`}>
                <span className="font-semibold">188+:</span> $2/hat
              </div>
            </div>
          </div>
        </div>

        {/* Front Location */}
        <div className={`bg-white rounded-xl shadow-sm border p-6 ${!hasFrontLocation ? 'border-pink/50' : 'border-gray-100'}`}>
          <h2 className="text-lg font-semibold text-text mb-4">
            Front Embroidery Location <span className="text-pink">*</span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">Choose where your main logo will be placed</p>
          <div className="space-y-3">
            {[
              { value: "front-center", label: "Center" },
              { value: "front-left", label: "Over Left Eye" },
              { value: "front-right", label: "Over Right Eye" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="frontLocation"
                  value={option.value}
                  checked={embroideryOptions.frontLocation === option.value}
                  onChange={() => handleFrontLocationChange(option.value as FrontLocation)}
                  className="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="font-medium text-text">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Upload Artwork (Main Logo) */}
        <div className={`bg-white rounded-xl shadow-sm border p-6 ${!hasArtwork ? 'border-pink/50' : 'border-gray-100'}`}>
          <h2 className="text-lg font-semibold text-text mb-4">
            Upload Artwork <span className="text-pink">*</span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload your logo or artwork file. Accepted formats: JPG, PNG, SVG, PDF
          </p>

          {!artworkFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-text font-medium">Click to upload your artwork</p>
              <p className="text-sm text-gray-400 mt-1">JPG, PNG, SVG, or PDF</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Artwork preview"
                    className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-text truncate">{artworkFileName}</p>
                  <p className="text-sm text-gray-500">
                    {artworkFile && (artworkFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 text-magenta hover:bg-pink/10 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.svg,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Artwork Rights Confirmation */}
        <div className={`bg-white rounded-xl shadow-sm border p-6 ${!hasArtworkRights ? 'border-pink/50' : 'border-gray-100'}`}>
          <h2 className="text-lg font-semibold text-text mb-4">
            Artwork Rights <span className="text-pink">*</span>
          </h2>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={embroideryOptions.artworkRightsConfirmed}
              onChange={(e) => handleArtworkRightsChange(e.target.checked)}
              className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-gray-700">
              I own or have the rights to use this artwork for embroidery purposes.
            </span>
          </label>
        </div>

        {/* Extra Locations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Extra Embroidery Locations</h2>
          <p className="text-sm text-gray-500 mb-4">
            Add additional embroidery locations (optional, +${EXTRA_LOCATION_PRICE} per hat per location)
          </p>
          <div className="space-y-3">
            {[
              { value: "left-side", label: "Left Side" },
              { value: "right-side", label: "Right Side" },
              { value: "back", label: "Back" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-primary/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={embroideryOptions.extraLocations.includes(option.value as ExtraLocation)}
                    onChange={() => handleExtraLocationToggle(option.value as ExtraLocation)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="font-medium text-text">{option.label}</span>
                </div>
                <span className="text-pink font-medium">+${EXTRA_LOCATION_PRICE}/hat</span>
              </label>
            ))}
          </div>
          {embroideryOptions.extraLocations.length > 0 && totalHats > 0 && (
            <div className="mt-4 p-4 bg-pink/10 rounded-lg">
              <p className="text-primary font-medium">
                Extra embroidery cost: ${extraLocationCost.toFixed(2)}
                <span className="text-sm font-normal text-gray-600 ml-2">
                  ({embroideryOptions.extraLocations.length} location(s) × {totalHats} hats × ${EXTRA_LOCATION_PRICE})
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Extra Embroidery Location Artwork */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Extra Embroidery Location Artwork</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload artwork for extra embroidery locations (side, back, etc.)
          </p>

          {!additionalFile ? (
            <div
              onClick={() => additionalFileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <p className="text-text font-medium text-sm">Click to upload additional file</p>
              <p className="text-xs text-gray-400 mt-1">Any file type accepted</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-4">
                {additionalPreviewUrl ? (
                  <img
                    src={additionalPreviewUrl}
                    alt="Additional file preview"
                    className="w-16 h-16 object-contain bg-gray-50 rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-text truncate text-sm">{additionalFileName}</p>
                  <p className="text-xs text-gray-500">
                    {additionalFile && (additionalFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={handleRemoveAdditionalFile}
                  className="p-2 text-magenta hover:bg-pink/10 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <input
            ref={additionalFileInputRef}
            type="file"
            onChange={handleAdditionalFileChange}
            className="hidden"
          />
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Special Instructions</h2>
          <p className="text-sm text-gray-500 mb-4">
            Any special requests or notes for your embroidery (thread colors, placement details, etc.)
          </p>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Enter any special instructions here..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-text placeholder:text-gray-400"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button href="/order/hats" variant="outline" className="flex-1">
            ← Back to Hats
          </Button>
          {canProceed ? (
            <Button href="/order/review" className="flex-1">
              Next: Review Order →
            </Button>
          ) : (
            <div className="flex-1 py-3 px-6 bg-gray-200 text-gray-500 font-semibold text-center rounded-lg cursor-not-allowed">
              {!hasArtworkRights
                ? "Please confirm artwork rights"
                : !hasFrontLocation
                ? "Please select front embroidery location"
                : "Please upload artwork"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
