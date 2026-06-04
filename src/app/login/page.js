'use client';

import { useState, Suspense } from 'react'; // 👈 ফিক্স: Suspense ইম্পোর্ট করা হলো
import { signIn } from 'next-auth/react'; 
import { useRouter, useSearchParams } from 'next/navigation'; 
import Link from 'next/link';

// ১. আপনার আসল লগইন ফর্মের কোডটি এই কম্পোনেন্টে রাখা হলো
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); 

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false, 
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh(); 
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-slate-100 rounded-3xl shadow-xl transition-all duration-300">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-sm font-medium text-slate-400">Login to manage your medical appointments</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-semibold text-sm flex items-center gap-2 animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
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

          <div className="p-3 bg-blue-50/50 border border-blue-100/60 rounded-xl text-xs text-blue-700 font-medium space-y-0.5">
            <p className="font-bold text-blue-800">💡 Quick Test Account:</p>
            <p>Email: <span className="font-mono bg-white px-1 py-0.5 rounded border">user@gmail.com</span></p>
            <p>Password: <span className="font-mono bg-white px-1 py-0.5 rounded border">123456</span></p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-blue-500/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-base"
          >
            {loading ? 'Verifying Account...' : 'Sign In 🩺'}
          </button>
        </form>

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

// ২. 🚀 মেইন পেজ এক্সপোর্ট করার সময় সেটিকে Suspense দিয়ে মুড়িয়ে দেওয়া হলো
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