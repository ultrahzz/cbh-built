import Link from "next/link";
import Button from "./components/Button";
import StatCard from "./components/StatCard";
import Footer from "./components/Footer";
import TestimonialCard from "./components/TestimonialCard";
import TestimonialCarousel from "./components/TestimonialCarousel";
import FamilyPhoto from "./components/FamilyPhoto";
import MobileMenu from "./components/MobileMenu";
import ExitIntentPopup from "./components/ExitIntentPopup";
import EmailSignupPopup from "./components/EmailSignupPopup";

// Static counters (update these values manually as needed)
const HATS_PRODUCED = 15624;
const CUSTOMERS_SERVED = 301;
const ORDERS_PLACED = 976;

// Icons for stat cards
function HatIcon() {
  return (
    <svg className="w-7 h-7 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function CustomerIcon() {
  return (
    <svg className="w-7 h-7 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg className="w-7 h-7 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

// Google Reviews - Add photos to /public/reviews/ folder
const testimonials = [
  {
    name: "Lilly L.",
    photo: "/reviews/lilly-l.jpg",
    quote: "I ordered a large batch of personalized hats for my wedding, and they absolutely nailed it. Each hat turned out perfectly—exactly what I had envisioned. The quality was great, and the pricing was more than fair!",
    rating: 5,
  },
  {
    name: "Izzy V.",
    photo: "/reviews/izzy-v.webp",
    quote: "Top notch business and I couldn't be happier with our hats! Great selection to choose from and found the perfect fit. Customer service was professional and friendly to work with. Already working on another project with them. Highly recommend!",
    rating: 5,
  },
  {
    name: "Zach D.",
    photo: "/reviews/zach-d.jpg",
    quote: "Stephen and his team are the absolute best! I got some hats to him and his turn around time was insane! Over all great experience and will be using them again and again.",
    rating: 5,
  },
  {
    name: "Angela B.",
    photo: "/reviews/angela-b.jpg",
    quote: "Absolutely blown away by the quality! The embroidery is crisp, clean, and exactly what we wanted. Our whole team loves wearing these hats. Will definitely be ordering more!",
    rating: 5,
  },
  {
    name: "Emily H.",
    photo: "/reviews/emily-h.jpg",
    quote: "These hats exceeded all my expectations. The colors are vibrant, the stitching is perfect, and they arrived faster than promised. Best custom hat company I've ever worked with!",
    rating: 5,
  },
  {
    name: "Mike S.",
    photo: "/reviews/mike-s.jpg",
    quote: "From start to finish, the experience was seamless. Great communication, fair pricing, and the final product is outstanding. Our customers constantly ask where we got these hats!",
    rating: 5,
  },
  {
    name: "Fuzz R.",
    photo: "/reviews/fuzz-r.jpg",
    quote: "I've ordered from several custom hat companies before, and Custom Business Hats is hands down the best. Premium quality at an unbeatable price. 10/10 recommend!",
    rating: 5,
  },
  {
    name: "Colleen G.",
    photo: "/reviews/colleen-g.jpg",
    quote: "The attention to detail is incredible. Every hat in our order was perfect - no loose threads, no color issues, just flawless embroidery. This is our go-to hat supplier now!",
    rating: 5,
  },
];

// FAQ data
const faqs = [
  {
    question: "What is the minimum order quantity?",
    answer: "There's no minimum! You can order as few as 1 hat. However, we offer volume discounts starting at 12 hats, with bigger savings at 24, 48, 96, and 188+ hats.",
  },
  {
    question: "How long does production take?",
    answer: "Standard turnaround is 10-15 business days after artwork approval. Rush orders are available for an additional fee.",
  },
  {
    question: "What file formats do you accept for logos?",
    answer: "We accept JPG, PNG, SVG, and PDF files. Vector files (SVG, PDF) work best for embroidery. We'll send a proof before production.",
  },
  {
    question: "Do you offer free shipping?",
    answer: "Yes! Orders of 24+ hats qualify for free standard shipping. Orders under 24 hats ship for a flat rate.",
  },
  {
    question: "What's the difference between standard and 3D puff embroidery?",
    answer: "Standard embroidery is flat and works great for detailed logos. 3D puff embroidery adds raised, textured dimension to your design for a premium look.",
  },
  {
    question: "Can I see a proof before you start?",
    answer: "Absolutely! We send a digital proof for approval before any production begins. You can request changes at no extra charge.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Popups */}
      <ExitIntentPopup />
      <EmailSignupPopup />

      {/* Trust Bar - Static */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Free Shipping on 24+ Hats</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/30" />
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>100% Satisfaction Guarantee</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/30" />
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Fast Turnaround</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/30" />
            <div className="hidden md:flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>No Minimum Order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation - Logo left, Nav center, Start Your Order right */}
      <nav className="sticky top-0 z-50 bg-primary shadow-lg relative">
        <div className="px-2 sm:px-4 py-px">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex items-center">
              <img 
                src="/cbh-logo-dark.png.jpg" 
                alt="Custom Business Hats Logo - Premium Embroidered Hats" 
                className="h-16 sm:h-20 object-contain"
              />
            </div>
            
            {/* Nav Links - Center (Desktop) */}
            <div className="hidden md:flex items-center gap-12 text-xl font-semibold absolute left-1/2 -translate-x-1/2">
              <a 
                href="#about" 
                className="text-white/90 hover:text-pink transition-colors"
              >
                About Us
              </a>
              <a 
                href="#faq" 
                className="text-white/90 hover:text-pink transition-colors"
              >
                FAQ
              </a>
              <a 
                href="/reorder" 
                className="text-white/90 hover:text-pink transition-colors"
              >
                Customer Login
              </a>
            </div>
            
            {/* Right side - Order button + Mobile menu */}
            <div className="flex items-center gap-2">
              {/* Start Your Order Button */}
              <a
                href="/order/hats"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold transition-colors text-xs sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Start Your Order</span>
                <span className="sm:hidden">Order</span>
              </a>
              
              {/* Mobile Menu */}
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-royal/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-royal/20 to-magenta/10 rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/90">Trusted by 300+ businesses</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Professional Custom Hats{" "}
              <span className="bg-gradient-to-r from-pink to-magenta bg-clip-text text-transparent">
                Your Team Will Actually Wear
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Premium embroidered hats from Richardson, Yupoong & more. 
              No minimums. No hidden fees. 10-15 business day turnaround.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button
                href="/order/hats"
                className="text-lg px-8 py-4 bg-accent hover:bg-accent-dark shadow-lg shadow-pink/30 hover:shadow-xl hover:shadow-pink/40 hover:scale-105"
              >
                Start Your Order
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <Button
                href="/reorder"
                variant="outline"
                className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reorder with Same Logo
              </Button>
            </div>

            {/* Trust Badges - Above the fold */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              {/* SSL Secured */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white font-medium">SSL Secured</span>
              </div>
              
              {/* Satisfaction Guarantee */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white font-medium">100% Satisfaction</span>
              </div>
              
              {/* Made in USA */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <span className="text-lg">🇺🇸</span>
                <span className="text-sm text-white font-medium">Made in USA</span>
              </div>
              
              {/* Secure Payments */}
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white font-medium">Secure Checkout</span>
              </div>
            </div>

            {/* Additional trust text */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free artwork proof
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No setup fees at 12+ hats
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No minimums required
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <StatCard label="Hats Produced" value={HATS_PRODUCED} icon={<HatIcon />} />
            <StatCard label="Customers Served" value={CUSTOMERS_SERVED} icon={<CustomerIcon />} />
            <StatCard label="Orders Placed" value={ORDERS_PLACED} icon={<OrderIcon />} />
          </div>

          {/* Customer Reviews - Right below stats */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-white">Google</span>
                <span className="text-white/60">Reviews</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                What Our Customers Say
              </h2>
            </div>
            {/* Auto-scrolling carousel */}
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-gradient-to-r from-pink to-magenta">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-white/80 mb-6">TRUSTED BY BUSINESSES LIKE</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {/* Placeholder company names */}
            {["Construction Co.", "Local Brewery", "Fitness Center", "Auto Shop", "Tech Startup", "Restaurant Group"].map((company) => (
              <div key={company} className="text-white/70 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-royal to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Get your custom embroidered hats in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/30">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Your Hats</h3>
              <p className="text-white/70">
                Select from premium brands like Richardson, Yupoong, Otto & Flexfit. Pick your colors and quantities.
              </p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-white/30 to-transparent" />
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/30">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Logo</h3>
              <p className="text-white/70">
                Upload your artwork and choose embroidery options. We&apos;ll send a free proof for approval.
              </p>
              {/* Connector line */}
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-white/30 to-transparent" />
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-white/30">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">We Stitch & Ship</h3>
              <p className="text-white/70">
                Our team embroiders your hats with precision. Ships in 10-15 business days, right to your door.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button href="/order/hats" className="px-8 py-4 bg-accent hover:bg-accent-dark">
              Start Your Order Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us - Family Story Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-pink to-magenta text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Meet Our Family
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              The heart behind every stitch
            </p>
          </div>

          {/* Family Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Family Photo - Add your image to /public/family/ folder */}
            <div className="rounded-2xl bg-white/10 border border-white/20 overflow-hidden">
              <FamilyPhoto 
                src="/family/family.jpg.png" 
                alt="Custom Business Hats Family - Our team behind every custom embroidered hat" 
                placeholder="Add family.jpg"
              />
            </div>

            {/* Story Text */}
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold">
                A Family Business Built on Quality & Trust
              </h3>
              <p className="text-white/80 text-lg leading-relaxed">
                What started as a small side project in our garage has grown into something 
                we&apos;re truly proud of. We&apos;re not a massive corporation — we&apos;re a family 
                that genuinely cares about every single hat that leaves our shop.
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                When you order from Custom Business Hats, you&apos;re not just getting a product. 
                You&apos;re getting our personal commitment to quality. We inspect every stitch, 
                we pack every box with care, and we treat your business like it&apos;s our own.
              </p>
              <p className="text-white/80 text-lg leading-relaxed">
                Thank you for trusting us with your brand. It means more than you know.
              </p>
              <p className="text-xl font-semibold text-pink-200 italic">
                — The Custom Business Hats Family
              </p>
            </div>
          </div>

          {/* Why Choose Us - Features */}
          <div className="border-t border-white/20 pt-16">
            <h3 className="text-2xl font-bold text-center mb-10">Why Customers Love Working With Us</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Minimums</h3>
                <p className="text-white/70 text-sm">Order 1 hat or 1,000. Volume discounts available but never required.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Turnaround</h3>
                <p className="text-white/70 text-sm">10-15 business days standard. Rush options available when you need it faster.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
                <p className="text-white/70 text-sm">100% satisfaction guaranteed. If you&apos;re not happy, we&apos;ll make it right.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Personal Touch</h3>
                <p className="text-white/70 text-sm">Real people, real care. Questions? We respond personally — not a call center.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volume Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-royal text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Volume Discounts That Add Up
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              The more you order, the more you save. No coupon codes needed.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { qty: "12+", perk: "Free Setup", desc: "$40 value" },
              { qty: "24+", perk: "$1 Off/Hat", desc: "+ Free Shipping" },
              { qty: "48+", perk: "$2 Off/Hat", desc: "Best for teams" },
              { qty: "96+", perk: "$3 Off/Hat", desc: "Company orders" },
              { qty: "188+", perk: "$4 Off/Hat", desc: "Max savings" },
            ].map((tier) => (
              <div key={tier.qty} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <p className="text-2xl font-bold text-pink">{tier.qty}</p>
                <p className="font-semibold">{tier.perk}</p>
                <p className="text-xs text-white/60">{tier.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              href="/order/hats" 
              className="px-8 py-4 bg-accent hover:bg-accent-dark text-white"
            >
              Calculate Your Price
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-br from-magenta to-pink text-white scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-white/70">
              Got questions? We&apos;ve got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details 
                key={index} 
                className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold pr-4">{faq.question}</span>
                  <svg className="w-5 h-5 text-white/60 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-white/80">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-white/70 mb-4">Still have questions?</p>
            <a href="mailto:support@custombusinesshats.com" className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@custombusinesshats.com
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-royal to-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses who trust Custom Business Hats for their team apparel. No minimums, no hassle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/order/hats" className="text-lg px-8 py-4 bg-accent hover:bg-accent-dark">
              Start Your Order
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
            <Link 
              href="#how-it-works"
              className="text-white/80 hover:text-white transition-colors font-medium"
            >
              Learn how it works →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
