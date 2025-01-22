import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

export function UserRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function getUserRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setRole(profile.role);
        }
      }
    }

    getUserRole();
  }, []);

  if (!role) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Role:</span>
      <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
        {role}
      </Badge>
    </div>
  );
}