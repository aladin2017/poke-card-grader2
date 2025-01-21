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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface QueueItem {
  id: string;
  cardName: string;
  condition: string;
  customer: string;
  priority: "high" | "normal";
  status: "queued" | "in_progress" | "completed";
}

export function GradingQueue() {
  const { toast } = useToast();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([
    {
      id: "1",
      cardName: "Charizard Base Set",
      condition: "Near Mint",
      customer: "John Doe",
      priority: "high",
      status: "queued",
    },
    {
      id: "2",
      cardName: "Pikachu Illustrator",
      condition: "Excellent",
      customer: "Jane Smith",
      priority: "normal",
      status: "queued",
    },
  ]);

  const handleStartGrading = (itemId: string) => {
    setQueueItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, status: "in_progress" }
          : item
      )
    );
    toast({
      title: "Grading Started",
      description: `Started grading process for card ${itemId}`,
    });
  };

  const handleMarkComplete = (itemId: string) => {
    setQueueItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, status: "completed" }
          : item
      )
    );
    toast({
      title: "Grading Completed",
      description: `Card ${itemId} has been successfully graded`,
    });
  };

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
              <TableHead>Status</TableHead>
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
                  <Badge
                    variant={
                      item.status === "completed"
                        ? "default"
                        : item.status === "in_progress"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {item.status === "queued" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStartGrading(item.id)}
                      >
                        Start Grading
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                    {item.status === "in_progress" && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600"
                        onClick={() => handleMarkComplete(item.id)}
                      >
                        Mark Complete
                        <CheckCircle className="ml-2 h-4 w-4" />
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