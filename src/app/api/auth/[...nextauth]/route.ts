import { options } from "@/lib/auth";
import NextAuth from "next-auth";

// Use nextauth for the signin page
const handler = NextAuth(options);

const GET = handler;
const POST = handler;

export { GET, POST };