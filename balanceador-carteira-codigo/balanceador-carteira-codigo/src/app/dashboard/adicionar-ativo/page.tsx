import { requireAuth } from '@/lib/auth';
import { getAssetCategories } from '@/lib/db';
import AddAssetForm from '@/components/portfolio/AddAssetForm';

export default async function AdicionarAtivoPage() {
  const userId = await requireAuth();
  const categories = await getAssetCategories(userId);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Adicionar Ativo</h1>
      <p className="text-gray-600">
        Adicione um novo ativo à sua carteira de investimentos.
      </p>
      
      <AddAssetForm categories={categories} />
    </div>
  );
}
