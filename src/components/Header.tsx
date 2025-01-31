import { useEffect, useState } from "react";
import { Image } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface HeaderProps {
  session: any;
}

export const Header = ({ session }: HeaderProps) => {
  const [logo, setLogo] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "customer" | null>(null);
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

    // Fetch user role when session changes
    const fetchUserRole = async () => {
      if (session?.user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not fetch user role. Please try again later.",
            });
            return;
          }

          if (data) {
            console.log('User role:', data.role);
            setUserRole(data.role);
          }
        } catch (error) {
          console.error('Error in fetchUserRole:', error);
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [session, toast]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = '/auth';
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  const handleDashboardClick = () => {
    console.log('Current user role:', userRole);
    if (userRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header 
      className={`w-full py-4 px-6 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary shadow-lg' : 'bg-white shadow'
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

        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-4">
            {session ? (
              <>
                <Button
                  variant="ghost"
                  className={`${isScrolled ? 'text-secondary hover:text-secondary/80' : 'text-primary hover:text-primary/80'}`}
                  onClick={handleDashboardClick}
                >
                  {userRole === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                </Button>
                <Button
                  variant="ghost"
                  className={`${isScrolled ? 'text-secondary hover:text-secondary/80' : 'text-primary hover:text-primary/80'}`}
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className={`${isScrolled ? 'text-secondary hover:text-secondary/80' : 'text-primary hover:text-primary/80'}`}
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};