import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Clock, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GradingStats {
  total_orders: string;  // Changed from number to string to handle bigint
  pending_orders: string;
  completed_orders: string;
  rejected_orders: string;
  avg_completion_time: string | null;
  total_revenue: number;  // This stays as number since it's numeric in DB
  orders_this_month: string;
}

export function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['grading-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_grading_stats');

      if (error) {
        console.error('Error fetching stats:', error);
        throw error;
      }

      return data[0] as GradingStats;
    },
  });

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  const formatCompletionTime = (timeStr: string | null) => {
    if (!timeStr) return 'N/A';
    // Parse the interval string and return a human-readable format
    const match = timeStr.match(/(\d+):(\d+):(\d+)/);
    if (!match) return timeStr;
    const [_, hours, minutes] = match;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Orders
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_orders || '0'}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.orders_this_month || '0'} this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Orders
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.pending_orders || '0'}</div>
          <p className="text-xs text-muted-foreground">
            Requires attention
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Orders
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.completed_orders || '0'}</div>
          <p className="text-xs text-muted-foreground">
            Avg. time: {formatCompletionTime(stats?.avg_completion_time)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{stats?.total_revenue || 0}</div>
          <p className="text-xs text-muted-foreground">
            Total earnings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}