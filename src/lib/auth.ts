import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type BarberiaUser = {
  id: string;
  email: string;
  name: string;
  subdominio: string;
  plan: string;
  nombre: string;
};

type SessionUser = {
  id: string;
  subdominio?: string;
  plan?: string;
  nombre?: string;
  email?: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const barberiaUser = user as BarberiaUser;
        token.id = barberiaUser.id;
        token.subdominio = barberiaUser.subdominio;
        token.plan = barberiaUser.plan;
        token.nombre = barberiaUser.nombre;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const sessionUser = session.user as SessionUser;
        sessionUser.id = token.id as string;
        sessionUser.subdominio = token.subdominio;
        sessionUser.plan = token.plan;
        sessionUser.nombre = token.nombre;
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