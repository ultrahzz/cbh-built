import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

// Disable static prerendering - this page uses useSearchParams
export const dynamic = "force-dynamic";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-12 text-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
