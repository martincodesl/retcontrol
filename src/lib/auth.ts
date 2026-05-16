import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

//  Mantenemos las extensiones de tipo para tu App (Sidebar, etc.)
declare module "next-auth" {
  interface User {
    id: string;
    subdominio?: string;
    plan?: string;
    nombre?: string;
  }
  
  interface Session {
    user: {
      id: string;
      subdominio?: string;
      plan?: string;
      nombre?: string;
      email?: string;
      name?: string | null;
    };
  }
}

type BarberiaUser = {
  id: string;
  email: string;
  name: string;
  subdominio: string;
  plan: string;
  nombre: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.subdominio = user.subdominio;
        token.plan = user.plan;
        token.nombre = user.nombre;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // 💡 Solución definitiva: Forzamos el tipo del token para Vercel
        session.user.id = token.id as string;
        session.user.subdominio = token.subdominio as string | undefined;
        session.user.plan = token.plan as string | undefined;
        session.user.nombre = token.nombre as string | undefined;
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