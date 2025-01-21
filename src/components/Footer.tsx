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
    <footer className="w-full bg-black text-white py-4 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Company Info - Spans 6 columns */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center">
              {logo ? (
                <img src={logo} alt="Footer Logo" className="w-32 h-20 object-contain" />
              ) : (
                <Image className="w-32 h-20 text-primary" />
              )}
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Professional trading card grading services with industry-leading technology and expert evaluation. Your cards deserve the best care and certification.
            </p>
            <div className="flex flex-col gap-1 text-gray-400">
              <div className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                <span className="text-base">📧</span>
                <a href="mailto:contact@abcgrading.com" className="text-xs">contact@abcgrading.com</a>
              </div>
              <div className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                <span className="text-base">📞</span>
                <a href="tel:+12345678901" className="text-xs">+1 (234) 567-890</a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-base">📍</span>
                <span className="text-xs">123 Grading Street, Card City</span>
              </div>
            </div>
          </div>

          {/* Right Side Sections - Spans 6 columns */}
          <div className="md:col-span-6 grid grid-cols-3 gap-2">
            {/* Services */}
            <div className="space-y-1">
              <h3 className="text-green-500 font-semibold text-sm">Services</h3>
              <ul className="space-y-0.5 text-gray-400">
                <li className="flex items-center space-x-1 hover:text-green-500 transition-colors cursor-pointer text-xs">
                  <span>•</span>
                  <span>Grading Services</span>
                </li>
                <li className="flex items-center space-x-1 hover:text-green-500 transition-colors cursor-pointer text-xs">
                  <span>•</span>
                  <span>Card Verification</span>
                </li>
                <li className="flex items-center space-x-1 hover:text-green-500 transition-colors cursor-pointer text-xs">
                  <span>•</span>
                  <span>Population Report</span>
                </li>
                <li className="flex items-center space-x-1 hover:text-green-500 transition-colors cursor-pointer text-xs">
                  <span>•</span>
                  <span>Grading Scale</span>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-1">
              <h3 className="text-green-500 font-semibold text-sm">Connect</h3>
              <div className="flex space-x-2">
                <Link to="#" className="text-pink-500 hover:text-pink-400 transition-colors">
                  <Facebook className="w-4 h-4" />
                </Link>
                <Link to="#" className="text-pink-500 hover:text-pink-400 transition-colors">
                  <Twitter className="w-4 h-4" />
                </Link>
                <Link to="#" className="text-pink-500 hover:text-pink-400 transition-colors">
                  <Instagram className="w-4 h-4" />
                </Link>
              </div>
              <ul className="space-y-0.5 text-gray-400">
                <li className="hover:text-green-500 transition-colors cursor-pointer text-xs">Terms of Service</li>
                <li className="hover:text-green-500 transition-colors cursor-pointer text-xs">Privacy Policy</li>
                <li className="hover:text-green-500 transition-colors cursor-pointer text-xs">Contact Us</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-1">
              <h3 className="text-green-500 font-semibold text-sm">Quick Links</h3>
              <ul className="space-y-0.5 text-gray-400">
                <li className="hover:text-green-500 transition-colors cursor-pointer text-xs">Home</li>
                <li className="hover:text-green-500 transition-colors cursor-pointer text-xs">About Us</li>
                <li className="hover:text-green-500 transition-colors cursor-pointer text-xs">Blog</li>
                <li className="hover:text-green-500 transition-colors cursor-pointer text-xs">FAQ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-3 pt-2 border-t border-gray-800 text-center text-gray-400">
          <p className="text-xs">© 2025 ABC Grading. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};