import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  card_name: string;
  status: "pending" | "queued" | "completed" | "rejected";
  created_at: string;
  service_type: string;
  shipping_method: string;
}

interface DataTableProps {
  showAll?: boolean;
}

const isValidStatus = (status: string): status is Order['status'] => {
  return ['pending', 'queued', 'completed', 'rejected'].includes(status);
};

export function DataTable({ showAll = false }: DataTableProps) {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', showAll],
    queryFn: async () => {
      // First check if user is admin by getting their specific profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError || profileData?.role !== 'admin') {
        console.error('Error fetching profile or user is not admin:', profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "You don't have permission to view orders.",
        });
        return [];
      }

      const query = supabase
        .from('card_gradings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!showAll) {
        query.in('status', ['pending', 'queued']);
      } else {
        query.in('status', ['completed', 'rejected']);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
        });
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        order_id: item.order_id,
        customer_name: item.customer_name,
        customer_email: item.customer_email,
        card_name: item.card_name,
        status: isValidStatus(item.status) ? item.status : 'pending',
        created_at: item.created_at,
        service_type: item.service_type,
        shipping_method: item.shipping_method,
      })) as Order[];
    },
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const moveToQueue = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('card_gradings')
        .update({ status: 'queued' })
        .eq('order_id', orderId);

      if (error) throw error;

      toast({
        title: "Order Queued",
        description: `Order #${orderId} has been moved to the queue.`,
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status. Please try again.",
      });
    }
  };

  const markAsCompleted = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('card_gradings')
        .update({ status: 'completed' })
        .eq('order_id', orderId);

      if (error) throw error;

      toast({
        title: "Order Completed",
        description: `Order #${orderId} has been marked as completed.`,
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status. Please try again.",
      });
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('card_gradings')
        .update({ status: 'rejected' })
        .eq('order_id', orderId);

      if (error) throw error;

      toast({
        title: "Order Rejected",
        description: `Order #${orderId} has been rejected.`,
        variant: "destructive",
      });

      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status. Please try again.",
      });
    }
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
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
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{showAll ? "Order History" : "Active Orders"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Card</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.order_id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.card_name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{order.service_type}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {order.status === "pending" && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-blue-600"
                          onClick={() => moveToQueue(order.order_id)}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-600"
                          onClick={() => handleRejectOrder(order.order_id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {order.status === "queued" && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-green-600"
                        onClick={() => markAsCompleted(order.order_id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details #{selectedOrder?.order_id}</DialogTitle>
              <DialogDescription>
                Customer: {selectedOrder?.customer_name}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Card</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Shipping</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder && (
                    <TableRow>
                      <TableCell>{selectedOrder.card_name}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                          {selectedOrder.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{selectedOrder.service_type}</TableCell>
                      <TableCell>{selectedOrder.shipping_method}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}