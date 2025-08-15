import { options } from "@/lib/auth";
import NextAuth from "next-auth";

// Use nextauth for the signin page
const handler = NextAuth(options);
export { handler as GET, handler as POST };