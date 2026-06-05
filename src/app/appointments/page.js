// src/app/appointments/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 🩺 ডাক্তারদের পারফেক্ট ডাইনামিক ডাটা সেট (ডিটেইলস পেজের সাথে হুবহু মিল রাখা হলো)
const allDoctorsData = [
  { id: "1", name: "Dr. Fahmida Kamal", specialty: "Cardiologist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400", experience: "10 years", fee: 800, hospital: "Labaid Hospital", location: "Dhanmondi, Dhaka" },
  { id: "2", name: "Dr. Rayhan Ahmed", specialty: "Neurologist", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400", experience: "8 years", fee: 1000, hospital: "Square Hospital", location: "Panthapath, Dhaka" },
  { id: "3", name: "Dr. Tanvir Hasan", specialty: "Pediatrician", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400", experience: "5 years", fee: 600, hospital: "Apollo Hospital", location: "Bashundhara, Dhaka" },
  { id: "4", name: "Dr. Ariful Islam", specialty: "Orthopedics", image: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=400", experience: "7 years", fee: 700, hospital: "Popular Hospital", location: "Dhanmondi, Dhaka" },
  { id: "5", name: "Dr. Tania Sultana", specialty: "Cardiologist", image: "https://images.unsplash.com/photo-1594824813573-246434e33963?q=80&w=400", experience: "6 years", fee: 800, hospital: "Labaid Hospital", location: "Mirpur, Dhaka" },
  { id: "6", name: "Dr. Kamrul Hasan", specialty: "Dermatology", image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=400", experience: "9 years", fee: 900, hospital: "Ibn Sina Hospital", location: "Kalyanpur, Dhaka" }
];

// 🏷️ ফিল্টারের জন্য স্পেশালিটি লিস্ট
const specialtiesList = ["All", "Cardiologist", "Neurologist", "Pediatrician", "Orthopedics", "Dermatology"];

export default function AppointmentsPage() {
  const router = useRouter();
  
  // সার্চ, ফিল্টার এবং সর্টিং স্টেট
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All'); 
  const [sortOrder, setSortOrder] = useState('default');

  // 💡 ফিক্সড লজিক: রিকোয়ারমেন্ট অনুযায়ী সরাসরি ডিটেইলস পেজে পাঠানো হচ্ছে (লগইন চেকের দরকার নেই, ডিটেইলস পাবলিক পেজ)
  const handleViewDetails = (id) => {
    router.push(`/doctor/${id}`); 
  };

  // 🔄 নাম এবং স্পেশালিটি ক্যাটাগরি একসাথে ফিল্টারিং
  const filteredDoctors = allDoctorsData.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // সর্টিং লজিক (ফি-এর পরিমাণ অনুযায়ী)
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortOrder === 'lowToHigh') return a.fee - b.fee;
    if (sortOrder === 'highToLow') return b.fee - a.fee;
    return 0;
  });

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Available Appointments</h2>
        <p className="text-slate-500">Find the right specialist and check their available slots.</p>
      </div>

      {/* সার্চ, ফিল্টার এবং সর্টিং কন্ট্রোল প্যানেল */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* সার্চ ইনপুট */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by Doctor Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm transition"
          />
          <span className="absolute right-3 top-3 text-slate-400 text-sm">🔍</span>
        </div>

        {/* স্পেশালিটি ক্যাটাগরি ফিল্টার ড্রপডাউন */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-start md:justify-center">
          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Specialty:</label>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition cursor-pointer w-full md:w-auto"
          >
            {specialtiesList.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {/* সর্টিং ড্রপডাউন */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Sort by Fee:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-600 transition cursor-pointer w-full md:w-auto"
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Low to High (Price)</option>
            <option value="highToLow">High to Low (Price)</option>
          </select>
        </div>
      </div>

      {/* অ্যাপয়েন্টমেন্ট কার্ডস গ্রিড লেআউট */}
      {sortedDoctors.length === 0 ? (
        <p className="text-center text-slate-500 py-12">No doctors found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedDoctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between h-full hover:shadow-md transition">
              <img src={doc.image} alt={doc.name} className="w-full h-48 object-cover" />
              
              <div className="p-6 space-y-3 flex-grow">
                <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {doc.specialty}
                </span>
                <h3 className="text-xl font-bold text-slate-800">{doc.name}</h3>
                
                <div className="text-sm text-slate-500 space-y-1">
                  <p>💼 Experience: {doc.experience}</p>
                  <p>🏥 {doc.hospital}</p>
                  <p>📍 {doc.location}</p>
                </div>
              </div>

              {/* 💡 ফিক্সড: বাটন টেক্সট বদলে "View Details" করা হলো যা ডাইনামিক ডিটেইলসে নিয়ে যাবে */}
              <div className="p-6 pt-0 border-t border-slate-50 mt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">৳ {doc.fee}</span>
                <button 
                  onClick={() => handleViewDetails(doc.id)}
                  className="bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm shadow-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}