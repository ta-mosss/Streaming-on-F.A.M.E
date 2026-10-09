import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

/**
 * Demo mode: if the API isn't reachable, accept any email + password
 * (min 6 chars) so the UI can be explored without a backend.
 * Remove the DEMO block once apps/api is running.
 */
async function tryApiLogin(email: string, password: string) {
  try {
    const res = await fetch(`${API}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // API offline
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        // 1. Try the real API first
        const fromApi = await tryApiLogin(email, password);
        if (fromApi) {
          return {
            id: fromApi.user.id,
            email: fromApi.user.email,
            name: fromApi.user.name,
            accessToken: fromApi.accessToken,
            refreshToken: fromApi.refreshToken,
          } as any;
        }

        // 2. DEMO FALLBACK — remove when apps/api is live
        if (password.length >= 6 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return {
            id: 'demo-user',
            email,
            name: email.split('@')[0],
            accessToken: 'demo-token',
            refreshToken: 'demo-refresh',
          } as any;
        }

        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
});