import "./globals.css";
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "DocAppoint | Book Your Doctor",
  description: "Secure and modern doctor appointment booking platform.",
};

export default function RootLayout({ children }) {
  // ডেমো লগইন স্টেট (Better Auth ইন্টিগ্রেশনের সময় এটি ডাইনামিক হবে)
  const isLoggedIn = false; 

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <Toaster position="top-center" />
        
        {/* Navbar */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
              🩺 DocAppoint
            </Link>
            <div className="flex items-center gap-6 font-medium">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <Link href="/appointments" className="hover:text-blue-600">All Appointments</Link>
              <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-200"></div>
                  <button className="text-red-500 hover:underline">Logout</button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="min-h-screen container mx-auto px-4 py-8">{children}</main>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-8 border-t mt-12">
          <div className="container mx-auto px-4 text-center space-y-4">
            <p className="font-bold text-lg">DocAppoint 🩺</p>
            <div className="flex justify-center gap-6 text-slate-400">
              <a href="#" className="hover:text-white">Facebook</a>
              {/* রিকোয়ারমেন্ট অনুযায়ী নতুন X লোগো ব্যবহার করবেন */}
              <a href="#" className="hover:text-white">𝕏 (Twitter)</a> 
              <a href="#" className="hover:text-white">LinkedIn</a>
            </div>
            <p className="text-sm text-slate-500">© 2026 DocAppoint. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}