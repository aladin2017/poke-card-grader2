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

export interface GradingDetails {
  centering: number;
  surfaces: number;
  edges: number;
  corners: number;
  finalGrade: number;
}

export type ServiceType = "standard" | "express" | "premium";
export type ShippingMethod = "standard" | "express" | "international";
export type OrderStatus = "pending" | "queued" | "in_progress" | "completed" | "rejected";