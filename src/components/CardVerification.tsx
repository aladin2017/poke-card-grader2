import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { QueueItem } from "@/types/grading";
import { Search } from "lucide-react";

export const CardVerification = () => {
  const [ean8, setEan8] = useState("");
  const [cardData, setCardData] = useState<QueueItem | null>(null);
  const { toast } = useToast();

  const verifyCard = () => {
    if (ean8.length === 8) {
      const mockData: QueueItem = {
        id: "1",
        cardName: "Charizard Base Set",
        condition: "Near Mint",
        customer: "John Doe",
        priority: "high",
        status: "completed",
        ean8: ean8,
        orderId: "order1",
        gradingDetails: {
          centering: 9.5,
          surfaces: 9.0,
          edges: 9.5,
          corners: 9.0,
          finalGrade: 9.5,
          frontImage: "https://placehold.co/400x600",
          backImage: "https://placehold.co/400x600"
        }
      };
      setCardData(mockData);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid 8-digit unique card number",
      });
    }
  };

  const getGradeLabel = (grade: number) => {
    if (grade === 10.5) return "Pristine (10+)";
    return grade.toString();
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-transparent px-4">
      <div className="w-full max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
          Card Verification System
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Enter your card's unique certification number to verify its authenticity and view grading details
        </p>
      </div>

      <div className="w-full max-w-xl mx-auto flex gap-4 mb-8">
        <Input
          type="text"
          placeholder="Enter unique certification number"
          value={ean8}
          onChange={(e) => setEan8(e.target.value)}
          className="text-lg"
          maxLength={8}
        />
        <Button onClick={verifyCard} size="lg">
          <Search className="mr-2 h-5 w-5" />
          Verify
        </Button>
      </div>

      {cardData && (
        <Card className="w-full max-w-4xl mx-auto animate-fade-up">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{cardData.cardName}</span>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                Grade: {getGradeLabel(cardData.gradingDetails?.finalGrade || 0)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Card Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-medium">{cardData.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Certification Number</p>
                      <p className="font-medium font-mono">{cardData.ean8}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Grading Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Centering</p>
                      <p className="font-medium">{cardData.gradingDetails?.centering}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Surfaces</p>
                      <p className="font-medium">{cardData.gradingDetails?.surfaces}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Edges</p>
                      <p className="font-medium">{cardData.gradingDetails?.edges}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Corners</p>
                      <p className="font-medium">{cardData.gradingDetails?.corners}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Card Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Front</p>
                      <img
                        src={cardData.gradingDetails?.frontImage}
                        alt="Card Front"
                        className="w-full h-96 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Back</p>
                      <img
                        src={cardData.gradingDetails?.backImage}
                        alt="Card Back"
                        className="w-full h-96 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};