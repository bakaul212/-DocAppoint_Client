// src/app/register/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', photoUrl: '', password: '' });
  const [error, setError] = useState('');

  // রিকোয়ারমেন্ট অনুযায়ী পাসওয়ার্ড ভ্যালিডেশন ফাংশন
  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least 1 uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least 1 lowercase letter.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // পাসওয়ার্ড চেক করা হচ্ছে
    const passError = validatePassword(formData.password);
    if (passError) {
      setError(passError); // ফর্মের ভেতরে এরর দেখানো হচ্ছে
      toast.error(passError); // কাস্টম টোস্ট এরর
      return;
    }

    try {
      // এখানে Better Auth / Backend API কল হবে। আপাতত আমরা ডেমো সাকসেস দেখাচ্ছি।
      toast.success("Registration Successful!");
      
      // রিকোয়ারমেন্ট অনুযায়ী সাকসেস হলে লগইন পেজে রিডাইরেক্ট করবে
      router.push('/login'); 
    } catch (err) {
      setError("Registration failed. Please try again.");
      toast.error("Registration failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      {/* রিকোয়ারমেন্ট টাইটেল */}
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">Register</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
          <input 
            type="text" 
            required 
            placeholder="John Doe"
            className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-600 transition" 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>
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
          <label className="block text-sm font-semibold text-slate-700 mb-1">Photo URL</label>
          <input 
            type="url" 
            required 
            placeholder="https://example.com/photo.jpg"
            className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-600 transition" 
            onChange={e => setFormData({...formData, photoUrl: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <input 
            type="password" 
            required 
            placeholder="••••••••"
            className="w-full border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-blue-600 transition" 
            onChange={e => setFormData({...formData, password: e.target.value})} 
          />
        </div>

        {/* রিকোয়ারমেন্ট: ফর্মের ভেতরে কাস্টম এরর দেখানো */}
        {error && (
          <p className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl border border-red-100">
            ⚠️ {error}
          </p>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">
          Register
        </button>
      </form>
      
      {/* রিকোয়ারমেন্ট লিঙ্কিং */}
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
      </p>
    </div>
  );
}