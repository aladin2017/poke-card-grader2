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

interface Order {
  id: string;
  customer: string;
  cards: number;
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

  useEffect(() => {
    const storedOrders = localStorage.getItem('gradingOrders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      const formattedOrders = parsedOrders.map((order: any, index: number) => ({
        id: (index + 1).toString(),
        customer: `${order.fullName}`,
        cards: order.cards.length,
        status: order.status || "pending",
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
      title: "Vizualizare Comandă",
      description: `Se vizualizează detaliile comenzii #${orderId}`,
    });
  };

  const moveToQueue = (orderId: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "queued" }
        : order
    );
    setOrders(updatedOrders);
    updateLocalStorage(orderId, "queued");
    
    toast({
      title: "Comandă în procesare",
      description: `Comanda #${orderId} a fost mutată în coada de gradare.`,
    });
  };

  const markAsCompleted = (orderId: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "completed" }
        : order
    );
    setOrders(updatedOrders);
    updateLocalStorage(orderId, "completed");

    toast({
      title: "Gradare finalizată",
      description: `Comanda #${orderId} a fost finalizată cu succes.`,
    });
  };

  const handleRejectOrder = (orderId: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "rejected" }
        : order
    );
    setOrders(updatedOrders);
    updateLocalStorage(orderId, "rejected");

    toast({
      title: "Comandă respinsă",
      description: `Comanda #${orderId} a fost respinsă.`,
      variant: "destructive",
    });
  };

  const updateLocalStorage = (orderId: string, newStatus: string) => {
    const storedOrders = localStorage.getItem('gradingOrders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      const updatedStoredOrders = parsedOrders.map((order: any, index: number) => {
        if ((index + 1).toString() === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      localStorage.setItem('gradingOrders', JSON.stringify(updatedStoredOrders));
    }
  };

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

  const displayedOrders = showAll 
    ? orders.filter(order => order.status === "completed" || order.status === "rejected")
    : orders.filter(order => order.status === "pending" || order.status === "queued");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{showAll ? "Istoric Gradări" : "Comenzi Active"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Comandă</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Cărți</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dată</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.cards}</TableCell>
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
                      onClick={() => handleViewOrder(order.id)}
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
      </CardContent>
    </Card>
  );
}