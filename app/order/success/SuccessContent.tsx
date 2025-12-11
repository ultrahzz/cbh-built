"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "../../components/Button";

interface LineItem {
  description: string;
  quantity: number;
  amount_total: number;
}

interface ShippingAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface OrderDetails {
  id: string;
  amount_total: number;
  currency: string;
  customer_email: string;
  customer_name: string;
  shipping_address: ShippingAddress;
  shipping_name: string;
  line_items: LineItem[];
  metadata: {
    embroideryType: string;
    frontLocation: string;
    extraLocations: string;
    artworkFileName: string;
  };
  payment_status: string;
  created: number;
}

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

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setOrderDetails(data);
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load order details");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getOrderNumber = (id: string) => {
    // Use last 8 characters of session ID as order number
    return id.slice(-8).toUpperCase();
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-text mb-2">
          Thank You for Your Order!
        </h1>
        {orderDetails && (
          <p className="text-lg text-primary font-semibold">
            Order #{getOrderNumber(orderDetails.id)}
          </p>
        )}
        <p className="text-gray-600 mt-2">
          Your payment was successful. We&apos;ve received your order and will begin
          working on your custom embroidered hats right away.
        </p>
      </div>

      {/* Order Details */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : orderDetails ? (
        <div className="space-y-6 mb-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-primary px-6 py-4">
              <h2 className="text-lg font-bold text-white">Order Summary</h2>
            </div>
            
            {/* Line Items */}
            <div className="divide-y divide-gray-100">
              {orderDetails.line_items.map((item, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-royal/10 to-pink/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-text">{item.description}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-text">
                    {formatCurrency(item.amount_total)}
                  </p>
                </div>
              ))}
            </div>

            {/* Embroidery Details */}
            {orderDetails.metadata && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <h3 className="font-semibold text-text mb-2 text-sm">Embroidery Details</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {orderDetails.metadata.embroideryType === "puff" ? "3D Puff" : "Standard"}
                  </p>
                  <p>
                    <span className="font-medium">Front Location:</span>{" "}
                    {frontLocationLabels[orderDetails.metadata.frontLocation] || orderDetails.metadata.frontLocation}
                  </p>
                  {orderDetails.metadata.extraLocations && orderDetails.metadata.extraLocations !== "" && (
                    <p>
                      <span className="font-medium">Extra Locations:</span>{" "}
                      {orderDetails.metadata.extraLocations
                        .split(",")
                        .map((loc) => extraLocationLabels[loc] || loc)
                        .join(", ")}
                    </p>
                  )}
                  {orderDetails.metadata.artworkFileName && orderDetails.metadata.artworkFileName !== "none" && (
                    <p>
                      <span className="font-medium">Artwork:</span>{" "}
                      {orderDetails.metadata.artworkFileName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-text">Total Paid</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(orderDetails.amount_total)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ordered on {formatDate(orderDetails.created)}
              </p>
            </div>
          </div>

          {/* Shipping Info */}
          {orderDetails.shipping_address && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-pink to-magenta px-6 py-4">
                <h2 className="text-lg font-bold text-white">Shipping To</h2>
              </div>
              <div className="p-4">
                <p className="font-medium text-text">{orderDetails.shipping_name}</p>
                <p className="text-gray-600">{orderDetails.shipping_address.line1}</p>
                {orderDetails.shipping_address.line2 && (
                  <p className="text-gray-600">{orderDetails.shipping_address.line2}</p>
                )}
                <p className="text-gray-600">
                  {orderDetails.shipping_address.city}, {orderDetails.shipping_address.state} {orderDetails.shipping_address.postal_code}
                </p>
                {orderDetails.customer_email && (
                  <p className="text-sm text-gray-500 mt-2">
                    Confirmation sent to: {orderDetails.customer_email}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* What's Next */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-text mb-4">What&apos;s Next?</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">1</span>
            </div>
            <div>
              <p className="font-medium text-text">Confirmation Email</p>
              <p className="text-sm text-gray-600">
                You&apos;ll receive an email confirmation with your order details shortly.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-text">Artwork Review</p>
              <p className="text-sm text-gray-600">
                Our team will review your artwork and reach out if we have any questions.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-text">Production & Shipping</p>
              <p className="text-sm text-gray-600">
                Your hats will be embroidered and shipped within 10-15 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center">
        <p className="text-gray-600">
          Questions about your order?{" "}
          <a
            href="mailto:support@custombusinesshats.com"
            className="text-primary hover:text-secondary font-medium"
          >
            Contact us
          </a>
        </p>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
