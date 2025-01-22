import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = Database["public"]["Enums"]["order_status"];

interface GradingDetails {
  centering: number;
  surfaces: number;
  edges: number;
  corners: number;
  finalGrade: number;
}

interface CardGrading {
  card_name: string;
  order_id: string;
  customer_name: string;
  ean8: string;
  grading_details: GradingDetails | null;
}

interface HistoryItem {
  id: string;
  changed_at: string;
  status: OrderStatus;
  notes: string | null;
  card_gradings: CardGrading | null;
}

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
        .from('card_grading_history')
        .select(`
          *,
          card_gradings (
            card_name,
            order_id,
            customer_name,
            ean8,
            grading_details
          )
        `)
        .in('status', ['completed', 'rejected'])
        .order('changed_at', { ascending: false });

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
        card_gradings: item.card_gradings ? {
          ...item.card_gradings,
          grading_details: item.card_gradings.grading_details as unknown as GradingDetails | null
        } : null
      })) as HistoryItem[];
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
                  {format(new Date(item.changed_at), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell>{item.card_gradings?.order_id}</TableCell>
                <TableCell>{item.card_gradings?.card_name}</TableCell>
                <TableCell>{item.card_gradings?.customer_name}</TableCell>
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
                  {item.card_gradings?.grading_details?.finalGrade || '-'}
                </TableCell>
                <TableCell>
                  <span className="font-mono">{item.card_gradings?.ean8 || '-'}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}