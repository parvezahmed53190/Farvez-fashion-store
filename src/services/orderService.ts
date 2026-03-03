import { Order, OrderStatus } from '../types/order';

const ORDERS_KEY = 'farvez_orders';

export function getOrders(): Order[] {
  const ordersJson = localStorage.getItem(ORDERS_KEY);
  return ordersJson ? JSON.parse(ordersJson) : [];
}

export function getOrdersByUserId(userId: string): Order[] {
  const orders = getOrders();
  return orders.filter(order => order.user_id === userId);
}

export function createOrder(order: Omit<Order, 'id' | 'status' | 'created_at'>): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: OrderStatus.PENDING,
    created_at: new Date().toISOString()
  } as Order;
  
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const orders = getOrders();
  const index = orders.findIndex(order => order.id === orderId);
  
  if (index !== -1) {
    orders[index].status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return orders[index];
  }
  
  return null;
}

export function getOrderStats() {
  const orders = getOrders();
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
    confirmed: orders.filter(o => o.status === OrderStatus.CONFIRMED).length,
    processing: orders.filter(o => o.status === OrderStatus.PROCESSING).length,
    shipped: orders.filter(o => o.status === OrderStatus.SHIPPED).length,
    delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    canceled: orders.filter(o => o.status === OrderStatus.CANCELED).length,
    totalRevenue: orders.reduce((sum, o) => o.status !== OrderStatus.CANCELED ? sum + o.total_amount : sum, 0)
  };
}
