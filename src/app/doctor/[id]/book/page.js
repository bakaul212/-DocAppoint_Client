// src/app/doctor/[id]/book/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const doctorsList = {
  "d1": "Dr. Ayesha Rahman",
  "d2": "Dr. Rayhan Ahmed",
  "d3": "Dr. Tanvir Hasan",
  "d4": "Dr. Sadiya Afrin"
};

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const doctorName = doctorsList[id] || "Unknown Doctor";

  // রিকোয়ারমেন্ট অনুযায়ী ফর্ম স্টেট
  const [formData, setFormData] = useState({
    userEmail: 'user@gmail.com', // আপাতত ডেমো ইমেইল (Better Auth আসার পর ডাইনামিক হবে)
    patientName: '',
    gender: 'Male',
    phone: '',
    appointmentDate: '',
    appointmentTime: '10:30 AM'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingPayload = {
      ...formData,
      doctorName: doctorName
    };

    try {
      // 🚀 আমাদের এক্সপ্রেস সার্ভারে ডেটা পাঠানো হচ্ছে (যা আমরা প্রথমে বানিয়েছিলাম)
      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();

      if (data.success) {
        // রিকোয়ারমেন্ট অনুযায়ী নির্দিষ্ট সাকসেস টোস্ট মেসেজ
        toast.success("Appointment booked successfully! 🎉");
        // সাকসেস হলে ইউজারকে ড্যাশবোর্ডে নিয়ে যাওয়া হবে
        router.push('/dashboard');
      } else {
        toast.error("Failed to book appointment.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server connection error. Is your server running?");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 text-center mb-1">Book Appointment</h2>
      <p className="text-center text-blue-600 font-semibold text-sm mb-6">with {doctorName}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Email (Read Only)</label>
          <input type="email" value={formData.userEmail} readOnly className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-500 cursor-not-allowed text-sm" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Patient Name</label>
          <input type="text" required placeholder="Enter Patient Full Name" className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition" onChange={e => setFormData({...formData, patientName: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Gender</label>
            <select className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-600 transition" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
            <input type="tel" required placeholder="017XXXXXXXX" className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition" onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Appointment Date</label>
            <input type="date" required className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition" onChange={e => setFormData({...formData, appointmentDate: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Preferred Time</label>
            <select className="w-full border border-slate-200 p-3 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-600 transition" value={formData.appointmentTime} onChange={e => setFormData({...formData, appointmentTime: e.target.value})}>
              <option value="09:30 AM">09:30 AM</option>
              <option value="10:30 AM">10:30 AM</option>
              <option value="04:30 PM">04:30 PM</option>
              <option value="06:30 PM">06:30 PM</option>
            </select>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition shadow-md text-sm mt-4">
          Confirm & Save Appointment
        </button>
      </form>
    </div>
  );
}