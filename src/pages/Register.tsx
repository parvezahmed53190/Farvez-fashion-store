import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full luxury-card p-10 space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm">Join the Farvez Fashion elite</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gold uppercase tracking-widest">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-luxury-black border border-white/10 pl-12 pr-4 py-4 focus:outline-none focus:border-gold transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gold uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-luxury-black border border-white/10 pl-12 pr-4 py-4 focus:outline-none focus:border-gold transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gold uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-luxury-black border border-white/10 pl-12 pr-4 py-4 focus:outline-none focus:border-gold transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full gold-gradient text-luxury-black font-bold py-4 rounded-sm hover:scale-[1.02] transition-transform flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="ml-2" size={18} />
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-gold hover:underline font-bold">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
}
