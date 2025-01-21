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
    <footer className="w-full bg-black text-white py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-pink-500 font-bold text-xl">ABC</div>
              <div className="text-green-500 font-bold text-xl">Grading</div>
            </div>
            <p className="text-gray-400 text-sm">
              Professional trading card grading services with industry-leading technology and expert evaluation. Your cards deserve the best care and certification.
            </p>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <span>contact@abcgrading.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>+1 (234) 567-890</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>123 Grading Street, Card City</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-green-500 font-semibold text-lg">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>• Grading Services</li>
              <li>• Card Verification</li>
              <li>• Population Report</li>
              <li>• Grading Scale</li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-green-500 font-semibold text-lg">Connect</h3>
            <div className="flex space-x-4">
              <Link to="#" className="text-pink-500 hover:text-pink-400">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link to="#" className="text-pink-500 hover:text-pink-400">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link to="#" className="text-pink-500 hover:text-pink-400">
                <Instagram className="w-6 h-6" />
              </Link>
            </div>
            <ul className="space-y-2 text-gray-400">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Logo Area */}
          <div className="flex justify-end items-start">
            {logo ? (
              <img src={logo} alt="Footer Logo" className="w-12 h-12 object-contain" />
            ) : (
              <Image className="w-12 h-12 text-primary" />
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          © 2025 ABC Grading. All rights reserved.
        </div>
      </div>
    </footer>
  );
};