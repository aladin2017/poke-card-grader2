import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderList } from "@/components/admin/OrderList";
import { OrderStats } from "@/components/admin/OrderStats";
import { GradingProcess } from "@/components/grading/GradingProcess";
import { GradingOrder } from "@/types/orders";

const Admin = () => {
  const [orders, setOrders] = useState<GradingOrder[]>([]);

  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = localStorage.getItem('gradingOrders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    };

    loadOrders();
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="grading">Grading</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OrderStats orders={orders} />
        </TabsContent>

        <TabsContent value="orders">
          <OrderList />
        </TabsContent>

        <TabsContent value="grading">
          <GradingProcess />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Admin;