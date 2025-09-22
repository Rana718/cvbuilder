"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/components/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Hero from "@/components/landing/Hero";
import Feature from "@/components/landing/Feature";
import Guide from "@/components/landing/Guide";
import Pricing from "@/components/landing/Pricing";
import Templates from "@/components/landing/Templates";
import Reviews from "@/components/landing/Reviews";
import faqs from "@/constants/Faqs";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <Navbar />

      <Hero/>
      <Feature/>
      <Guide/>
      <Pricing/>
      <Templates/>
      <Reviews/>
      

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about our ResumeAI
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-slate-50 rounded-xl px-6 border-0">
                  <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-slate-600 mb-4">Still have questions?</p>
            <a
              href="mailto:arhaanresumeai@gmail.com"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Mail className="h-5 w-5" />
              <span>Contact our support team</span>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Payment Card Modal */}
      {/* <PaymentCard
        isOpen={showPaymentCard}
        onClose={() => setShowPaymentCard(false)}
        onSuccess={handlePaymentSuccess}
      /> */}
    </div>
  );
}