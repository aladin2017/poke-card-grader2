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
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface Order {
  id: string;
  customer: string;
  cards: number;
  status: "pending" | "completed" | "rejected";
  date: string;
  total: string;
}

interface DataTableProps {
  showAll?: boolean;
}

export function DataTable({ showAll = false }: DataTableProps) {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Get orders from localStorage
    const storedOrders = localStorage.getItem('gradingOrders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      // Transform the grading form data into the Order format
      const formattedOrders = parsedOrders.map((order: any, index: number) => ({
        id: (index + 1).toString(),
        customer: `${order.fullName}`,
        cards: order.cards.length,
        status: "pending" as const,
        date: new Date().toISOString().split('T')[0],
        total: calculateTotal(order.package, order.cards.length),
      }));
      setOrders(formattedOrders);
    }
  }, []);

  const calculateTotal = (packageType: string, cardCount: number) => {
    const basePrice = packageType === 'premium' ? 25 : 15;
    return `€${basePrice * cardCount}.00`;
  };

  const handleViewOrder = (orderId: string) => {
    toast({
      title: "Viewing Order Details",
      description: `Viewing details for order #${orderId}`,
    });
  };

  const handleApproveOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "completed" as const }
        : order
    ));
    toast({
      title: "Order Approved",
      description: `Order #${orderId} has been approved successfully.`,
    });
  };

  const handleRejectOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "rejected" as const }
        : order
    ));
    toast({
      title: "Order Rejected",
      description: `Order #${orderId} has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{showAll ? "Grading History" : "Recent Orders"}</CardTitle>
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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.cards}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
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
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {order.status === "pending" && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-green-600"
                          onClick={() => handleApproveOrder(order.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}