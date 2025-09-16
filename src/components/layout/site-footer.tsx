import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export function SiteFooter() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast({
        title: 'Subscribed!',
        description: 'Thank you for subscribing to our newsletter.',
      });
      setEmail('');
    }
  };

  // Reusable class for the social buttons:
  // default (white box / dark icon) -> hover (black box / white icon)
  const socialBtn =
    'inline-flex h-10 w-10 items-center justify-center rounded-xl ' +
    'border border-slate-300 bg-white text-slate-900 ' +
    'transition-colors ' +
    'hover:bg-slate-900 hover:text-white hover:border-slate-900 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2';

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200">
      {/* Newsletter Section */}
      <div className="w-full bg-gradient-to-r from-[#6B4EFF] to-[#FF8A65] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay in Style</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and fashion tips.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
            />
            <Button type="submit" variant="secondary" className="bg-white text-[#6B4EFF] hover:bg-white/90">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6B4EFF] text-white font-bold">
                F
              </div>
              <span className="font-bold text-xl text-slate-800">Fashion</span>
            </div>
            <p className="text-slate-600">
              Your one-stop destination for trendy fashion. Quality clothing for men, women, and accessories.
            </p>

            {/* Social icons — white by default, invert on hover */}
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className={socialBtn}>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className={socialBtn}>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className={socialBtn}>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="YouTube" className={socialBtn}>
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/men', label: "Men's Wear" },
                { href: '/women', label: "Women's Wear" },
                { href: '/accessories', label: 'Accessories' },
                { href: '/sale', label: 'Sale' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-slate-600 hover:text-[#6B4EFF] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Customer Service</h3>
            <ul className="space-y-2">
              {[
                { href: '/contact', label: 'Contact Us' },
                { href: '#', label: 'Size Guide' },
                { href: '#', label: 'Shipping Info' },
                { href: '#', label: 'Returns' },
                { href: '#', label: 'FAQ' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-600 hover:text-[#6B4EFF] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Newsletter</h3>
            <p className="text-slate-600 text-sm">
              Subscribe to get updates on new arrivals and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-slate-200"
              />
              <Button type="submit" className="w-full bg-[#6B4EFF] hover:bg-[#5A3FE7]">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm">© 2024 Fashion Store. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="#"
              className="text-slate-600 hover:text-[#6B4EFF] text-sm transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-slate-600 hover:text-[#6B4EFF] text-sm transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
