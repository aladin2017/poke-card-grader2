import { useEffect, useState } from "react";
import { Image, LogIn, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const Header = () => {
  const [logo, setLogo] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedLogo = localStorage.getItem('headerLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        duration: 2000,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error signing out",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <header 
      className={`w-full py-4 px-6 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
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

        <div className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
            </NavigationMenuList>
          </NavigationMenu>

          {session ? (
            <Button 
              variant="secondary"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          ) : (
            <Button 
              variant="secondary"
              onClick={handleSignIn}
              className="flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};