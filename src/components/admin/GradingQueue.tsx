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
import { ArrowRight, CheckCircle } from "lucide-react";

export function GradingQueue() {
  // Mock data - in a real app, this would come from your backend
  const queueItems = [
    {
      id: "1",
      cardName: "Charizard Base Set",
      condition: "Near Mint",
      customer: "John Doe",
      priority: "high",
    },
    {
      id: "2",
      cardName: "Pikachu Illustrator",
      condition: "Excellent",
      customer: "Jane Smith",
      priority: "normal",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grading Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Card</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queueItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.cardName}</TableCell>
                <TableCell>{item.condition}</TableCell>
                <TableCell>{item.customer}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.priority === "high" ? "destructive" : "default"}
                  >
                    {item.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Start Grading
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-green-600">
                      Mark Complete
                      <CheckCircle className="ml-2 h-4 w-4" />
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