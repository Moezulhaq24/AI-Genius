import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        AI-Genius
      </h1>
      <p className="text-xl text-slate-300 mb-8">The Secure, Role-Based AI SaaS Platform</p>
      <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
        Login to Dashboard
      </Link>
    </div>
  );
}