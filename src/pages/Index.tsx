import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#001F54] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B2C</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#001F54]">Bid2Clean</h1>
                <div className="h-1 w-20 bg-[#F5C542] rounded-full"></div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-600 hover:text-[#001F54] font-medium">Services</a>
              <a href="#about" className="text-gray-600 hover:text-[#001F54] font-medium">About</a>
              <a href="#contact" className="text-gray-600 hover:text-[#001F54] font-medium">Contact</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-[#001F54] mb-6 leading-tight">
            Professional Cleaning
            <br />
            <span className="text-[#F5C542]">Made Simple</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get a customized cleaning quote for your business in minutes. Our professional team 
            provides reliable, high-quality cleaning services tailored to your facility's unique needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/get-a-quote"
              className="px-8 py-4 bg-[#001F54] text-white rounded-xl font-semibold text-lg hover:bg-[#0a2d7a] transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
            >
              Get Your Free Quote
            </Link>
            
            <a
              href="#services"
              className="px-8 py-4 border-2 border-[#001F54] text-[#001F54] rounded-xl font-semibold text-lg hover:bg-[#001F54] hover:text-white transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#F5C542] mb-2">500+</div>
            <div className="text-gray-600 font-medium">Satisfied Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#F5C542] mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Customer Support</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#F5C542] mb-2">10+</div>
            <div className="text-gray-600 font-medium">Years Experience</div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-[#001F54] mb-4">
              Our Services
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive cleaning solutions for every type of facility
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h4 className="text-xl font-semibold text-[#001F54] mb-3">Office Cleaning</h4>
              <p className="text-gray-600">Professional office maintenance to keep your workspace pristine and productive.</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h4 className="text-xl font-semibold text-[#001F54] mb-3">Medical Facilities</h4>
              <p className="text-gray-600">Specialized cleaning for healthcare environments with strict sanitation standards.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🏪</div>
              <h4 className="text-xl font-semibold text-[#001F54] mb-3">Retail Spaces</h4>
              <p className="text-gray-600">Keep your retail environment welcoming and spotless for customers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#001F54] to-[#0a2d7a] py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied businesses who trust Bid2Clean for their professional cleaning needs.
          </p>
          
          <Link
            to="/get-a-quote"
            className="inline-block px-8 py-4 bg-[#F5C542] text-[#001F54] rounded-xl font-bold text-lg hover:bg-[#f0b90b] transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Your Free Quote Today
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-[#001F54] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B2C</span>
            </div>
            <span className="text-xl font-bold text-[#001F54]">Bid2Clean</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 Bid2Clean. Professional cleaning services you can trust.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
