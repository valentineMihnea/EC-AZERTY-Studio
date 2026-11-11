import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { toCatalogProductDTO } from '@/lib/catalog';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        product: toCatalogProductDTO(product),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof (error as { digest: unknown }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_')
    ) {
      throw error;
    }
    console.error('Failed to fetch product details:', error);
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 });
  }
}
