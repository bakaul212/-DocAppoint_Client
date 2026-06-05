'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
// 🔐 Integrated Better-Auth Client Wrapper
import { authClient } from "@/lib/auth-client"; 

export default function RegisterPage() {
  const router = useRouter();
  
  // 📝 Combined form and status states
  const [formData, setFormData] = useState({ name: '', email: '', photoUrl: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // 🚀 Register form submit handler using Better-Auth
  const handleRegister = async (e) => {
    e.preventDefault();
    setValidationError('');

    // 🔒 Password validation checks
    const { password } = formData;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const isLongEnough = password.length >= 6;

    if (!hasUppercase || !hasLowercase || !isLongEnough) {
      setValidationError("❌ Password must be at least 6 characters long, contain 1 uppercase letter, and 1 lowercase letter.");
      toast.error("Password validation failed!");
      return;
    }

    setLoading(true);

    try {
      // 📡 Executing Better-Auth email sign-up protocol
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.photoUrl, 
      });

      if (error) {
        setValidationError(error.message || "Registration failed.");
        toast.error(error.message || "Registration failed.");
      } else {
        toast.success("Registration Successful! Please login. 🎉");
        router.push('/login'); 
      }
    } catch (err) {
      console.error(err);
      setValidationError("🌐 Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 Google Social Authentication Handler
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error("Failed to authenticate with Google.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-slate-50/50 px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-3xl shadow-xl space-y-6">
        
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Register</h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">Create an account to manage your appointments</p>
        </div>

        {/* ⚠️ Alert Message Area */}
        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold text-center">
            {validationError}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Name</label>
            <input 
              type="text" 
              required
              placeholder="John Doe" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 transition-colors"
            />
          </div>

          {/* Photo URL Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Photo URL</label>
            <input 
              type="url" 
              required
              placeholder="https://example.com/photo.jpg" 
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 transition-colors"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              placeholder="Min 6 chars, 1 Upper, 1 Lower" 
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-blue-600/10 disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? 'Registering Account...' : 'Register'}
          </button>
        </form>

        {/* 🌐 Modernized Better-Auth Social Action Area */}
        <div className="space-y-3 pt-2">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs text-slate-400 font-bold uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 font-bold text-sm text-slate-700 transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.216 1.494 15.44 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.83 11.57-11.64 0-.78-.08-1.38-.23-2.075H12.24z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </div>

      </div>
    </div>
  );
}