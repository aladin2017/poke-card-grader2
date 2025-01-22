import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export function UserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Current user:", user);
        
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          console.log("Profile data:", profile);
          console.log("Profile error:", error);
          
          if (profile) {
            setRole(profile.role);
          }
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    }

    getUserRole();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading role...</div>;
  }

  if (!role) return null;

  return (
    <div className="bg-white shadow-sm rounded-lg p-3 m-4 flex items-center gap-2">
      <span className="text-sm text-gray-500">Role:</span>
      <Badge 
        variant={role === 'admin' ? 'default' : 'secondary'}
        className="flex items-center gap-1"
      >
        {role === 'admin' && <Shield className="w-3 h-3" />}
        {role}
      </Badge>
    </div>
  );
}