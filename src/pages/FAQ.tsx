import { motion } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    questionBn: "১️⃣ কিভাবে অর্ডার করবো?",
    questionEn: "1️⃣ How can I place an order?",
    answerBn: "👉 আপনার পছন্দের প্রোডাক্ট সিলেক্ট করুন → “Add to Cart” বাটনে ক্লিক করুন → Checkout পেজে গিয়ে তথ্য পূরণ করে অর্ডার কনফার্ম করুন।",
    answerEn: "👉 Select your desired product → Click “Add to Cart” → Go to Checkout → Fill in your details → Confirm your order."
  },
  {
    questionBn: "২️⃣ পেমেন্ট কিভাবে করবো?",
    questionEn: "2️⃣ What payment methods do you accept?",
    answerBn: "আমরা নিচের পেমেন্ট গ্রহণ করি:\n• Cash on Delivery\n• bKash\n• Nagad\n• Debit/Credit Card",
    answerEn: "We accept the following payment methods:\n• Cash on Delivery\n• bKash\n• Nagad\n• Debit/Credit Card"
  },
  {
    questionBn: "৩️⃣ ডেলিভারি কতদিনে পাবো?",
    questionEn: "3️⃣ How long does delivery take?",
    answerBn: "📍 ঢাকার ভিতরে: ২–৩ কার্যদিবস\n📍 ঢাকার বাইরে: ৩–৫ কার্যদিবস",
    answerEn: "📍 Inside Dhaka: 2–3 working days\n📍 Outside Dhaka: 3–5 working days"
  },
  {
    questionBn: "৪️⃣ ডেলিভারি চার্জ কত?",
    questionEn: "4️⃣ What is the delivery charge?",
    answerBn: "ঢাকার ভিতরে: ৬০ টাকা\nঢাকার বাইরে: ১২০ টাকা\n\n(অফার চলাকালীন ফ্রি ডেলিভারি থাকতে পারে)",
    answerEn: "Inside Dhaka: 60 BDT\nOutside Dhaka: 120 BDT\n\n(Free delivery may be available during special offers.)"
  },
  {
    questionBn: "৫️⃣ রিটার্ন বা এক্সচেঞ্জ করা যাবে?",
    questionEn: "5️⃣ Do you offer returns or exchanges?",
    answerBn: "হ্যাঁ, পণ্য পাওয়ার ৭ দিনের মধ্যে রিটার্ন/এক্সচেঞ্জ করা যাবে।\n\nশর্ত:\n• পণ্য অবশ্যই অব্যবহৃত থাকতে হবে\n• ট্যাগ ও প্যাকেজিং অক্ষত থাকতে হবে",
    answerEn: "Yes, returns/exchanges are available within 7 days of receiving the product.\n\nConditions:\n• The product must be unused\n• Tags & packaging must be intact"
  },
  {
    questionBn: "৬️⃣ অর্ডার ট্র্যাক কিভাবে করবো?",
    questionEn: "6️⃣ How can I track my order?",
    answerBn: "অর্ডার কনফার্ম হওয়ার পর SMS বা ইমেইলে ট্র্যাকিং তথ্য পাঠানো হবে।",
    answerEn: "After order confirmation, tracking details will be sent via SMS or email."
  },
  {
    questionBn: "৭️⃣ কাস্টমার সাপোর্ট কিভাবে পাবো?",
    questionEn: "7️⃣ How can I contact customer support?",
    answerBn: "📞 Mobile: 01934896944\n🌐 Facebook: https://www.facebook.com/share/1MuvYSfBrP/\n📧 Email: parvezahmed53190@gmail.com",
    answerEn: "📞 Mobile: 01934896944\n🌐 Facebook: https://www.facebook.com/share/1MuvYSfBrP/\n📧 Email: parvezahmed53190@gmail.com"
  },
  {
    questionBn: "৮️⃣ প্রোডাক্ট অরিজিনাল কি?",
    questionEn: "8️⃣ Are your products original?",
    answerBn: "হ্যাঁ, আমরা ১০০% অরিজিনাল ও কোয়ালিটি চেকড পণ্য সরবরাহ করি।",
    answerEn: "Yes, we provide 100% original and quality-checked products."
  }
];

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-gold font-serif italic mb-2 tracking-widest uppercase">Support Center</h2>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-400 mb-8">Everything you need to know about shopping at Farvez Fashion Store.</p>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => setLang('bn')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${lang === 'bn' ? 'gold-gradient text-luxury-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            বাংলা
          </button>
          <button 
            onClick={() => setLang('en')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${lang === 'en' ? 'gold-gradient text-luxury-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            English
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="luxury-card overflow-hidden">
            <button
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-bold text-lg pr-8">
                {lang === 'bn' ? faq.questionBn : faq.questionEn}
              </span>
              <ChevronDown 
                className={`text-gold transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} 
                size={20} 
              />
            </button>
            <motion.div
              initial={false}
              animate={{ height: activeIndex === index ? 'auto' : 0 }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-8 text-gray-400 whitespace-pre-line leading-relaxed border-t border-white/5 pt-6">
                {lang === 'bn' ? faq.answerBn : faq.answerEn}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="mt-24 luxury-card p-12 text-center bg-gold/5 border-gold/20">
        <HelpCircle className="mx-auto text-gold mb-6" size={48} />
        <h3 className="text-2xl font-serif font-bold mb-4">Still have questions?</h3>
        <p className="text-gray-400 mb-8">If you cannot find the answer to your question in our FAQ, you can always contact us. We will answer you shortly!</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a href="mailto:parvezahmed53190@gmail.com" className="gold-gradient text-luxury-black px-8 py-3 font-bold rounded-sm">
            Email Us
          </a>
          <a href="tel:01934896944" className="border border-gold text-gold px-8 py-3 font-bold rounded-sm hover:bg-gold hover:text-luxury-black transition-all">
            Call Support
          </a>
        </div>
      </div>
    </div>
  );
}
