import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';

        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let query = supabase
            .from('Customer')
            .select('*, orders:Order(count), addresses:Address(*)', { count: 'exact' });

        if (search) {
            const searchPattern = `%${search}%`;
            query = query.or(`email.ilike.${searchPattern},firstName.ilike.${searchPattern},lastName.ilike.${searchPattern},phone.ilike.${searchPattern}`);
        }

        if (startDate) {
            query = query.gte('createdAt', startDate);
        }
        if (endDate) {
            const end = new Date(new Date(endDate).setHours(23, 59, 59, 999)).toISOString();
            query = query.lte('createdAt', end);
        }

        const { data: customers, count: total, error } = await query
            .order('createdAt', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);

        if (error) throw error;

        // Reformat customers to match expected structure if needed (Prisma _count -> Supabase alias)
        const formattedCustomers = (customers || []).map((c: any) => ({
            ...c,
            _count: {
                orders: c.orders?.[0]?.count || 0
            }
        }));

        return NextResponse.json({
            customers: formattedCustomers,
            pagination: {
                total: total || 0,
                page,
                limit,
                totalPages: Math.ceil((total || 0) / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch customers' },
            { status: 500 }
        );
    }
}
