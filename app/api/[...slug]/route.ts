import { NextRequest, NextResponse } from 'next/server';

// O endereço do backend, acessível apenas de dentro da rede Docker.
const BACKEND_URL = process.env.INTERNAL_API_URL || 'http://backend:8000';

export async function handler(req: NextRequest) {
  const url = new URL(req.nextUrl.pathname, BACKEND_URL);

  // Copia os parâmetros de busca da requisição original
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Copia outros headers importantes, se necessário
        Authorization: req.headers.get('Authorization') || '',
      },
      body: req.body,
      // Garante que o fetch não use cache interno
      cache: 'no-store',
    });

    return response;
  } catch (error) {
    console.error('Erro ao fazer proxy da requisição:', error);
    return new NextResponse('Proxy error', { status: 500 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH }; 