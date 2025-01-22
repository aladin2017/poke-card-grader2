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
          <CardTitle className="text-2xl">Thank You for Your Order!</CardTitle>
          <CardDescription className="text-lg mt-2">
            Your order has been successfully placed and confirmed.
            <br />
            Order Number: <span className="font-semibold">{orderId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4 text-gray-600">
            <p>
              We have received your card grading submission and our team will start processing it shortly.
              You can track the status of your cards through your account dashboard.
            </p>
            <p>
              A confirmation email has been sent to your email address with all the order details.
            </p>
            <p className="font-medium">
              Thank you for choosing our card grading service!
            </p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;