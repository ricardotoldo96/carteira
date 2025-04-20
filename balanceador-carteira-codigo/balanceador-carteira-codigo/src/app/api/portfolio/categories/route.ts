import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { updateCategoryPercentage } from '@/lib/db';

export async function PUT(request: NextRequest) {
  const userId = await getUserId();
  
  if (!userId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    const { updates } = await request.json();
    
    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }
    
    // Verificar se a soma dos percentuais é 100%
    const totalPercentage = updates.reduce((sum, update) => sum + update.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      return NextResponse.json({ 
        error: `A soma dos percentuais deve ser 100%. Atual: ${totalPercentage.toFixed(2)}%` 
      }, { status: 400 });
    }
    
    // Atualizar cada categoria
    for (const update of updates) {
      await updateCategoryPercentage(update.categoryId, update.percentage);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar categorias:', error);
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
  }
}
