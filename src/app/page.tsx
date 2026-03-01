import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bamboo-cream px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-bamboo-green mb-2">
          The Bamboo Nation
        </h1>
        <p className="text-bamboo-brown text-lg mb-8">Jaipur</p>
        <Link
          href="/reserve"
          className="inline-block bg-bamboo-green text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-bamboo-green-dark transition-colors"
        >
          Reserve a Table
        </Link>
      </div>
    </main>
  );
}
