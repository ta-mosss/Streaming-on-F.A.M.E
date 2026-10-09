import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ProfileView } from '@/components/profile/ProfileView';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return <ProfileView user={session.user} />;
}