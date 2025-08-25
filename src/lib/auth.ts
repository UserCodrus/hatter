import Google from "next-auth/providers/google";

import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

export type SessionUser = {
	name?: string | null | undefined,
	email?: string | null | undefined,
	image?: string | null | undefined,
	id: string
}

export interface AuthSession extends Session {
	user: SessionUser
}

/** Options for NextAuth */
export const options: NextAuthOptions = {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	adapter: PrismaAdapter(prisma),
	secret: process.env.AUTH_SECRET,
	callbacks: {
		async session(params: {session: Session, token: JWT, user: AdapterUser}): Promise<AuthSession> {
			const session = params.session as AuthSession;
			if (session.user)
				session.user.id = params.user.id;

			return session;
		}
	}
};