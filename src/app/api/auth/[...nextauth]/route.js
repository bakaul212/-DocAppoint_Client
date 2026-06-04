import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
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

        // 💡 ১. হার্ডকোডেড কুইক ডেমো অ্যাকাউন্ট চেক (ডাটাবেজ ছাড়াও যেন লগইন হয়)
        if (credentials.email === "user@gmail.com" && credentials.password === "123456") {
          return {
            id: "demo-user-123",
            name: "Md Hosen Bakaul",
            email: "user@gmail.com",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150"
          };
        }

        try {
          // 🌐 ২. এক্সপ্রেস ব্যাকএন্ড থেকে ইউজার ডাটা নিয়ে আসা
          const res = await fetch("http://localhost:5000/users", { 
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: 'no-store' 
          });

          if (res.ok) {
            const result = await res.json();
            const users = result?.data || [];
            
            // ডাটাবেজের ইউজারদের সাথে ম্যাচ করানো (String বা Number যাই হোক তা অবজেক্ট চেক করবে)
            const foundUser = users.find(
              (u) => u.email?.toLowerCase() === credentials.email?.toLowerCase() && 
                     String(u.password) === String(credentials.password)
            );

            if (foundUser) {
              return {
                id: foundUser._id.toString(),
                name: foundUser.name || "Registered User",
                email: foundUser.email,
                image: foundUser.photoURL || ""
              };
            }
          }
        } catch (error) {
          console.error("NextAuth Database Fetch Error:", error);
        }

        // যদি কোনো অ্যাকাউন্টের সাথে না মিলে তবেই 401 বা null রিটার্ন হবে
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login", 
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // ২৪ ঘণ্টা সেশন থাকবে
  },
  callbacks: {
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