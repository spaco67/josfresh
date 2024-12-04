import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "farmer" | "customer" | "admin";
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    user: User;
  }
}