import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { GradingDetails } from "@/types/grading";

interface CardData {
  id: string;
  card_name: string;
  year: string;
  set_name: string;
  card_number: string | null;
  variant: string | null;
  status: string;
  grading_details: GradingDetails | null;
  front_image_url: string | null;
  back_image_url: string | null;
  customer_name: string;
  order_id: string;
}

export const CardVerification = () => {
  const [ean8, setEan8] = useState("");
  const { toast } = useToast();

  const { data: cardData, isLoading } = useQuery({
    queryKey: ['card', ean8],
    queryFn: async (): Promise<CardData | null> => {
      if (!ean8 || ean8.length !== 8) return null;

      const { data, error } = await supabase
        .from('card_gradings')
        .select('*')
        .eq('ean8', ean8)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Not found error code
          console.error('Error fetching card:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "A apărut o eroare la căutarea cardului. Vă rugăm să încercați din nou.",
          });
        }
        return null;
      }

      // Safely convert the grading_details from JSON to GradingDetails type
      const gradingDetails = data.grading_details as unknown as GradingDetails;
      
      // Validate that the grading details have all required properties
      const isValidGradingDetails = gradingDetails && 
        typeof gradingDetails.centering === 'number' &&
        typeof gradingDetails.surfaces === 'number' &&
        typeof gradingDetails.edges === 'number' &&
        typeof gradingDetails.corners === 'number' &&
        typeof gradingDetails.finalGrade === 'number';

      return {
        ...data,
        grading_details: isValidGradingDetails ? gradingDetails : null
      };
    },
    enabled: ean8.length === 8,
  });

  const getGradeLabel = (grade: number) => {
    if (grade >= 10) return "Pristine (10)";
    if (grade >= 9.5) return "Gem Mint (9.5)";
    if (grade >= 9) return "Mint (9)";
    if (grade >= 8.5) return "Near Mint-Mint (8.5)";
    if (grade >= 8) return "Near Mint (8)";
    return grade.toString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "rejected":
        return "destructive";
      case "in_progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-transparent px-4">
      <div className="w-full max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
          Card Verification System
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Introduceți numărul unic de certificare al cardului pentru a verifica autenticitatea și detaliile de gradare
        </p>
      </div>

      <div className="w-full max-w-xl mx-auto flex gap-4 mb-8">
        <Input
          type="text"
          placeholder="Introduceți numărul unic de certificare"
          value={ean8}
          onChange={(e) => setEan8(e.target.value)}
          className="text-lg"
          maxLength={8}
        />
        <Button disabled={ean8.length !== 8 || isLoading} size="lg">
          <Search className="mr-2 h-5 w-5" />
          Verifică
        </Button>
      </div>

      {isLoading && (
        <Alert className="w-full max-w-xl mx-auto mb-8">
          <AlertDescription>
            Se caută cardul...
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && ean8.length === 8 && !cardData && (
        <Alert className="w-full max-w-xl mx-auto mb-8">
          <AlertDescription>
            Nu s-a găsit niciun card cu acest număr de certificare. Vă rugăm să verificați numărul și să încercați din nou.
          </AlertDescription>
        </Alert>
      )}

      {cardData && (
        <Card className="w-full max-w-4xl mx-auto animate-fade-up">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{cardData.card_name}</span>
              {cardData.grading_details && (
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  Grad: {getGradeLabel(cardData.grading_details.finalGrade)}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Detalii Card</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">An</p>
                      <p className="font-medium">{cardData.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Set</p>
                      <p className="font-medium">{cardData.set_name}</p>
                    </div>
                    {cardData.card_number && (
                      <div>
                        <p className="text-sm text-gray-500">Număr Card</p>
                        <p className="font-medium">{cardData.card_number}</p>
                      </div>
                    )}
                    {cardData.variant && (
                      <div>
                        <p className="text-sm text-gray-500">Variantă</p>
                        <p className="font-medium">{cardData.variant}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant={getStatusBadgeVariant(cardData.status)}>
                        {cardData.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Număr Certificare</p>
                      <p className="font-medium font-mono">{ean8}</p>
                    </div>
                  </div>
                </div>

                {cardData.grading_details && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Detalii Gradare</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Centrare</p>
                        <p className="font-medium">{cardData.grading_details.centering}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Suprafețe</p>
                        <p className="font-medium">{cardData.grading_details.surfaces}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Margini</p>
                        <p className="font-medium">{cardData.grading_details.edges}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Colțuri</p>
                        <p className="font-medium">{cardData.grading_details.corners}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {(cardData.front_image_url || cardData.back_image_url) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Imagini Card</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {cardData.front_image_url && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Față</p>
                        <img
                          src={cardData.front_image_url}
                          alt="Card Front"
                          className="w-full h-96 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {cardData.back_image_url && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Spate</p>
                        <img
                          src={cardData.back_image_url}
                          alt="Card Back"
                          className="w-full h-96 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};