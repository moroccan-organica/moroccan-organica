export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface AdminOrder {
    id: string;
    reference: string;
    createdAt: Date | string;
    status: OrderStatus;
    totalAmount: number;
    customer: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    shippingAddress: {
        country: string;
        city: string;
    } | null;
    itemsCount: number;
    items?: {
        id: string;
        name: string;
        variantName: string | null;
        quantity: number;
        price: number;
        image: string | null;
    }[];
}
