import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// DELETE /api/blog/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if category has posts
    const postsCount = await prisma.blogPost.count({
      where: { categoryId: id },
    });

    if (postsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts' },
        { status: 400 }
      );
    }

    await prisma.blogCategory.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
