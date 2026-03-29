// app/rhythm/page.tsx
import type { Metadata } from "next";
import prayers from "../../data/rhythm.json";

export const metadata: Metadata = {
  title: "Daily Prayers — Rhythm",
  description: "Simple daily prayers with optional audio.",
};

type Prayer = {
  title: string;
  text: string;
  audio?: string;
};

export default function RhythmPage() {
  const list = prayers as Prayer[];

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Daily Prayers</h1>
      <ul className="space-y-6">
        {list.map((p, i) => (
          <li key={i} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="mt-2 text-gray-600">{p.text}</p>
            {!!p.audio && (
              <audio className="w-full mt-3" preload="none" controls src={p.audio} />
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
