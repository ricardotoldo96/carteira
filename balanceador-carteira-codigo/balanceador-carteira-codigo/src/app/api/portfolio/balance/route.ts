import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/auth';
import { calculateInvestmentDistribution } from '@/lib/db';

export async function GET(request: NextRequest) {
  const userId = await getUserId();
  
  if (!userId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const amount = parseFloat(searchParams.get('amount') || '0');
    
    if (amount <= 0) {
      return NextResponse.json({ error: 'Valor de investimento inválido' }, { status: 400 });
    }
    
    const distribution = await calculateInvestmentDistribution(userId, amount);
    
    return NextResponse.json({ distribution });
  } catch (error) {
    console.error('Erro ao calcular balanceamento:', error);
    return NextResponse.json({ error: 'Erro ao processar a solicitação' }, { status: 500 });
  }
}
