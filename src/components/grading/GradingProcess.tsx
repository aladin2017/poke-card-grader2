import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { GradeCard } from "./GradeCard";
import { GradeCard as IGradeCard, GradeDetails, GradeQueue } from "@/types/grading";

export function GradingProcess() {
  const { toast } = useToast();
  const [queue, setQueue] = useState<GradeQueue>({
    cards: [],
    totalCards: 0,
    completedCards: 0,
    averageGrade: 0,
  });
  const [currentCard, setCurrentCard] = useState<IGradeCard | null>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = () => {
    const storedQueue = localStorage.getItem("gradingQueue");
    if (storedQueue) {
      const parsedQueue = JSON.parse(storedQueue);
      setQueue(parsedQueue);
      
      const nextCard = parsedQueue.cards.find(
        (card: IGradeCard) => card.status === "pending"
      );
      if (nextCard) {
        setCurrentCard(nextCard);
      }
    }
  };

  const updateQueue = (updatedQueue: GradeQueue) => {
    localStorage.setItem("gradingQueue", JSON.stringify(updatedQueue));
    setQueue(updatedQueue);
  };

  const handleGradeSubmit = (cardId: string, gradeDetails: GradeDetails) => {
    const updatedCards = queue.cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            status: "completed" as const,
            gradeDetails,
            updatedAt: new Date().toISOString(),
          }
        : card
    );

    const completedCards = updatedCards.filter(
      (card) => card.status === "completed"
    ).length;

    const totalGrades = updatedCards
      .filter((card) => card.status === "completed")
      .reduce((sum, card) => sum + (card.gradeDetails?.finalGrade || 0), 0);

    const averageGrade =
      completedCards > 0 ? totalGrades / completedCards : 0;

    const updatedQueue = {
      ...queue,
      cards: updatedCards,
      completedCards,
      averageGrade,
    };

    updateQueue(updatedQueue);

    const nextCard = updatedCards.find((card) => card.status === "pending");
    setCurrentCard(nextCard || null);

    toast({
      title: "Card Graded",
      description: `Card has been successfully graded with a ${gradeDetails.finalGrade} rating.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grading Queue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium">Total Cards</h3>
              <p className="text-2xl font-bold">{queue.totalCards}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Completed</h3>
              <p className="text-2xl font-bold">{queue.completedCards}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Average Grade</h3>
              <p className="text-2xl font-bold">
                {queue.averageGrade.toFixed(1)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentCard ? (
        <GradeCard card={currentCard} onGradeSubmit={handleGradeSubmit} />
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-500">
              No cards waiting to be graded
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Queue Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queue.cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-4 border rounded"
              >
                <div>
                  <p className="font-medium">{card.name}</p>
                  <p className="text-sm text-gray-500">
                    {card.set} ({card.year})
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {card.gradeDetails && (
                    <span className="font-bold">
                      Grade: {card.gradeDetails.finalGrade}
                    </span>
                  )}
                  <Badge className={getStatusColor(card.status)}>
                    {card.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}