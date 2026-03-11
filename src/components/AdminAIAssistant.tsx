import { useState, useRef, useEffect } from 'react';
import { Send, X, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export function AdminAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'আসসালামু আলাইকুম অ্যাডমিন! আমি ফারভেজ ফ্যাশন স্টোর অ্যাডমিন প্যানেলের স্মার্ট এআই অ্যাসিস্ট্যান্ট। আমি আপনাকে কাস্টমার অ্যাকাউন্ট, অর্ডার ম্যানেজমেন্ট, অ্যাড্রেস এবং প্রোফাইল সেটিংস পরিচালনায় সাহায্য করতে পারি। \n\nHello Admin! I am the smart AI assistant for the Farvez Fashion Store admin panel. I can help you manage customer accounts, orders, addresses, and profile settings.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: `You are the smart AI assistant for "Farvez Fashion Store" admin panel. 
Your role is to manage customer accounts, orders, addresses, and profile settings. 
You must provide accurate and actionable guidance for all admin tasks.

Requirements:

1. Order Management:
   - Display all orders with details: Order #, Date, Customer Name, Items, Total, Status.
   - Allow changing the order status (Pending, Shipped, Delivered, Cancelled) from the admin panel.
   - Ensure that status updates are saved to the database and reflected in the frontend immediately.
   - Provide confirmation messages when the status is updated.

2. Profile Management:
   - Show admin profile settings and allow updates for name, email, and contact info.
   - Ensure updates are saved and visible instantly.
   - Admin Profile Details:
     - Name: Farvez Ahmed
     - Email: parvezahmed53190@gmail.com
     - Mobile: 01934896944
     - Role: Store Owner & Administrator

3. Saved Addresses:
   - List all saved addresses of customers.
   - Allow adding, editing, and deleting addresses.

4. Navigation:
   - Guide the admin on how to return to the main store using the "Back to Store" button in the sidebar or the back arrow on mobile.

5. Multi-language Support:
   - Understand and respond in Bangla and English accurately.
   - Provide instructions in the language requested by the admin.

5. Troubleshooting:
   - Detect if any feature (like Order Status change) fails.
   - Suggest exact steps or code fixes (both frontend and backend) to resolve issues.
   - Check permissions, API endpoints, database queries, and console errors.
   
Behavior:
- Always respond in a step-by-step actionable way.
- Provide code snippets if necessary for fixing issues.
- Ensure the AI knows all admin functionalities and how to execute them perfectly.
- Always identify yourself as the Smart Admin AI for Farvez Fashion Store.`,
        }
      });

      const aiText = response.text || "I apologize, I am having trouble connecting to the admin systems. Please try again or contact technical support.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm currently unable to process your request. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-emerald-600 text-white p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform flex items-center space-x-2"
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
            className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-2rem)] h-[500px] bg-luxury-gray border border-white/10 rounded-2xl z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-emerald-600/10">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="text-emerald-500" size={20} />
                <span className="font-serif font-bold text-emerald-500">Admin Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white font-medium' : 'bg-white/5 text-gray-200 border border-white/5'}`}>
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

            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about admin tasks..."
                  className="flex-grow bg-luxury-black border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 bg-emerald-600 text-white rounded-full hover:scale-105 transition-transform"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
