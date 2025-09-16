import { Link } from 'react-router-dom'
import { ArrowRight, Truck, RefreshCw, Shield, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card' // <- removed CardContent

export function HomePage() {
  const categories = [
    {
      title: "Men's Fashion",
      description: "Discover the latest trends in men's clothing",
      image:
        'https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=800',
      href: '/men',
    },
    {
      title: "Women's Fashion",
      description: 'Elegant styles for the modern woman',
      image:
        'https://images.pexels.com/photos/794064/pexels-photo-794064.jpeg?auto=compress&cs=tinysrgb&w=800',
      href: '/women',
    },
    {
      title: 'Accessories',
      description: 'Complete your look with premium accessories',
      image:
        'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=800',
      href: '/accessories',
    },
  ]

  const features = [
    { icon: Truck, title: 'Free Shipping', description: 'Free shipping on orders over NPR 6,650' },
    { icon: RefreshCw, title: 'Easy Returns', description: '30-day hassle-free returns' },
    { icon: Shield, title: 'Secure Payment', description: '100% secure payment processing' },
    { icon: Star, title: 'Premium Quality', description: 'High-quality materials and craftsmanship' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#6B4EFF] to-[#FF8A65] py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Your Perfect Style</h1>
            <p className="text-xl mb-8 text-white/90">
              Shop the latest fashion trends with premium quality clothing and accessories for men and
              women.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="border-white text-text-[#6B4EFF] hover:text-black"
                asChild
              >
                <Link to="/women">
                  Shop Women&apos;s <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-text-[#6B4EFF] hover:bg-white "
                asChild
              >
                <Link to="/men">
                  Shop Men&apos;s <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Shop by Category</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore our curated collections of fashion-forward clothing and accessories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.href} to={category.href} className="group block">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                      <p className="text-white/90">{category.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Choose Us</h2>
            <p className="text-lg text-slate-600">
              We&apos;re committed to providing you with the best shopping experience and highest
              quality products.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#6B4EFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="py-16 bg-gradient-to-r from-[#FF8A65] to-[#6B4EFF]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Sale - Up to 50% Off</h2>
            <p className="text-xl mb-8 text-white/90">
              Don&apos;t miss out on amazing deals across our entire collection
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-[#6B4EFF] hover:bg-white/90"
              asChild
            >
              <Link to="/sale">
                Shop Sale <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
