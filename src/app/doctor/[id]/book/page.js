// src/app/doctor/[id]/book/page.js (অথবা আপনার ফাইল রাউট অনুসারে)
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';

// রিকোয়ারমেন্ট ডাটাবেজ অনুযায়ী ডক্টর লিস্ট
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

  const doctor = doctorsData.find((doc) => doc.id === id);

  // 📝 রিকোয়ারমেন্ট অনুসারে স্টেট (States) - ইনপুট ইনিশিয়ালি এম্পটি স্ট্রিং
  const [patientName, setPatientName] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 🔐 অথেন্টিকেশন চেক এবং সেশন নেম ইনিশিয়ালাইজেশন
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/doctor/${id}/book`);
    }
    // সেশন লোড শেষ হলে এবং ইউজার নাম থাকলে তা স্টেটে ডিফল্ট সেট হবে
    if (status === 'authenticated' && session?.user?.name && !patientName) {
      setPatientName(session.user.name);
    }
  }, [status, router, id, session]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return <div className="text-center py-16 text-rose-500 font-bold">❌ Doctor not found!</div>;
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // সেশন ইমেইল বা ফলব্যাক ইমেইল হ্যান্ডেল করা
    const activeEmail = session?.user?.email || "user@gmail.com";

    const bookingInfo = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      patientName: patientName || session?.user?.name || "Anonymous Patient", 
      patientEmail: activeEmail, 
      gender,
      phone,
      appointmentDate: date, // ড্যাশবোর্ডের স্কিমার সাথে মিল রেখে appointmentDate ও appointmentTime রাখা হলো
      appointmentTime: timeSlot,
    };

    try {
      // ✅ ফিক্সড: হার্ডকোডেড URL পরিবর্তন করে ডাইনামিক NEXT_PUBLIC_API_URL ব্যবহার করা হলো
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://docappoint-server-fq1x.onrender.com';
      const res = await fetch(`${apiUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-slate-100 rounded-3xl shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <span className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          {doctor.specialty}
        </span>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Book Appointment</h2>
        <p className="text-sm text-slate-500 font-medium">
          Booking with <span className="text-blue-600 font-bold">{doctor.name}</span>
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-bold text-center ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-4">
        {/* Email - Read Only */}
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Your Email (Read Only)</label>
          <input 
            type="email" 
            value={session?.user?.email || 'user@gmail.com'} 
            disabled 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
          />
        </div>

        {/* Patient Name */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Patient Name *</label>
          <input 
            type="text" 
            placeholder="Enter Patient Full Name"
            required
            value={patientName} 
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium"
          />
        </div>

        {/* Gender & Phone Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gender</label>
            <select 
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number *</label>
            <input 
              type="tel" 
              placeholder="017XXXXXXXX"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium"
            />
          </div>
        </div>

        {/* Date & Time Slot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Appointment Date *</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Preferred Time</label>
            <select 
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium cursor-pointer"
            >
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:30 AM">10:30 AM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:30 PM">04:30 PM</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg disabled:opacity-50"
          >
            {loading ? 'Processing Booking...' : 'Confirm & Save Appointment 🩺'}
          </button>
        </div>
      </form>
    </div>
  );
}