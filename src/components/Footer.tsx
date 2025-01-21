import { useEffect, useState } from "react";
import { Image } from "lucide-react";

export const Footer = () => {
  const [logo, setLogo] = useState<string>("");

  useEffect(() => {
    const savedLogo = localStorage.getItem('footerLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  return (
    <footer className="w-full py-4 px-6 bg-white shadow-sm mt-auto">
      <div className="container mx-auto flex justify-end">
        {logo ? (
          <img src={logo} alt="Footer Logo" className="w-12 h-12 object-contain" />
        ) : (
          <Image className="w-12 h-12 text-primary" />
        )}
      </div>
    </footer>
  );
};