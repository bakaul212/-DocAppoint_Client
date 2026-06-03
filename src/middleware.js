// NextAuth-এর ডিফল্ট মিডলওয়্যার ইম্পোর্ট করছি
export { default } from "next-auth/middleware";

// কোন কোন রাউট বা পেজগুলোকে আমরা লক করতে চাই, তা এখানে বলে দিতে হবে
export const config = {
  matcher: [
    "/dashboard/:path*",      // ড্যাশবোর্ড এবং এর ভেতরের সব সাব-পেজ লক থাকবে
    "/appointments/:path*",   // অ্যাপয়েন্টমেন্ট পেজ লক থাকবে
  ],
};