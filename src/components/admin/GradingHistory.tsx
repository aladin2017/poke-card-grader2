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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type OrderStatus = Database["public"]["Enums"]["order_status"];

interface GradingDetails {
  centering: number;
  surfaces: number;
  edges: number;
  corners: number;
  finalGrade: number;
}

interface GradingHistoryProps {
  session: any;
}

const getGradeColor = (grade: number) => {
  if (grade >= 9) return "text-green-500";
  if (grade >= 7) return "text-yellow-500";
  return "text-red-500";
};

const isGradingDetails = (details: any): details is GradingDetails => {
  return (
    details &&
    typeof details === 'object' &&
    'centering' in details &&
    'surfaces' in details &&
    'edges' in details &&
    'corners' in details &&
    'finalGrade' in details
  );
};

export function GradingHistory({ session }: GradingHistoryProps) {
  const { toast } = useToast();
  
  const { data: historyItems = [], isLoading } = useQuery({
    queryKey: ['grading-history', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to view grading history.",
        });
        return [];
      }

      // First check if user is admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user profile. Please try again.",
        });
        return [];
      }

      // Fetch both card gradings and their history
      const { data: gradings, error: gradingsError } = await supabase
        .from('card_gradings')
        .select(`
          *,
          card_grading_history (
            *
          )
        `)
        .in('status', ['completed', 'rejected'])
        .order('graded_at', { ascending: false });

      if (gradingsError) {
        console.error('Error fetching history:', gradingsError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch grading history. Please try again.",
        });
        throw gradingsError;
      }

      // If user is not admin, filter to show only their cards
      if (profileData?.role !== 'admin') {
        return gradings?.filter(grading => grading.user_id === session.user.id) || [];
      }

      return gradings || [];
    },
    enabled: !!session?.user?.id,
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
              <TableHead>Notes</TableHead>
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
                        : item.status === "rejected"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.grading_details && isGradingDetails(item.grading_details) && (
                    <span className={cn("font-bold", getGradeColor(item.grading_details.finalGrade))}>
                      {item.grading_details.finalGrade}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {item.notes || '-'}
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