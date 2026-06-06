// src/app/doctor/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// 🩺 ডক্টর ডাটা সেট (১০০% ইউনিক এবং সঠিক লাইভ ইমেজ লিংক সহ আপডেট করা হয়েছে)
const allDoctorsData = {
  "1": { 
    id: "1",
    name: "Dr. Fahmida Kamal", 
    specialty: "Cardiologist", 
    image: "https://images.unsplash.com/photo-1594824813573-246434e33963?q=80&w=600", 
    experience: "10 years", 
    fee: 800, 
    hospital: "Labaid Hospital", 
    location: "Dhanmondi, Dhaka", 
    availability: ["09:00 AM - 12:00 PM", "04:00 PM - 07:00 PM"], 
    description: "Highly experienced cardiologist specializing in cardiovascular diseases, preventive cardiac care, and advanced clinical cardiology treatments." 
  },
  "2": { 
    id: "2",
    name: "Dr. Rayhan Ahmed", 
    specialty: "Neurologist", 
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600", 
    experience: "8 years", 
    fee: 1000, 
    hospital: "Square Hospital", 
    location: "Panthapath, Dhaka", 
    availability: ["10:00 AM - 01:00 PM", "06:00 PM - 09:00 PM"], 
    description: "Expert neurologist dedicated to providing comprehensive care for complex neurological, spinal cord, and critical neuromuscular disorders." 
  },
  "3": { 
    id: "3",
    name: "Dr. Tanvir Hasan", 
    specialty: "Pediatrician", 
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600", 
    experience: "5 years", 
    fee: 600, 
    hospital: "Apollo Hospital", 
    location: "Bashundhara, Dhaka", 
    availability: ["11:00 AM - 02:00 PM"], 
    description: "Compassionate pediatrician specializing in neonatal care, regular pediatric immunizations, childhood nutrition, and development tracking." 
  },
  "4": { 
    id: "4",
    name: "Dr. Ariful Islam", 
    specialty: "Orthopedics", 
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600", 
    experience: "7 years", 
    fee: 700, 
    hospital: "Popular Hospital", 
    location: "Dhanmondi, Dhaka", 
    availability: ["02:00 PM - 05:00 PM", "06:30 PM - 08:30 PM"], 
    description: "Dedicated orthopedic surgeon focusing on bone fractures, corrective joint surgeries, sports injuries, and musculoskeletal disorder therapies." 
  },
  "5": { 
    id: "5",
    name: "Dr. Tania Sultana", 
    specialty: "Cardiologist", 
    image: "https://images.pexels.com/photos/7578803/pexels-photo-7578803.jpeg?auto=compress&cs=tinysrgb&w=600", 
    experience: "6 years", 
    fee: 800, 
    hospital: "Labaid Hospital", 
    location: "Mirpur, Dhaka", 
    availability: ["03:00 PM - 06:00 PM"], 
    description: "Focused specialist in women's cardiac health, hypertension treatments, valvular heart conditions, and lifestyle management plans." 
  },
  "6": { 
    id: "6",
    name: "Dr. Kamrul Hasan", 
    specialty: "Dermatology", 
    image: "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=600", 
    experience: "9 years", 
    fee: 900, 
    hospital: "Ibn Sina Hospital", 
    location: "Kalyanpur, Dhaka", 
    availability: ["05:00 PM - 08:30 PM"], 
    description: "Reputed dermatologist specializing in modern skincare therapies, clinical acne solutions, skin pathology diagnostics, and allergy care." 
  }
};

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const doctor = allDoctorsData[id];

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.name && !patientName) {
      setPatientName(session.user.name);
    }
  }, [status, session, patientName]);

  if (!doctor) {
    return (
      <div className="text-center py-20 space-y-4 container mx-auto">
        <p className="text-rose-500 font-bold text-xl">❌ Doctor Profile Not Found!</p>
        <button onClick={() => router.push('/')} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition">
          Back to Home
        </button>
      </div>
    );
  }

  const handleProceedToBook = () => {
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=/doctor/${id}`);
      return;
    }
    
    setShowBookingForm(true);
    setTimeout(() => {
      const element = document.getElementById('booking-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // 💾 MongoDB ডাটাবেজে অ্যাপয়েন্টমেন্ট সেভ করার লজিক
  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!patientName || !phone || !date || !selectedSlot) {
      setMessage({ type: 'error', text: '⚠️ Please fill out all required fields and select a time slot.' });
      setLoading(false);
      return;
    }

    const activeEmail = session?.user?.email;
    if (!activeEmail) {
      setMessage({ type: 'error', text: 'User session not found. Please log in again.' });
      setLoading(false);
      return;
    }

    // 🌟 ড্যাশবোর্ড এবং ব্যাকএন্ড স্কিমার সাথে হুবহু মিল রেখে অবজেক্ট স্ট্রাকচার তৈরি করা হলো 
    const bookingInfo = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      patientName: patientName, 
      patientEmail: activeEmail, 
      userEmail: activeEmail,       // 👈 ড্যাশবোর্ডের ফিল্টারিং সিঙ্ক
      phone: phone,                 // 👈 ওল্ড ডাটা ব্যাকআপ সাপোর্ট 
      patientPhone: phone,          // 👈 ড্যাশবোর্ড মেইন ফোন কী
      appointmentDate: date,        // 👈 ড্যাশবোর্ড মেইন ডেট কী (date থেকে পরিবর্তন করা হলো)
      selectedSlot: selectedSlot,   // 👈 ড্যাশবোর্ড মেইন টাইম স্লট কী
      appointmentTime: selectedSlot, // 👈 ওল্ড ড্যাশবোর্ড ব্যাকআপ সাপোর্ট
      reason: reason || "General Checkup"
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://docappoint-server-fq1x.onrender.com';
      const res = await fetch(`${apiUrl}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingInfo),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: '🎉 Appointment Booked Successfully!' });
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh(); 
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to book appointment.' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: '🌐 Server connection error!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl space-y-8">
      
      {/* ১. ডক্টর প্রোফাইল কার্ড সেকশন */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-2/5 h-72 md:h-auto relative bg-slate-50">
          <img 
            src={doctor.image} 
            alt={doctor.name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/387/387561.png";
            }}
          />
        </div>

        <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {doctor.specialty}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 mt-2 tracking-tight">{doctor.name}</h2>
              <p className="text-slate-400 font-bold text-xs mt-1">💼 {doctor.experience} of Active Experience</p>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
              {doctor.description}
            </p>

            <div className="text-sm space-y-2.5 text-slate-600">
              <p className="flex items-center gap-2">🏥 <strong className="text-slate-700">Hospital:</strong> <span className="font-semibold text-slate-800">{doctor.hospital}</span></p>
              <p className="flex items-center gap-2">📍 <strong className="text-slate-700">Location:</strong> <span className="font-medium">{doctor.location}</span></p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Consultation Fee</p>
              <p className="text-2xl font-black text-blue-600">৳ {doctor.fee}</p>
            </div>
            <button 
              onClick={handleProceedToBook}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/10 text-sm"
            >
              Proceed to Book 👇
            </button>
          </div>
        </div>
      </div>

      {/* ২. কন্ডিশনাল বুকিং ফর্ম */}
      {showBookingForm && (
        <div id="booking-form" className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6 scroll-mt-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">📅 Book an Appointment Slot</h3>
            <p className="text-xs text-slate-400 font-medium">Please fulfill the patient data & select an available timing slot</p>
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl text-xs font-bold text-center ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmitBooking} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Patient Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 text-slate-800 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Contact Number *</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter mobile number" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 text-slate-800 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Preferred Date *</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 text-slate-800 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Available Time Slots *</label>
                <div className="flex flex-wrap gap-2.5">
                  {doctor.availability.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 border ${
                        selectedSlot === slot
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Reason for Appointment / Symptoms</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="3" 
                placeholder="Describe briefly your physical difficulties or medical context..." 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 text-slate-800 transition resize-none"
              ></textarea>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-500/10 text-sm md:text-base disabled:opacity-50"
              >
                {loading ? 'Sending Request to Server...' : 'Confirm & Request Appointment 🚀'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}