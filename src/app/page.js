// src/app/page.js
'use client';

import { useState } from 'react'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // ✅ Next-Auth গ্লোবাল সেশন ইম্পোর্ট করা হলো
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// 🩺 ডাক্তারদের ডাইনামিক ডাটা সেট
const initialDoctors = [
  { id: "1", name: "Dr. Fahmida Kamal", specialty: "Cardiologist", experience: "10 Years", rating: 4.9, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop" },
  { id: "2", name: "Dr. Rayhan Ahmed", specialty: "Neurologist", experience: "8 Years", rating: 4.8, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop" },
  { id: "3", name: "Dr. Tanvir Hasan", specialty: "Pediatrician", experience: "5 Years", rating: 4.7, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop" },
  { id: "4", name: "Dr. Ariful Islam", specialty: "Orthopedics", experience: "7 Years", rating: 4.9, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400" },
  { id: "5", name: "Dr. Tania Sultana", specialty: "Cardiologist", experience: "6 Years", rating: 4.6, image: "https://images.unsplash.com/photo-1594824813573-246434e33963?q=80&w=400" },
  { id: "6", name: "Dr. Kamrul Hasan", specialty: "Dermatology", experience: "9 Years", rating: 5.0, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400" },
];

const specialties = ["All", "Cardiologist", "Neurologist", "Pediatrician", "Orthopedics", "Dermatology"];

const heroSlides = [
  {
    title: "Your Health, Our Top Priority",
    subtitle: "Take the first step towards a healthier life. Browse certified local doctors and book your appointment instantly.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Expert Doctors, Reliable Care",
    subtitle: "Connect with verified medical specialists who care about your health and provide personalized solutions.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Smart Scheduling, No Waiting Line",
    subtitle: "Book your preferred time slot in less than a minute. Manage everything seamlessly from your live dashboard.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop"
  }
];

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession(); // ✅ Next-Auth সেশন ট্র্যাকিং রিয়েল-টাইম ডাটা রিড
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // 🔐 সেশন ভিত্তিক সুরক্ষিত রিডাইরেক্ট লজিক
  const handleViewDetails = (id) => {
    if (!session?.user) {
      // ইউজার লগইন না থাকলে সরাসরি লগইন পেজে রিডাইরেক্ট করবে
      router.push('/login');
    } else {
      router.push(`/doctor/${id}`);
    }
  };

  const filteredDoctors = initialDoctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* প্রধান কন্টেন্ট সেকশন */}
      <div className="flex-grow space-y-12 py-6 pb-20 container mx-auto px-4 md:px-8">
        
        {/* ১. হিরো ব্যানার সেকশন */}
        <section className="rounded-3xl overflow-hidden shadow-2xl relative block bg-slate-100">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect={'fade'}
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="w-full h-full"
          >
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={index} className="overflow-hidden">
                <div 
                  className="relative p-8 md:p-24 text-center space-y-6 flex flex-col justify-center items-center min-h-[420px] md:min-h-[480px] bg-cover bg-center bg-no-repeat object-cover"
                  style={{ backgroundImage: `url('${slide.image}')` }}
                >
                  <div className="relative z-10 max-w-3xl mx-auto space-y-5 bg-white/10 backdrop-blur-[2px] p-6 rounded-2xl border border-white/20 shadow-xl">
                    <span className="bg-blue-600 text-white border border-blue-500 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full inline-block">
                      🏥 Welcome to DocAppoint
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                      {slide.title}
                    </h1>
                    <p className="text-xs md:text-base text-slate-800 max-w-xl mx-auto font-semibold leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                      {slide.subtitle}
                    </p>
                    <div className="pt-2">
                      <Link href="/appointments" className="inline-block bg-blue-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-blue-500/30 active:scale-95 text-sm md:text-base">
                        Book Appointment Now 🩺
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* 🔍 ২. সার্চ এবং ফিল্টার কন্ট্রোল প্যানেল */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="space-y-1 w-full md:w-auto">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Our Top Rated Doctors</h2>
              <p className="text-xs text-slate-400 font-medium">Search by doctor name or filter by medical specialty</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <input 
                type="text"
                placeholder="Search doctor by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 text-slate-800 transition-all duration-200"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 ${
                  selectedSpecialty === specialty
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </section>
        
        {/* 🩻 ৩. ডক্টর গ্রিড লিস্ট */}
        <section>
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed rounded-2xl p-8 text-slate-400">
              <span className="text-4xl block mb-2">🕵️‍♂️</span>
              No doctors found matching "{searchQuery}" in {selectedSpecialty}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredDoctors.slice(0, 3).map((doc) => (
                <div key={doc.id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between h-full hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1.5">
                  <div className="overflow-hidden relative">
                    <img 
                      src={doc.image} 
                      alt={doc.name} 
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" 
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 flex-grow space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        {doc.specialty}
                      </span>
                      <span className="text-amber-500 font-bold text-sm flex items-center gap-1 bg-amber-50/60 px-2.5 py-0.5 rounded-lg">
                        ★ {doc.rating}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 transition-colors duration-200 group-hover:text-blue-600">{doc.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">💼 Experience: {doc.experience}</p>
                  </div>
                  <div className="p-6 pt-0">
                    <button 
                      onClick={() => handleViewDetails(doc.id)}
                      className="w-full text-center bg-slate-50 text-slate-700 font-bold py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95 shadow-inner text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ৪. আমাদের বৈশিষ্ট্য সেকশন */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-200 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12">
              🛡️
            </div>
            <h4 className="font-bold text-xl text-slate-800 mt-4 mb-2">100% Secure</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Your health records and appointment history are fully protected with strict privacy standards.</p>
          </div>
          
          <div className="group bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-200 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-12">
              🩺
            </div>
            <h4 className="font-bold text-xl text-slate-800 mt-4 mb-2">Instant Booking</h4>
            <p className="text-sm text-slate-500 leading-relaxed">No long waiting queues. Pick your preferred time slot and get confirmed instantly.</p>
          </div>

          <div className="group bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:border-purple-200 transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-sm transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white group-hover:rotate-12">
              📊
            </div>
            <h4 className="font-bold text-xl text-slate-800 mt-4 mb-2">Easy Dashboard</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Manage, reschedule, or cancel your bookings anytime directly from your interactive dashboard.</p>
          </div>
        </section>

        {/* ৫. স্বাস্থ্য সচেতনতা সেকশন */}
        <section className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-teal-50/50 border-l-4 border-blue-600 p-6 md:p-8 rounded-r-2xl shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-teal-500">
          <div className="absolute right-6 -bottom-6 text-blue-100/40 text-9xl font-black pointer-events-none select-none animate-pulse">
            &hearts;
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="text-3xl p-3 bg-white rounded-xl shadow-md border border-blue-100">
              ❤️‍🩹
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-xl text-slate-800 tracking-tight">Weekly Health Awareness Tip</h3>
              <p className="text-slate-600 leading-relaxed font-medium text-sm md:text-base">
                Regular physical activity, even a brisk 30-minute walk daily, can significantly cut down the risk of cardiovascular diseases and improve mental well-being. Stay hydrated and stay active!
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 🚀 👑 নতুন যুক্ত করা আধুনিক ও অ্যানিমেটেড ফুটার সেকশন */}
      <footer className="relative bg-gradient-to-b from-slate-50 to-slate-100 border-t border-slate-200/80 overflow-hidden">
        
        {/* 🌟 ব্যাকগ্রাউন্ড গ্লো অ্যানিমেশন ইফেক্ট */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-4000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-3000"></div>

        <div className="container mx-auto px-6 md:px-12 pt-16 pb-8 max-w-7xl relative z-10">
          
          {/* প্রধান ফুটার গ্রিড */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
            
            {/* ১. ওয়েবসাইট লোগো ও বর্ণনা */}
            <div className="md:col-span-1 space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group w-fit">
                <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.25 2.25 0 0 1 10.5 2.25h4.5a2.25 2.25 0 0 1 2.183 1.75m-6 0C10.012 4.015 9.75 4.14 9.497 4.3a48.513 48.513 0 0 0-3.084.55C5.276 5.016 4.5 5.955 4.5 7.02v10.73c0 1.065.776 2.004 1.913 2.172a48.39 48.39 0 0 0 3.084.549c.252.16.514.285.783.351z" />
                  </svg>
                </div>
                <span className="text-xl font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                  Doc<span className="text-blue-600">Appoint</span>
                </span>
              </Link>
              <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                Connecting patients with the best verified doctors anytime, anywhere. Experience modern digital healthcare seamlessly.
              </p>
            </div>

            {/* ২. কুইক নেভিগেশন লিংক */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-2.5 text-slate-600 text-sm font-semibold">
                <li>
                  <Link href="/" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">Home</Link>
                </li>
                <li>
                  <Link href="/appointments" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">Book Appointment</Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200">My Dashboard</Link>
                </li>
              </ul>
            </div>

            {/* ৩. মেডিকেল স্পেশালিটি */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Specialties</h4>
              <ul className="space-y-2.5 text-slate-500 text-sm font-semibold">
                <li className="hover:text-blue-600 cursor-pointer transition duration-200">Cardiology Care</li>
                <li className="hover:text-blue-600 cursor-pointer transition duration-200">Neurology Expert</li>
                <li className="hover:text-blue-600 cursor-pointer transition duration-200">Pediatrician Consult</li>
              </ul>
            </div>

            {/* ৪. সোশ্যাল আইকন সমূহ (স্মুথ বাউন্স এবং হোভার ইফেক্ট) */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Connect With Us</h4>
              <p className="text-slate-500 text-xs font-medium">Follow us on our official social handles.</p>
              
              <div className="flex items-center gap-3">
                {/* 🐦 X / Twitter */}
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-sky-500 hover:border-sky-200 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* 🐙 GitHub */}
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-slate-500/5 transition-all duration-300"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>

                {/* 💼 LinkedIn */}
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.8v8.37h2.8v-4.67c0-.25.02-.5.1-.68a1.14 1.14 0 0 1 1-.77c.49 0 .86.37.86.92v5.2h2.8M7.12 7.6a1.44 1.44 0 1 0-1.44-1.44A1.44 1.44 0 0 0 7.12 7.6m1.41 10.9V10.13H5.71v8.37h2.82z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* নিচের কপিরাইট পার্ট */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400">
            <p>© {new Date().getFullYear()} DocAppoint. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-blue-600 cursor-pointer transition">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-blue-600 cursor-pointer transition">Terms of Service</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}