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

          // 🛠️ ফিক্সড ইউআরএল: /users/login বদলে /auth/login করা হলো (ব্যাকএন্ডের সাথে ম্যাচ করতে)
          const res = await fetch(`${baseUrl}/auth/login`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            cache: 'no-store' 
          });

          const result = await res.json();

          // ডাটাবেজের ভেরিফিকেশন চেক
          if (res.ok && result && result.success) {
            const foundUser = result.user; 
            
            if (foundUser) {
              return {
                id: foundUser._id?.toString() || foundUser.id || "user-id",
                name: foundUser.name || "Registered User",
                email: foundUser.email,
                image: foundUser.image || foundUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"
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
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://docappoint-server-fq1x.onrender.com";
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
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