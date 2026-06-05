// src/app/page.js
'use client';

import { useState } from 'react'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ✅ লগইন রিডাইরেক্টের জন্য useRouter ইমপোর্ট করা হলো
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// 🩺 ডাক্তারদের ডাইনামিক ডাটা সেট (অল অ্যাপয়েন্টমেন্ট পেজের ছবির সাথে ১০০% মিল রাখা হলো)
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
  const router = useRouter(); // ✅ রাউটার ডিক্লেয়ার করা হলো
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [subscribed, setSubscribed] = useState(false);

  // 🔐 ফিক্সড সিকিউরিটি লজিক (হোম পেজের জন্যও সরাসরি রিডাইরেক্ট)
  const handleViewDetails = (id) => {
    const loggedInUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (!loggedInUser) {
      // কোনো অ্যালার্ট আসবে না, সরাসরি লগইন পেজে নিয়ে যাবে
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
      <div className="flex-grow space-y-12 py-2 pb-20">
        
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    {doc.experience && (
                      <p className="text-xs text-slate-400 font-medium">💼 Experience: {doc.experience}</p>
                    )}
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
            ♥
          </div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="text-3xl p-3 bg-white rounded-xl shadow-md border border-blue-100 animate-bounce">
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

      {/* 🌐 ৬. গ্লোবাল ফুটার সেকশন */}
      <footer className="bg-slate-900 text-slate-400 rounded-t-3xl border-t border-slate-800 mt-auto shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-black text-2xl">
              <span className="text-blue-500">🩺</span> DocAppoint
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Making healthcare accessible, reliable, and modern. Book top-rated certified local doctors near you in one click.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-500 text-lg">
              <span className="hover:text-blue-400 cursor-pointer">🌐</span>
              <span className="hover:text-blue-400 cursor-pointer font-bold text-sm tracking-tighter">𝕏</span>
              <span className="hover:text-blue-400 cursor-pointer">💼</span>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-white font-bold text-base tracking-wide uppercase">Quick Links</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition-colors duration-200">Home</Link></li>
              <li><Link href="/appointments" className="hover:text-blue-400 transition-colors duration-200">All Appointments</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors duration-200">User Dashboard</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-white font-bold text-base tracking-wide uppercase">Support & Privacy</h5>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-blue-400 cursor-pointer">Contact Support</li>
              <li className="hover:text-blue-400 cursor-pointer">Terms of Service</li>
              <li className="hover:text-blue-400 cursor-pointer">Privacy Policy</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-white font-bold text-base tracking-wide uppercase">Stay Connected</h5>
            <p className="text-sm text-slate-400">Subscribe for health tips and platform updates.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your Email" className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3.5 py-2 w-full text-sm focus:outline-none focus:border-blue-500" />
              <button 
                onClick={() => setSubscribed(true)} 
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-blue-500 transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                {subscribed ? '✓ Done' : 'Join'}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500 tracking-wide">
          © 2026 DocAppoint. Crafted beautifully for healthcare excellence. All rights reserved.
        </div>
      </footer>
    </div>
  );
}