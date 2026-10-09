import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-fame-line bg-fame-surface p-7 shadow-2xl">
      <h1 className="mb-2 font-display text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 text-sm text-fame-muted">Sign in to continue watching.</p>
      <LoginForm />
      <p className="mt-5 text-center text-sm text-fame-muted">
        New to F.A.M.E?{' '}
        <Link href="/register" className="font-bold text-fame-pink hover:underline">Create account</Link>
      </p>
    </div>
  );
}