import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register', '/'];

// ✅ TODOS los archivos estáticos de Next.js deben ser públicos
const isStaticFile = (pathname: string) => {
  return (
    pathname.startsWith('/_next/static') ||  // CSS, JS, chunks
    pathname.startsWith('/_next/image') ||   // Imágenes optimizadas
    pathname.startsWith('/_next/data') ||    // Datos de Next.js
    pathname.startsWith('/fonts') ||         // Fuentes
    pathname.startsWith('/images') ||        // Imágenes
    pathname.includes('.' )                  // Cualquier archivo con extensión
  );
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 🟢 PRIORIDAD 1: Archivos estáticos SIEMPRE pasan
  if (isStaticFile(pathname)) {
    return NextResponse.next();
  }

  // 🟢 PRIORIDAD 2: Rutas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 🔐 El resto requiere autenticación
  const token = request.cookies.get('token')?.value;

  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const userRole = payload.role;

    if (pathname.startsWith('/dashboard/business') && userRole !== 'business') {
      const redirectPath = userRole === 'client' ? '/dashboard/client' : '/';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    if (pathname.startsWith('/dashboard/client') && userRole !== 'client') {
      const redirectPath = userRole === 'business' ? '/dashboard/business' : '/';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
