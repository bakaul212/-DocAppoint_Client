// src/app/layout.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react'; // ✅ Next-Auth সেশন ট্র্যাকিং হুক
import AuthProvider from "./providers"; // আপনার সেশন প্রোভাইডার ফাইল পাথ (providers বা provider)
import './globals.css'; 

// এটি একটি ইনার (Inner) কম্পোনেন্ট যা AuthProvider এর ভেতরে থাকবে যেন সেশন ডাটা অ্যাক্সেস করা যায়
function MainAppStructure({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession(); // ✅ গ্লোবাল সেশন থেকে রিয়েল-টাইম ইউজার ডাটা রিড
  const router = useRouter();

  // প্রোফাইল ইমেজ ও নাম ডাইনামিক সিঙ্ক (লোকালস্টোরেজ বা গুগল সেশন থেকে)
  let profileName = session?.user?.name || 'User Name';
  let profileImage = session?.user?.image || null;

  if (session?.user?.email) {
    const savedName = typeof window !== 'undefined' ? localStorage.getItem(`profile_name_${session.user.email}`) : null;
    const savedImage = typeof window !== 'undefined' ? localStorage.getItem(`profile_image_${session.user.email}`) : null;
    
    profileName = savedName || session.user.name || 'User Name';
    profileImage = savedImage || session.user.image || null;
  }

  // 🔐 লগআউট হ্যান্ডলার ফাংশন
  const handleLogout = async () => {
    setIsOpen(false);
    await signOut({ redirect: false }); // Next-Auth সেশন ক্লিয়ার
    router.push('/'); // হোম পেজে রিডাইরেক্ট
  };

  return (
    <>
      {/* 🌐 গ্লোবাল রেসপন্সিভ নেভিগেশন বার */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
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
              
              {/* ডাইনামিক পার্ট: লগইন স্টেট অনুযায়ী বাটন বা প্রোফাইল ইমেজ */}
              {session?.user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center gap-2">
                    {profileImage ? (
                      <img src={profileImage} alt="User Avatar" className="w-8 h-8 rounded-full border border-blue-500 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                        {profileName.charAt(0)}
                      </div>
                    )}
                    <span className="text-slate-700 text-xs font-bold max-w-[100px] truncate">{profileName}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-red-500 font-bold hover:text-red-600 transition-colors text-xs bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
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

            {/* ✅ ৩. মোবাইল হ্যামবার্গার বাটন */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 focus:outline-none transition-all duration-200"
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

        {/* ✅ ৪. মোবাইল ড্রপডাউন মেনু */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-slate-100 shadow-inner font-medium text-slate-700">
            <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">Home</Link>
            <Link href="/appointments" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">All Appointment</Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl text-base hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">Dashboard</Link>
            
            <div className="pt-2 border-t border-slate-100 mt-2">
              {session?.user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    {profileImage ? (
                      <img src={profileImage} alt="User Avatar" className="w-8 h-8 rounded-full border border-blue-500 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                        {profileName.charAt(0)}
                      </div>
                    )}
                    <span className="text-slate-800 text-sm font-bold truncate max-w-[150px]">{profileName}</span>
                  </div>
                  <button onClick={handleLogout} className="text-red-500 font-bold hover:underline text-sm">Logout</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm">Login</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="block text-center bg-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-md text-sm">Register</Link>
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
    </>
  );
}

// মূল Root Layout যা HTML স্ট্রাকচার প্রদান করে এবং AuthProvider দিয়ে র‍্যাপ করে
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 🚀 গ্লোবাল এবং প্রোপার এসইও মেটাডাটা হেড ট্যাগের মাধ্যমে যুক্ত করা হলো */}
      <head>
        <title>DocAppoint | Book Best Doctors Online</title>
        <meta name="description" content="Find and book appointments with the best doctors in Dhaka instantly. Expert medical consultants just a click away." />
        <meta name="keywords" content="doctor appointment, online doctor booking, healthcare Bangladesh, Dhaka doctors, medical consult" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        {/* 🔒 সর্বপ্রথমে AuthProvider থাকবে যেন এর ভেতরের প্রতিটি চাইল্ড এবং ডাইনামিক রাউট সেশন এক্সেস পায় */}
        <AuthProvider>
          <MainAppStructure>{children}</MainAppStructure>
        </AuthProvider>
      </body>
    </html>
  );
}