import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function PopulationReport() {
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<string>("");

  // Mock data - in a real app, this would come from your backend
  const cardSets = [
    "Base Set",
    "Jungle",
    "Fossil",
    "Team Rocket",
  ];

  const cards = {
    "Base Set": ["Charizard", "Blastoise", "Venusaur"],
    "Jungle": ["Snorlax", "Flareon", "Jolteon"],
    "Fossil": ["Dragonite", "Zapdos", "Articuno"],
    "Team Rocket": ["Dark Charizard", "Dark Blastoise", "Dark Dragonite"],
  };

  // Mock population data - in a real app, this would come from your backend
  const populationData = [
    { grade: "10", count: 5, percentage: "2.5%" },
    { grade: "9", count: 25, percentage: "12.5%" },
    { grade: "8", count: 45, percentage: "22.5%" },
    { grade: "7", count: 75, percentage: "37.5%" },
    { grade: "6", count: 35, percentage: "17.5%" },
    { grade: "5", count: 15, percentage: "7.5%" },
  ];

  const totalGraded = populationData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Population Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <Select
                value={selectedSet}
                onValueChange={(value) => {
                  setSelectedSet(value);
                  setSelectedCard("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a card set" />
                </SelectTrigger>
                <SelectContent>
                  {cardSets.map((set) => (
                    <SelectItem key={set} value={set}>
                      {set}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Select
                value={selectedCard}
                onValueChange={setSelectedCard}
                disabled={!selectedSet}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  {selectedSet &&
                    cards[selectedSet as keyof typeof cards].map((card) => (
                      <SelectItem key={card} value={card}>
                        {card}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSet && selectedCard && (
            <>
              <div className="text-center mb-4">
                <p className="text-lg font-semibold">
                  Total Graded: {totalGraded}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedCard} from {selectedSet}
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {populationData.map((data) => (
                    <TableRow key={data.grade}>
                      <TableCell>
                        <Badge variant="outline">{data.grade}</Badge>
                      </TableCell>
                      <TableCell>{data.count}</TableCell>
                      <TableCell>{data.percentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}