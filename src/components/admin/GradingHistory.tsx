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
  grading_details: GradingDetails | null;
}

interface HistoryItem {
  id: string;
  changed_at: string;
  status: string;
  notes: string | null;
  card_gradings: CardGrading | null;
}

export function GradingHistory() {
  const { data: historyItems = [], isLoading } = useQuery<HistoryItem[]>({
    queryKey: ['grading-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('card_grading_history')
        .select(`
          *,
          card_gradings (
            card_name,
            order_id,
            customer_name,
            grading_details
          )
        `)
        .order('changed_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        throw error;
      }

      return data || [];
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
              <TableHead>Notes</TableHead>
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
                <TableCell>{item.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}