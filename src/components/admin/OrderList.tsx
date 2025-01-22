import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { GradingOrder, OrderStatus } from "@/types/orders";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function OrderList() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<GradingOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<GradingOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = localStorage.getItem('gradingOrders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    };

    loadOrders();
    // Set up interval to check for new orders every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );

    localStorage.setItem('gradingOrders', JSON.stringify(orders));

    toast({
      title: "Status actualizat",
      description: `Comanda #${orderId} a fost actualizată la ${newStatus}`,
    });
  };

  const handlePriorityToggle = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, priority: !order.priority }
          : order
      )
    );

    localStorage.setItem('gradingOrders', JSON.stringify(orders));
  };

  const handleSaveNotes = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, internalNotes }
          : order
      )
    );

    localStorage.setItem('gradingOrders', JSON.stringify(orders));
    
    toast({
      title: "Note salvate",
      description: "Notele interne au fost actualizate cu succes.",
    });
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "queued":
        return "bg-blue-500";
      case "in_progress":
        return "bg-purple-500";
      case "completed":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const openOrderDetails = (order: GradingOrder) => {
    setSelectedOrder(order);
    setInternalNotes(order.internalNotes || "");
    setIsDetailsOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comenzi Active</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Comandă</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioritate</TableHead>
              <TableHead>Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={order.priority}
                    onCheckedChange={() => handlePriorityToggle(order.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => openOrderDetails(order)}
                    >
                      Detalii
                    </Button>
                    {order.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, "queued")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(order.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {order.status === "queued" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(order.id, "in_progress")}
                      >
                        Start Grading
                      </Button>
                    )}
                    {order.status === "in_progress" && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(order.id, "completed")}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalii Comandă</DialogTitle>
              <DialogDescription>
                Informații complete despre comandă și cărți
              </DialogDescription>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Informații Client</h3>
                    <p>Nume: {selectedOrder.customerName}</p>
                    <p>Email: {selectedOrder.email}</p>
                    <p>Telefon: {selectedOrder.phone}</p>
                    <p>Adresă: {selectedOrder.address}</p>
                    <p>Oraș: {selectedOrder.city}</p>
                    <p>Județ: {selectedOrder.state}</p>
                    <p>Cod Poștal: {selectedOrder.zipCode}</p>
                    <p>Țară: {selectedOrder.country}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Detalii Comandă</h3>
                    <p>Tip Serviciu: {selectedOrder.serviceType}</p>
                    <p>Metoda Livrare: {selectedOrder.shippingMethod}</p>
                    <p>Total: ${selectedOrder.totalAmount}</p>
                    <p>Status: {selectedOrder.status}</p>
                    <p>Data Creare: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p>Ultima Actualizare: {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Cărți ({selectedOrder.cards.length})</h3>
                  <div className="space-y-2">
                    {selectedOrder.cards.map((card, index) => (
                      <div key={card.id} className="border p-2 rounded">
                        <p className="font-medium">Card #{index + 1}</p>
                        <p>Nume: {card.name}</p>
                        <p>An: {card.year}</p>
                        <p>Set: {card.set}</p>
                        {card.cardNumber && <p>Număr Card: {card.cardNumber}</p>}
                        {card.variant && <p>Variantă: {card.variant}</p>}
                        {card.notes && <p>Note: {card.notes}</p>}
                        {card.gradingDetails && (
                          <div className="mt-2">
                            <p className="font-medium">Detalii Gradare:</p>
                            <p>Centrare: {card.gradingDetails.centering}</p>
                            <p>Suprafețe: {card.gradingDetails.surfaces}</p>
                            <p>Margini: {card.gradingDetails.edges}</p>
                            <p>Colțuri: {card.gradingDetails.corners}</p>
                            <p>Nota Finală: {card.gradingDetails.finalGrade}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="internalNotes">Note Interne</Label>
                  <Textarea
                    id="internalNotes"
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="mt-1"
                  />
                  <Button
                    onClick={() => handleSaveNotes(selectedOrder.id)}
                    className="mt-2"
                  >
                    Salvează Note
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}