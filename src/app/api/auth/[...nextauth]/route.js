import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // আমরা আপাতত ইমেইল এবং পাসওয়ার্ড দিয়ে কাস্টম লগইন ব্যবহার করব
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 🚨 এই অংশটি আমরা পরবর্তী ধাপে আমাদের ব্যাকএন্ড (Node.js/Express/MongoDB) API-এর সাথে কানেক্ট করব।
        // আপাতত টেস্ট করার জন্য একটি ডেমো ইউজার রিটার্ন করছি।
        if (credentials.email === "user@gmail.com" && credentials.password === "123456") {
          return {
            id: "1",
            name: "Md Hosen Bakaul",
            email: "user@gmail.com",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
          };
        }
        
        // লগইন ভুল হলে null রিটার্ন করবে
        return null;
      }
    })
  ],
  // ইউজারকে কাস্টম লগইন পেজে রিডাইরেক্ট করার জন্য পাথ বলে দেওয়া
  pages: {
    signIn: "/login", 
  },
  session: {
    strategy: "jwt", // সেশন ম্যানেজমেন্টের জন্য JSON Web Token ব্যবহার হবে
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };