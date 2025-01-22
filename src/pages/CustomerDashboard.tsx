import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GradingDetails {
  centering: number;
  surfaces: number;
  edges: number;
  corners: number;
  finalGrade: number;
}

interface Order {
  id: string;
  order_id: string;
  card_name: string;
  service_type: string;
  status: string;
  created_at: string;
  grading_details: GradingDetails | null;
}

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please log in to view your dashboard.",
        });
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  // Set up authentication listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Authentication required');
      }

      const { data: orderData, error: queryError } = await supabase
        .from('card_gradings')
        .select(`
          id,
          order_id,
          card_name,
          service_type,
          status,
          created_at,
          grading_details
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) {
        console.error('Error fetching orders:', queryError);
        throw queryError;
      }
      
      return (orderData || []).map(order => ({
        ...order,
        grading_details: order.grading_details as unknown as GradingDetails | null
      })) as Order[];
    },
    enabled: true,
    retry: 1,
    meta: {
      onError: (err: Error) => {
        console.error('Query error:', err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your orders. Please try again later.",
        });
      }
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "rejected":
        return "destructive";
      case "queued":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            Loading your orders...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center text-red-500">
            Failed to load orders. Please try refreshing the page.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You don't have any orders yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Card Name</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.order_id}</TableCell>
                    <TableCell>{order.card_name}</TableCell>
                    <TableCell>{order.service_type}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {order.status === 'completed' && order.grading_details ? (
                        <div className="space-y-1">
                          <p className="font-bold">Final Grade: {order.grading_details.finalGrade}</p>
                          <p className="text-sm text-muted-foreground">
                            Centering: {order.grading_details.centering} | 
                            Surfaces: {order.grading_details.surfaces} | 
                            Edges: {order.grading_details.edges} | 
                            Corners: {order.grading_details.corners}
                          </p>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;