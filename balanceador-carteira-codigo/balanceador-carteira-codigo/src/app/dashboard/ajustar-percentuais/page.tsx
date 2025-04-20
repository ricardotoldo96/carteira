import { requireAuth } from '@/lib/auth';
import { getAssetCategories } from '@/lib/db';
import AssetCategoryForm from '@/components/portfolio/AssetCategoryForm';

export default async function AjustarPercentuaisPage() {
  const userId = await requireAuth();
  const categories = await getAssetCategories(userId);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ajustar Percentuais</h1>
      <p className="text-gray-600">
        Defina a porcentagem alvo para cada categoria de ativo. A soma deve ser igual a 100%.
      </p>
      
      <AssetCategoryForm categories={categories} />
    </div>
  );
}
