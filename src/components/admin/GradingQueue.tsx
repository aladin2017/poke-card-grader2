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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const gradeScales = [
  { value: "10+", label: "Pristine (10+)" },
  { value: "10", label: "Gem-Mint (10)" },
  { value: "9", label: "Mint (9)" },
  { value: "8", label: "Near Mint-Mint (8)" },
  { value: "7", label: "Near Mint (7)" },
  { value: "6", label: "Excellent-Mint (6)" },
  { value: "5", label: "Excellent (5)" },
  { value: "4", label: "Very Good-Excellent (4)" },
  { value: "3", label: "Very Good (3)" },
  { value: "2", label: "Good (2)" },
  { value: "1.5", label: "Fair (1.5)" },
  { value: "1", label: "Poor (1)" }
];

const getGradeColor = (grade: number) => {
  if (grade >= 9) return "text-green-500";
  if (grade >= 7) return "text-yellow-500";
  return "text-red-500";
};

export function GradingQueue() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: queueItems = [], isLoading } = useQuery({
    queryKey: ['grading-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('card_gradings')
        .select('*')
        .eq('status', 'queued')
        .order('created_at', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch queue items. Please try again.",
        });
        throw error;
      }

      return data || [];
    },
  });

  const handleStartGrading = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('card_gradings')
        .update({ status: 'in_progress' })
        .eq('order_id', orderId);

      if (error) throw error;

      toast({
        title: "Grading Started",
        description: `Started grading process for order ${orderId}`,
      });

      queryClient.invalidateQueries({ queryKey: ['grading-queue'] });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start grading. Please try again.",
      });
    }
  };

  const handleMarkComplete = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('card_gradings')
        .update({ status: 'completed' })
        .eq('order_id', orderId);

      if (error) throw error;

      toast({
        title: "Grading Completed",
        description: `Order ${orderId} has been successfully graded`,
      });

      queryClient.invalidateQueries({ queryKey: ['grading-queue'] });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete grading. Please try again.",
      });
    }
  };

  const handleGradingSubmit = async (orderId: string, gradingDetails: any) => {
    try {
      const { error } = await supabase
        .from('card_gradings')
        .update({
          grading_details: gradingDetails,
          status: 'completed'
        })
        .eq('order_id', orderId);

      if (error) throw error;

      toast({
        title: "Grading Details Saved",
        description: `Grading details for order ${orderId} have been saved successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ['grading-queue'] });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save grading details. Please try again.",
      });
    }
  };

  const GradingForm = ({ item }: { item: any }) => {
    const [centering, setCentering] = useState<number>(0);
    const [surfaces, setSurfaces] = useState<number>(0);
    const [edges, setEdges] = useState<number>(0);
    const [corners, setCorners] = useState<number>(0);
    const [finalGrade, setFinalGrade] = useState<string>("");
    const [frontImage, setFrontImage] = useState<string>("");
    const [backImage, setBackImage] = useState<string>("");

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const { data, error } = await supabase.storage
            .from('card-images')
            .upload(`${item.order_id}/${side}`, file);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('card-images')
            .getPublicUrl(data.path);

          if (side === 'front') {
            setFrontImage(publicUrl);
          } else {
            setBackImage(publicUrl);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to upload image. Please try again.",
          });
        }
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!finalGrade) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a final grade.",
        });
        return;
      }

      handleGradingSubmit(item.order_id, {
        centering,
        surfaces,
        edges,
        corners,
        finalGrade: parseFloat(finalGrade),
        frontImage,
        backImage,
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="space-y-2">
          <Label htmlFor="finalGrade">Final Grade</Label>
          <Select onValueChange={setFinalGrade} value={finalGrade}>
            <SelectTrigger>
              <SelectValue placeholder="Select final grade" />
            </SelectTrigger>
            <SelectContent>
              {gradeScales.map((grade) => (
                <SelectItem key={grade.value} value={grade.value}>
                  {grade.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="frontImage">Front Image</Label>
            <Input
              id="frontImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'front')}
              required
            />
            {frontImage && (
              <div className="mt-2">
                <img 
                  src={frontImage} 
                  alt="Card Front" 
                  className="w-full h-40 object-contain border rounded"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="backImage">Back Image</Label>
            <Input
              id="backImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'back')}
              required
            />
            {backImage && (
              <div className="mt-2">
                <img 
                  src={backImage} 
                  alt="Card Back" 
                  className="w-full h-40 object-contain border rounded"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button type="submit" className="w-full">Save Grading Details</Button>
        </div>
      </form>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const customerGroups = queueItems.reduce((groups: { [key: string]: any[] }, item) => {
    if (!groups[item.customer_name]) {
      groups[item.customer_name] = [];
    }
    groups[item.customer_name].push(item);
    return groups;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grading Queue</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(customerGroups).map(([customer, items]) => (
          <div key={customer} className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              {customer} - {items.length} card(s) to grade
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>EAN8</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.card_name}</TableCell>
                    <TableCell>{item.service_type}</TableCell>
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
                      <span className="font-mono">{item.ean8}</span>
                    </TableCell>
                    <TableCell>
                      {item.grading_details && (
                        <span className={cn("font-bold", getGradeColor(item.grading_details.finalGrade))}>
                          {item.grading_details.finalGrade}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {item.status === "queued" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStartGrading(item.order_id)}
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
                                  <DialogTitle>Grade Card: {item.card_name}</DialogTitle>
                                </DialogHeader>
                                <GradingForm item={item} />
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600"
                              onClick={() => handleMarkComplete(item.order_id)}
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
}