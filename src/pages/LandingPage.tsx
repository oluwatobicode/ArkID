import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { login, authenticated, ready } = usePrivy();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (authenticated && ready) {
      navigate("/dashboard");
    }
  }, [authenticated, ready, navigate]);

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <img 
            src="/Logo (1).png" 
            alt="ArkID Logo" 
            className="h-8 w-auto md:h-10 cursor-pointer" 
            onClick={() => navigate("/")}
          />
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-sm font-medium text-gray-900 transition-colors hover:text-[#d4af37]">
              Home
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-900 transition-colors hover:text-[#d4af37]">
              How It Works
            </a>
            <a href="#pricing" onClick={() => navigate("/checkout")} className="text-sm font-medium text-gray-900 transition-colors hover:text-[#d4af37] cursor-pointer">
              Pricing/Shop
            </a>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={handleLogin}
              className="rounded-md border-2 border-[#d4af37] px-5 py-2 text-sm font-semibold text-[#d4af37] transition-all hover:bg-[#d4af37] hover:text-black"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="rounded-md bg-[#d4af37] px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-[#c29f2f]"
            >
              Buy Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-16 z-50 bg-white shadow-lg md:hidden">
            <nav className="flex flex-col border-t border-gray-100">
              <a 
                href="#home" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-b border-gray-100 px-4 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
              >
                Home
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-b border-gray-100 px-4 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
              >
                How it Works
              </a>
              <a 
                href="#pricing" 
                onClick={() => { navigate("/checkout"); setIsMobileMenuOpen(false); }} 
                className="border-b border-gray-100 px-4 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 cursor-pointer"
              >
                Pricing/Shop
              </a>
              <a 
                href="#login" 
                onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }} 
                className="border-b border-gray-100 px-4 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 cursor-pointer"
              >
                Sign Up/Log In
              </a>
              <a 
                href="#contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
              >
                Contact Us
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-white px-4 py-12 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              The Last Business Card
              <br />
              You'll Ever Need
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-base text-gray-600 md:text-lg">
              Share your contact info, social media, and portfolio with just one tap
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="mb-3 rounded-md bg-[#d4af37] px-8 py-3 text-base font-semibold text-black transition-all hover:bg-[#c29f2f]"
            >
              Get Your Card
            </button>
            <p className="text-sm text-gray-500">Compatible with iOS & Android</p>
          </div>

          {/* Card Image */}
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-md md:max-w-lg">
              <img
                src="/Card (2).png"
                alt="ArkID Card"
                className="w-full rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-white px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            How it Works
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center transition-shadow hover:shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Step 1: Order</h3>
              <p className="text-gray-600">
                Customize your card and place your order
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center transition-shadow hover:shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Step 2: Activate</h3>
              <p className="text-gray-600">
                Create your profile on your dashboard
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center transition-shadow hover:shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">Step 3: Tap</h3>
              <p className="text-gray-600">
                Tap your card on any phone to share your details instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <img src="/Logo (2).png" alt="ArkID Logo" className="mb-4 h-10 w-auto" />
              <p className="text-base text-white">
                Share your contact info, social media, and portfolio with just one tap
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-base font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#how-it-works" className="text-base text-white hover:text-[#d4af37]">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" onClick={() => navigate("/checkout")} className="text-base text-white hover:text-[#d4af37] cursor-pointer">
                    Pricing/Shop
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-base font-semibold text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#terms" className="text-base text-white hover:text-[#d4af37]">
                    Terms of use
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="text-base text-white hover:text-[#d4af37]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#help" className="text-base text-white hover:text-[#d4af37]">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="mb-4 text-base font-semibold text-white">Social</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#twitter" className="flex items-center gap-2 text-base text-white hover:text-[#d4af37]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#instagram" className="flex items-center gap-2 text-base text-white hover:text-[#d4af37]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">&copy; 2025 ArkID</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
