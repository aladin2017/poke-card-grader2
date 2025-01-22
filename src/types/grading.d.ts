export interface QueueItem {
  id: string;
  cardName: string;
  condition: string;
  customer: string;
  priority: "high" | "normal";
  status: "queued" | "in_progress" | "completed";
  ean8: string;
  orderId: string;
  gradingDetails?: {
    centering: number;
    surfaces: number;
    edges: number;
    corners: number;
    finalGrade: number;
    frontImage?: string;
    backImage?: string;
  };
}