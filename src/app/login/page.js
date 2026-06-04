'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react'; 
import { useRouter, useSearchParams } from 'next/navigation'; // 👈 ফিক্স: useSearchParams ইম্পোর্ট করা হলো
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 👈 ফিক্স: ইউআরএল প্যারামিটার রিড করার জন্য

  // 🔍 ফিক্স: বুকিং পেজ থেকে আসলে callbackUrl-এ বুকিং পেজের লিঙ্ক থাকবে, না থাকলে ডিফল্ট '/dashboard'
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  // ফর্ম ইনপুটের জন্য স্টেট
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // লোডিং এবং এরর মেসেজ হ্যান্ডেল করার স্টেট
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 📝 লগইন সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // NextAuth-এর Credentials মেথড ব্যবহার করে সাইন-ইন কল করা
      const res = await signIn('credentials', {
        redirect: false, // আমরা কাস্টম রিডাইরেক্ট হ্যান্ডেল করব যেন পেজ রিফ্রেশ না হয়
        email,
        password,
      });

      if (res?.error) {
        // যদি NextAuth কোনো এরর দেয় (যেমন: ভুল পাসওয়ার্ড)
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      } else {
        // 🚀 ফিক্স: সফলভাবে লগইন হলে ইউজারকে সরাসরি আগের পেজে (বা ড্যাশবোর্ডে) নিয়ে যাবে
        router.push(callbackUrl);
        router.refresh(); // স্টেট ইনস্ট্যান্ট আপডেট করার জন্য রিফ্রেশ
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-slate-100 rounded-3xl shadow-xl transition-all duration-300">
        
        {/* হেডার টেক্সট */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-sm font-medium text-slate-400">Login to manage your medical appointments</p>
        </div>

        {/* 🚨 এরর মেসেজ অ্যালার্ট বক্স */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-semibold text-sm flex items-center gap-2 animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* 📨 লগইন ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ইমেইল ইনপুট ফিল্ড */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium transition-colors duration-200 text-sm"
            />
          </div>

          {/* পাসওয়ার্ড ইনপুট ফিল্ড */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot?</a>
            </div>
            <input 
              type="password" 
              required
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium transition-colors duration-200 text-sm"
            />
          </div>

          {/* ডেমো ক্রেডেনশিয়ালস হিন্ট */}
          <div className="p-3 bg-blue-50/50 border border-blue-100/60 rounded-xl text-xs text-blue-700 font-medium space-y-0.5">
            <p className="font-bold text-blue-800">💡 Quick Test Account:</p>
            <p>Email: <span className="font-mono bg-white px-1 py-0.5 rounded border">user@gmail.com</span></p>
            <p>Password: <span className="font-mono bg-white px-1 py-0.5 rounded border">123456</span></p>
          </div>

          {/* সাবমিট বাটন */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-blue-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-base"
          >
            {loading ? 'Verifying Account...' : 'Sign In 🩺'}
          </button>
        </form>

        {/* রেজিস্টার লিংক */}
        <div className="text-center text-sm font-medium text-slate-400 pt-2 border-t border-slate-50">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}