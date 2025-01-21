import { useEffect, useState } from "react";
import { Image } from "lucide-react";

export const Header = () => {
  const [logo, setLogo] = useState<string>("");

  useEffect(() => {
    const savedLogo = localStorage.getItem('headerLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="container mx-auto">
        {logo ? (
          <img src={logo} alt="Header Logo" className="w-12 h-12 object-contain" />
        ) : (
          <Image className="w-12 h-12 text-primary" />
        )}
      </div>
    </header>
  );
};