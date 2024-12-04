"use client";

import { Button } from "@/components/ui/button";
import {
  Leaf,
  ShoppingBasket,
  TrendingUp,
  Star,
  Users,
  Truck,
  Phone,
  Mail,
  MapPin,
  Shield,
  BarChart,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/logo";
import { InvestmentCalculator } from "@/components/investment-calculator";
import { VideoBackground } from "@/components/video-background";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 navbar-gradient">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/marketplace">Marketplace</Link>
            </Button>
            {session ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="default" onClick={() => signOut()}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/register/farmers">Register as Farmer</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/investments">Investments</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <VideoBackground />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
              Fresh From Farm to Your Table
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12">
              Connect directly with local farmers and get fresh produce
              delivered to your doorstep. Reduce food waste while supporting
              sustainable agriculture.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-xl"
                asChild
              >
                <Link href="/marketplace">Shop Now</Link>
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="text-lg px-8 py-6 rounded-xl"
                asChild
              >
                <Link href="/investments">Invest Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 partners-gradient overflow-hidden">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-muted-foreground">
              Trusted By
            </h2>
          </div>
        </div>
        <div className="relative whitespace-nowrap">
          <div
            className="inline-flex gap-8 animate-[scroll_20s_linear_infinite]"
            style={{ willChange: "transform" }}
          >
            <div className="inline-flex items-center gap-8">
              <span className="text-xl font-semibold text-muted-foreground hover:text-primary transition-colors">
                Plateau State Government
              </span>
              <span className="text-xl font-semibold text-muted-foreground hover:text-primary transition-colors">
                Ministry of Science & Innovation
              </span>
              <span className="text-xl font-semibold text-muted-foreground hover:text-primary transition-colors">
                QEDA
              </span>
              <span className="text-xl font-semibold text-muted-foreground hover:text-primary transition-colors">
                Zeustek ICT Solutions
              </span>
              <span className="text-xl font-semibold text-muted-foreground hover:text-primary transition-colors">
                UniJos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose JosFresh?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fresh & Local</h3>
              <p className="text-muted-foreground">
                Get the freshest produce directly from local farmers, ensuring
                quality and supporting your community.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <ShoppingBasket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Ordering</h3>
              <p className="text-muted-foreground">
                Browse, order, and schedule deliveries with just a few clicks.
                Convenient shopping experience.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fair Prices</h3>
              <p className="text-muted-foreground">
                Get competitive prices by cutting out middlemen. Support farmers
                while saving money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Showcase Sections */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Section 1: Empowering Local Farmers */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/11448527/pexels-photo-11448527.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="African farmers tending to crops"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Empowering Local Farmers</h2>
              <p className="text-muted-foreground text-lg">
                We partner with smallholder farmers across Nigeria, providing
                them with technology, training, and direct market access. Our
                platform has helped over 2,000 farmers increase their income by
                up to 40%.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span>40% average increase in farmer income</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span>2,000+ farmers onboarded and trained</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Reduced post-harvest losses by 60%</span>
                </li>
              </ul>
              <Button size="lg" asChild>
                <Link href="/register/farmers">Join as a Farmer</Link>
              </Button>
            </div>
          </div>

          {/* Section 2: Growing Together */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-20">
            <div className="space-y-6 order-2 md:order-1">
              <h2 className="text-4xl font-bold">Growing Together</h2>
              <p className="text-muted-foreground text-lg">
                Join our network of merchants and distributors to tap into a
                reliable supply of fresh, quality produce. Our platform connects
                you directly with verified farmers, ensuring competitive prices
                and consistent supply.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    15%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Lower Costs
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    24h
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Delivery Time
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    100%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Quality Assured
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    50+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Product Types
                  </div>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link href="/marketplace">Start Buying</Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden order-1 md:order-2">
              <Image
                src="https://images.pexels.com/photos/6457556/pexels-photo-6457556.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="African marketplace"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Section 3: Investment Opportunities */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/28351274/pexels-photo-28351274/free-photo-of-smiling-couple-sitting-in-freetown-sierra-leone.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Business professionals"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Investment Opportunities</h2>
              <p className="text-muted-foreground text-lg">
                Invest in verified agricultural projects and earn competitive
                returns while supporting sustainable farming. Our platform
                offers transparent, secure investment opportunities with
                expected returns of 8-15% annually.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">12%</div>
                  <div className="text-sm text-muted-foreground">
                    Average ROI
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">₦50k</div>
                  <div className="text-sm text-muted-foreground">
                    Min Investment
                  </div>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link href="/investments">Explore Opportunities</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Invest in Agriculture</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Support local farmers while earning competitive returns. Our
              platform connects you directly with verified farmers, offering
              transparent investment opportunities with expected returns of
              8-15% annually.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Competitive Returns
                  </h3>
                  <p className="text-muted-foreground">
                    Earn attractive returns on your investment while supporting
                    sustainable agriculture. Our farmers have a proven track
                    record of success.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Secure Investment
                  </h3>
                  <p className="text-muted-foreground">
                    All farms are thoroughly vetted and monitored. Your
                    investment is protected by comprehensive insurance coverage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Full Transparency
                  </h3>
                  <p className="text-muted-foreground">
                    Track your investment performance in real-time. Regular
                    updates and reports keep you informed about your farm's
                    progress.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <InvestmentCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center text-primary-foreground">
              <div className="text-4xl font-bold mb-2">2,000+</div>
              <div className="text-sm">Active Farmers</div>
            </div>
            <div className="text-center text-primary-foreground">
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-sm">Happy Customers</div>
            </div>
            <div className="text-center text-primary-foreground">
              <div className="text-4xl font-bold mb-2">100,000+</div>
              <div className="text-sm">Orders Delivered</div>
            </div>
            <div className="text-center text-primary-foreground">
              <div className="text-4xl font-bold mb-2">₦10M+</div>
              <div className="text-sm">Farmer Earnings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-md">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-muted-foreground mb-4">
                "JosFresh has transformed how I sell my produce. Direct access
                to customers means better prices and less waste."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">John Ibrahim</div>
                  <div className="text-sm text-muted-foreground">
                    Tomato Farmer
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-md">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-muted-foreground mb-4">
                "The quality of produce is amazing. Everything is fresh and the
                prices are very reasonable."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Sarah James</div>
                  <div className="text-sm text-muted-foreground">
                    Regular Customer
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-md">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-muted-foreground mb-4">
                "Fast delivery and excellent customer service. The platform is
                very easy to use."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Mary Johnson</div>
                  <div className="text-sm text-muted-foreground">
                    Restaurant Owner
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of farmers and customers already using JosFresh to
              buy and sell fresh produce.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Join as a Customer</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register/farmers">Register as a Farmer</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">+234 800 123 4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">info@josfresh.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-muted-foreground">
                      Jos, Plateau State, Nigeria
                    </p>
                  </div>
                </div>
              </div>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input type="email" placeholder="Your Email" />
                <Input placeholder="Subject" />
                <Textarea
                  placeholder="Your Message"
                  className="min-h-[120px]"
                />
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
