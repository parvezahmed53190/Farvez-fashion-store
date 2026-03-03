export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELED = 'Canceled'
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  items?: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  shipping_address: string;
  phone: string;
  payment_method?: string;
  payment_status?: string;
}
