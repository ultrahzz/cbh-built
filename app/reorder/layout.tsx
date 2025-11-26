import { Metadata } from "next";
import { OrderProvider } from "../order/context/OrderContext";

export const metadata: Metadata = {
  title: "Reorder Custom Hats",
  description: "Returning customer? Reorder your custom embroidered hats with the same logo. Quick and easy reordering process.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function ReorderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrderProvider>{children}</OrderProvider>;
}

