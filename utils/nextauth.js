import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./../libs/prisma";
import md5 from "md5";

export const options = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			type: "credentials",
			async authorize(credentials, req, res) {
				const { username, password } = credentials;
				console.log(credentials);
				const user = await prisma.users.findUnique({
					where: { username },
				});

				if (user && md5(password) === user.password) {
					return user;
				} else {
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 2 * 24 * 60 * 60, // 2 Days Expire
	},
	pages: {
		signIn: "/login",
		signUp: "/login",
		signOut: "/login",
	},
	callbacks: {
		async jwt(params) {
			// Update Token
			if (params.user) {
				params.token.userid = params.user.userid;
				params.token.name = params.user.name;
			}

			// Return Final Token
			console.log(params.user);
			return params.token;
		},
		async session({ session, token }) {
			// Menyimpan username ke dalam session untuk dikirimkan ke client
			session.user.userid = token.userid;
			session.user.name = token.name;

			return session;
		},
	},
};
