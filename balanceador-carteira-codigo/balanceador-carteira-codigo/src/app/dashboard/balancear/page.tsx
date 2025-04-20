import { requireAuth } from '@/lib/auth';
import { getAssetCategories } from '@/lib/db';
import BalanceCalculator from '@/components/portfolio/BalanceCalculator';

export default async function BalancearPage() {
  const userId = await requireAuth();
  const categories = await getAssetCategories(userId);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Balancear Carteira</h1>
      <p className="text-gray-600">
        Calcule quanto investir em cada categoria para manter sua carteira balanceada de acordo com os percentuais alvo.
      </p>
      
      <BalanceCalculator categories={categories} />
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajustar Percentuais</h2>
        <p className="text-gray-600 mb-4">
          Se desejar alterar os percentuais alvo de cada categoria, você pode fazer isso na página de ajuste de percentuais.
        </p>
        <a 
          href="/dashboard/ajustar-percentuais" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          Ajustar Percentuais
        </a>
      </div>
    </div>
  );
}
