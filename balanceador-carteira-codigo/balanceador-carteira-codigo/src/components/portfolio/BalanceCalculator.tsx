'use client';

import { useState } from 'react';

export default function BalanceCalculator({ categories }) {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      setError('Por favor, informe um valor válido para investimento.');
      return;
    }
    
    setIsCalculating(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/portfolio/balance?amount=${parseFloat(investmentAmount)}`);
      
      if (!response.ok) {
        throw new Error('Falha ao calcular balanceamento');
      }
      
      const data = await response.json();
      setResults(data.distribution);
    } catch (err) {
      setError('Ocorreu um erro ao calcular o balanceamento. Tente novamente.');
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Calcular Investimento</h2>
      <p className="text-gray-600 mb-6">
        Informe o valor que deseja investir e calcule quanto deve ser alocado em cada categoria para manter sua carteira balanceada.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleCalculate} className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Valor para Investir (R$)
            </label>
            <input
              type="number"
              id="investmentAmount"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              min="0.01"
              step="0.01"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="pt-6">
            <button
              type="submit"
              disabled={isCalculating}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isCalculating ? 'Calculando...' : 'Calcular'}
            </button>
          </div>
        </div>
      </form>
      
      {results && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Recomendação de Investimento</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor a Investir
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.targetAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
