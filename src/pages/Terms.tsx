import { motion } from 'motion/react';
import { Shield, FileText, Scale, HelpCircle } from 'lucide-react';

export function Terms() {
  return (
    <div className="min-h-screen bg-luxury-black py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold gold-text-gradient mb-4 tracking-tight">Terms & Services</h1>
          <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-gray-400 font-light tracking-wide">Farvez Fashion Store – Style That Defines You</p>
        </div>

        <div className="space-y-12">
          {/* 1. Order Process */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <FileText className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">1. Order Process</h3>
            </div>
            <div className="text-gray-400 space-y-4 leading-relaxed">
              <p>By placing an order with Farvez Fashion Store, you agree to provide accurate and complete information. Our order process is designed for your convenience:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Select your desired premium products and add them to your cart.</li>
                <li>Proceed to checkout and provide valid shipping and contact details.</li>
                <li>Upon successful placement, you will receive an order confirmation via email or SMS.</li>
                <li>We reserve the right to cancel any order due to stock unavailability or pricing errors.</li>
              </ul>
            </div>
          </section>

          {/* 2. Payment */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Shield className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">2. Payment</h3>
            </div>
            <div className="text-gray-400 space-y-4 leading-relaxed">
              <p>We ensure secure and transparent transactions for our esteemed clients:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Accepted methods include Cash on Delivery (COD), bKash, Nagad, and major Debit/Credit Cards.</li>
                <li>All online payments are processed through secure, encrypted gateways.</li>
                <li>Full payment must be authorized before the dispatch of goods for non-COD orders.</li>
              </ul>
            </div>
          </section>

          {/* 3. Delivery */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Shield className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">3. Delivery</h3>
            </div>
            <div className="text-gray-400 space-y-4 leading-relaxed">
              <p>Our logistics partners are committed to delivering your fashion pieces with care:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Standard delivery within Dhaka takes 2–3 business days.</li>
                <li>Outside Dhaka, delivery typically takes 3–5 business days.</li>
                <li>Shipping charges are calculated at checkout based on location and order volume.</li>
                <li>Delivery timelines are estimates and may vary due to unforeseen circumstances.</li>
              </ul>
            </div>
          </section>

          {/* 4. Returns & Exchanges */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Scale className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">4. Returns & Exchanges</h3>
            </div>
            <div className="text-gray-400 space-y-4 leading-relaxed">
              <p>We stand by the quality of our products. If you are not entirely satisfied:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You may request a return or exchange within 3 days (72 hours) of receiving the product.</li>
                <li>Items must be unworn, unwashed, and in their original packaging with tags intact.</li>
                <li>Proof of purchase (Order ID) is required for all requests.</li>
              </ul>
            </div>
          </section>

          {/* 5. Liability */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <Scale className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">5. Liability</h3>
            </div>
            <div className="text-gray-400 space-y-4 leading-relaxed">
              <p>Farvez Fashion Store shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. We strive for excellence, but our total liability is limited to the amount paid for the specific product in question.</p>
            </div>
          </section>

          {/* 6. Customer Support */}
          <section className="luxury-card p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gold/10 rounded-full">
                <HelpCircle className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold">6. Customer Support</h3>
            </div>
            <div className="text-gray-400 space-y-4 leading-relaxed">
              <p>Our dedicated concierge team is here to assist you with any inquiries:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-white/5 rounded-sm">
                  <span className="text-gold font-bold block mb-1">Phone</span>
                  <span>+880 193996944</span>
                </div>
                <div className="p-4 bg-white/5 rounded-sm">
                  <span className="text-gold font-bold block mb-1">Email</span>
                  <span>parvezahmed53190@gmail.com</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-20 text-center">
          <blockquote className="text-xl md:text-2xl font-serif italic text-gold/80 leading-relaxed">
            “At Farvez Fashion Store, we don't just sell clothing; we curate a lifestyle of elegance, quality, and timeless style.”
          </blockquote>
        </div>
      </motion.div>
    </div>
  );
}
