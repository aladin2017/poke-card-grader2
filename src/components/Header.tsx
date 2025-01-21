import { useEffect, useState } from "react";
import { Image } from "lucide-react";
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";

export const Header = () => {
  const [logo, setLogo] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const savedLogo = localStorage.getItem('headerLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`w-full py-4 px-6 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-center">
        <Link to="/" className="flex items-center space-x-2">
          {logo ? (
            <img src={logo} alt="Header Logo" className="w-12 h-12 object-contain" />
          ) : (
            <Image className="w-12 h-12 text-secondary" />
          )}
          <span className={`text-xl font-poppins font-bold ${
            isScrolled ? 'text-secondary' : 'text-primary'
          }`}>
            ABC Grading
          </span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};