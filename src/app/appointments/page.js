// src/app/appointments/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Next.js সঠিক রাউটার ইম্পোর্ট
import { useSession } from 'next-auth/react'; 

// 🩺 ৬ জন ডাক্তারের জন্যই সম্পূর্ণ ইউনিক ও পৃথক লাইভ ইমেজ সেট (ডুপ্লিকেট বাগ ফিক্সড)
const allDoctorsData = [
  { 
    id: "1", 
    name: "Dr. Fahmida Kamal", 
    specialty: "Cardiologist", 
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400", // ফিমেল ডক্টর ১
    experience: "10 years", 
    fee: 800, 
    hospital: "Labaid Cardiac Hospital", 
    location: "Dhanmondi, Dhaka" 
  },
  { 
    id: "2", 
    name: "Dr. Rayhan Ahmed", 
    specialty: "Neurologist", 
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400", // মেল ডক্টর ১
    experience: "8 years", 
    fee: 1000, 
    hospital: "Square Hospital", 
    location: "Panthapath, Dhaka" 
  },
  { 
    id: "3", 
    name: "Dr. Tanvir Hasan", 
    specialty: "Pediatrician", 
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400", // মেল ডক্টর ২
    experience: "5 years", 
    fee: 700, 
    hospital: "Evercare Hospital", 
    location: "Bashundhara, Dhaka" 
  },
  { 
    id: "4", 
    name: "Dr. Ariful Islam", 
    specialty: "Orthopedics", 
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400", // মেল ডক্টর ৩
    experience: "7 years", 
    fee: 700, 
    hospital: "Popular Hospital", 
    location: "Dhanmondi, Dhaka" 
  },
 { 
    id: "5", 
    name: "Dr. Tania Sultana", 
    specialty: "Cardiologist", 
    // 🌟 একদম নতুন, স্টেবল এবং রিয়েল ফিমেল ডক্টর ইমেজ লিংক
    image: "https://images.pexels.com/photos/7578803/pexels-photo-7578803.jpeg?auto=compress&cs=tinysrgb&w=400", 
    experience: "6 years", 
    fee: 800, 
    hospital: "Labaid Hospital", 
    location: "Mirpur, Dhaka" 
  },
  { 
    id: "6", 
    name: "Dr. Kamrul Hasan", 
    specialty: "Dermatology", 
    image: "https://images.unsplash.com/photo-1637059824899-a441006a6875?q=80&w=400", // মেল ডক্টর ৪ (সম্পূর্ণ আলাদা ছবি)
    experience: "9 years", 
    fee: 900, 
    hospital: "Ibn Sina Hospital", 
    location: "Kalyanpur, Dhaka" 
  }
];

const specialtiesList = ["All", "Cardiologist", "Neurologist", "Pediatrician", "Orthopedics", "Dermatology"];

export default function AppointmentsPage() {
  const router = useRouter();
  const { data: session } = useSession(); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All'); 
  const [sortOrder, setSortOrder] = useState('default');

  const handleViewDetails = (id) => {
    if (!session?.user) {
      router.push('/login');
    } else {
      router.push(`/doctor/${id}`); 
    }
  };

  const filteredDoctors = allDoctorsData.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortOrder === 'lowToHigh') return a.fee - b.fee;
    if (sortOrder === 'highToLow') return b.fee - a.fee;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 pb-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-sm bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          🔍 Medical Specialists
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800">Available Appointments</h2>
        <p className="text-sm text-slate-400 font-medium">Find the right specialist, filter by criteria and check their available slots.</p>
      </div>

      {/* সার্চ ও ফিল্টার প্যানেল */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search by Doctor Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-medium text-slate-800 transition"
          />
          <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">Specialty:</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition cursor-pointer w-full sm:w-64 md:w-auto text-slate-700"
            >
              {specialtiesList.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">Sort by Fee:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3 py-3 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition cursor-pointer w-full sm:w-64 md:w-auto text-slate-700"
            >
              <option value="default">Default Sorting</option>
              <option value="lowToHigh">Low to High (Price)</option>
              <option value="highToLow">High to Low (Price)</option>
            </select>
          </div>
        </div>
      </div>

      {/* গ্রিড লেআউট */}
      {sortedDoctors.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed rounded-3xl p-8 text-slate-400 max-w-xl mx-auto">
          <span className="text-5xl block mb-3">🕵️‍♂️</span>
          <p className="font-bold text-slate-700">No doctors found matching your criteria.</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting the specialty filter or modifying your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedDoctors.map((doc) => (
            <div key={doc.id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between h-full hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1.5">
              
              <div className="overflow-hidden relative bg-slate-100">
                <img 
                  src={doc.image} 
                  alt={doc.name} 
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // 🛡️ নিরাপদ ফলব্যাক: যদি মূল ছবি ফেইল করে, তাহলে একটি নিউট্রাল ডক্টর আইকন লোড হবে, কারও ছবি ডুপ্লিকেট হবে না।
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/387/387561.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6 space-y-3 flex-grow">
                <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {doc.specialty}
                </span>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight transition-colors duration-200 group-hover:text-blue-600">{doc.name}</h3>
                
                <div className="text-xs font-medium text-slate-500 space-y-1.5 pt-1">
                  <p className="flex items-center gap-1.5">💼 Experience: <span className="text-slate-700 font-semibold">{doc.experience}</span></p>
                  <p className="flex items-center gap-1.5">🏥 {doc.hospital}</p>
                  <p className="flex items-center gap-1.5">📍 {doc.location}</p>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/40">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visit Fee</p>
                  <span className="text-xl font-black text-blue-600">৳ {doc.fee}</span>
                </div>
                <button 
                  onClick={() => handleViewDetails(doc.id)}
                  className="bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 active:scale-95 text-xs shadow-inner"
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