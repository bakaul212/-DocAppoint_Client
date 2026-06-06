'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';

// 🩺 ডক্টর ডাটা বেস
const doctorsData = [
  { id: "1", name: "Dr. Fahmida Kamal", specialty: "Cardiologist" },
  { id: "2", name: "Dr. Rayhan Ahmed", specialty: "Neurologist" },
  { id: "3", name: "Dr. Tanvir Hasan", specialty: "Pediatrician" },
  { id: "4", name: "Dr. Ariful Islam", specialty: "Orthopedics" },
  { id: "5", name: "Dr. Tania Sultana", specialty: "Cardiologist" },
  { id: "6", name: "Dr. Kamrul Hasan", specialty: "Dermatology" },
];

export default function BookingPage() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();

  // সরাসরি রেন্ডার টাইমে ডাটা ক্যালকুলেট করা
  const doctor = doctorsData.find((doc) => doc.id === id);

  // স্টেটস
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male'); // ✅ যুক্ত করা হলো (Default: Male)
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 🔒 ফিক্সড সিকিউরিটি গার্ড: শুধুমাত্র নিশ্চিতভাবে 'unauthenticated' হলেই লগইন পেজে যাবে
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/book/${id}`);
    }
  }, [status, router, id]);

  // ⏳ লোডিং স্টেট হ্যান্ডলিং
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-xs text-slate-500 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // 🔒 যদি সেশন না থাকে, তবে ফর্ম দেখাবে না
  if (status === 'unauthenticated') {
    return null;
  }

  if (!doctor) {
    return (
      <div className="text-center py-16 text-rose-500 font-bold">
        ❌ Doctor not found! Please check the URL.
      </div>
    );
  }

  // 🚀 ফর্ম সাবমিট হ্যান্ডলার (আপডেটেড ও সিঙ্কড)
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // 🔗 ড্যাশবোর্ডের স্টেট এবং ব্যাকএন্ড স্কিমার সাথে হুবহু মিল রেখে অবজেক্ট তৈরি
    const bookingInfo = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      userEmail: session?.user?.email,
      patientName: session?.user?.name,
      gender: gender,
      phone: phone, // ড্যাশবোর্ডের ওল্ড সাপোর্ট এটিকে হ্যান্ডেল করবে
      patientPhone: phone, // ড্যাশবোর্ডের নতুন ফিল্ডের সাথে মিল রেখে যুক্ত করা হলো
      appointmentDate: date, 
      appointmentTime: timeSlot, // ব্যাকএন্ড ওল্ড সাপোর্ট
      selectedSlot: timeSlot, // 🌟 ড্যাশবোর্ডের মেইন কি (selectedSlot) এর সাথে সিঙ্ক করা হলো
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://docappoint-server-fq1x.onrender.com";

      const res = await fetch(`${baseUrl}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingInfo),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: '🎉 Appointment booked successfully!' });
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 2500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to book appointment.' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: '🌐 Server connection error. Please try again!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-slate-100 rounded-3xl shadow-xl space-y-6">
      
      {/* 🏷️ ডক্টর ডিটেইলস হেডার */}
      <div className="text-center space-y-2">
        <span className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          {doctor.specialty}
        </span>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Book Appointment</h2>
        <p className="text-sm text-slate-500 font-medium">
          You are booking an appointment with <span className="text-blue-600 font-bold">{doctor.name}</span>
        </p>
      </div>

      {/* 🔔 অ্যালার্ট বক্স */}
      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-bold text-center ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
            : 'bg-rose-50 text-rose-600 border border-rose-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* 📝 বুকিং ফর্ম */}
      <form onSubmit={handleBooking} className="space-y-4">
        
        {/* Patient Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Patient Name</label>
          <input 
            type="text" 
            value={session?.user?.name || ''} 
            disabled 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
          <input 
            type="email" 
            value={session?.user?.email || ''} 
            disabled 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
          />
        </div>

        {/* ✅ Gender Select ফিল্ড */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Gender <span className="text-rose-500">*</span>
          </label>
          <select 
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium transition-colors cursor-pointer"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input 
            type="tel" 
            placeholder="e.g. 017XXXXXXXX"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium transition-colors"
          />
        </div>

        {/* Appointment Date */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Appointment Date <span className="text-rose-500">*</span>
          </label>
          <input 
            type="date" 
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium transition-colors"
          />
        </div>

        {/* Preferred Time Slot */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Preferred Time Slot</label>
          <select 
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium transition-colors cursor-pointer"
          >
            <option value="09:00 AM">09:00 AM (Morning)</option>
            <option value="10:30 AM">10:30 AM (Morning)</option>
            <option value="03:00 PM">03:00 PM (Afternoon)</option>
            <option value="04:30 PM">04:30 PM (Evening)</option>
            <option value="07:30 PM">07:30 PM (Night)</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-blue-600/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing Booking...' : 'Confirm Appointment Now 🩺'}
          </button>
        </div>

      </form>
    </div>
  );
}