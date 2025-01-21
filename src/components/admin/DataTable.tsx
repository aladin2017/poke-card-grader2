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
} from "@/components/ui/dialog";

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

const generateEAN8 = (existingEAN8s: string[]): string => {
  const generateNumber = () => {
    let num = '';
    for(let i = 0; i < 7; i++) {
      num += Math.floor(Math.random() * 10);
    }
    return num;
  };

  const calculateCheckDigit = (digits: string): number => {
    let sum = 0;
    for(let i = 0; i < digits.length; i++) {
      const digit = parseInt(digits[i]);
      sum += digit * (i % 2 === 0 ? 3 : 1);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
  };

  const generateUniqueEAN8 = (): string => {
    const digits = generateNumber();
    const checkDigit = calculateCheckDigit(digits);
    const ean8 = digits + checkDigit;
    
    if (existingEAN8s.includes(ean8)) {
      return generateUniqueEAN8();
    }
    return ean8;
  };

  return generateUniqueEAN8();
};

export function DataTable({ showAll = false }: DataTableProps) {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    const storedOrders = localStorage.getItem('gradingOrders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      const formattedOrders: Order[] = parsedOrders.map((order: any, index: number) => ({
        id: (index + 1).toString(),
        customer: `${order.fullName}`,
        cards: order.cards.map((card: any) => ({
          name: card.name || 'Unnamed Card',
          condition: card.condition || 'Unknown',
          status: order.status || "pending",
          priority: "normal",
          notes: card.notes
        })),
        status: (order.status as Order['status']) || "pending",
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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const moveToQueue = (orderId: string) => {
    const existingEAN8s = orders.flatMap(order => 
      order.cards.map(card => card.ean8 || '')
    ).filter(Boolean);

    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedCards = order.cards.map(card => ({
          ...card,
          status: "queued" as const,
          ean8: generateEAN8(existingEAN8s)
        }));
        return { 
          ...order, 
          status: "queued" as const,
          cards: updatedCards
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    updateLocalStorage(orderId, "queued", updatedOrders);
    
    toast({
      title: "Comandă în procesare",
      description: `Comanda #${orderId} a fost mutată în coada de gradare.`,
    });
  };

  const markAsCompleted = (orderId: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedCards = order.cards.map(card => ({
          ...card,
          status: "completed" as const
        }));
        return { 
          ...order, 
          status: "completed" as const,
          cards: updatedCards
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    updateLocalStorage(orderId, "completed", updatedOrders);

    toast({
      title: "Gradare finalizată",
      description: `Comanda #${orderId} a fost finalizată cu succes.`,
    });
  };

  const handleRejectOrder = (orderId: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedCards = order.cards.map(card => ({
          ...card,
          status: "rejected" as const
        }));
        return { 
          ...order, 
          status: "rejected" as const,
          cards: updatedCards
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    updateLocalStorage(orderId, "rejected", updatedOrders);

    toast({
      title: "Comandă respinsă",
      description: `Comanda #${orderId} a fost respinsă.`,
      variant: "destructive",
    });
  };

  const updateLocalStorage = (orderId: string, newStatus: Order['status'], updatedOrders: Order[]) => {
    localStorage.setItem('gradingOrders', JSON.stringify(updatedOrders));
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
              <DialogTitle>Detalii Comandă #{selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Client: {selectedOrder?.customer}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Card</TableHead>
                    <TableHead>Condiție</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>EAN8</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder?.cards.map((card, index) => (
                    <TableRow key={index}>
                      <TableCell>{card.name}</TableCell>
                      <TableCell>{card.condition}</TableCell>
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