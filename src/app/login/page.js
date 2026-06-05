'use client';

import { useState, Suspense } from 'react'; 
import { useRouter } from 'next/navigation'; 
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch("https://docappoint-server-fq1x.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ডাটা লোকালস্টোরেজে রাখা হচ্ছে
        localStorage.setItem('user', JSON.stringify(data.user || { name: 'User', email }));
        
        // আপনার layout.js ফাইলে থাকা 'storage' লিসেনারকে ইনস্ট্যান্ট ট্রিগার করার জন্য ট্রিক
        window.dispatchEvent(new Event('storage'));
        
        router.push('/dashboard');
        router.refresh(); 
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please check your internet or server connection.');
    } finally {
      setLoading(false);
    }
  };

  // গুগল লগইন বাটনে ক্লিক করলে সাময়িকভাবে একটি ডেমো ইউজার দিয়ে ড্যাশবোর্ডে পাঠাবে (বিল্ড সেভ করার জন্য)
  const handleGoogleLogin = () => {
    const demoGoogleUser = {
      name: "Google User",
      email: "googleuser@gmail.com",
      image: null
    };
    localStorage.setItem('user', JSON.stringify(demoGoogleUser));
    window.dispatchEvent(new Event('storage'));
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-slate-100 rounded-3xl shadow-xl">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Login</h2>
          <p className="text-sm font-medium text-slate-400">Login to manage your medical appointments</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-semibold text-sm flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Email</label>
            <input 
              type="email" 
              required
              autoComplete="email"
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password</Link>
            </div>
            <input 
              type="password" 
              required
              autoComplete="current-password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800 font-medium text-sm"
            />
          </div>

          <div className="p-3 bg-blue-50/50 border border-blue-100/60 rounded-xl text-xs text-blue-700 font-medium space-y-0.5">
            <p className="font-bold text-blue-800">💡 Quick Test Account:</p>
            <p>Email: <span className="font-mono bg-white px-1 py-0.5 rounded border">user@gmail.com</span></p>
            <p>Password: <span className="font-mono bg-white px-1 py-0.5 rounded border">123456</span></p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50 text-base"
          >
            {loading ? 'Verifying Account...' : 'Login 🩺'}
          </button>
        </form>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs text-slate-400 font-bold uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 font-bold text-sm text-slate-700 transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.216 1.494 15.44 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.83 11.57-11.64 0-.78-.08-1.38-.23-2.075H12.24z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="text-center text-sm font-medium text-slate-400 pt-2 border-t border-slate-50">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-semibold text-slate-500 animate-pulse">Loading Login Page...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}