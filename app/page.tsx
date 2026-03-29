// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sanctuary in Motion — Home",
  description: "Your prayer rhythm companion.",
};

export default function Home() {
  return (
    <main className="p-12 text-center">
      <h1 className="text-4xl font-bold">Sanctuary in Motion</h1>
      <p className="mt-4 text-lg text-gray-600">
        Your prayer rhythm companion — starting here.
      </p>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Link
          href="/rhythm"
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Go to Daily Prayers
        </Link>

        <Link
          href="https://www.homeandfashion.love"
          className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          Home &amp; Fashion
        </Link>
      </div>
    </main>
  );
}
