'use client';

import { useState, Suspense } from 'react'; 
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

        {/* 🆕 👥 সোশ্যাল লগইন সেকশন এখানে যুক্ত করা হলো */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs text-slate-400 font-bold uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* 🔴 Google Login Button */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl })}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 font-bold text-sm text-slate-700 transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.216 1.494 15.44 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.83 11.57-11.64 0-.78-.08-1.38-.23-2.075H12.24z"/>
              </svg>
              Google
            </button>

            {/* 🪟 GitHub Login Button */}
            <button
              type="button"
              onClick={() => signIn('github', { callbackUrl })}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 font-bold text-sm text-slate-700 transition-all active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

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

// ২. 🚀 মেইন পেজ এক্সপোর্ট করার সময় সেটিকে Suspense দিয়ে মুড়িয়ে দেওয়া হলো
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