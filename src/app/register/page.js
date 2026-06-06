// src/app/register/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { signIn } from 'next-auth/react'; // ✅ Next-Auth সাইন-ইন মেথড ইম্পোর্ট করা হলো
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', photoUrl: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // 📝 কাস্টম ইমেইল ও পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন হ্যান্ডলার
  const handleRegister = async (e) => {
    e.preventDefault();
    setValidationError('');

    const { password } = formData;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const isLongEnough = password.length >= 6;

    if (!hasUppercase || !hasLowercase || !isLongEnough) {
      setValidationError("Password must be at least 6 characters long, contain 1 uppercase letter, and 1 lowercase letter.");
      toast.error("Password validation failed!");
      return;
    }

    setLoading(true); // ✅ এখানে টাইপো ফিক্স করা হলো (loading(true) থেকে setLoading(true))

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://docappoint-server-fq1x.onrender.com";
      
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          image: formData.photoUrl, 
          password: formData.password
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Registration Successful! Please login. 🎉");
        router.push('/login'); 
      } else {
        setValidationError(data.message || "Registration failed.");
        toast.error(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setValidationError("Failed to connect to server. Try again later.");
      toast.error("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 গুগলের রিয়েল সোশ্যাল লগইন হ্যান্ডলার
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setValidationError('');
    try {
      toast.loading("Redirecting to Google...", { id: "google-register" });
      // ✅ এটি গুগলের আসল পপআপ সেশন চালু করবে এবং সফল হলে ড্যাশবোর্ডে পাঠাবে
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error("Failed to authenticate with Google.", { id: "google-register" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      {/* 🧠 ব্রাউজার টাইটেল ও এসইও ডাইনামিক সিঙ্ক */}
      <title>Register | DocAppoint</title>
      <meta name="description" content="Create a free account on DocAppoint to easily access top medical consultants and track your health schedules seamlessly." />

      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-slate-100 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-800">Register</h2>
          <p className="text-sm text-slate-500">Create an account to manage your appointments</p>
        </div>

        {validationError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <p>{validationError}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Name</label>
            <input 
              type="text" required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border p-3 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
            <input 
              type="email" required 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border p-3 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="example@gmail.com"
            />
          </div>

          {/* 🛠️ ফিক্সড ফটো ইউআরএল সেকশন */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Photo URL</label>
            <input 
              type="text" 
              required 
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              className="w-full border p-3 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <input 
              type="password" required 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border p-3 rounded-xl text-sm bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Min 6 chars, 1 Upper, 1 Lower"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition text-sm shadow-md disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="space-y-3 pt-2">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs text-slate-400 font-bold uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 font-bold text-sm text-slate-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.216 1.494 15.44 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.83 11.57-11.64 0-.78-.08-1.38-.23-2.075H12.24z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-slate-600 pt-2 border-t border-slate-100">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}