import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const savings = searchParams.get('savings') || '0';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#020617',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%)',
            color: 'white',
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              padding: '10px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              border: '1px solid rgba(5, 150, 105, 0.2)',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#10b981',
            }}
          >
            AI Spend Audit Results
          </div>
          
          <div style={{ display: 'flex', fontSize: '100px', fontWeight: '900', color: '#10b981', marginBottom: '10px' }}>
            ${savings}/mo
          </div>
          
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '60px' }}>
            in potential savings found
          </div>
          
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              color: '#64748b',
              marginTop: 'auto',
            }}
          >
            spendlens.vercel.app — Free & No Login Required
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
