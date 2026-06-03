import Link from 'next/link';

// ডেমো ডক্টরস ডেটা (ডাটাবেজ থেকে আনার আগে টেস্ট করার জন্য)
// src/app/page.js এর ভেতরের featuredDoctors আপডেট করুন:
const featuredDoctors = [
  { id: "1", name: "Dr. Fahmida Kamal", specialty: "Cardiologist", rating: 4.9, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop" },
  { id: "2", name: "Dr. Rayhan Ahmed", specialty: "Neurologist", rating: 4.8, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop" },
  // ৩ নম্বর ইমেজ লিঙ্কটি এটি দিয়ে পরিবর্তন করুন (১০০% কাজ করবে):
  { id: "3", name: "Dr. Tanvir Hasan", specialty: "Pediatrician", rating: 4.7, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop" },
];

export default function HomePage() {
  return (
    <div className="space-y-16 py-6">
      {/* ১. হিরো ব্যানার সেকশন */}
      <section className="bg-gradient-to-r flex flex-col justify-center from-blue-600 to-indigo-700 text-white rounded-2xl p-8 md:p-16 text-center space-y-6 shadow-xl">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">Your Health, Our Top Priority</h1>
        <p className="text-lg text-blue-100 max-w-xl mx-auto">
          Take the first step towards a healthier life. Browse certified local doctors and book your appointment instantly.
        </p>
        <div>
          <Link href="/appointments" className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-xl shadow-md hover:bg-blue-50 transition transform hover:-translate-y-0.5">
            Book Appointment Now
          </Link>
        </div>
      </section>

      {/* ২. টপ রেটেড ডক্টরস সেকশন (রিকোয়ারমেন্ট: ঠিক ৩টি কার্ড দেখাতে হবে) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Our Top Rated Doctors</h2>
          <p className="text-slate-500">Meet our highly qualified and experienced medical specialists.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between h-full hover:shadow-md transition">
              <img src={doc.image} alt={doc.name} className="w-full h-56 object-cover" />
              <div className="p-6 flex-grow space-y-2">
                <div className="flex justify-between items-center">
                  <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">{doc.specialty}</span>
                  <span className="text-amber-500 font-bold text-sm">★ {doc.rating}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">{doc.name}</h3>
              </div>
              <div className="p-6 pt-0">
                <Link href={`/appointments`} className="block text-center bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ৩. অতিরিক্ত সেকশন ১: আমাদের বৈশিষ্ট্য */}
      <section className="bg-white border border-slate-100 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center shadow-sm">
        <div className="space-y-3 p-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto text-xl font-bold">🔒</div>
          <h4 className="font-bold text-lg text-slate-800">100% Secure</h4>
          <p className="text-sm text-slate-500">Your health records and appointment history are fully protected with strict privacy standards.</p>
        </div>
        <div className="space-y-3 p-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto text-xl font-bold">⚡</div>
          <h4 className="font-bold text-lg text-slate-800">Instant Booking</h4>
          <p className="text-sm text-slate-500">No long waiting queues. Pick your preferred time slot and get confirmed instantly.</p>
        </div>
        <div className="space-y-3 p-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto text-xl font-bold">🛠️</div>
          <h4 className="font-bold text-lg text-slate-800">Easy Dashboard</h4>
          <p className="text-sm text-slate-500">Manage, reschedule, or cancel your bookings anytime directly from your interactive dashboard.</p>
        </div>
      </section>

      {/* ৪. অতিরিক্ত সেকশন ২: স্বাস্থ্য সচেতনতা (Health Tip) */}
      <section className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-sm">
        <div className="flex items-start gap-4">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-bold text-lg text-amber-900 mb-1">Weekly Health Awareness Tip</h3>
            <p className="text-amber-800 leading-relaxed">
              Regular physical activity, even a brisk 30-minute walk daily, can significantly cut down the risk of cardiovascular diseases and improve mental well-being. Stay hydrated and stay active!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}