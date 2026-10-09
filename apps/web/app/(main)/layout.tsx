import { TopBar } from '@/components/layout/TopBar';
import { TabBar } from '@/components/layout/TabBar';
import { ProfileGate } from '@/components/layout/ProfileGate';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileGate>
      <div className="flex min-h-screen flex-col">
        <TopBar />
        <main className="flex-1 pb-24 pt-14">{children}</main>
        <TabBar />
      </div>
    </ProfileGate>
  );
}