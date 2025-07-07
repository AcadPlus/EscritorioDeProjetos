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
    // Cria novos headers, encaminhando apenas os necessários.
    const headersToForward = new Headers();

    // Encaminha o Content-Type original da requisição.
    if (req.headers.has('Content-Type')) {
      headersToForward.set('Content-Type', req.headers.get('Content-Type'));
    }

    // Encaminha o token de autorização, se existir.
    if (req.headers.has('Authorization')) {
      headersToForward.set('Authorization', req.headers.get('Authorization'));
    }

    const response = await fetch(url.toString(), {
      method: req.method,
      headers: headersToForward, // Usa os headers encaminhados
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