import { redirect } from 'next/navigation';
import { getUserId, getUsername } from '@/lib/auth';
import LogoutButton from '@/components/auth/LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getUserId();
  const username = await getUsername();
  
  if (!userId) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Balanceador de Carteira</h1>
            <p className="text-sm text-gray-600">Olá, {username}</p>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
