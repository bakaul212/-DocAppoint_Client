import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // প্রয়োজন হলে এখানে কাস্টম রাউটিং বা রোল-ভিত্তিক সিকিউরিটি যোগ করা যায়
    return NextResponse.next();
  },
  {
    callbacks: {
      // ✅ রিফ্রেশ বাগ ফিক্স: সেশন/টোকেন রিড করার সময় প্রপারলি বুনিয়ান ভ্যালু রিটার্ন করা
      authorized: ({ token }) => {
        // যদি টোকেন থাকে (ইউজার লগইন থাকে), তাহলে ট্রু রিটার্ন করবে এবং রিফ্রেশ করলেও রিডাইরেক্ট করবে না
        return !!token;
      },
    },
    pages: {
      signIn: "/login", // যদি ইউজার লগইন না থাকে বা টোকেন ফলস হয়, তাকে এই পেজে রিডাইরেক্ট করবে
    },
  }
);

// 🎯 কোন কোন পেজগুলো লগইন ছাড়া দেখা যাবে না, তা এখানে ডিফাইন করা হলো
export const config = {
  matcher: [
    "/dashboard/:path*", // ড্যাশবোর্ড এবং তার ভেতরের সব পেজ সুরক্ষিত
    "/book/:path*",      // বুকিং এবং তার ভেতরের সব পেজ সুরক্ষিত
    "/all-appointments/:path*" // রিকোয়ারমেন্ট শিটের অল অ্যাপয়েন্টমেন্ট পেজটি সুরক্ষিত থাকলে এটিও যোগ করতে পারেন
  ],
};