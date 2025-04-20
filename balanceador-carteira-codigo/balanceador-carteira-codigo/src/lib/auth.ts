import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authenticateUser } from '@/lib/db';

export async function authenticate(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Usuário e senha são obrigatórios' };
  }

  try {
    const user = await authenticateUser(username, password);
    
    if (!user) {
      return { error: 'Usuário ou senha inválidos' };
    }

    // Armazenar ID do usuário em cookie
    cookies().set('userId', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });

    cookies().set('username', user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return { error: 'Erro ao tentar fazer login' };
  }
}

export async function getUserId() {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId');
  
  return userId ? parseInt(userId.value) : null;
}

export async function getUsername() {
  const cookieStore = cookies();
  const username = cookieStore.get('username');
  
  return username ? username.value : null;
}

export async function logout() {
  cookies().delete('userId');
  cookies().delete('username');
}

export async function requireAuth() {
  const userId = await getUserId();
  
  if (!userId) {
    redirect('/login');
  }
  
  return userId;
}
