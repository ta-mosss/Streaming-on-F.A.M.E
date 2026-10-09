'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await api.post('/v1/auth/register', { name, email, password });
      await signIn('credentials', { email, password, redirect: false });
      router.push('/browse');
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <Field label="Full name" type="text" value={name} onChange={setName} placeholder="e.g. Matodzi Makananisa" />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
      {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">Create account</Button>
    </form>
  );
}

function Field({
  label, type, value, onChange, placeholder,
}: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-fame-muted">
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border border-fame-line bg-fame-bg px-4 py-3 text-[15px] outline-none transition focus:border-fame-pink"
      />
    </label>
  );
}