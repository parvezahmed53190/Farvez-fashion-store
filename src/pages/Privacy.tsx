import { motion } from 'motion/react';
import { Shield, Lock, Eye, Info, Mail, Phone } from 'lucide-react';

export function Privacy() {
  const effectiveDate = "March 03, 2026";

  return (
    <div className="min-h-screen bg-luxury-black py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold gold-text-gradient mb-4 tracking-tight">Privacy Policy</h1>
          <h2 className="text-2xl font-serif text-white/80 mb-6">গোপনীয়তা নীতি</h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-gray-400 font-light tracking-wide">Effective Date: {effectiveDate}</p>
          <p className="text-gray-400 font-light tracking-wide">কার্যকরী তারিখ: {effectiveDate}</p>
        </div>

        <div className="space-y-12">
          {/* 1. Introduction / পরিচিতি */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Info className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">1. Introduction / পরিচিতি</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
              <div>
                <p className="mb-4">Welcome to Farvez Fashion Store. We value your privacy and are committed to protecting your personal data. This policy explains how we handle your information when you visit our website or make a purchase.</p>
              </div>
              <div className="border-l border-white/5 pl-8">
                <p>ফারভেজ ফ্যাশন স্টোরে আপনাকে স্বাগতম। আমরা আপনার গোপনীয়তাকে মূল্য দিই এবং আপনার ব্যক্তিগত তথ্য সুরক্ষায় প্রতিশ্রুতিবদ্ধ। আপনি যখন আমাদের ওয়েবসাইট ভিজিট করেন বা কেনাকাটা করেন তখন আমরা কীভাবে আপনার তথ্য ব্যবহার করি তা এই নীতিতে ব্যাখ্যা করা হয়েছে।</p>
              </div>
            </div>
          </section>

          {/* 2. Information We Collect / আমরা কোন তথ্য সংগ্রহ করি */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Eye className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">2. Information We Collect / আমরা কোন তথ্য সংগ্রহ করি</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
              <div>
                <p className="font-bold text-white mb-2">We collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name and contact details (Email, Phone)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information</li>
                  <li>Device and browsing data</li>
                </ul>
              </div>
              <div className="border-l border-white/5 pl-8">
                <p className="font-bold text-white mb-2">আমরা সংগ্রহ করি:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>নাম এবং যোগাযোগের বিবরণ (ইমেল, ফোন)</li>
                  <li>শিপিং এবং বিলিং ঠিকানা</li>
                  <li>পেমেন্ট সংক্রান্ত তথ্য</li>
                  <li>ডিভাইস এবং ব্রাউজিং ডেটা</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. How We Use Your Information / আমরা তথ্য কীভাবে ব্যবহার করি */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Shield className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">3. How We Use Your Information / আমরা তথ্য কীভাবে ব্যবহার করি</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
              <div>
                <p className="font-bold text-white mb-2">Purpose:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>To process and deliver your orders</li>
                  <li>To communicate order updates</li>
                  <li>To improve our website and services</li>
                  <li>To send promotional offers (with your consent)</li>
                </ul>
              </div>
              <div className="border-l border-white/5 pl-8">
                <p className="font-bold text-white mb-2">উদ্দেশ্য:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>আপনার অর্ডার প্রসেস এবং ডেলিভারি করতে</li>
                  <li>অর্ডার আপডেট জানাতে</li>
                  <li>আমাদের ওয়েবসাইট এবং পরিষেবা উন্নত করতে</li>
                  <li>প্রোমোশনাল অফার পাঠাতে (আপনার সম্মতিতে)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Information Sharing / তথ্য শেয়ারিং */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Lock className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">4. Information Sharing / তথ্য শেয়ারিং</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
              <div>
                <p>We do not sell your data. We only share information with trusted partners (like delivery services and payment gateways) necessary to fulfill your order.</p>
              </div>
              <div className="border-l border-white/5 pl-8">
                <p>আমরা আপনার ডেটা বিক্রি করি না। আমরা শুধুমাত্র বিশ্বস্ত অংশীদারদের (যেমন ডেলিভারি সার্ভিস এবং পেমেন্ট গেটওয়ে) সাথে আপনার অর্ডার সম্পন্ন করার জন্য প্রয়োজনীয় তথ্য শেয়ার করি।</p>
              </div>
            </div>
          </section>

          {/* 5. Cookies / কুকিজ */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Eye className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">5. Cookies / কুকিজ</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
              <div>
                <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic.</p>
              </div>
              <div className="border-l border-white/5 pl-8">
                <p>আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে, আপনার পছন্দগুলো মনে রাখতে এবং সাইট ট্রাফিক বিশ্লেষণ করতে কুকিজ ব্যবহার করি।</p>
              </div>
            </div>
          </section>

          {/* 6. Data Security / তথ্য সুরক্ষা */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Lock className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">6. Data Security / তথ্য সুরক্ষা</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
              <div>
                <p>We implement industry-standard security measures to protect your personal information from unauthorized access or disclosure.</p>
              </div>
              <div className="border-l border-white/5 pl-8">
                <p>আমরা আপনার ব্যক্তিগত তথ্য অননুমোদিত অ্যাক্সেস বা প্রকাশ থেকে রক্ষা করার জন্য ইন্ডাস্ট্রি-স্ট্যান্ডার্ড নিরাপত্তা ব্যবস্থা গ্রহণ করি।</p>
              </div>
            </div>
          </section>

          {/* 7. Your Rights / আপনার অধিকার */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Shield className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">7. Your Rights / আপনার অধিকার</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
              <div>
                <p>You have the right to access, correct, or delete your personal information. You can also opt-out of marketing communications at any time.</p>
              </div>
              <div className="border-l border-white/5 pl-8">
                <p>আপনার ব্যক্তিগত তথ্য অ্যাক্সেস করার, সংশোধন করার বা মুছে ফেলার অধিকার আপনার রয়েছে। আপনি যেকোনো সময় মার্কেটিং যোগাযোগ বন্ধ করার অনুরোধ করতে পারেন।</p>
              </div>
            </div>
          </section>

          {/* 8. Changes to This Policy / নীতিতে পরিবর্তন */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Info className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">8. Changes to This Policy / নীতিতে পরিবর্তন</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
              <div>
                <p>We may update this policy from time to time. Any changes will be posted on this page with an updated effective date.</p>
              </div>
              <div className="border-l border-white/5 pl-8">
                <p>আমরা সময়ে সময়ে এই নীতি আপডেট করতে পারি। যেকোনো পরিবর্তন এই পৃষ্ঠায় আপডেট করা কার্যকরী তারিখ সহ পোস্ট করা হবে।</p>
              </div>
            </div>
          </section>

          {/* 9. Contact Us / যোগাযোগ করুন */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Mail className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">9. Contact Us / যোগাযোগ করুন</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
              <div className="space-y-4">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <div className="flex items-center space-x-3 text-white">
                  <Mail size={18} className="text-gold" />
                  <span>parvezahmed53190@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 text-white">
                  <Phone size={18} className="text-gold" />
                  <span>+880 193996944</span>
                </div>
              </div>
              <div className="border-l border-white/5 pl-8 space-y-4">
                <p>এই গোপনীয়তা নীতি সম্পর্কে আপনার যদি কোনো প্রশ্ন থাকে, তাহলে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:</p>
                <div className="flex items-center space-x-3 text-white">
                  <Mail size={18} className="text-gold" />
                  <span>parvezahmed53190@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 text-white">
                  <Phone size={18} className="text-gold" />
                  <span>+880 193996944</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm">Thank you for trusting Farvez Fashion Store with your personal information.</p>
          <p className="text-gray-500 text-sm mt-2">আপনার ব্যক্তিগত তথ্যের জন্য ফারভেজ ফ্যাশন স্টোরের ওপর আস্থা রাখার জন্য ধন্যবাদ।</p>
        </div>
      </motion.div>
    </div>
  );
}
