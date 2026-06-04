import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // যদি ইউজার লগইন না থাকে, তাকে এই পেজে রিডাইরেক্ট করবে
  },
});

// 🎯 কোন কোন পেজগুলো লগইন ছাড়া দেখা যাবে না, তা এখানে বলে দেওয়া হচ্ছে
export const config = {
  matcher: [
    "/dashboard/:path*", // ড্যাশবোর্ড এবং তার ভেতরের সব পেজ প্রটেক্টেড
    "/book/:path*",      // বুকিং এবং তার ভেতরের সব পেজ প্রটেক্টেড
  ],
};