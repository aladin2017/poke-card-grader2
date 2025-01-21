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
import { ArrowRight, CheckCircle, ClipboardEdit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface QueueItem {
  id: string;
  cardName: string;
  condition: string;
  customer: string;
  priority: "high" | "normal";
  status: "queued" | "in_progress" | "completed";
  ean8?: string;
  gradingDetails?: {
    centering: number;
    surfaces: number;
    edges: number;
    corners: number;
    finalGrade: number;
  };
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

  // Function to generate a valid EAN8 number
  const generateEAN8 = (): string => {
    // Generate 7 random digits (the 8th will be the check digit)
    const generateNumber = () => {
      let num = '';
      for(let i = 0; i < 7; i++) {
        num += Math.floor(Math.random() * 10);
      }
      return num;
    };

    // Calculate check digit according to EAN8 algorithm
    const calculateCheckDigit = (digits: string): number => {
      let sum = 0;
      for(let i = 0; i < digits.length; i++) {
        const digit = parseInt(digits[i]);
        sum += digit * (i % 2 === 0 ? 3 : 1);
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      return checkDigit;
    };

    // Generate unique EAN8
    const generateUniqueEAN8 = (): string => {
      const digits = generateNumber();
      const checkDigit = calculateCheckDigit(digits);
      const ean8 = digits + checkDigit;
      
      // Check if this EAN8 is already used
      const isUsed = queueItems.some(item => item.ean8 === ean8);
      if (isUsed) {
        // If used, generate a new one recursively
        return generateUniqueEAN8();
      }
      return ean8;
    };

    return generateUniqueEAN8();
  };

  const handleStartGrading = (itemId: string) => {
    setQueueItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, status: "in_progress", ean8: generateEAN8() }
          : item
      )
    );
    toast({
      title: "Grading Started",
      description: `Started grading process for card ${itemId}`,
    });
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "text-green-500";
    if (grade >= 7) return "text-yellow-500";
    return "text-red-500";
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

  const handleGradingSubmit = (itemId: string, gradingDetails: QueueItem['gradingDetails']) => {
    setQueueItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, gradingDetails }
          : item
      )
    );
    toast({
      title: "Grading Details Saved",
      description: `Grading details for card ${itemId} have been saved successfully`,
    });
  };

  const GradingForm = ({ item }: { item: QueueItem }) => {
    const [centering, setCentering] = useState<number>(0);
    const [surfaces, setSurfaces] = useState<number>(0);
    const [edges, setEdges] = useState<number>(0);
    const [corners, setCorners] = useState<number>(0);

    const calculateFinalGrade = () => {
      const grades = [centering, surfaces, edges, corners];
      const sum = grades.reduce((acc, curr) => acc + curr, 0);
      return Number((sum / grades.length).toFixed(2));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const finalGrade = calculateFinalGrade();
      handleGradingSubmit(item.id, {
        centering,
        surfaces,
        edges,
        corners,
        finalGrade,
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="centering">Centering (0-10)</Label>
            <Input
              id="centering"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={centering}
              onChange={(e) => setCentering(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surfaces">Surfaces (0-10)</Label>
            <Input
              id="surfaces"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={surfaces}
              onChange={(e) => setSurfaces(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edges">Edges (0-10)</Label>
            <Input
              id="edges"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={edges}
              onChange={(e) => setEdges(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="corners">Corners (0-10)</Label>
            <Input
              id="corners"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={corners}
              onChange={(e) => setCorners(Number(e.target.value))}
              required
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Final Grade:</span>
            <span className={cn("text-xl font-bold", getGradeColor(calculateFinalGrade()))}>
              {calculateFinalGrade()}
            </span>
          </div>
          <Button type="submit" className="w-full">Save Grading Details</Button>
        </div>
      </form>
    );
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
              <TableHead>EAN8</TableHead>
              <TableHead>Grade</TableHead>
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
                  {item.ean8 && (
                    <span className="font-mono">{item.ean8}</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.gradingDetails && (
                    <span className={cn("font-bold", getGradeColor(item.gradingDetails.finalGrade))}>
                      {item.gradingDetails.finalGrade}
                    </span>
                  )}
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
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                            >
                              Grade Card
                              <ClipboardEdit className="ml-2 h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Grade Card: {item.cardName}</DialogTitle>
                            </DialogHeader>
                            <GradingForm item={item} />
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600"
                          onClick={() => handleMarkComplete(item.id)}
                        >
                          Mark Complete
                          <CheckCircle className="ml-2 h-4 w-4" />
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
