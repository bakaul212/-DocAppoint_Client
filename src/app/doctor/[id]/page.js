// src/app/doctor/[id]/page.js
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // ✅ লগইন স্ট্যাটাস চেক করার জন্য

// 🩺 ডাক্তারদের ডিপ ইকুইভালেন্ট ডেটা সেট
const allDoctorsData = {
  "1": { 
    id: "1",
    name: "Dr. Fahmida Kamal", 
    specialty: "Cardiologist", 
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600", 
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
    specialties: "Pediatrician", 
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
    image: "https://images.unsplash.com/photo-1594824813573-246434e33963?q=80&w=600", 
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
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600", 
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
  const { data: session } = useSession();

  const doctor = allDoctorsData[id];

  // বুকিং ফর্মের স্টেট ম্যানেজমেন্ট (Date, Time slot, Patient Name, Phone, Reason)
  const [formData, setFormData] = useState({
    patientName: session?.user?.name || '',
    patientPhone: '',
    appointmentDate: '',
    selectedSlot: '',
    reason: ''
  });
  const [customError, setCustomError] = useState('');

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

  // ফর্ম ইনপুট হ্যান্ডলার
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (customError) setCustomError(''); // টাইপ করার সময় এরর মেসেজ রিমুভ করা
  };

  // অ্যাপয়েন্টমেন্ট সাবমিট লজিক
  const handleSubmitBooking = (e) => {
    e.preventDefault();

    // সিকিউরিটি চেক: লগইন না থাকলে বুকিং করতে দেবে না
    if (!session?.user) {
      router.push('/login');
      return;
    }

    // ভ্যালিডেশন চেক (রিকোয়ারমেন্ট অনুযায়ী কোনো ডিফল্ট অ্যালার্ট ব্যবহার করা যাবে না)
    if (!formData.patientName || !formData.patientPhone || !formData.appointmentDate || !formData.selectedSlot || !formData.reason) {
      setCustomError('⚠️ Please fill out all the fields and select a time slot.');
      return;
    }

    // একটি নতুন বুকিং অবজেক্ট তৈরি করা
    const newBooking = {
      id: Date.now().toString(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      image: doctor.image,
      fee: doctor.fee,
      hospital: doctor.hospital,
      patientName: formData.patientName,
      patientPhone: formData.patientPhone,
      appointmentDate: formData.appointmentDate,
      selectedSlot: formData.selectedSlot,
      reason: formData.reason,
      status: 'Pending'
    };

    // লোকাল স্টোরেজে বুকিং ডাটা পুশ করা (পরবর্তী অল-অ্যাপয়েন্টমেন্ট বা ড্যাশবোর্ডে ডাটা রিড করার জন্য)
    const existingBookings = JSON.parse(localStorage.getItem('doc_bookings')) || [];
    existingBookings.push(newBooking);
    localStorage.setItem('doc_bookings', JSON.stringify(existingBookings));

    // সফল বুকিং শেষে সরাসরি ড্যাশবোর্ড পেজে রিডাইরেকশন করা
    router.push('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl space-y-8">
      
      {/* ১. ডক্টর প্রোফাইল কার্ড সেকশন */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-2/5 h-72 md:h-auto relative bg-slate-50">
          <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
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
            <a href="#booking-form" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 active:scale-95 shadow-md shadow-blue-500/10 text-sm">
              Proceed to Book 👇
            </a>
          </div>
        </div>
      </div>

      {/* ২. ডাইনামিক অ্যাপয়েন্টমেন্ট বুকিং ফর্ম সেকশন */}
      <div id="booking-form" className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6 scroll-mt-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">📅 Book an Appointment Slot</h3>
          <p className="text-xs text-slate-400 font-medium">Please fulfill the patient data & select an available timing slot</p>
        </div>

        {/* কাস্টম রিকোয়ারমেন্ট মেসেজ (কোন ডিফল্ট ব্রাউজার অ্যালার্ট ব্যবহার করা হয়নি) */}
        {customError && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 font-bold text-xs rounded-xl flex items-center gap-2 animate-shake">
            {customError}
          </div>
        )}

        <form onSubmit={handleSubmitBooking} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ইনপুট: রোগীর নাম */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Patient Full Name</label>
              <input 
                type="text" 
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                placeholder="Enter patient name" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 text-slate-800 transition"
              />
            </div>

            {/* ইনপুট: ফোন নাম্বার */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Contact Number</label>
              <input 
                type="tel" 
                name="patientPhone"
                value={formData.patientPhone}
                onChange={handleInputChange}
                placeholder="Enter mobile number" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 text-slate-800 transition"
              />
            </div>

            {/* ইনপুট: অ্যাপয়েন্টমেন্ট তারিখ */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Preferred Date</label>
              <input 
                type="date" 
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 text-slate-800 transition"
              />
            </div>

            {/* স্লট সিলেকশন বাটন এরিয়া */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Available Time Slots</label>
              <div className="flex flex-wrap gap-2.5">
                {doctor.availability.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setFormData((prev) => ({ ...prev, selectedSlot: slot }))}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 border ${
                      formData.selectedSlot === slot
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

          {/* ইনপুট: অ্যাপয়েন্টমেন্টের কারণ */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">Reason for Appointment / Symptoms</label>
            <textarea 
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows="3" 
              placeholder="Describe briefly your physical difficulties or medical context..." 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 text-slate-800 transition resize-none"
            ></textarea>
          </div>

          {/* ফাইনাল সাবমিট বাটন */}
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all duration-300 active:scale-[0.98] shadow-lg shadow-blue-500/10 text-sm md:text-base"
            >
              Confirm & Request Appointment 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}