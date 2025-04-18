import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      profileId?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
    profileId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    profileId?: string | null;
  }
}
