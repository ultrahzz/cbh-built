"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "../../components/Button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      {/* Success Icon */}
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
      <h1 className="text-3xl font-bold text-text mb-4">
        Thank You for Your Order!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your payment was successful. We&apos;ve received your order and will begin
        working on your custom embroidered hats right away.
      </p>

      {/* What's Next */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 text-left">
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
                Once approved, your hats will be embroidered and shipped within 5-7 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
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
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-12 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
