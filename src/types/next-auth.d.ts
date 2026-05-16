import type { DefaultJWT, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      nombre?: string;
      subdominio?: string;
      plan?: string;
    };
  }

  interface User {
    id: string;
    nombre?: string;
    subdominio?: string;
    plan?: string;
  }

  interface JWT extends DefaultJWT {
    id?: string;
    nombre?: string;
    subdominio?: string;
    plan?: string;
  }
}
