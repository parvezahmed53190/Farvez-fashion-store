import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export function Toaster() {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const handleNotification = (event: any) => {
      setNotification(event.detail.message);
      setTimeout(() => setNotification(null), 3000);
    };

    window.addEventListener('cart-notification', handleNotification);
    window.addEventListener('app-notification', handleNotification);
    return () => {
      window.removeEventListener('cart-notification', handleNotification);
      window.removeEventListener('app-notification', handleNotification);
    };
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-8 left-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3"
        >
          <CheckCircle size={20} />
          <span className="font-bold text-sm">{notification}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
