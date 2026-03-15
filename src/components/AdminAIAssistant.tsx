import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, ShieldCheck, Database, ShoppingBag, Users, Bell, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

interface AdminAIAssistantProps {
  stats?: any;
  products?: any[];
  orders?: any[];
  onRefresh?: () => void;
}

export function AdminAIAssistant({ stats, products, orders, onRefresh }: AdminAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string, text: string }[]>(() => {
    const saved = localStorage.getItem('admin_chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', text: 'Welcome to the Admin Command Center. I am your specialized AI Operations Assistant. How can I help you optimize Farvez Fashion Store today?' }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('admin_chat_history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleNotification = (event: any) => {
      const msg = event.detail.message;
      setMessages(prev => [...prev, { role: 'assistant', text: `🔔 System Notification: ${msg}` }]);
    };
    window.addEventListener('app-notification', handleNotification);
    return () => window.removeEventListener('app-notification', handleNotification);
  }, []);

  const tools: { functionDeclarations: FunctionDeclaration[] }[] = [
    {
      functionDeclarations: [
        {
          name: "updateProfile",
          description: "Update the admin's personal profile information (name, email, phone, address, photo).",
          parameters: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Full name of the admin" },
              email: { type: Type.STRING, description: "Email address" },
              phone: { type: Type.STRING, description: "Contact number" },
              address: { type: Type.STRING, description: "Store/Admin address" },
              photo: { type: Type.STRING, description: "Profile photo URL" }
            }
          }
        },
        {
          name: "addAddress",
          description: "Add a new customer/admin address to the database.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              customerName: { type: Type.STRING },
              address: { type: Type.STRING },
              city: { type: Type.STRING },
              zip: { type: Type.STRING },
              country: { type: Type.STRING },
              phone: { type: Type.STRING }
            },
            required: ["customerName", "address", "city", "zip", "phone"]
          }
        },
        {
          name: "deleteAddress",
          description: "Delete an address from the database by ID.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER, description: "The ID of the address to delete" }
            },
            required: ["id"]
          }
        },
        {
          name: "changePassword",
          description: "Securely change the admin password.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              currentPassword: { type: Type.STRING },
              newPassword: { type: Type.STRING }
            },
            required: ["currentPassword", "newPassword"]
          }
        },
        {
          name: "getLatestInfo",
          description: "Retrieve the latest profile and address information from the database.",
          parameters: { type: Type.OBJECT, properties: {} }
        },
        {
          name: "listProducts",
          description: "Get a list of all products in the store.",
          parameters: { type: Type.OBJECT, properties: {} }
        },
        {
          name: "getProductDetails",
          description: "Get full details for a specific product by its slug.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              slug: { type: Type.STRING, description: "The unique slug of the product" }
            },
            required: ["slug"]
          }
        },
        {
          name: "editProduct",
          description: "Update a product's information in the database.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER, description: "The ID of the product to edit" },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              price: { type: Type.NUMBER },
              discount_price: { type: Type.NUMBER },
              stock: { type: Type.NUMBER },
              sku: { type: Type.STRING },
              category_id: { type: Type.NUMBER },
              is_featured: { type: Type.BOOLEAN },
              is_trending: { type: Type.BOOLEAN }
            },
            required: ["id"]
          }
        },
        {
          name: "deleteProduct",
          description: "Permanently delete a product from the database.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER, description: "The ID of the product to delete" },
              name: { type: Type.STRING, description: "The name of the product (for confirmation message)" }
            },
            required: ["id"]
          }
        }
      ]
    }
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const context = {
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        recentRevenue: stats?.revenue || 0,
        pendingOrders: orders?.filter(o => o.status === 'Pending').length || 0,
        lowStockItems: products?.filter(p => p.stock < 5).length || 0
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          tools,
          systemInstruction: `You are the specialized Admin AI Operations Assistant for Farvez Fashion Store. 
Your role is to assist the administrator (Farvez Ahmed - Phone: +880 193996944, Email: parvezahmed53190@gmail.com, Address: Humaun Rashid cattar, Dakshin surma, Sylhet, 3100) in managing the store, personal info, addresses, and products efficiently.

Current Store Context:
- Total Products: ${context.totalProducts}
- Total Orders: ${context.totalOrders}
- Total Revenue: $${context.recentRevenue}
- Pending Orders: ${context.pendingOrders}
- Low Stock Items: ${context.lowStockItems}

Your Capabilities:
1. Personal Info: View/Edit name, email, phone, profile details.
2. Addresses: Add, edit, or delete addresses.
3. Password: Securely change password (requires current password).
4. Product Management:
   - View all products (list names, prices, stock).
   - View full product details (description, SKU, category, images).
   - Edit any product field (name, price, stock, etc.).
   - Delete products permanently (always ask for confirmation if not explicitly confirmed).
5. Order Management: Guide on status updates and inventory.

Tone & Language:
- Professional, efficient, and polite.
- Support both Bangla and English. Respond in the language used by the admin.
- Address the admin as "Sir" or "Farvez ভাই".
- Confirm every successful update with a clear message.

Example Confirmations:
- "Hi Farvez, your profile name has been updated to ‘Farvez Ahmed’ successfully."
- "Farvez ভাই, প্রোডাক্ট ‘Classic T-Shirt’ সফলভাবে ডিলিট হয়েছে।"

Rules:
- All updates MUST go to the database via function calls.
- Persist chat history.
- Notify admin of system events.
- When listing products, keep it concise unless details are asked for.`,
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls) {
        for (const call of functionCalls) {
          const { name, args } = call;
          const token = localStorage.getItem('token');
          let result;

          if (name === 'updateProfile') {
            const res = await fetch('/api/admin/profile', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                name: args.name,
                email: args.email,
                phone: args.phone,
                address: args.address,
                profile_photo: args.photo
              })
            });
            result = await res.json();
            if (onRefresh) onRefresh();
          } else if (name === 'addAddress') {
            const res = await fetch('/api/admin/addresses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                customer_name: args.customerName,
                address: args.address,
                city: args.city,
                zip: args.zip,
                country: args.country || 'Bangladesh',
                phone: args.phone
              })
            });
            result = await res.json();
            if (onRefresh) onRefresh();
          } else if (name === 'deleteAddress') {
            const res = await fetch(`/api/admin/addresses/${args.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            result = await res.json();
            if (onRefresh) onRefresh();
          } else if (name === 'changePassword') {
            const res = await fetch('/api/admin/password', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                currentPassword: args.currentPassword,
                newPassword: args.newPassword
              })
            });
            result = await res.json();
          } else if (name === 'getLatestInfo') {
            const res = await fetch('/api/auth/me', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const profile = await res.json();
            const addrRes = await fetch('/api/admin/addresses', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const addresses = await addrRes.json();
            result = { profile, addresses };
          } else if (name === 'listProducts') {
            const res = await fetch('/api/products');
            result = await res.json();
          } else if (name === 'getProductDetails') {
            const res = await fetch(`/api/products/${args.slug}`);
            result = await res.json();
          } else if (name === 'editProduct') {
            const res = await fetch(`/api/admin/products/${args.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(args)
            });
            result = await res.json();
            if (onRefresh) onRefresh();
          } else if (name === 'deleteProduct') {
            const res = await fetch(`/api/products/${args.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            result = await res.json();
            if (onRefresh) onRefresh();
          }

          // Send function response back to AI
          const followUp = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
              { role: 'user', parts: [{ text: input }] },
              { role: 'model', parts: [{ functionCall: { name, args } }] },
              { role: 'user', parts: [{ functionResponse: { name, response: result } }] }
            ],
            config: {
              systemInstruction: "You just performed a database operation or retrieved data. Present the information or confirm the result to the admin politely in their language. If listing products, use a clean list format."
            }
          });
          setMessages(prev => [...prev, { role: 'assistant', text: followUp.text || "Operation completed." }]);
        }
      } else {
        const aiText = response.text || "I encountered an error processing your request.";
        setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: "Operational link interrupted. Please verify your API configuration." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-emerald-600 text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform flex items-center space-x-2 border-2 border-white/20"
      >
        <ShieldCheck size={24} />
        <span className="font-bold text-sm hidden md:block">Admin AI</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-2rem)] h-[600px] bg-luxury-black border border-emerald-500/30 rounded-2xl z-50 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]"
          >
            <div className="p-4 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-500/10">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="text-emerald-500" size={20} />
                <span className="font-serif font-bold text-emerald-500">Ops Intelligence</span>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => setMessages([{ role: 'assistant', text: 'Chat history cleared.' }])} className="text-gray-500 hover:text-red-400 p-1">
                  <Trash2 size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="bg-emerald-500/5 p-2 flex justify-around border-b border-emerald-500/10">
              <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity cursor-help">
                <ShoppingBag size={14} className="text-emerald-500" />
                <span className="text-[8px] uppercase font-bold mt-1">Orders</span>
              </div>
              <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity cursor-help">
                <Database size={14} className="text-emerald-500" />
                <span className="text-[8px] uppercase font-bold mt-1">Stock</span>
              </div>
              <div className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity cursor-help">
                <Users size={14} className="text-emerald-500" />
                <span className="text-[8px] uppercase font-bold mt-1">Users</span>
              </div>
            </div>

            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user' 
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none' 
                      : m.text.startsWith('🔔') 
                        ? 'bg-gold/10 text-gold border border-gold/20 italic'
                        : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl space-x-1 flex">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-emerald-500/20 bg-emerald-500/5">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Query system data or update profile..."
                  className="flex-grow bg-luxury-black border border-emerald-500/20 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-emerald-500 text-gray-200"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-500 transition-colors shadow-lg"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
