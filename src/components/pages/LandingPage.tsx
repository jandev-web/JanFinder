'use client';

import Link from 'next/link';
import Header from '@/components/Header'; // <-- use the new Header
import heroBackground from '@/assets/homePicSecond.jpeg';
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Header (replaced) */}
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground.src})` }}
        >
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
              Cleaning Services
              <br />
              <span className="text-yellow-400 drop-shadow-lg">Competitive Bidding</span>
            </h2>

            <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
              Get multiple cleaning companies competing for your business.
              <span className="text-yellow-400 font-semibold"> No salesmen, no site visits, no hassle.</span>
              Just transparent quotes and professional service.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/get-a-quote">
                <button className="bg-yellow-400 text-white hover:bg-yellow-500 text-xl px-12 py-6 rounded-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
                  Get Competitive Quotes
                </button>
              </Link>

              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 text-xl px-12 py-6 rounded-xl font-semibold transition-all duration-300 bg-white/10 backdrop-blur-sm">
                Join as Cleaning Company
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Value Props */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-[#001F54] mb-2">For Business Owners</h3>
                <p className="text-lg text-gray-600">Save 20-40% on cleaning costs</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">Multiple quotes in 24 hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">No pushy sales calls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">Skip time-consuming site visits</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">Transparent, competitive pricing</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🏢</div>
                <h3 className="text-2xl font-bold text-[#001F54] mb-2">For Cleaning Companies</h3>
                <p className="text-lg text-gray-600">Access ready-to-buy customers</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#001F54] rounded-full"></div>
                  <span className="text-gray-700">Pre-qualified leads only</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#001F54] rounded-full"></div>
                  <span className="text-gray-700">Detailed project requirements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#001F54] rounded-full"></div>
                  <span className="text-gray-700">Fair bidding platform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#001F54] rounded-full"></div>
                  <span className="text-gray-700">Grow your client base</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="industries" className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold text-[#001F54] mb-6">
              How Bid2Clean Works
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionizing commercial cleaning through competitive bidding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-6xl mb-4">📝</div>
              <h4 className="text-2xl font-bold text-[#001F54] mb-4">1. Submit Your Needs</h4>
              <p className="text-gray-600 text-lg">Fill out our comprehensive form detailing your facility&apos;s cleaning requirements. No phone calls or site visits needed.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-6xl mb-4">⚡</div>
              <h4 className="text-2xl font-bold text-[#001F54] mb-4">2. Companies Compete</h4>
              <p className="text-gray-600 text-lg">Pre-qualified cleaning companies submit competitive bids for your project within 24 hours.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-6xl mb-4">✅</div>
              <h4 className="text-2xl font-bold text-[#001F54] mb-4">3. Choose &amp; Save</h4>
              <p className="text-gray-600 text-lg">Review quotes, compare services, and select the best option. Start saving immediately on professional cleaning.</p>
            </div>
          </div>

          {/* Industries We Serve */}
          <div className="text-center mb-12">
            <h4 className="text-3xl font-bold text-[#001F54] mb-8">Industries We Serve</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-3">🏢</div>
              <h5 className="font-semibold text-[#001F54]">Office Buildings</h5>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-3">🏥</div>
              <h5 className="font-semibold text-[#001F54]">Medical Facilities</h5>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-3">🏪</div>
              <h5 className="font-semibold text-[#001F54]">Retail Spaces</h5>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl mb-3">🏭</div>
              <h5 className="font-semibold text-[#001F54]">Warehouses</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="why-bid2clean" className="bg-gradient-to-br from-[#001F54] to-blue-700 py-20 md:py-32 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose Bid2Clean?
            </h3>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We&apos;ve eliminated everything you hate about finding cleaning services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h4 className="text-3xl font-bold mb-8">No More Hassles</h4>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-400 text-black rounded-full p-2 mt-1">
                    <span className="text-sm font-bold">✗</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">No Pushy Salesmen</h5>
                    <p className="opacity-90">Skip the aggressive sales tactics and endless follow-up calls.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-400 text-black rounded-full p-2 mt-1">
                    <span className="text-sm font-bold">✗</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">No Site Inspections</h5>
                    <p className="opacity-90">Our detailed form captures everything needed for accurate quotes.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-400 text-black rounded-full p-2 mt-1">
                    <span className="text-sm font-bold">✗</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">No Hidden Costs</h5>
                    <p className="opacity-90">Transparent pricing with all details included upfront.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-3xl font-bold mb-8">What You Get Instead</h4>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-400 text-black rounded-full p-2 mt-1">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">Competitive Pricing</h5>
                    <p className="opacity-90">Companies compete, you save 20-40% on cleaning costs.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-400 text-black rounded-full p-2 mt-1">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">Quick Turnaround</h5>
                    <p className="opacity-90">Multiple quotes delivered within 24 hours.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-400 text-black rounded-full p-2 mt-1">
                    <span className="text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">Verified Companies</h5>
                    <p className="opacity-90">All cleaning companies are pre-screened and insured.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div id="quote-seekers" className="bg-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-[#001F54] mb-16">Trusted by Businesses Nationwide</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-500 mb-2">2,500+</div>
              <div className="text-gray-600 font-medium">Successful Matches</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-500 mb-2">$2M+</div>
              <div className="text-gray-600 font-medium">Saved by Clients</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-500 mb-2">24hr</div>
              <div className="text-gray-600 font-medium">Average Response</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-500 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="business-owners" className="bg-gradient-to-r from-[#001F54] to-blue-700 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Save on Cleaning?
          </h3>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of smart business owners who use competitive bidding to get the best cleaning deals. 
            No commitments, no hidden fees, just better prices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/get-a-quote">
              <button className="bg-yellow-400 text-black hover:bg-yellow-500 text-xl px-12 py-6 rounded-xl font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
                Get Your Free Quotes Now
              </button>
            </Link>
            
            <button className="border-2 border-white text-white hover:bg-white hover:text-[#001F54] text-xl px-12 py-6 rounded-xl font-semibold transition-all duration-300">
              Learn More About Bidding
            </button>
          </div>

          <p className="text-sm text-white/70 mt-8">
            ⚡ Get quotes in 24 hours • 💰 Save 20-40% • 🚫 No sales calls
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#001F54] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">B2C</span>
                </div>
                <span className="text-2xl font-bold text-[#001F54]">Bid2Clean</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Revolutionizing commercial cleaning through competitive bidding. 
                Better prices, no hassle, professional results.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#001F54] mb-4">For Businesses</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#quote-seekers" className="hover:text-[#001F54] transition-colors">Get Quotes</a></li>
                <li><a href="#industries" className="hover:text-[#001F54] transition-colors">Industries</a></li>
                <li><a href="#why-bid2clean" className="hover:text-[#001F54] transition-colors">Why Choose Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#001F54] mb-4">For Cleaners</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#business-owners" className="hover:text-[#001F54] transition-colors">Join Platform</a></li>
                <li><a href="#" className="hover:text-[#001F54] transition-colors">Partner Benefits</a></li>
                <li><a href="#" className="hover:text-[#001F54] transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              © 2024 Bid2Clean. Connecting businesses with competitive cleaning solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;