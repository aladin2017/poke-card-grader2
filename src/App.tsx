import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Success from "./pages/Success";
import CustomerDashboard from "./pages/CustomerDashboard";
import { CardSubmissionForm } from "./components/CardSubmissionForm";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Fetch user role
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setUserRole(data.role);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        // Fetch user role on auth state change
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUserRole(data.role);
            }
          });
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header session={session} />
            <main className="flex-1 pt-24">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/submit/:serviceType" element={<CardSubmissionForm />} />
                <Route path="/success" element={<Success />} />
                <Route
                  path="/admin"
                  element={
                    session && userRole === 'admin' ? (
                      <Admin />
                    ) : (
                      <Navigate to="/auth" replace />
                    )
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    session ? <CustomerDashboard /> : <Navigate to="/auth" replace />
                  }
                />
                <Route
                  path="/auth"
                  element={
                    !session ? <Auth /> : <Navigate to="/" replace />
                  }
                />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;