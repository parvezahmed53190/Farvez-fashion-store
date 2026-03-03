import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h2 className="text-gold font-serif italic mb-2 tracking-widest uppercase">Get in Touch</h2>
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Contact Us</h1>
        <div className="w-24 h-1 gold-gradient mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Information */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold text-gold">Contact Information</h3>
            <p className="text-gray-400 leading-relaxed">
              Have a question or feedback? We'd love to hear from you. Fill out the form or use our contact details below.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Call Us</p>
                <p className="text-lg font-bold">+8801934896944</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Email Us</p>
                <p className="text-lg font-bold">parvezahmed53190@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Visit Us</p>
                <p className="text-lg font-bold">123 Fashion Street, Luxury District, Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-white uppercase tracking-widest text-sm">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1MuvYSfBrP/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-gold hover:text-luxury-black transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-gold hover:text-luxury-black transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-gold hover:text-luxury-black transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="luxury-card p-8 md:p-12"
        >
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                <Send size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-400">Thank you for reaching out. We will get back to you as soon as possible.</p>
              </div>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-gold font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:border-gold outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:border-gold outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:border-gold outline-none transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                <textarea 
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:border-gold outline-none transition-colors resize-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full gold-gradient text-luxury-black font-bold py-4 rounded-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-luxury-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
