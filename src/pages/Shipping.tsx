import { motion } from 'motion/react';
import { Truck, MapPin, Clock, ShieldCheck, CreditCard } from 'lucide-react';

export function Shipping() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <h2 className="text-gold font-serif italic mb-2 tracking-widest uppercase">Logistics</h2>
        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Shipping Information</h1>
        <div className="w-24 h-1 gold-gradient mx-auto mb-4"></div>
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
              Farvez Fashion Store-এ আমরা আপনার অর্ডার করা পণ্য দ্রুত এবং নিরাপদে পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ। আমরা সারা বাংলাদেশে হোম ডেলিভারি প্রদান করি।
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="text-gold mt-1"><MapPin size={20} /></div>
              <div>
                <h4 className="font-bold text-white">ডেলিভারি এলাকা ও চার্জ:</h4>
                <ul className="mt-2 space-y-1 text-gray-400">
                  <li>• ঢাকার ভিতরে: ৬০ টাকা</li>
                  <li>• ঢাকার বাইরে: ১২০ টাকা</li>
                  <li className="text-xs italic text-gold mt-1">(বিশেষ অফার চলাকালীন ফ্রি ডেলিভারি প্রযোজ্য হতে পারে)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-gold mt-1"><Clock size={20} /></div>
              <div>
                <h4 className="font-bold text-white">ডেলিভারি সময়:</h4>
                <ul className="mt-2 space-y-1 text-gray-400">
                  <li>• ঢাকার ভিতরে: ২–৩ কার্যদিবস</li>
                  <li>• ঢাকার বাইরে: ৩–৫ কার্যদিবস</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-gold mt-1"><ShieldCheck size={20} /></div>
              <div>
                <h4 className="font-bold text-white">প্যাকেজিং ও নিরাপত্তা:</h4>
                <p className="mt-2 text-gray-400 text-sm">
                  আমরা প্রতিটি পণ্য প্রিমিয়াম প্যাকেজিং-এ সরবরাহ করি যাতে পণ্যটি আপনার কাছে অক্ষত অবস্থায় পৌঁছায়।
                </p>
              </div>
            </div>
          </div>
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
              At Farvez Fashion Store, we are committed to delivering your ordered products quickly and safely. We provide home delivery services all across Bangladesh.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="text-gold mt-1"><MapPin size={20} /></div>
              <div>
                <h4 className="font-bold text-white">Delivery Areas & Charges:</h4>
                <ul className="mt-2 space-y-1 text-gray-400">
                  <li>• Inside Dhaka: 60 BDT</li>
                  <li>• Outside Dhaka: 120 BDT</li>
                  <li className="text-xs italic text-gold mt-1">(Free delivery may apply during special offers)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-gold mt-1"><Clock size={20} /></div>
              <div>
                <h4 className="font-bold text-white">Delivery Time:</h4>
                <ul className="mt-2 space-y-1 text-gray-400">
                  <li>• Inside Dhaka: 2–3 working days</li>
                  <li>• Outside Dhaka: 3–5 working days</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-gold mt-1"><ShieldCheck size={20} /></div>
              <div>
                <h4 className="font-bold text-white">Packaging & Safety:</h4>
                <p className="mt-2 text-gray-400 text-sm">
                  We supply every product in premium packaging to ensure the product reaches you in perfect condition.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="luxury-card p-8 text-center">
          <Truck className="mx-auto text-gold mb-4" size={32} />
          <h4 className="font-bold mb-2">Fast Delivery</h4>
          <p className="text-xs text-gray-400">Quick processing and dispatch for all orders.</p>
        </div>
        <div className="luxury-card p-8 text-center">
          <CreditCard className="mx-auto text-gold mb-4" size={32} />
          <h4 className="font-bold mb-2">Secure Payment</h4>
          <p className="text-xs text-gray-400">Multiple secure payment options available.</p>
        </div>
        <div className="luxury-card p-8 text-center">
          <ShieldCheck className="mx-auto text-gold mb-4" size={32} />
          <h4 className="font-bold mb-2">Quality Guarantee</h4>
          <p className="text-xs text-gray-400">100% original and quality-checked products.</p>
        </div>
      </div>
    </div>
  );
}
