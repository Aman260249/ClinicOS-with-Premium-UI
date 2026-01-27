import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Verifying credentials...");
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success("Welcome to ClinicOS", { id: loadingToast });
      navigate('/dashboard'); 
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans selection:bg-indigo-100 p-4 sm:p-6">
      <Toaster position="top-right" />
      
      {/* Main Container */}
      <div className="w-full max-w-[1100px] flex bg-white rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] overflow-hidden min-h-[650px] border border-slate-100">
        
        {/* Left Side: Image & Branding (Visible on Tablet and Laptop) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-12 flex-col justify-between relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30">
                <ShieldCheck className="text-white" size={28} />
              </div>
              <h2 className="text-white text-2xl font-black tracking-tight">ClinicOS</h2>
            </div>
            
            <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
              Manage your <br /> 
              <span className="text-indigo-200">clinic with ease.</span>
            </h1>
            <p className="text-indigo-100 text-lg font-medium max-w-sm leading-relaxed">
              The all-in-one solution for patient management, tracking, and medical records.
            </p>
          </div>

          {/* User Image Placeholder */}
          <div className="relative z-10 mt-auto">
             <div className="flex items-center gap-4 bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10 w-fit">
                {/* YAHAN APNI PNG IMAGE LAGANA */}
                <img 
                  src="/assets/logo-retouch.png" 
                  alt="Codelab Logo" 
                  className="w-12 h-12 rounded-2xl object-cover shadow-lg border-2 border-white/50" 
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Codelab&background=6366f1&color=fff"; }}
                />
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-widest">Built by Codelab</p>
                  <p className="text-indigo-200 text-xs font-bold">Version 1.0.2</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight italic">Welcome Back</h3>
              <p className="text-slate-400 font-bold">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 rounded-2xl outline-none transition-all font-bold text-slate-700"
                    placeholder="admin@clinicos.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Secret Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input 
                    type="password" 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 rounded-2xl outline-none transition-all font-bold text-slate-700"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                ACCESS DASHBOARD
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-slate-50">
               <p className="text-center text-slate-400 text-sm font-bold">
                 Unauthorized access is strictly prohibited.
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;