import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { addAsset } from '@/lib/db';

export async function POST(request: NextRequest) {
  const userId = await getUserId();
  
  if (!userId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    const { name, ticker, currentValue, categoryId } = await request.json();
    
    if (!name || currentValue === undefined || !categoryId) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }
    
    const assetId = await addAsset({
      name,
      ticker: ticker || '',
      current_value: currentValue,
      category_id: categoryId,
      user_id: userId,
    });
    
    return NextResponse.json({ success: true, assetId });
  } catch (error) {
    console.error('Erro ao adicionar ativo:', error);
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
  }
}
