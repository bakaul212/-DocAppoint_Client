// src/app/layout.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// যদি আপনার globals.css অন্য ফোল্ডারে থাকে তবে পাথটি ঠিক করে নিবেন
import './globals.css'; 

export default function RootLayout({ children }) {
  // মোবাইল মেনু ওপেন/ক্লোজ রাখার জন্য React State
  const [isOpen, setIsOpen] = useState(false);
  
  // লগইন করা ইউজারের স্টেট (অ্যাপয়েন্টমেন্ট ও হোম পেজের localStorage মেকানিজমের সাথে সিঙ্ক করার জন্য)
  const [user, setUser] = useState(null);
  const router = useRouter();

  // পেজ লোড হওয়া এবং যেকোনো রাউট পরিবর্তনের সময় ইউজার ডাটা চেক করার জন্য
  useEffect(() => {
    const checkUser = () => {
      const loggedInUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (loggedInUser) {
        try {
          setUser(JSON.parse(loggedInUser));
        } catch (e) {
          setUser({ name: 'User', image: null }); // Fallback
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    
    // উইন্ডো ফোকাস বা লোকালস্টোরেজ চেঞ্জ ইভেন্ট ট্র্যাকিং
    window.addEventListener('storage', checkUser);
    window.addEventListener('focus', checkUser);
    
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('focus', checkUser);
    };
  }, []);

  // 🔐 লগআউট হ্যান্ডলার ফাংশন
  const handleLogout = () => {
    localStorage.removeItem('user'); // localStorage থেকে ডাটা মুছে ফেলা
    setUser(null); // স্টেট ক্লিয়ার করা
    setIsOpen(false); // মোবাইল মেনু বন্ধ করা
    router.push('/'); // হোম পেজে রিডাইরেক্ট করা
  };

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        
        {/* 🌐 গ্লোবাল রেসপন্সিভ নেভিগেশন বার */}
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 transition-all duration-300 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              
              {/* ✅ ১. Logo + Name */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center gap-2 text-blue-600 font-black text-xl tracking-tight">
                  <span>🩺</span> DocAppoint
                </Link>
              </div>

              {/* ✅ ২. Links: Home, All Appointment, Dashboard (ডেক্সটপ মেনু) */}
              <div className="hidden md:flex items-center space-x-6 font-semibold text-sm text-slate-600">
                <Link href="/" className="hover:text-blue-600 transition-colors duration-200">Home</Link>
                <Link href="/appointments" className="hover:text-blue-600 transition-colors duration-200">All Appointment</Link>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors duration-200">Dashboard</Link>
                
                {/* ডাইনামিক পার্ট: লগইন স্টেট অনুযায়ী বাটন */}
                {user ? (
                  /* ✅ ইউজার লগইন থাকলে: প্রোফাইল পিকচার + নাম + Logout বাটন */
                  <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                    <div className="flex items-center gap-2">
                      {user.image ? (
                        <img src={user.image} alt="User Avatar" className="w-8 h-8 rounded-full border border-blue-500 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                          {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                      )}
                      <span className="text-slate-700 text-xs font-bold max-w-[100px] truncate">{user.name || 'User'}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-red-500 font-bold hover:text-red-600 transition-colors text-xs bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  /* ✅ ইউজার লগইন না থাকলে: Login এবং Register বাটন */
                  <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                    <Link href="/login" className="text-slate-700 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-all duration-200 text-xs">
                      Login
                    </Link>
                    <Link href="/register" className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm active:scale-95 text-xs">
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* ৩. মোবাইল হ্যামবার্গার বাটন */}
              <div className="flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 focus:outline-none transition-all duration-200"
                  aria-controls="mobile-menu"
                  aria-expanded={isOpen}
                >
                  <span className="sr-only">Open main menu</span>
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

          {/* ৪. মোবাইল ড্রপডাউন মেনু */}
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
                All Appointment
              </Link>
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                Dashboard
              </Link>
              
              <div className="pt-2 border-t border-slate-100 mt-2">
                {user ? (
                  /* মোবাইল স্ক্রিনে লগইন থাকা অবস্থা */
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      {user.image ? (
                        <img src={user.image} alt="User Avatar" className="w-8 h-8 rounded-full border border-blue-500 object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                          {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                      )}
                      <span className="text-slate-800 text-sm font-bold truncate max-w-[150px]">{user.name || 'User'}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-red-500 font-bold hover:underline text-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  /* মোবাইল স্ক্রিনে লগআউট বা আনঅথরাইজড অবস্থা (Login + Register বাটন) */
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link 
                      href="/login" 
                      onClick={() => setIsOpen(false)}
                      className="block text-center border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setIsOpen(false)}
                      className="block text-center bg-blue-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md text-sm"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* 🎽 ৫. মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-grow w-full">
          {children}
        </main>
      </body>
    </html>
  );
}