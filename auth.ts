import NextAuth from "next-auth"
import { db } from "./lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";


export const { auth, handlers, signIn, signOut } = NextAuth({
    callbacks: {
        async signIn({ user, account, profile }) {
            // FIX 1: Added !user.email so TypeScript knows the email is guaranteed to exist
            if (!user || !user.email || !account) return false;

            const existingUser = await db.user.findUnique({
                where: { email: user.email }
            });

            if (!existingUser) {
                const newUser = await db.user.create({
                    data: {
                        email: user.email,
                        name: user.name || "",
                        image: user.image || "",

                        accounts: {
                            create: {
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                // FIX 2: Changed the LEFT side keys to snake_case to match Prisma exactly
                                refresh_token: account.refresh_token,
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token,
                                session_state: account.session_state as string | undefined,
                            },
                        },
                    },
                });

                if (!newUser) return false;
            } else {
                const existingAccount = await db.account.findUnique({
                    where: {
                        provider_providerAccountId: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        }
                    }
                })
                
                if (!existingAccount) {
                    await db.account.create({
                        data: {
                            userId: existingUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            // FIX 2: Same fix applied here
                            refresh_token: account.refresh_token,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                            session_state: account.session_state as string | undefined,
                        },
                    });
                }
            }

            return true;
        },

       async jwt({ token, user, account }) {
            if (!token.sub) return token;

            // FIX: Use Prisma directly so TypeScript knows exactly what 'existingUser' is
            const existingUser = await db.user.findUnique({
                where: { id: token.sub }
            });

            if (!existingUser) return token;

            // Notice we deleted the getAccountByUserId line because you weren't using it anyway!

            token.name = existingUser.name;
            token.email = existingUser.email;
            
            // @ts-ignore - Assuming role is defined in your schema
            token.role = existingUser.role;

            return token;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.sub && session.user) {
                // @ts-ignore - Assuming role is defined in your schema
                session.user.role = token.role;
            }

            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
});