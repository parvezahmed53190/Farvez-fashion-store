import { motion } from 'motion/react';
import { Mail, Phone, Facebook, MapPin, User } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h2 className="text-gold font-serif italic mb-2 tracking-widest uppercase">Our Story</h2>
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">About Us</h1>
        <div className="w-24 h-1 gold-gradient mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-gold">🇧🇩 বাংলা ভার্সন</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Farvez Fashion Store একটি আধুনিক ও বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম, যেখানে আপনি পাবেন ট্রেন্ডি, প্রিমিয়াম ও মানসম্পন্ন ফ্যাশন পণ্য।
            </p>
            <div className="space-y-2">
              <p className="font-bold text-white">আমাদের লক্ষ্য হলো—</p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <span className="text-gold">✨</span> <span>স্টাইলিশ ও কোয়ালিটি পণ্য সবার জন্য সহজলভ্য করা</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gold">✨</span> <span>সাশ্রয়ী দামে সেরা ফ্যাশন সরবরাহ করা</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gold">✨</span> <span>গ্রাহকের সন্তুষ্টিকে সর্বোচ্চ অগ্রাধিকার দেওয়া</span>
                </li>
              </ul>
            </div>
            <p className="text-gray-400">
              আমরা প্রতিটি পণ্য কোয়ালিটি চেক করে সরবরাহ করি, যাতে আপনি পান সেরা অভিজ্ঞতা। Farvez Fashion Store শুধু একটি শপ নয়, এটি আপনার ব্যক্তিত্ব ও স্টাইল প্রকাশের একটি মাধ্যম।
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8 border-l border-white/5 pl-8"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-gold">🇬🇧 English Version</h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Farvez Fashion Store is a modern and trusted online shopping platform offering trendy, premium, and high-quality fashion products.
            </p>
            <div className="space-y-2">
              <p className="font-bold text-white">Our mission is to:</p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <span className="text-gold">✨</span> <span>Make stylish and quality fashion accessible to everyone</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gold">✨</span> <span>Provide the best fashion at affordable prices</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gold">✨</span> <span>Ensure maximum customer satisfaction</span>
                </li>
              </ul>
            </div>
            <p className="text-gray-400">
              Every product goes through a quality check process to guarantee the best experience for our customers. Farvez Fashion Store is not just a shop — it’s a platform that defines your personality and style.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="luxury-card p-12 bg-gold/5 border-gold/20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-serif font-bold mb-2">Contact Information</h3>
          <p className="text-gray-400">Get in touch with the owner</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Owner</p>
              <p className="font-bold">Farvez Ahmed</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Mobile</p>
              <p className="font-bold">01934896944</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Email</p>
              <p className="font-bold">parvezahmed53190@gmail.com</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
              <Facebook size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Facebook</p>
              <a href="https://www.facebook.com/share/1MuvYSfBrP/" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-gold transition-colors">Visit Profile</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
