// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { signIn } from 'next-auth/react'; // ✅ Next-Auth সাইন-ইন মেথড
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 📝 ইমেইল এবং পাসওয়ার্ড দিয়ে ক্রেডেনশিয়াল লগইন হ্যান্ডলার
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      if (res?.error) {
        setErrorMsg("Invalid email or password. Please try again.");
        toast.error("Login failed.");
      } else {
        toast.success("Login Successful! 🚀");
        router.push('/dashboard');
        router.refresh(); 
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please check your internet or server connection.");
      toast.error("Server connection error.");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 গুগলের রিয়েল সোশ্যাল লগইন হ্যান্ডলার (প্রোডাকশন সেফ)
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      toast.loading("Redirecting to Google...", { id: "google-auth" });
      // ✅ গুগল সেশন চালু এবং ড্যাশবোর্ডে রিডাইরেকশন ট্র্যাকিং
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      console.error("Google Auth Error:", err);
      toast.error("Google Authentication Failed.", { id: "google-auth" });
      setLoading(false);
    }
    // Note: সোশ্যাল লগইনে সাকসেসফুল হলে পেজ রিডাইরেক্ট হয়ে যায়, তাই এখানে setLoading(false) দরকার নেই
  };

  const handleQuickTest = (e) => {
    e.preventDefault(); // ফর্ম সাবমিশন রোধ করতে
    setEmail('user@gmail.com');
    setPassword('123456');
    toast.success("Demo credentials loaded! 💡");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border border-slate-100 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-800">Login</h2>
          <p className="text-sm text-slate-500">Login to manage your medical appointments</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm font-semibold flex items-start gap-2">
            <span>⚠️</span>
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition text-slate-800 outline-none" 
              placeholder="example@gmail.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Password</label>
              <button type="button" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</button>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition text-slate-800 outline-none" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="button"
            onClick={handleQuickTest}
            className="w-full bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-left cursor-pointer hover:bg-blue-50 transition text-xs space-y-1"
          >
            <p className="font-bold text-blue-800">💡 Quick Test Account (Click to Autofill):</p>
            <p className="text-slate-600">Email: <span className="underline font-mono text-blue-600">user@gmail.com</span></p>
            <p className="text-slate-600">Password: <span className="underline font-mono text-blue-600">123456</span></p>
          </button>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition text-sm shadow-md disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? "Logging in..." : "Login 🩺"}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or Continue With</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button 
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.216 1.494 15.44 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.83 11.57-11.64 0-.78-.08-1.38-.23-2.075H12.24z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-600">
          Don't have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}