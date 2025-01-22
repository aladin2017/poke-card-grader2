import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session status:", session ? "Active" : "No session");
        
        if (!session) {
          console.log("No session found, redirecting");
          setIsAdmin(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error.message);
          setIsAdmin(false);
          return;
        }

        console.log("Profile data:", profile);

        if (profile?.role !== 'admin') {
          toast({
            title: "Access Denied",
            description: "You need admin privileges to access this page.",
            variant: "destructive",
          });
        }

        setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [toast]);

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};