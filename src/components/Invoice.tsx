import React from 'react';
import { Order } from '../types/order';
import { Package, MapPin, Phone, Mail, Globe, CreditCard } from 'lucide-react';

interface InvoiceProps {
  order: Order;
}

export const Invoice: React.FC<InvoiceProps> = ({ order }) => {
  const subtotal = order.total_amount; // Simplified for this example
  const tax = subtotal * 0.05; // 5% tax example
  const total = subtotal + tax;

  return (
    <div id={`invoice-${order.id}`} className="bg-white p-12 w-[800px] min-h-[1100px] font-sans" style={{ color: '#0A0A0A' }}>
      {/* Header */}
      <div className="flex justify-between items-start pb-10 mb-12" style={{ borderBottom: '8px solid #D4AF37' }}>
        <div className="flex items-center">
          <div className="w-16 h-16 flex items-center justify-center mr-6 rounded-sm shadow-lg" style={{ backgroundColor: '#0A0A0A' }}>
            <span className="text-3xl font-serif font-bold" style={{ color: '#D4AF37' }}>F</span>
          </div>
          <div>
            <h1 className="text-5xl font-serif font-bold tracking-tighter leading-none" style={{ color: '#0A0A0A' }}>FARVEZ</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] mt-1 font-bold" style={{ color: '#9CA3AF' }}>Haute Couture & Luxury</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-serif font-bold mb-1 uppercase tracking-widest" style={{ color: '#0A0A0A' }}>Invoice</h2>
          <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest mt-2" style={{ backgroundColor: '#D4AF37', color: '#0A0A0A' }}>
            Order #{order.id.toString().padStart(6, '0')}
          </div>
          <p className="text-[10px] mt-2 font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
            Date: {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4 pb-2" style={{ color: '#D4AF37', borderBottom: '1px solid #F3F4F6' }}>Billed To</h3>
          <div className="space-y-1">
            <p className="font-bold text-lg" style={{ color: '#0A0A0A' }}>{order.customer_name}</p>
            <p className="text-sm flex items-start" style={{ color: '#4B5563' }}>
              <MapPin size={14} className="mr-2 mt-1 flex-shrink-0" style={{ color: '#D4AF37' }} />
              {order.address || order.shipping_address}
            </p>
            <p className="text-sm flex items-center" style={{ color: '#4B5563' }}>
              <Mail size={14} className="mr-2" style={{ color: '#D4AF37' }} />
              {order.customer_email}
            </p>
            <p className="text-sm flex items-center" style={{ color: '#4B5563' }}>
              <Phone size={14} className="mr-2" style={{ color: '#D4AF37' }} />
              {order.phone}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4 pb-2" style={{ color: '#D4AF37', borderBottom: '1px solid #F3F4F6' }}>Company Info</h3>
          <div className="space-y-1 text-right">
            <p className="font-bold text-lg" style={{ color: '#0A0A0A' }}>FARVEZ FASHION LTD.</p>
            <p className="text-sm" style={{ color: '#4B5563' }}>123 Luxury Avenue, Fashion District</p>
            <p className="text-sm" style={{ color: '#4B5563' }}>Paris, France 75001</p>
            <p className="text-sm flex items-center justify-end" style={{ color: '#4B5563' }}>
              contact@farvez.com <Mail size={14} className="ml-2" style={{ color: '#D4AF37' }} />
            </p>
            <p className="text-sm flex items-center justify-end" style={{ color: '#4B5563' }}>
              www.farvez.com <Globe size={14} className="ml-2" style={{ color: '#D4AF37' }} />
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="uppercase text-[10px] tracking-widest" style={{ backgroundColor: '#0A0A0A', color: '#FFFFFF' }}>
              <th className="px-4 py-3 font-bold">Item Description</th>
              <th className="px-4 py-3 font-bold text-center">Qty</th>
              <th className="px-4 py-3 font-bold text-right">Price</th>
              <th className="px-4 py-3 font-bold text-right">Amount</th>
            </tr>
          </thead>
          <tbody style={{ borderTop: '1px solid #F3F4F6' }}>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <tr key={idx} className="text-sm" style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td className="px-4 py-4">
                    <p className="font-bold" style={{ color: '#0A0A0A' }}>{item.name}</p>
                    <p className="text-xs italic" style={{ color: '#9CA3AF' }}>
                      {item.variant ? 
                        (() => {
                          try {
                            const v = JSON.parse(item.variant);
                            return Object.entries(v)
                              .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
                              .join(' | ');
                          } catch (e) {
                            return item.variant;
                          }
                        })()
                        : 'Luxury Edition'}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center">{item.quantity}</td>
                  <td className="px-4 py-4 text-right">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr className="text-sm" style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td className="px-4 py-4">
                  <p className="font-bold" style={{ color: '#0A0A0A' }}>{order.product_name || 'Luxury Product'}</p>
                  <p className="text-xs italic" style={{ color: '#9CA3AF' }}>
                    Size: {order.size || 'N/A'} | Color: {order.color || 'N/A'}
                  </p>
                </td>
                <td className="px-4 py-4 text-center">1</td>
                <td className="px-4 py-4 text-right">${order.total_amount.toFixed(2)}</td>
                <td className="px-4 py-4 text-right font-bold">${order.total_amount.toFixed(2)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-24">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="uppercase tracking-widest" style={{ color: '#6B7280' }}>Subtotal</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="uppercase tracking-widest" style={{ color: '#6B7280' }}>Tax (5%)</span>
            <span className="font-bold">${tax.toFixed(2)}</span>
          </div>
          <div className="pt-3 flex justify-between items-center" style={{ borderTop: '2px solid #D4AF37' }}>
            <span className="text-lg font-serif font-bold uppercase tracking-widest">Total</span>
            <span className="text-2xl font-bold" style={{ color: '#0A0A0A' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 mt-auto" style={{ borderTop: '1px solid #F3F4F6' }}>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center" style={{ color: '#D4AF37' }}>
              <CreditCard size={12} className="mr-2" /> Payment Method
            </h4>
            <p className="text-xs uppercase font-bold" style={{ color: '#4B5563' }}>{order.payment_method || 'Cash on Delivery'}</p>
            <p className="text-[10px] mt-1 italic" style={{ color: '#9CA3AF' }}>Payment Status: {order.payment_status || 'Unpaid'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs italic" style={{ color: '#6B7280' }}>Thank you for choosing FARVEZ. We appreciate your business.</p>
            <p className="text-[10px] mt-2 uppercase tracking-widest" style={{ color: '#9CA3AF' }}>This is a computer generated invoice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
