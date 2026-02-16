'use server';

import { supabase } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { BlogCategory } from '@/types/blog';

// ============================================
// HELPERS
// ============================================

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
    return session;
}

// ============================================
// PUBLIC SERVER ACTIONS FOR BLOG CATEGORIES
// ============================================

/**
 * Get all blog categories (with optional counts)
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
    try {
        const { data: categories, error } = await supabase
            .from('BlogCategory')
            .select('*, posts:BlogPost(count)')
            .order('sortOrder', { ascending: true });

        if (error) throw error;

        return (categories || []).map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            color: cat.color || '#606C38',
            icon: cat.icon || '',
            postCount: cat.posts?.[0]?.count || 0,
        }));
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

/**
 * Create a blog category (ADMIN ONLY)
 */
export async function createBlogCategory(input: any) {
    await checkAdmin();

    try {
        const { name, description, color, icon } = input;
        const slug = generateSlug(name);

        const { data, error } = await supabase
            .from('BlogCategory')
            .insert({
                name,
                description: description || null,
                color: color || '#606C38',
                icon: icon || null,
                slug,
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/[lang]/admin/blog');
        return { success: true, data };
    } catch (error: any) {
        console.error('Error creating category:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Delete a blog category (ADMIN ONLY)
 */
export async function deleteBlogCategory(categoryId: string) {
    await checkAdmin();

    try {
        // Check for associated posts first
        const { count, error: countError } = await supabase
            .from('BlogPost')
            .select('*', { count: 'exact', head: true })
            .eq('categoryId', categoryId);

        if (countError) throw countError;

        if (count && count > 0) {
            return { success: false, error: 'Cannot delete category with associated posts' };
        }

        const { error } = await supabase.from('BlogCategory').delete().eq('id', categoryId);
        if (error) throw error;

        revalidatePath('/[lang]/admin/blog');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting category:', error);
        return { success: false, error: error.message };
    }
}
