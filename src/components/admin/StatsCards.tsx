import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Clock, DollarSign } from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      title: "Total Orders",
      value: "156",
      icon: Package,
      description: "Last 30 days",
    },
    {
      title: "Active Customers",
      value: "89",
      icon: Users,
      description: "↗︎ 10% from last month",
    },
    {
      title: "Pending Orders",
      value: "12",
      icon: Clock,
      description: "Requires attention",
    },
    {
      title: "Revenue",
      value: "€2,345",
      icon: DollarSign,
      description: "Last 30 days",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}