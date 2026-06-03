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
        // ভ্যালিডেশন চেক
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 💡 ১. টেস্ট করার সুবিধার্থে ডেমো ইউজার অ্যাকাউন্ট সচল রাখা হলো
        if (credentials.email === "user@gmail.com" && credentials.password === "123456") {
          return {
            id: "demo-1",
            name: "Md Hosen Bakaul",
            email: "user@gmail.com",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
          };
        }

        try {
          // 📡 ২. মঙ্গোডিবি ব্যাকএন্ড (Express Server) থেকে ইউজার ভ্যালিডেশন করার চেষ্টা
          // আমরা এক্সপ্রেস ব্যাকএন্ডে একটি সহজ চেক বসাতে পারি অথবা সরাসরি এখানেই ডাটাবেজ ভেরিফাই করতে পারি।
          // সবচেয়ে ক্লিন উপায় হলো এক্সপ্রেসের মাধ্যমে ভেরিফাই করা অথবা এক্সপ্রেস ডাটাবেজের সরাসরি হেল্প নেওয়া।
          
          // এখানে আমরা এক্সপ্রেস ব্যাকএন্ডে সরাসরি রিকোয়েস্ট পাঠিয়ে চেক করছি ইউজার সঠিক কি না
          const res = await fetch("http://localhost:5000/users");
          if (res.ok) {
            const result = await res.json();
            
            // এক্সপ্রেস থেকে আসা ইউজার লিস্ট থেকে ইমেইল ও পাসওয়ার্ড ম্যাচ করানো হচ্ছে
            // (নোট: প্রোডাকশনে পাসওয়ার্ড bcrypt দিয়ে হ্যাশ করা উচিত, লার্নিং বা টেস্টের জন্য এটি একদম পারফেক্ট)
            const users = result?.data || [];
            const foundUser = users.find(
              (u) => u.email === credentials.email && u.password === credentials.password
            );

            if (foundUser) {
              return {
                id: foundUser._id.toString(),
                name: foundUser.name,
                email: foundUser.email,
                image: foundUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop"
              };
            }
          }
        } catch (error) {
          console.error("Next-Auth Authorization Error:", error);
        }

        // ইমেইল বা পাসওয়ার্ড না মিললে লগইন রিজেক্ট হবে
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login", 
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // সেশনে ইউজারের ইমেজ এবং আইডি সঠিকভাবে পাস করার জন্য টোকেন কলব্যাক
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.image = token.picture;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };