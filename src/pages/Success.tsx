import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!orderId) {
      toast({
        title: "Error",
        description: "No order ID found. Please try again.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [orderId, navigate, toast]);

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your order. Your order number is: {orderId}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We will start processing your card grading request shortly. You can track the status of your order in your account.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/")}>
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;