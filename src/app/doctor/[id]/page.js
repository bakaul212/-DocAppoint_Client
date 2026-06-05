// src/app/doctor/[id]/page.js
'use client';

import { useParams, useRouter } from 'next/navigation';

// 🩺 ফিক্সড: All Appointments পেজের সাথে আইডি ("1", "2", "3"...) হুবহু মিল রাখা হলো
const allDoctorsData = {
  "1": { 
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
    name: "Dr. Ariful Islam", 
    specialty: "Orthopedics", 
    image: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600", 
    experience: "7 years", 
    fee: 700, 
    hospital: "Popular Hospital", 
    location: "Dhanmondi, Dhaka", 
    availability: ["02:00 PM - 05:00 PM", "06:30 PM - 08:30 PM"], 
    description: "Dedicated orthopedic surgeon focusing on bone fractures, corrective joint surgeries, sports injuries, and musculoskeletal disorder therapies." 
  },
  "5": { 
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
    name: "Dr. Kamrul Hasan", 
    specialty: "Dermatology", 
    image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=600", 
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
  
  // ডাইনামিক আইডি ফিল্টারিং
  const doctor = allDoctorsData[id];

  if (!doctor) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-rose-500 font-bold text-xl">❌ Doctor Profile Not Found!</p>
        <button onClick={() => router.push('/appointments')} className="text-sm text-blue-600 underline font-semibold">Back to All Appointments</button>
      </div>
    );
  }

  const handleBookAppointment = () => {
    // সরাসরি ডাইনামিক বুকিং পেজে রাউট রিডাইরেকশন
    router.push(`/doctor/${id}/book`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6 mb-12">
      <div className="flex flex-col md:flex-row">
        {/* বাম পাশে ডক্টরের ইমেজ */}
        <div className="md:w-2/5 h-64 md:h-auto relative bg-slate-50">
          <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
        </div>

        {/* ডান পাশে ডক্টরের তথ্য */}
        <div className="p-8 md:w-3/5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {doctor.specialty}
              </span>
              <h2 className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{doctor.name}</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">💼 {doctor.experience} of Active Experience</p>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed border-b border-t py-4 border-slate-100">
              {doctor.description}
            </p>

            <div className="text-sm space-y-2 text-slate-600">
              <p className="flex items-center gap-2">🏥 <strong>Hospital:</strong> <span className="font-semibold text-slate-800">{doctor.hospital}</span></p>
              <p className="flex items-center gap-2">📍 <strong>Location:</strong> {doctor.location}</p>
              
              <div className="pt-2">
                <p className="font-bold text-slate-700 mb-1">⏰ Available Slots:</p>
                <div className="flex flex-wrap gap-2">
                  {doctor.availability.map((time, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg font-medium">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* নিচের ফি কাউন্টার এবং কনফার্ম বাটন */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Consultation Fee</p>
              <p className="text-2xl font-black text-blue-600">৳ {doctor.fee}</p>
            </div>
            <button 
              onClick={handleBookAppointment}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-sm text-sm"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}