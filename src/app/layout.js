// src/app/layout.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react'; // ✅ Next-Auth সেশন ট্র্যাকিং হুক
import AuthProvider from "./providers"; // আপনার সেশন প্রোভাইডার ফাইল পাথ
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

      {/* 🚀 👑 গ্লোবাল আধুনিক ও অ্যানিমেটেড ফুটার সেকশন (যা সব পেজে দেখাবে) */}
      <footer className="relative bg-gradient-to-b from-slate-50 to-slate-100 border-t border-slate-200/80 overflow-hidden">
        {/* 🌟 ব্যাকগ্রাউন্ড গ্লো অ্যানিমেশন ইফেক্ট */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-4000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-3000"></div>

        <div className="container mx-auto px-6 md:px-12 pt-16 pb-8 max-w-7xl relative z-10">
          {/* প্রধান ফুটার গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
            
            {/* ১. ওয়েবসাইট লোগো ও বর্ণনা */}
            <div className="md:col-span-1 space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group w-fit">
                <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.25 2.25 0 0 1 10.5 2.25h4.5a2.25 2.25 0 0 1 2.183 1.75m-6 0C10.012 4.015 9.75 4.14 9.497 4.3a48.513 48.513 0 0 0-3.084.55C5.276 5.016 4.5 5.955 4.5 7.02v10.73c0 1.065.776 2.004 1.913 2.172a48.39 48.39 0 0 0 3.084.549c.252.16.514.285.783.351z" />
                  </svg>
                </div>
                <span className="text-xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                  Doc<span className="text-blue-600">Appoint</span>
                </span>
              </Link>
              <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                Connecting patients with the best verified doctors anytime, anywhere. Experience modern digital healthcare seamlessly.
              </p>
            </div>

            {/* ২. কুইক নেভিগেশন লিংক */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-2.5 text-slate-600 text-sm font-semibold">
                <li>
                  <Link href="/" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">Home</Link>
                </li>
                <li>
                  <Link href="/appointments" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">Book Appointment</Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">My Dashboard</Link>
                </li>
              </ul>
            </div>

            {/* ৩. মেডিকেল স্পেশালিটি */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Specialties</h4>
              <ul className="space-y-2.5 text-slate-500 text-sm font-semibold">
                <li className="hover:text-blue-600 cursor-pointer transition duration-200">Cardiology Care</li>
                <li className="hover:text-blue-600 cursor-pointer transition duration-200">Neurology Expert</li>
                <li className="hover:text-blue-600 cursor-pointer transition duration-200">Pediatrician Consult</li>
              </ul>
            </div>

            {/* ৪. সোশ্যাল আইকন সমূহ */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Connect With Us</h4>
              <p className="text-slate-500 text-xs font-medium">Follow us on our official social handles.</p>
              
              <div className="flex items-center gap-3">
                {/* 🐦 X / Twitter */}
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-sky-500 hover:border-sky-200 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* 🐙 GitHub */}
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-slate-500/5 transition-all duration-300"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>

                {/* 💼 LinkedIn */}
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.8v8.37h2.8v-4.67c0-.25.02-.5.1-.68a1.14 1.14 0 0 1 1-.77c.49 0 .86.37.86.92v5.2h2.8M7.12 7.6a1.44 1.44 0 1 0-1.44-1.44A1.44 1.44 0 0 0 7.12 7.6m1.41 10.9V10.13H5.71v8.37h2.82z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* নিচের কপিরাইট পার্ট */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
            <p>© {new Date().getFullYear()} DocAppoint. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-blue-600 cursor-pointer transition">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-blue-600 cursor-pointer transition">Terms of Service</span>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

// মূল Root Layout যা HTML স্ট্রাকচার প্রদান করে এবং AuthProvider দিয়ে র‍্যাপ করে
export default function RootLayout({ children }) {
  return (
    <html lang="en">
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