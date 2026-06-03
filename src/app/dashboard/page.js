// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // রিকোয়ারমেন্ট: লোডিং স্পিনার দেখাতে হবে
  const [selectedBooking, setSelectedBooking] = useState(null); // মডালের জন্য স্টেট
  const [showModal, setShowModal] = useState(false);

  // এডিটের জন্য ফর্ম স্টেট
  const [editForm, setEditForm] = useState({
    patientName: '',
    phone: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  const userEmail = 'user@gmail.com'; // আপাতত ডেমো (Better Auth-এর সাথে কানেক্ট হবে)

  // 🔄 ডাটাবেজ থেকে ইউজারের বুকিং ডাটা নিয়ে আসা (Fetch)
  useEffect(() => {
    fetch(`http://localhost:5000/appointments?email=${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 🗑️ বুকিং ডিলিট করার লজিক (Delete Appointment)
  const handleDelete = async (id) => {
    const proceed = confirm("Are you sure you want to delete this appointment?");
    if (!proceed) return;

    try {
      const response = await fetch(`http://localhost:5000/appointments/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        // রিকোয়ারমেন্ট: ইনস্ট্যান্টলি ইউজার ইন্টারফেস (UI) থেকে আইটেম রিমুভ করতে হবে (No reload)
        setBookings(bookings.filter((b) => b._id !== id));
        toast.success("Appointment deleted successfully! 🗑️");
      }
    } catch (err) {
      toast.error("Failed to delete appointment.");
    }
  };

  // 📝 আপডেট মডাল ওপেন করার লজিক
  const openUpdateModal = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      patientName: booking.patientName,
      phone: booking.phone,
      appointmentDate: booking.appointmentDate,
      appointmentTime: booking.appointmentTime
    });
    setShowModal(true);
  };

  // 💾 আপডেট ডাটা সেভ করার লজিক (Update Appointment)
  const handleUpdateSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/appointments/${selectedBooking._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();

      if (data.success) {
        // রিকোয়ারমেন্ট: পেজ রিফ্রেশ ছাড়া সাথে সাথে UI আপডেট করতে হবে
        setBookings(bookings.map((b) => (b._id === selectedBooking._id ? { ...b, ...editForm } : b)));
        toast.success("Appointment updated successfully! 🎉");
        setShowModal(false);
      }
    } catch (err) {
      toast.error("Failed to update appointment.");
    }
  };

  // রিকোয়ারমেন্ট: ডাটা ফেচ হওয়ার সময় লোডিং স্পিনার দেখানো
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="border-b pb-4">
        <h2 className="text-3xl font-black text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your active doctor appointments here.</p>
      </div>

      <h3 className="text-xl font-bold text-slate-700">My Bookings</h3>

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
                  <p>👤 <strong>Patient:</strong> {booking.patientName} ({booking.gender})</p>
                  <p>📞 <strong>Phone:</strong> {booking.phone}</p>
                  <p>📅 <strong>Date:</strong> {booking.appointmentDate}</p>
                </div>
              </div>

              {/* অ্যাকশন বাটনসমূহ (হোম পেজের বাটন স্টাইলের সাথে মিল রেখে) */}
              <div className="flex gap-3 pt-2 border-t border-slate-50">
                <button onClick={() => openUpdateModal(booking)} className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl text-sm hover:bg-blue-600 hover:text-white transition">
                  Update
                </button>
                <button onClick={() => handleDelete(booking._id)} className="flex-1 bg-red-50 text-red-600 font-semibold py-2 rounded-xl text-sm hover:bg-red-600 hover:text-white transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📝 আপডেট ফর্ম মডাল (Controlled Modal Layout) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-slate-800">Edit Appointment</h3>
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg font-medium">
              ⚠️ Doctor details and account email cannot be modified to protect data integrity.
            </p>

            <form onSubmit={handleUpdateSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Patient Name</label>
                <input type="text" required value={editForm.patientName} className="w-full border p-2.5 rounded-xl text-sm" onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })} />
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
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
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
    </div>
  );
}