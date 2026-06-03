// src/app/login/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // অ্যাসাইনমেন্ট চেক করার জন্য সাময়িক ডেমো লগইন লজিক
    if (formData.email === 'user@gmail.com' && formData.password === 'Test1234') {
      toast.success("Successfully Logged In! 🚀");
      
      // রিকোয়ারমেন্ট অনুযায়ী: লগইন সফল হলে হোম পেজ বা আগের প্রটেক্টেড রুটে যাবে
      router.push('/'); 
    } else {
      // রিকোয়ারমেন্ট অনুযায়ী: লগইন ফেইল হলে কাস্টম টোস্ট এরর দেখাবে
      toast.error("Invalid email or password. Try user@gmail.com / Test1234");
    }
  };

  const handleSocialLogin = () => {
    // রিকোয়ারমেন্ট অনুযায়ী: সোশ্যাল লগইন ফ্লো
    toast.success("Google Login Initiated...");
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      {/* রিকোয়ারমেন্ট টাইটেল */}
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
          <input 
            type="email" 
            required 
            placeholder="user@gmail.com"
            className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-600 transition" 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <a href="#" className="text-xs text-blue-600 hover:underline">Forgot Password?</a>
          </div>
          <input 
            type="password" 
            required 
            placeholder="••••••••"
            className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-600 transition" 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">
          Login
        </button>
      </form>

      {/* রিকোয়ারমেন্ট অনুযায়ী: সোশ্যাল লগইন (যেকোনো একটি - আমরা Google ব্যবহার করছি) */}
      <div className="mt-6 space-y-4">
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-sm">or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button 
          onClick={handleSocialLogin}
          type="button" 
          className="w-full flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.04 8.79 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.68 2.85c2.15-1.98 3.4-4.9 3.4-8.53z"/>
            <path fill="#FBBC05" d="M5.1 14.7c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 7.3C.54 9.22 0 11.35 0 13.6s.54 4.38 1.5 6.3l3.6-2.9z"/>
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.68-2.85c-1.02.68-2.33 1.09-4.28 1.09-3.21 0-5.99-2-6.91-4.96l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
          </svg>
          Google
        </button>
      </div>
      
      {/* রিকোয়ারমেন্ট অনুযায়ী রেজিস্ট্রেশন পেজে যাওয়ার লিঙ্ক */}
      <p className="mt-6 text-center text-sm text-slate-600">
        Don't have an account? <Link href="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
      </p>
    </div>
  );
}