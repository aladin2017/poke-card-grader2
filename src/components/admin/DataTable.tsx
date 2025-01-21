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

interface DataTableProps {
  showAll?: boolean;
}

export function DataTable({ showAll = false }: DataTableProps) {
  // Mock data - in a real app, this would come from your backend
  const orders = [
    {
      id: "1",
      customer: "John Doe",
      cards: 3,
      status: "pending",
      date: "2024-02-20",
      total: "€45.00",
    },
    {
      id: "2",
      customer: "Jane Smith",
      cards: 1,
      status: "completed",
      date: "2024-02-19",
      total: "€15.00",
    },
  ];

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
                    variant={order.status === "completed" ? "default" : "secondary"}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-green-600">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600">
                      <XCircle className="h-4 w-4" />
                    </Button>
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