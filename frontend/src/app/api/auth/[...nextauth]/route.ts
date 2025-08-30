import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const api_key = process.env.NEXT_PUBLIC_API_KEY;

// Function to refresh access token
async function refreshAccessToken(refreshToken: string) {
    try {
        const response = await axios.post(`${api_key}/api/auth/refresh`, {
            refresh_token: refreshToken,
        });

        const refreshedTokens = response.data;

        return {
            accessToken: refreshedTokens.access_token,
            refreshToken: refreshToken, // Keep the same refresh token
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return null;
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                try {
                    const response = await axios.post(`${api_key}/api/auth/login`, {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const authData = response.data;

                    if (!authData?.access_token || !authData?.user) {
                        console.error("Missing fields in auth response");
                        return null;
                    }

                    return {
                        id: authData.user?.id || "",
                        email: authData.user.email,
                        name: authData.user.full_name,
                        accessToken: authData.access_token,
                        refreshToken: authData.refresh_token,
                    };
                } catch (error: any) {
                    console.error(
                        "Auth error:",
                        error?.response?.data || error.message,
                    );
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/sign-in",
        signOut: "/",
        error: "/sign-in",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.name = user.name;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                // Set token expiry time (2 hours from now)
                token.accessTokenExpires = Date.now() + 2 * 60 * 60 * 1000;
            }

            // Check if access token is expired and refresh if needed
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // Access token has expired, try to refresh it
            const refreshedTokens = await refreshAccessToken(token.refreshToken as string);
            
            if (refreshedTokens) {
                return {
                    ...token,
                    accessToken: refreshedTokens.accessToken,
                    accessTokenExpires: Date.now() + 2 * 60 * 60 * 1000,
                };
            }

            // If refresh fails, return token with error
            return {
                ...token,
                error: "RefreshAccessTokenError",
            };
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    email: token.email,
                    name: token.name,
                    accessToken: token.accessToken,
                };
                
                // Pass error to session if token refresh failed
                if (token.error) {
                    session.error = token.error;
                }
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60, 
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };