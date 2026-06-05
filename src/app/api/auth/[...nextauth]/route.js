// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; 

export const authOptions = {
  providers: [
    // ১. গুগল লগইন কনফিগারেশন
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // ২. ক্রেডেনশিয়াল লগইন কনফিগারেশন
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 💡 কুইক টেস্ট ডেমো অ্যাকাউন্ট হ্যান্ডলিং
        if (credentials.email === "user@gmail.com" && credentials.password === "123456") {
          return {
            id: "demo-user-123",
            name: "Md Hosen Bakaul",
            email: "user@gmail.com",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"
          };
        }

        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://docappoint-server-fq1x.onrender.com";

          // ব্যাকএন্ডে লগইন রিকোয়েস্ট পাঠানো
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

          // ডাটাবেজের ভেরিফিকেশন চেক এবং অবজেক্ট ম্যাপিং ট্র্যাকিং
          if (res.ok && result) {
            const foundUser = result.user || result.data || result; 
            
            if (foundUser && (foundUser.email || foundUser._id)) {
              return {
                id: foundUser._id?.toString() || foundUser.id || "user-id",
                name: foundUser.name || "Registered User",
                email: foundUser.email,
                // 🛠️ সব ধরণের ইমেজ প্রোপার্টি সাপোর্ট করার জন্য ফলব্যাক চেইন
                image: foundUser.photoURL || foundUser.image || foundUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"
              };
            }
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
    maxAge: 24 * 60 * 60, // ২৪ ঘণ্টা
  },
  callbacks: {
    // গুগল ইউজার ডাটাবেজ সিংক্রোনাইজেশন
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://docappoint-server-fq1x.onrender.com";
          // সোশ্যাল লগইনের সময় ডেটা ব্যাকএন্ডে সেভ/আপডেট করা
          await fetch(`${baseUrl}/users`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              image: user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150",
              role: "patient"
            })
          });
        } catch (error) {
          console.error("Error syncing social user to database:", error);
          // ডাটাবেজ সাময়িক ডাউন থাকলেও ইউজার যেন ফ্রন্টএন্ডে আটকে না যায়, তাই true রিটার্ন করা ভালো
        }
      }
      return true; 
    },

    // টোকেন এবং সেশনে ডাটা পুশ করা (রিলোড ও সেশন পার্সিস্টেন্স বাগ ফিক্সড)
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      // ড্যাশবোর্ড থেকে প্রোফাইল আপডেট করলে সেশন রিয়েল-টাইম আপডেট করার মেকানিজম
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
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