import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // ✅ শুধুমাত্র গুগল প্রোভাইডার রাখা হলো

export const authOptions = {
  providers: [
    // 🔴 ১. গুগল লগইন কনফিগারেশন (রিকোয়ারমেন্ট অনুযায়ী শুধুমাত্র ১টি সোশ্যাল প্রোভাইডার)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // 🩺 ২. ক্রেডেনশিয়াল লগইন কনফিগারেশন (সুরক্ষিত এবং অপ্টিমাইজড)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 💡 হার্ডকোডেড কুইক ডেমো অ্যাকাউন্ট চেক (টেস্টিং পারপাস)
        if (credentials.email === "user@gmail.com" && credentials.password === "123456") {
          return {
            id: "demo-user-123",
            name: "Md Hosen Bakaul",
            email: "user@gmail.com",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"
          };
        }

        try {
          // এনভায়রনমেন্ট ভেরিয়েবল ব্যাকআপ সহ ডাইনামিক বেস ইউআরএল নির্ধারণ
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://docappoint-server-fq1x.onrender.com";

          // ✅ ফিক্সড: সমস্ত ইউজার গেট না করে, ব্যাকএন্ডের সিকিউর লগইন এপিআই-তে রিকোয়েস্ট পাঠানো হচ্ছে
          const res = await fetch(`${baseUrl}/users/login`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            cache: 'no-store' 
          });

          const result = await res.json();

          // যদি ব্যাকএন্ড ভেরিফিকেশন সফল হয় এবং ইউজার ডাটা পাওয়া যায়
          if (res.ok && result.success && result.user) {
            const foundUser = result.user;
            return {
              id: foundUser._id.toString(),
              name: foundUser.name || "Registered User",
              email: foundUser.email,
              image: foundUser.photoURL || ""
            };
          }
        } catch (error) {
          console.error("NextAuth Database Login Fetch Error:", error);
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/login", 
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // ২৪ ঘণ্টা সেশন ভ্যালিডিটি
  },
  callbacks: {
    // 🌟 ৩. signIn Callback: সোশ্যাল ইউজার সিনক্রোনাইজেশন লজিক
    async signIn({ user, account }) {
      // ✅ ফিক্সড: রিকোয়ারমেন্ট মেনে শুধুমাত্র গুগলের ডাটা সিঙ্ক করার কন্ডিশন রাখা হলো
      if (account.provider === "google") {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://docappoint-server-fq1x.onrender.com";
          
          // ব্যাকএন্ডের Upsert (PUT) API-তে সোশ্যাল ইউজারের ডাটা পাঠানো হচ্ছে
          await fetch(`${baseUrl}/users`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "patient"
            })
          });
        } catch (error) {
          console.error("Error syncing social user to database:", error);
        }
      }
      return true; 
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "MY_SUPER_SECRET_KEY_12345", 
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };