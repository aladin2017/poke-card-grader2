import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradingOrder } from "@/types/orders";

interface OrderStatsProps {
  orders: GradingOrder[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  const getAverageProcessingTime = () => {
    const completedOrders = orders.filter(order => order.status === "completed");
    if (completedOrders.length === 0) return 0;

    const totalTime = completedOrders.reduce((sum, order) => {
      const start = new Date(order.createdAt).getTime();
      const end = new Date().getTime();
      return sum + (end - start);
    }, 0);

    return Math.round(totalTime / completedOrders.length / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Venit Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${getTotalRevenue()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comenzi în Așteptare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getOrdersByStatus("pending")}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comenzi în Lucru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getOrdersByStatus("in_progress")}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Timp Mediu Procesare (zile)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getAverageProcessingTime()}</div>
        </CardContent>
      </Card>
    </div>
  );
}