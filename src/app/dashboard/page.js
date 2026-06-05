'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react'; 

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // 💡 কাস্টম ডিলিট কনফার্মেশন মডাল স্টেট (ডিফল্ট confirm() এর বিকল্প)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);

  // 👤 প্রোফাইল স্টেট
  const [updatedName, setUpdatedName] = useState('');
  const [updatedImage, setUpdatedImage] = useState('');

  // প্রোফাইল এডিট ফর্ম স্টেট
  const [profileForm, setProfileForm] = useState({ name: '', photoUrl: '' });

  // 📝 অ্যাপয়েন্টমেন্ট এডিট ফর্ম স্টেট
  const [editForm, setEditForm] = useState({
    patientName: '', 
    phone: '', 
    appointmentDate: '', 
    appointmentTime: '',
    gender: 'Male'
  });

  let profileName = 'User Name';
  let profileImage = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200';

  if (status === "authenticated" && session?.user) {
    const savedName = typeof window !== 'undefined' ? localStorage.getItem(`profile_name_${session.user.email}`) : null;
    const savedImage = typeof window !== 'undefined' ? localStorage.getItem(`profile_image_${session.user.email}`) : null;
    
    profileName = updatedName || savedName || session.user.name || 'User Name';
    profileImage = updatedImage || savedImage || session.user.image || profileImage;
  }

  // 🚀 ব্যাকএন্ড থেকে বুকিং ডাটা ফেচ
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments?userEmail=${session.user.email}`);
        const data = await res.json();
        
        if (data.success) {
          setBookings(data.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        loading && setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session?.user?.email, loading]);

  // 💡 ফিক্সড: কাস্টম ডিলিট ট্রিগার লজিক (No window.confirm)
  const openDeleteConfirmation = (id) => {
    setBookingIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookingIdToDelete) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${bookingIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setBookings(bookings.filter((b) => b._id !== bookingIdToDelete));
        toast.success("Appointment deleted successfully! 🗑️");
      }
    } catch (err) {
      toast.error("Failed to delete appointment.");
    } finally {
      setShowDeleteModal(false);
      setBookingIdToDelete(null);
    }
  };

  // 📝 আপডেট মডাল ওপেন
  const openUpdateModal = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      patientName: booking.patientName || '',
      phone: booking.phone || '',
      appointmentDate: booking.appointmentDate || '', 
      appointmentTime: booking.appointmentTime || '10:30 AM',
      gender: booking.gender || 'Male'
    });
    setShowModal(true);
  };

  // 💾 আপডেট ডাটা সেভ
  const handleUpdateSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${selectedBooking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();

      if (data.success) {
        setBookings(bookings.map((b) => (b._id === selectedBooking._id ? { ...b, ...editForm } : b)));
        toast.success("Appointment updated successfully! 🎉");
        setShowModal(false);
      }
    } catch (err) {
      toast.error("Failed to update appointment.");
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

  // 👤 প্রোফাইল সরাসরি ব্যাকএন্ডে সেভ
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!session?.user?.email) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name: profileForm.name,
          image: profileForm.photoUrl
        }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem(`profile_name_${session.user.email}`, profileForm.name);
        localStorage.setItem(`profile_image_${session.user.email}`, profileForm.photoUrl);

        setUpdatedName(profileForm.name);
        setUpdatedImage(profileForm.photoUrl);

        toast.success("Profile updated successfully! 👤🎉");
        setShowProfileModal(false);
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Server error! Failed to update profile.");
    }
  };

  if (status === "loading" || (session && loading)) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-4">
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
            <p className="text-sm text-slate-500 font-medium">{session?.user?.email || 'user@email.com'}</p>
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
              <div key={booking._id} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-slate-800">{booking.doctorName}</h4>
                    <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full font-semibold">{booking.appointmentTime}</span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>👤 <strong>Patient:</strong> {booking.patientName}</p>
                    <p>⚧️ <strong>Gender:</strong> {booking.gender || 'Not Specified'}</p> 
                    <p>📞 <strong>Phone:</strong> {booking.phone}</p>
                    <p>📅 <strong>Date:</strong> {booking.appointmentDate}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-slate-50">
                  <button onClick={() => openUpdateModal(booking)} className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl text-sm hover:bg-blue-600 hover:text-white transition">
                    Update
                  </button>
                  {/* 💡 ফিক্সড: কাস্টম মডাল ট্রিগার করা হচ্ছে */}
                  <button onClick={() => openDeleteConfirmation(booking._id)} className="flex-1 bg-red-50 text-red-600 font-semibold py-2 rounded-xl text-sm hover:bg-red-600 hover:text-white transition">
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Gender</label>
                <select value={editForm.gender} className="w-full border p-2.5 rounded-xl text-sm bg-white" onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input type="tel" required value={editForm.phone} className="w-full border p-2.5 rounded-xl text-sm" onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input type="date" required value={editForm.appointmentDate} className="w-full border p-2.5 rounded-xl text-sm" onChange={(e) => setEditForm({ ...editForm, appointmentDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time Slot</label>
                  <select value={editForm.appointmentTime} className="w-full border p-2.5 rounded-xl text-sm bg-white" onChange={(e) => setEditForm({ ...editForm, appointmentTime: e.target.value })}>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
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

      {/* 💡 নতুন সংযোজন: কাস্টম ডিলিট কনফার্মেশন মডাল (১০০% রিকোয়ারমেন্ট ফ্রেন্ডলি) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
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
              <button type="button" onClick={handleConfirmDelete} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase hover:bg-red-700 shadow-md shadow-red-600/10">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}