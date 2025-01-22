import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type OrderStatus = Database["public"]["Enums"]["order_status"];

interface GradingDetails {
  centering: number;
  surfaces: number;
  edges: number;
  corners: number;
  finalGrade: number;
}

const getGradeColor = (grade: number) => {
  if (grade >= 9) return "text-green-500";
  if (grade >= 7) return "text-yellow-500";
  return "text-red-500";
};

export function GradingHistory() {
  const { toast } = useToast();
  
  const { data: historyItems = [], isLoading } = useQuery({
    queryKey: ['grading-history'],
    queryFn: async () => {
      // First check if user is admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError || profileData?.role !== 'admin') {
        console.error('Error fetching profile or user is not admin:', profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "You don't have permission to view grading history.",
        });
        return [];
      }

      const { data, error } = await supabase
        .from('card_gradings')
        .select('*')
        .in('status', ['completed', 'rejected'])
        .order('graded_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch grading history. Please try again.",
        });
        throw error;
      }

      return (data || []).map(item => ({
        ...item,
        grading_details: item.grading_details as GradingDetails
      }));
    },
  });

  if (isLoading) {
    return <div>Loading history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grading History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Card</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>EAN8</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.graded_at ? format(new Date(item.graded_at), 'dd/MM/yyyy HH:mm') : '-'}
                </TableCell>
                <TableCell>{item.order_id}</TableCell>
                <TableCell>{item.card_name}</TableCell>
                <TableCell>{item.customer_name}</TableCell>
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
                  {item.grading_details && (
                    <span className={cn("font-bold", getGradeColor(item.grading_details.finalGrade))}>
                      {item.grading_details.finalGrade}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-mono">{item.ean8}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}