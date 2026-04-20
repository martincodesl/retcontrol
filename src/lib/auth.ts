import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.subdominio = (user as any).subdominio;
        token.plan = (user as any).plan;
        token.nombre = (user as any).nombre;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).subdominio = token.subdominio;
        (session.user as any).plan = token.plan;
        (session.user as any).nombre = token.nombre;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const barberia = await prisma.barberia.findUnique({
          where: { email: credentials.email as string },
        });

        if (!barberia) return null;

        const passwordValida = await bcrypt.compare(
          credentials.password as string,
          barberia.password
        );

        if (!passwordValida) return null;

        return {
          id: barberia.id,
          email: barberia.email,
          name: barberia.nombre,
          subdominio: barberia.subdominio,
          plan: barberia.plan,
          nombre: barberia.nombre,
        };
      },
    }),
  ],
});