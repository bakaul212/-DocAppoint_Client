// src/app/not-found.js
import Link from 'next/link';

// ফাংশনের আগে অবশ্যই 'export default' থাকতে হবে
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 space-y-6">
      <h1 className="text-9xl font-black text-blue-600/10 tracking-widest">404</h1>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">Requested Page Not Found</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          The link you followed might be broken, or the page may have been removed. Double check the URL or head back home.
        </p>
      </div>
      <Link href="/" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition">
        Return to Homepage
      </Link>
    </div>
  );
}