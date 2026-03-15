import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, CheckCircle } from 'lucide-react';

interface LogoutOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function LogoutOverlay({ isVisible, onComplete }: LogoutOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const duration = 3000;
      const interval = 10;
      const step = (interval / duration) * 100;
      
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(onComplete, 200);
            return 100;
          }
          return prev + step;
        });
      }, interval);

      return () => clearInterval(timer);
    } else {
      setProgress(0);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-luxury-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-panel border border-white/10 rounded-2xl p-8 shadow-2xl text-center overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 blur-[80px] rounded-full -z-10" />

            <div className="mb-6 relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto border border-gold/30"
              >
                <LogOut size={32} className="text-gold" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-1 right-[calc(50%-40px)] w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-luxury-black"
              >
                <CheckCircle size={16} className="text-white" />
              </motion.div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-white mb-2">Logging Out...</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              আপনি সফলভাবে লগআউট হয়েছেন। <br />
              ধন্যবাদ <span className="text-gold font-bold">Farvez Fashion Store</span> ব্যবহার করার জন্য।
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <span>Redirecting</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
