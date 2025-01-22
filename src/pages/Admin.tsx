import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/admin/DataTable";
import { StatsCards } from "@/components/admin/StatsCards";
import { GradingQueue } from "@/components/admin/GradingQueue";
import { GradingHistory } from "@/components/admin/GradingHistory";
import { Settings } from "@/components/admin/Settings";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check session and admin status
    const checkAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        navigate('/auth');
        return;
      }

      setSession(currentSession);

      // Check if user is admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentSession.user.id)
        .single();

      if (profileError || profileData?.role !== 'admin') {
        console.error('Not an admin or error:', profileError);
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You must be an admin to access this page.",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setSession(session);
      
      // Recheck admin status when auth state changes
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileData?.role !== 'admin') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (!session || !isAdmin) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsCards />
          <DataTable />
        </TabsContent>

        <TabsContent value="queue">
          <GradingQueue session={session} />
        </TabsContent>

        <TabsContent value="history">
          <GradingHistory session={session} />
        </TabsContent>

        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;