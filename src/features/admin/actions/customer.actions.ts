'use server';

import { supabase } from '@/lib/supabase/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
    return session;
}

export interface GetCustomersOptions {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
}

export async function getCustomers(options: GetCustomersOptions = {}) {
    await checkAdmin();

    const { page = 1, limit = 20, search = '', startDate, endDate } = options;

    try {
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

        const formattedCustomers = (customers || []).map((c: any) => ({
            ...c,
            _count: {
                orders: c.orders?.[0]?.count || 0
            }
        }));

        return {
            customers: formattedCustomers,
            pagination: {
                total: total || 0,
                page,
                limit,
                totalPages: Math.ceil((total || 0) / limit),
            },
        };
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw new Error('Failed to fetch customers');
    }
}
