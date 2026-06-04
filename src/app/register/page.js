'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  // 📝 ইনপুটের জন্য স্টেট ডিক্লেয়ারেশন (ডিফল্ট খালি থাকবে)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 🚀 রেজিস্টার ফর্ম সাবমিট হ্যান্ডলার
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // ✅ এখানে অবজেক্টের নাম userInfo রাখা হয়েছে
    const userInfo = { name, email, photoURL, password };

    try {
      // 📡 লাইভ রেন্ডার ব্যাকএন্ড সার্ভারে ডাটা পাঠানো হচ্ছে
      const res = await fetch("https://docappoint-server-fq1x.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo) // 👈 ফিক্সড: 'user' পরিবর্তন করে 'userInfo' করে দেওয়া হলো
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('🎉 Registration successful! Redirecting to login...');
        
        // ফর্ম ক্লিয়ার করা
        setName('');
        setEmail('');
        setPhotoURL('');
        setPassword('');

        // ২ সেকেন্ড পর লগইন পেজে পাঠিয়ে দেওয়া
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('🌐 Server connection error. Please make sure your backend is running!');
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-slate-50/50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-3xl shadow-xl space-y-6">
        
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Register</h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">Create an account to manage your appointments</p>
        </div>

        {/* 🔔 অ্যালার্ট মেসেজ এরিয়া */}
        {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold text-center">{error}</div>}
        {success && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold text-center">{success}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Name</label>
            <input 
              type="text" 
              required
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 transition-colors"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              required
              placeholder="example@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 transition-colors"
            />
          </div>

          {/* Photo URL Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Photo URL</label>
            <input 
              type="url" 
              placeholder="https://example.com/photo.jpg" 
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-blue-600/10 disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? 'Registering Account...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 font-medium">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </div>

      </div>
    </div>
  );
}