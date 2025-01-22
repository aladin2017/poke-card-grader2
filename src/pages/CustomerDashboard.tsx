import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface GradingDetails {
  centering: number;
  surfaces: number;
  edges: number;
  corners: number;
  finalGrade: number;
}

interface Order {
  id: string;
  order_id: string;
  card_name: string;
  service_type: string;
  status: string;
  created_at: string;
  grading_details: GradingDetails | null;
}

const CustomerDashboard = () => {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const { data: orderData, error } = await supabase
        .from('card_gradings')
        .select(`
          id,
          order_id,
          card_name,
          service_type,
          status,
          created_at,
          grading_details
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure grading_details is properly typed
      return (orderData || []).map(order => ({
        ...order,
        grading_details: order.grading_details as GradingDetails | null
      })) as Order[];
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "rejected":
        return "destructive";
      case "queued":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return <div className="container mx-auto pt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Card Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.order_id}</TableCell>
                  <TableCell>{order.card_name}</TableCell>
                  <TableCell>{order.service_type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {order.status === 'completed' && order.grading_details ? (
                      <div className="space-y-1">
                        <p className="font-bold">Final Grade: {order.grading_details.finalGrade}</p>
                        <p className="text-sm text-muted-foreground">
                          Centering: {order.grading_details.centering} | 
                          Surfaces: {order.grading_details.surfaces} | 
                          Edges: {order.grading_details.edges} | 
                          Corners: {order.grading_details.corners}
                        </p>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;