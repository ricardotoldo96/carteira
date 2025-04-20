import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface User {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

export interface AssetCategory {
  id: number;
  name: string;
  target_percentage: number;
  user_id: number;
}

export interface Asset {
  id: number;
  name: string;
  ticker: string;
  current_value: number;
  category_id: number;
  user_id: number;
  created_at: string;
}

export interface BalanceHistory {
  id: number;
  user_id: number;
  total_value: number;
  date: string;
}

// Função simulada para substituir getCloudflareContext
export async function getDB() {
  // Em um ambiente de produção, isso seria substituído pela conexão real com o banco de dados
  return {
    prepare: (query: string) => ({
      bind: (...params: any[]) => ({
        first: async <T>() => {
          // Simulação para autenticação
          if (query.includes('SELECT * FROM users WHERE username = ? AND password = ?')) {
            const [username, password] = params;
            if (username === 'RicardoToldo' && password === 'ricardo1008') {
              return { id: 1, username: 'RicardoToldo', password: 'ricardo1008', created_at: new Date().toISOString() } as T;
            }
            return null;
          }
          return null;
        },
        all: async <T>() => {
          // Simulação para categorias de ativos
          if (query.includes('SELECT * FROM asset_categories WHERE user_id = ?')) {
            return {
              results: [
                { id: 1, name: 'Ações brasileiras', target_percentage: 20, user_id: 1 },
                { id: 2, name: 'Fundos imobiliários', target_percentage: 20, user_id: 1 },
                { id: 3, name: 'Renda fixa', target_percentage: 20, user_id: 1 },
                { id: 4, name: 'Ações internacionais', target_percentage: 20, user_id: 1 },
                { id: 5, name: 'Criptomoedas', target_percentage: 20, user_id: 1 }
              ] as T[]
            };
          }
          
          // Simulação para ativos
          if (query.includes('SELECT * FROM assets WHERE user_id = ?')) {
            return {
              results: [] as T[]
            };
          }
          
          // Simulação para resumo do portfólio
          if (query.includes('SELECT')) {
            return {
              results: [
                { id: 1, name: 'Ações brasileiras', target_percentage: 20, currentValue: 0, currentPercentage: 0, difference: -20 },
                { id: 2, name: 'Fundos imobiliários', target_percentage: 20, currentValue: 0, currentPercentage: 0, difference: -20 },
                { id: 3, name: 'Renda fixa', target_percentage: 20, currentValue: 0, currentPercentage: 0, difference: -20 },
                { id: 4, name: 'Ações internacionais', target_percentage: 20, currentValue: 0, currentPercentage: 0, difference: -20 },
                { id: 5, name: 'Criptomoedas', target_percentage: 20, currentValue: 0, currentPercentage: 0, difference: -20 }
              ] as T[]
            };
          }
          
          return { results: [] as T[] };
        },
        run: async () => ({ meta: { last_row_id: 1 } })
      })
    })
  };
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const db = await getDB();
  const user = await db.prepare(
    'SELECT * FROM users WHERE username = ? AND password = ?'
  ).bind(username, password).first<User>();
  
  return user || null;
}

export async function getAssetCategories(userId: number): Promise<AssetCategory[]> {
  const db = await getDB();
  const categories = await db.prepare(
    'SELECT * FROM asset_categories WHERE user_id = ?'
  ).bind(userId).all<AssetCategory>();
  
  return categories.results;
}

export async function updateCategoryPercentage(categoryId: number, percentage: number): Promise<void> {
  const db = await getDB();
  await db.prepare(
    'UPDATE asset_categories SET target_percentage = ? WHERE id = ?'
  ).bind(percentage, categoryId).run();
}

export async function getAssets(userId: number): Promise<Asset[]> {
  const db = await getDB();
  const assets = await db.prepare(
    'SELECT * FROM assets WHERE user_id = ?'
  ).bind(userId).all<Asset>();
  
  return assets.results;
}

export async function addAsset(asset: Omit<Asset, 'id' | 'created_at'>): Promise<number> {
  const db = await getDB();
  const result = await db.prepare(
    'INSERT INTO assets (name, ticker, current_value, category_id, user_id) VALUES (?, ?, ?, ?, ?)'
  ).bind(asset.name, asset.ticker, asset.current_value, asset.category_id, asset.user_id).run();
  
  return result.meta.last_row_id as number;
}

export async function updateAssetValue(assetId: number, value: number): Promise<void> {
  const db = await getDB();
  await db.prepare(
    'UPDATE assets SET current_value = ? WHERE id = ?'
  ).bind(value, assetId).run();
}

export async function saveBalanceHistory(userId: number, totalValue: number): Promise<void> {
  const db = await getDB();
  await db.prepare(
    'INSERT INTO balance_history (user_id, total_value) VALUES (?, ?)'
  ).bind(userId, totalValue).run();
}

export async function getPortfolioSummary(userId: number): Promise<{
  totalValue: number;
  categories: (AssetCategory & { currentValue: number; currentPercentage: number; difference: number })[];
}> {
  const db = await getDB();
  
  // Get categories with current values
  const categoriesQuery = await db.prepare(`
    SELECT 
      c.id, 
      c.name, 
      c.target_percentage,
      0 as currentValue,
      0 as currentPercentage
    FROM 
      asset_categories c
    WHERE 
      c.user_id = ?
  `).bind(userId).all();
  
  const categories = categoriesQuery.results.map((category: any) => ({
    ...category,
    difference: category.currentPercentage - category.target_percentage
  }));
  
  return {
    totalValue: 0,
    categories
  };
}

export async function calculateInvestmentDistribution(userId: number, investmentAmount: number): Promise<{
  category: string;
  targetAmount: number;
}[]> {
  const categories = await getAssetCategories(userId);
  
  return categories.map(category => ({
    category: category.name,
    targetAmount: (category.target_percentage / 100) * investmentAmount
  }));
}
