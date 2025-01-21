import { useEffect, useState } from "react";
import { Image, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const [logo, setLogo] = useState<string>("");

  useEffect(() => {
    const savedLogo = localStorage.getItem('footerLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  return (
    <footer className="w-full bg-black text-white py-8 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Company Info - Spans 6 columns */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center">
              {logo ? (
                <img src={logo} alt="Footer Logo" className="w-36 h-24 object-contain" />
              ) : (
                <Image className="w-36 h-24 text-primary" />
              )}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional trading card grading services with industry-leading technology and expert evaluation. Your cards deserve the best care and certification.
            </p>
            <div className="flex flex-col gap-1.5 text-gray-400">
              <div className="flex items-center space-x-3 hover:text-green-500 transition-colors">
                <span className="text-lg">📧</span>
                <a href="mailto:contact@abcgrading.com" className="text-sm">contact@abcgrading.com</a>
              </div>
              <div className="flex items-center space-x-3 hover:text-green-500 transition-colors">
                <span className="text-lg">📞</span>
                <a href="tel:+12345678901" className="text-sm">+1 (234) 567-890</a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg">📍</span>
                <span className="text-sm">123 Grading Street, Card City</span>
              </div>
            </div>
          </div>

          {/* Right Side Sections - Spans 6 columns */}
          <div className="md:col-span-6 grid grid-cols-3 gap-4">
            {/* Services */}
            <div className="space-y-2">
              <h3 className="text-green-500 font-semibold text-lg">Services</h3>
              <ul className="space-y-1 text-gray-400">
                <li className="flex items-center space-x-1 hover:text-green-500 transition-colors cursor-pointer text-sm">
                  <span>•</span>
                  <span>Grading Services</span>
                </li>
                <li className="flex items-center space-x-1 hover:text-green-500 transition-colors cursor-pointer text-sm">
                  <span>•</span>
                  <span>Card Verification</span>
                </li>
                <li className="flex items-center space-x-1 hover:text-green-500 transition-colors cursor-pointer text-sm">
                  <span>•</span>
                  <span>Population Report</span>
                </li>
                <li className="flex items-center space-x-1 hover:text-green-500 transition-colors cursor-pointer text-sm">
                  <span>•</span>
                  <span>Grading Scale</span>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-2">
              <h3 className="text-green-500 font-semibold text-lg">Connect</h3>
              <div className="flex space-x-2">
                <Link to="#" className="text-pink-500 hover:text-pink-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link to="#" className="text-pink-500 hover:text-pink-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link to="#" className="text-pink-500 hover:text-pink-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
              </div>
              <ul className="space-y-1 text-gray-400">
                <li className="hover:text-green-500 transition-colors cursor-pointer text-sm">Terms of Service</li>
                <li className="hover:text-green-500 transition-colors cursor-pointer text-sm">Privacy Policy</li>
                <li className="hover:text-green-500 transition-colors cursor-pointer text-sm">Contact Us</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h3 className="text-green-500 font-semibold text-lg">Quick Links</h3>
              <ul className="space-y-1 text-gray-400">
                <li className="hover:text-green-500 transition-colors cursor-pointer text-sm">Home</li>
                <li className="hover:text-green-500 transition-colors cursor-pointer text-sm">About Us</li>
                <li className="hover:text-green-500 transition-colors cursor-pointer text-sm">Blog</li>
                <li className="hover:text-green-500 transition-colors cursor-pointer text-sm">FAQ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-gray-800 text-center text-gray-400">
          <p className="text-sm">© 2025 ABC Grading. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};