import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET /api/blog/categories - List all categories
export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('BlogCategory')
      .select('*, posts:BlogPost(count)')
      .order('sortOrder', { ascending: true });

    if (error) throw error;

    const formattedCategories = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      color: cat.color || '#606C38',
      icon: cat.icon || '',
      postCount: cat.posts?.[0]?.count || 0,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/blog/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, color, icon } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = generateSlug(name);

    // Ensure unique slug
    let counter = 1;
    let uniqueSlug = slug;

    while (true) {
      const { data: existing } = await supabase
        .from('BlogCategory')
        .select('id')
        .eq('slug', uniqueSlug)
        .single();

      if (!existing) break;

      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const { data: category, error } = await supabase
      .from('BlogCategory')
      .insert({
        name,
        slug: uniqueSlug,
        description: description || null,
        color: color || '#606C38',
        icon: icon || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color || '#606C38',
      icon: category.icon || '',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
