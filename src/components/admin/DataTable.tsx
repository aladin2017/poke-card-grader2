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
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  customer: string;
  cards: Array<{
    name: string;
    condition: string;
    ean8?: string;
    priority?: "high" | "normal";
    status: "pending" | "queued" | "completed" | "rejected";
    notes?: string;
  }>;
  status: "pending" | "queued" | "completed" | "rejected";
  date: string;
  total: string;
}

interface DataTableProps {
  showAll?: boolean;
}

export function DataTable({ showAll = false }: DataTableProps) {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [showAll]);

  const fetchOrders = async () => {
    try {
      const { data: cardGradings, error } = await supabase
        .from('card_gradings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group cards by order_id
      const orderMap = new Map();
      cardGradings?.forEach(grading => {
        if (!orderMap.has(grading.order_id)) {
          orderMap.set(grading.order_id, {
            id: grading.order_id,
            customer: grading.customer_name,
            cards: [],
            status: grading.status,
            date: new Date(grading.created_at).toLocaleDateString(),
            total: calculateTotal(grading.service_type, 1, grading.shipping_method),
          });
        }
        
        orderMap.get(grading.order_id).cards.push({
          name: grading.card_name,
          condition: 'Pending Review',
          ean8: grading.ean8,
          status: grading.status,
          notes: grading.notes,
        });

        // Update total based on all cards
        const order = orderMap.get(grading.order_id);
        order.total = calculateTotal(
          grading.service_type,
          order.cards.length,
          grading.shipping_method
        );
      });

      const formattedOrders = Array.from(orderMap.values());
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
      });
    }
  };

  const calculateTotal = (serviceType: string, cardCount: number, shippingMethod: string) => {
    const servicePrice = {
      standard: 15,
      medium: 20,
      priority: 25,
    }[serviceType] || 15;

    const shippingPrice = {
      standard: 10,
      express: 25,
    }[shippingMethod] || 10;

    return `$${(servicePrice * cardCount) + shippingPrice}.00`;
  };

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

      fetchOrders();
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

      fetchOrders();
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

      fetchOrders();
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

  const displayedOrders = showAll 
    ? orders.filter(order => order.status === "completed" || order.status === "rejected")
    : orders.filter(order => order.status === "pending" || order.status === "queued");

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
              <TableHead>Cards</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.cards.length}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total}</TableCell>
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
                          onClick={() => moveToQueue(order.id)}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-600"
                          onClick={() => handleRejectOrder(order.id)}
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
                        onClick={() => markAsCompleted(order.id)}
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
              <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
              <DialogDescription>
                Customer: {selectedOrder?.customer}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Card</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>EAN8</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder?.cards.map((card, index) => (
                    <TableRow key={index}>
                      <TableCell>{card.name}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(card.status)}>
                          {card.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono">{card.ean8 || 'N/A'}</span>
                      </TableCell>
                      <TableCell>{card.notes || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}