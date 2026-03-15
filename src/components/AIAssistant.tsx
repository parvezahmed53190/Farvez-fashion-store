import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'আসসালামু আলাইকুম! আমি ফারভেজ ফ্যাশন স্টোরের অফিসিয়াল এআই অ্যাসিস্ট্যান্ট। আপনাকে কীভাবে সাহায্য করতে পারি? \n\nHello! I am the official AI assistant of Farvez Fashion Store. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-assistant', handleOpen);
    return () => window.removeEventListener('open-ai-assistant', handleOpen);
  }, []);

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
        contents: [{ role: 'user', parts: [{ text: input }] }],
        config: {
          systemInstruction: `You are the official AI assistant of Farvez Fashion Store, a premium online fashion destination in Bangladesh. 

Owner & Founder Information:
- Owner Name: Farvez Ahmed (ফারভেজ আহমেদ)
- Phone: +880 193996944
- Email: parvezahmed53190@gmail.com
- Facebook: https://www.facebook.com/share/1MuvYSfBrP/
- Address: Humaun Rashid cattar, Dakshin surma, Sylhet, 3100

Store Philosophy:
Farvez Fashion Store focuses on quality, affordability, and customer satisfaction. We curate a lifestyle of elegance and timeless style.

Services & Policies:
- Delivery: All over Bangladesh. Inside Dhaka (2-3 days), Outside Dhaka (3-5 days).
- Payment: Cash on Delivery (COD), bKash, Nagad, and Cards.
- Returns: Request within 3 days (72 hours) of delivery. Items must be unworn with tags.

Your Personality:
- You are helpful, polite, and professional.
- You represent Farvez Ahmed's brand with excellence.
- You know everything about the store and its owner.
- Address customers warmly.
- Language: Respond in the language the customer uses (Bangla or English).

Guidelines:
- If a customer asks about the owner, speak highly of Farvez Ahmed.
- Help with product choices, sizes, and order processes.
- For specific order issues, guide them to contact support via phone or email.
- Always be positive and encouraging.`,
        }
      });

      const aiText = response.text || "I apologize, I am having trouble connecting to my fashion database. How else can I assist you?";
      setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm currently offline, but our style experts are always here to help!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 gold-gradient text-luxury-black p-4 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform flex items-center space-x-2"
      >
        <Sparkles size={24} />
        <span className="font-bold text-sm hidden md:block">Style AI</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-8 w-96 max-w-[calc(100vw-2rem)] h-[500px] glass-panel rounded-2xl z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gold/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-gold" size={20} />
                <span className="font-serif font-bold gold-text-gradient">Style Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-gold text-luxury-black font-medium' : 'bg-white/5 text-gray-200 border border-white/5'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl space-x-1 flex">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
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
                  placeholder="Ask about styling..."
                  className="flex-grow bg-luxury-black border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-gold"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 bg-gold text-luxury-black rounded-full hover:scale-105 transition-transform"
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
