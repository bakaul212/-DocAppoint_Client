'use client';

import { useState } from 'react';
import Link from 'next/link';
// যদি আপনার globals.css অন্য ফোল্ডারে থাকে তবে পাথটি ঠিক করে নিবেন
import './globals.css'; 

export default function RootLayout({ children }) {
  // মোবাইল মেনু ওপেন/ক্লোজ রাখার জন্য React State
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        
        {/* 🌐 গ্লোবাল রেসপন্সিভ নেভিগেশন বার */}
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 transition-all duration-300 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              
              {/* ১. লোগো */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center gap-2 text-blue-600 font-black text-xl tracking-tight">
                  🩺 DocAppoint
                </Link>
              </div>

              {/* ২. ডেক্সটপ মেনু (বড় স্ক্রিনে দেখাবে, md:flex অর্থাৎ মোবাইল স্ক্রিনে লুকিয়ে যাবে) */}
              <div className="hidden md:flex items-center space-x-8 font-semibold text-sm text-slate-600">
                <Link href="/" className="hover:text-blue-600 transition-colors duration-200">Home</Link>
                <Link href="/appointments" className="hover:text-blue-600 transition-colors duration-200">All Appointments</Link>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors duration-200">Dashboard</Link>
                <Link href="/login" className="bg-blue-600 text-white font-bold px-5 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm active:scale-95">
                  Login
                </Link>
              </div>

              {/* ৩. মোবাইল হ্যামবার্গার বাটন (md:hidden অর্থাৎ বড় স্ক্রিনে লুকিয়ে যাবে, মোবাইলে দৃশ্যমান হবে) */}
              <div className="flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 focus:outline-none transition-all duration-200"
                  aria-controls="mobile-menu"
                  aria-expanded={isOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {/* হ্যামবার্গার আইকন বা ক্লোজ আইকন চেঞ্জ হওয়ার ডাইনামিক লজিক */}
                  {!isOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* ৪. মোবাইল ড্রপডাউন মেনু (হ্যামবার্গার বাটনে ক্লিক করলে নিচ থেকে ওপেন হবে) */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'block opacity-100' : 'hidden opacity-0'}`} id="mobile-menu">
            <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-slate-100 shadow-inner font-medium text-slate-700">
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                Home
              </Link>
              <Link 
                href="/appointments" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                All Appointments
              </Link>
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                Dashboard
              </Link>
              <div className="pt-2 border-t border-slate-100 mt-2">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md text-base"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* ৫. মেইন কন্টেন্ট এরিয়া (এখানে আপনার page.js ফাইলটি রেন্ডার হবে) */}
        <main className="flex-grow w-full">
          {children}
        </main>

      </body>
    </html>
  );
}