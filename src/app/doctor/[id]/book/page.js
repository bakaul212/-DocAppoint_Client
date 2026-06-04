'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';

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

  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/doctor/${id}/book`);
    }
  }, [status, router, id]);

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

    // 💡 ফিক্স: সেশন থেকে নাম ও ইমেইল না পেলে ব্যাকআপ ডেমো ডাটা সেট হবে যেন এপিআই ক্র্যাশ না করে
    const activeName = session?.user?.name || "Roni";
    const activeEmail = session?.user?.email || "goodn0813@gmail.com";

    const bookingInfo = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      patientName: activeName,      // এক্সপ্রেস ব্যাকএন্ডে এটি userName হিসেবে ম্যাপ হবে
      patientEmail: activeEmail,    // এক্সপ্রেস ব্যাকএন্ডে এটি userEmail হিসেবে ম্যাপ হবে
      phone,
      date,
      timeSlot,
    };

    try {
      const res = await fetch('http://localhost:5000/appointments', {
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
          // 🚀 বুকিং শেষে সরাসরি ড্যাশবোর্ডে পুশ করবে এবং পেজ রিফ্রেশ করবে নতুন ডাটা দেখানোর জন্য
          router.push('/dashboard');
          window.location.reload(); 
        }, 2000);
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
        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Patient Name</label>
          <input 
            type="text" 
            value={session?.user?.name || 'Roni'} 
            disabled 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
          <input 
            type="email" 
            value={session?.user?.email || 'goodn0813@gmail.com'} 
            disabled 
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 font-medium cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number *</label>
          <input 
            type="tel" 
            placeholder="e.g. 017XXXXXXXX"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium"
          />
        </div>

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
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Preferred Time Slot</label>
          <select 
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 rounded-xl text-sm text-slate-800 font-medium cursor-pointer"
          >
            <option value="09:00 AM">09:00 AM (Morning)</option>
            <option value="10:30 AM">10:30 AM (Morning)</option>
            <option value="03:00 PM">03:00 PM (Afternoon)</option>
            <option value="04:30 PM">04:30 PM (Evening)</option>
          </select>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg disabled:opacity-50"
          >
            {loading ? 'Processing Booking...' : 'Confirm Appointment Now 🩺'}
          </button>
        </div>
      </form>
    </div>
  );
}