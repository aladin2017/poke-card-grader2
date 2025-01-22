import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GradeCard as IGradeCard, GradeDetails } from "@/types/grading";

interface Props {
  card: IGradeCard;
  onGradeSubmit: (cardId: string, details: GradeDetails) => void;
}

export function GradeCard({ card, onGradeSubmit }: Props) {
  const { toast } = useToast();
  const [centering, setCentering] = useState(0);
  const [corners, setCorners] = useState(0);
  const [edges, setEdges] = useState(0);
  const [surface, setSurface] = useState(0);
  const [notes, setNotes] = useState("");
  const [frontImage, setFrontImage] = useState("");
  const [backImage, setBackImage] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "front") {
          setFrontImage(reader.result as string);
        } else {
          setBackImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateFinalGrade = () => {
    const total = centering + corners + edges + surface;
    return parseFloat((total / 4).toFixed(1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (centering === 0 || corners === 0 || edges === 0 || surface === 0) {
      toast({
        title: "Error",
        description: "All grading criteria must be filled out",
        variant: "destructive",
      });
      return;
    }

    const gradeDetails: GradeDetails = {
      centering,
      corners,
      edges,
      surface,
      finalGrade: calculateFinalGrade(),
      notes,
      frontImage,
      backImage,
    };

    onGradeSubmit(card.id, gradeDetails);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Card: {card.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Centering (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={centering}
                onChange={(e) => setCentering(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Corners (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={corners}
                onChange={(e) => setCorners(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Edges (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={edges}
                onChange={(e) => setEdges(parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Surface (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={surface}
                onChange={(e) => setSurface(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about the card's condition..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Front Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "front")}
              />
              {frontImage && (
                <img
                  src={frontImage}
                  alt="Card Front"
                  className="mt-2 max-h-40 object-contain"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Back Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "back")}
              />
              {backImage && (
                <img
                  src={backImage}
                  alt="Card Back"
                  className="mt-2 max-h-40 object-contain"
                />
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold">
                Final Grade: {calculateFinalGrade()}
              </span>
            </div>
            <Button type="submit">Submit Grade</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}