import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// 💡 Declaramos todo dentro del módulo global "next-auth"
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

  // 💡 Movemos la interfaz JWT aquí adentro para que herede el contexto correcto
  interface JWT {
    id?: string;
    subdominio?: string;
    plan?: string;
    nombre?: string;
  }
}

// ... El resto de tus tipos (como BarberiaUser) y la configuración de NextAuth continúan igual abajo

// Mantenemos tus tipos por si los usas en otras partes del proyecto
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
        // Al extender el módulo arriba, ya no necesitas forzar tipos aquí
        token.id = user.id;
        token.subdominio = user.subdominio;
        token.plan = user.plan;
        token.nombre = user.nombre;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Ahora session.user y token tienen los tipos mapeados correctamente
        session.user.id = token.id as string;
        session.user.subdominio = token.subdominio;
        session.user.plan = token.plan;
        session.user.nombre = token.nombre;
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

        // Lo que retorna aquí coincide perfectamente con la interfaz User extendida arriba
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