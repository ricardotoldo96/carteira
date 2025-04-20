'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AssetCategoryForm({ categories }) {
  const [percentages, setPercentages] = useState(
    categories.reduce((acc, category) => {
      acc[category.id] = category.target_percentage;
      return acc;
    }, {})
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handlePercentageChange = (categoryId, value) => {
    setPercentages({
      ...percentages,
      [categoryId]: parseFloat(value) || 0,
    });
  };

  const getTotalPercentage = () => {
    return Object.values(percentages).reduce((sum, value) => sum + value, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const total = getTotalPercentage();
    if (Math.abs(total - 100) > 0.01) {
      setError(`A soma dos percentuais deve ser 100%. Atualmente: ${total.toFixed(2)}%`);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const updates = Object.entries(percentages).map(([categoryId, percentage]) => ({
        categoryId: parseInt(categoryId),
        percentage,
      }));
      
      const response = await fetch('/api/portfolio/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar percentuais');
      }
      
      router.refresh();
      router.push('/dashboard');
    } catch (err) {
      setError('Ocorreu um erro ao salvar os percentuais. Tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajustar Percentuais Alvo</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <label className="w-1/3 text-sm font-medium text-gray-700">
                {category.name}
              </label>
              <div className="w-2/3 flex items-center">
                <input
                  type="number"
                  value={percentages[category.id]}
                  onChange={(e) => handlePercentageChange(category.id, e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="ml-2 text-gray-500">%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            Total: <span className={Math.abs(getTotalPercentage() - 100) > 0.01 ? 'text-red-600' : 'text-green-600'}>
              {getTotalPercentage().toFixed(2)}%
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Math.abs(getTotalPercentage() - 100) > 0.01}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Percentuais'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
