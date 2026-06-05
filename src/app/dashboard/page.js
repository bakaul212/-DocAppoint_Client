// src/app/dashboard/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // ✅ Next-Auth সেশন ব্যবহার করা হলো রিফ্রেশ বাগ ফিক্স করতে
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // ✅ সিকিউর গ্লোবাল সেশন রিড করা হলো
  
  // 📅 bookings state
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // 💡 কাস্টম ডিলিট কনফার্মেশন মডাল স্টেট
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);

  // 👤 প্রোফাইল স্টেট
  const [updatedName, setUpdatedName] = useState('');
  const [updatedImage, setUpdatedImage] = useState('');

  // প্রোফাইল এডিট ফর্ম স্টেট
  const [profileForm, setProfileForm] = useState({ name: '', photoUrl: '' });

  // 📝 অ্যাপয়েন্টমেন্ট এডিট ফর্ম স্টেট (বুকিং পেজের কী-সমূহের সাথে হুবহু মিল রেখে ফিক্সড করা হলো)
  const [editForm, setEditForm] = useState({
    patientName: '', 
    patientPhone: '', // 🛠️ বাগ ফিক্স: phone পরিবর্তন করে patientPhone করা হলো
    appointmentDate: '', 
    selectedSlot: '', // 🛠️ বাগ ফিক্স: appointmentTime পরিবর্তন করে selectedSlot করা হলো
    reason: ''
  });

  // 🛡️ Route Protection - সেশন লোড হওয়া পর্যন্ত রিডাইরেক্ট করবে না (রিলোড বাগ সমাধান)
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // প্রোফাইল নেম এবং ইমেজ সিঙ্ক করার লজিক
  let profileName = session?.user?.name || 'User Name';
  let profileImage = session?.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200';

  if (session?.user?.email) {
    const savedName = typeof window !== 'undefined' ? localStorage.getItem(`profile_name_${session.user.email}`) : null;
    const savedImage = typeof window !== 'undefined' ? localStorage.getItem(`profile_image_${session.user.email}`) : null;
    
    profileName = updatedName || savedName || session.user.name || 'User Name';
    profileImage = updatedImage || savedImage || session.user.image || profileImage;
  }

  // 🚀 ব্যাকএন্ড এবং লোকাল স্টোরেজ থেকে ডেটা মার্জ করে ফেচ করার লজিক
  const fetchDashboardData = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      // লোকাল স্টোরেজ থেকে বুকিং ডেটা রিড করা (ফলব্যাক মেকানিজম)
      const localData = JSON.parse(localStorage.getItem('doc_bookings')) || [];
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://docappoint-server-fq1x.onrender.com';
      const res = await fetch(`${baseUrl}/appointments?userEmail=${session.user.email}`);
      const serverData = await res.json();
      
      if (serverData.success) {
        // সার্ভার ডেটা এবং লোকাল স্টোরেজ ডেটা মার্জ করা যেন কোনো অ্যাপয়েন্টমেন্ট মিস না হয়
        const mergedBookings = [...serverData.data, ...localData.filter(lb => !serverData.data.some(sb => sb._id === lb.id || sb.id === lb.id))];
        setBookings(mergedBookings);
      } else {
        setBookings(localData);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      // এপিআই এরর বা অফলাইন থাকলে লোকাল ডাটা লোড হবে
      const localData = JSON.parse(localStorage.getItem('doc_bookings')) || [];
      setBookings(localData);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, fetchDashboardData]);

  // 💡 কাস্টম ডিলিট কনফার্মেশন লজিক
  const openDeleteConfirmation = (id) => {
    setBookingIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookingIdToDelete) return;
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://docappoint-server-fq1x.onrender.com';
      const response = await fetch(`${baseUrl}/appointments/${bookingIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      // স্টেট এবং লোকাল স্টোরেজ থেকে মুছে ফেলা
      setBookings(bookings.filter((b) => b._id !== bookingIdToDelete && b.id !== bookingIdToDelete));
      const localData = JSON.parse(localStorage.getItem('doc_bookings')) || [];
      const updatedLocal = localData.filter((b) => b.id !== bookingIdToDelete && b._id !== bookingIdToDelete);
      localStorage.setItem('doc_bookings', JSON.stringify(updatedLocal));

      toast.success("Appointment deleted successfully! 🗑️");
    } catch (err) {
      // যদি সার্ভার ফেইল করে লোকাল থেকে ডিলিট করার চেষ্টা করবে
      setBookings(bookings.filter((b) => b._id !== bookingIdToDelete && b.id !== bookingIdToDelete));
      toast.success("Appointment removed locally. 🗑️");
    } finally {
      setShowDeleteModal(false);
      setBookingIdToDelete(null);
    }
  };

  // 📝 আপডেট মডাল ওপেন (কী-সমূহ সঠিকভাবে ম্যাপ করা হলো)
  const openUpdateModal = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      patientName: booking.patientName || '',
      patientPhone: booking.patientPhone || booking.phone || '', // ওল্ড সাপোর্ট সহ সেফগার্ড
      appointmentDate: booking.appointmentDate || '', 
      selectedSlot: booking.selectedSlot || booking.appointmentTime || '',
      reason: booking.reason || ''
    });
    setShowModal(true);
  };

  // 💾 আপডেট ডাটা সেভ
  const handleUpdateSave = async (e) => {
    e.preventDefault();
    const targetId = selectedBooking._id || selectedBooking.id;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://docappoint-server-fq1x.onrender.com';
      const response = await fetch(`${baseUrl}/appointments/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();

      // লোকাল স্টেট আপডেট
      setBookings(bookings.map((b) => ((b._id === targetId || b.id === targetId) ? { ...b, ...editForm } : b)));
      
      // লোকাল স্টোরেজ সিঙ্ক
      const localData = JSON.parse(localStorage.getItem('doc_bookings')) || [];
      const updatedLocal = localData.map((b) => ((b._id === targetId || b.id === targetId) ? { ...b, ...editForm } : b));
      localStorage.setItem('doc_bookings', JSON.stringify(updatedLocal));

      toast.success("Appointment updated successfully! 🎉");
      setShowModal(false);
    } catch (err) {
      // নেটওয়ার্ক ডাউন থাকলে লোকাল আপডেট ফলব্যাক
      setBookings(bookings.map((b) => ((b._id === targetId || b.id === targetId) ? { ...b, ...editForm } : b)));
      toast.success("Appointment updated locally! 🎉");
      setShowModal(false);
    }
  };

  // 👤 প্রোফাইল আপডেট মডাল ওপেন
  const openProfileModal = () => {
    setProfileForm({ 
      name: profileName, 
      photoUrl: profileImage 
    });
    setShowProfileModal(true);
  };

  // 👤 প্রোফাইল ব্যাকএন্ড এবং লোকাল সিঙ্ক
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://docappoint-server-fq1x.onrender.com';
      const response = await fetch(`${baseUrl}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name: profileForm.name,
          image: profileForm.photoUrl
        }),
      });
      const data = await response.json();

      localStorage.setItem(`profile_name_${session.user.email}`, profileForm.name);
      localStorage.setItem(`profile_image_${session.user.email}`, profileForm.photoUrl);

      setUpdatedName(profileForm.name);
      setUpdatedImage(profileForm.photoUrl);
      window.dispatchEvent(new Event('storage'));

      toast.success("Profile updated successfully! 👤🎉");
      setShowProfileModal(false);
    } catch (err) {
      localStorage.setItem(`profile_name_${session.user.email}`, profileForm.name);
      localStorage.setItem(`profile_image_${session.user.email}`, profileForm.photoUrl);
      setUpdatedName(profileForm.name);
      setUpdatedImage(profileForm.photoUrl);
      toast.success("Profile updated locally! 👤🎉");
      setShowProfileModal(false);
    }
  };

  // লোডিং ফুলব্যাক স্ক্রিন
  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium text-sm">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* 👤 মাই প্রোফাইল সেকশন */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-50" 
          />
          <div>
            <h2 className="text-2xl font-black text-slate-800">{profileName}</h2>
            <p className="text-sm text-slate-500 font-medium">{session?.user?.email}</p>
            <span className="inline-block mt-2 bg-green-50 text-green-600 text-xs font-bold px-2.5 py-0.5 rounded-full">Active Account</span>
          </div>
        </div>
        <button onClick={openProfileModal} className="w-full sm:w-auto bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm shadow-sm">
          Update Profile
        </button>
      </div>

      {/* 📅 মাই বুকিংস সেকশন */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800">My Bookings</h3>

        {bookings.length === 0 ? (
          <p className="text-slate-500 bg-white p-6 rounded-xl border text-center">You have no active appointments booked.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id || booking.id} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-slate-800">{booking.doctorName || "General Specialist"}</h4>
                    <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-bold">{booking.selectedSlot || booking.appointmentTime}</span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>👤 <strong>Patient:</strong> {booking.patientName || "Not Specified"}</p>
                    <p>📞 <strong>Phone:</strong> {booking.patientPhone || booking.phone || "Not Provided"}</p>
                    <p>📅 <strong>Date:</strong> {booking.appointmentDate || "Not Specified"}</p>
                    {booking.reason && <p>📝 <strong>Reason:</strong> {booking.reason}</p>}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-slate-50">
                  <button onClick={() => openUpdateModal(booking)} className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl text-sm hover:bg-blue-600 hover:text-white transition">
                    Update
                  </button>
                  <button onClick={() => openDeleteConfirmation(booking._id || booking.id)} className="flex-1 bg-red-50 text-red-600 font-semibold py-2 rounded-xl text-sm hover:bg-red-600 hover:text-white transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📝 অ্যাপয়েন্টমেন্ট আপডেট মডাল */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-slate-800">Edit Appointment</h3>
            <form onSubmit={handleUpdateSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Patient Name</label>
                <input type="text" required value={editForm.patientName} className="w-full border p-2.5 rounded-xl text-sm" onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input type="tel" required value={editForm.patientPhone} className="w-full border p-2.5 rounded-xl text-sm" onChange={(e) => setEditForm({ ...editForm, patientPhone: e.target.value })} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input type="date" required value={editForm.appointmentDate} className="w-full border p-2.5 rounded-xl text-sm" onChange={(e) => setEditForm({ ...editForm, appointmentDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time Slot</label>
                  <select value={editForm.selectedSlot} className="w-full border p-2.5 rounded-xl text-sm bg-white" onChange={(e) => setEditForm({ ...editForm, selectedSlot: e.target.value })}>
                    <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                    <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM</option>
                    <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                    <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
                    <option value="11:00 AM - 02:00 PM">11:00 AM - 02:00 PM</option>
                    <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                    <option value="06:30 PM - 08:30 PM">06:30 PM - 08:30 PM</option>
                    <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                    <option value="05:00 PM - 08:30 PM">05:00 PM - 08:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reason</label>
                <textarea rows="2" value={editForm.reason} className="w-full border p-2.5 rounded-xl text-sm resize-none" onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 👤 প্রোফাইল আপডেট মডাল */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-slate-800">Update Profile</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Name</label>
                <input type="text" required value={profileForm.name} className="w-full border p-2.5 rounded-xl text-sm" onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Photo URL</label>
                <input type="url" required value={profileForm.photoUrl} className="w-full border p-2.5 rounded-xl text-sm" onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 💡 কাস্টম ডিলিট কনফার্মেশন মডাল */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl border border-slate-100">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">Cancel Appointment?</h3>
              <p className="text-sm text-slate-500">Are you sure you want to delete this booking? This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowDeleteModal(false); setBookingIdToDelete(null); }} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase">
                No, Keep it
              </button>
              <button type="button" onClick={handleConfirmDelete} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase hover:bg-red-700 shadow-md">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}