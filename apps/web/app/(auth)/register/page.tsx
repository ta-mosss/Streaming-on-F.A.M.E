import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-fame-line bg-fame-surface p-7 shadow-2xl">
      <h1 className="mb-2 font-display text-2xl font-bold">Create your account</h1>
      <p className="mb-6 text-sm text-fame-muted">Start your F.A.M.E journey in under a minute.</p>
      <RegisterForm />
      <p className="mt-5 text-center text-sm text-fame-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-fame-pink hover:underline">Sign in</Link>
      </p>
    </div>
  );
}