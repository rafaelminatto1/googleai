// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // In a real application, you might also check database connectivity here.
    // await prisma.$connect();
    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('[API_HEALTH_ERROR]', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'A service is down.',
      timestamp: new Date().toISOString() 
    }, { status: 503 });
  }
}