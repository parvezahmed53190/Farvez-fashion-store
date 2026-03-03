import { motion } from 'motion/react';
import { RefreshCcw, CheckCircle, XCircle, Clock, Phone, Mail } from 'lucide-react';

export function Returns() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h2 className="text-gold font-serif italic mb-2 tracking-widest uppercase">Customer Care</h2>
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Returns & Exchanges</h1>
        <div className="w-24 h-1 gold-gradient mx-auto mb-4"></div>
        <p className="text-gold font-bold text-xl tracking-widest uppercase">3 Days Policy (72 Hours)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Bengali Version */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="luxury-card p-10 space-y-8"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-gold border-b border-white/5 pb-4">🇧🇩 বাংলা ভার্সন</h3>
            <p className="text-gray-300 leading-relaxed">
              আমরা আমাদের পণ্যের মান নিয়ে আত্মবিশ্বাসী। তবুও যদি কোনো কারণে আপনি সন্তুষ্ট না হন, তাহলে পণ্য পাওয়ার ৩ দিনের (৭২ ঘন্টা) মধ্যে আমাদের সাথে যোগাযোগ করে রিটার্ন বা এক্সচেঞ্জের আবেদন করতে পারবেন।
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <Phone size={18} className="text-gold" />
              <span>যোগাযোগের মাধ্যম:</span>
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>ফোন: 01934896944</li>
              <li>ইমেইল: parvezahmed53190@gmail.com</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white">📌 যোগাযোগের সময় অবশ্যই উল্লেখ করবেন:</h4>
            <ul className="space-y-2 text-gray-400 list-disc pl-5">
              <li>অর্ডার নাম্বার</li>
              <li>পণ্যের নাম</li>
              <li>সমস্যার সংক্ষিপ্ত বিবরণ</li>
              <li>প্রয়োজনে পণ্যের ছবি</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-emerald-500 flex items-center space-x-2">
                <CheckCircle size={18} />
                <span>গ্রহণযোগ্য হবে যদি:</span>
              </h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• ভুল পণ্য ডেলিভারি হয়</li>
                <li>• পণ্য ড্যামেজ বা ত্রুটিপূর্ণ হয়</li>
                <li>• সাইজ সমস্যা থাকে (স্টক থাকা সাপেক্ষে)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-red-500 flex items-center space-x-2">
                <XCircle size={18} />
                <span>গ্রহণযোগ্য হবে না যদি:</span>
              </h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• পণ্য ব্যবহৃত বা ধোয়া হয়</li>
                <li>• ট্যাগ/প্যাকেজিং নষ্ট হয়</li>
                <li>• ৩ দিনের পরে আবেদন করা হয়</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gold italic pt-4">অনুমোদনের পর ৩–৭ কার্যদিবসের মধ্যে রিফান্ড বা এক্সচেঞ্জ প্রসেস করা হবে।</p>
        </motion.div>

        {/* English Version */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="luxury-card p-10 space-y-8 border-gold/10"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-gold border-b border-white/5 pb-4">🇬🇧 English Version</h3>
            <p className="text-gray-300 leading-relaxed">
              We are confident about our product quality. However, if you are not satisfied, you may request a return or exchange within 3 days (72 hours) of receiving the product.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white flex items-center space-x-2">
              <Mail size={18} className="text-gold" />
              <span>Contact Method:</span>
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li>Phone: 01934896944</li>
              <li>Email: parvezahmed53190@gmail.com</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white">📌 While contacting, please provide:</h4>
            <ul className="space-y-2 text-gray-400 list-disc pl-5">
              <li>Order Number</li>
              <li>Product Name</li>
              <li>Brief description of the issue</li>
              <li>Product photo (if necessary)</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-emerald-500 flex items-center space-x-2">
                <CheckCircle size={18} />
                <span>Eligible if:</span>
              </h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• Wrong item delivered</li>
                <li>• Damaged or defective product</li>
                <li>• Size issue (subject to stock)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-red-500 flex items-center space-x-2">
                <XCircle size={18} />
                <span>Not eligible if:</span>
              </h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• Product is used or washed</li>
                <li>• Tags/packaging damaged</li>
                <li>• Request made after 3 days</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gold italic pt-4">After approval, refunds or exchanges will be processed within 3–7 working days.</p>
        </motion.div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center space-x-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full">
          <Clock className="text-gold" size={24} />
          <span className="text-lg font-bold">Need help? Our support is available 24/7.</span>
        </div>
      </div>
    </div>
  );
}
