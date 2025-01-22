export type GradeStatus = 'pending' | 'in_progress' | 'completed';
export type Priority = 'high' | 'normal' | 'low';
export type QueueStatus = 'queued' | 'in_progress' | 'completed';

export interface GradeDetails {
  centering: number;
  corners: number;
  edges: number;
  surfaces: number;
  finalGrade: number;
  notes?: string;
  frontImage?: string;
  backImage?: string;
}

export interface GradeCard {
  id: string;
  name: string;
  set: string;
  year: string;
  cardNumber?: string;
  variant?: string;
  condition: string;
  status: GradeStatus;
  gradeDetails?: GradeDetails;
  ean8: string;
  orderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueueItem {
  id: string;
  cardName: string;
  condition: string;
  customer: string;
  priority: Priority;
  status: QueueStatus;
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

export interface GradeQueue {
  cards: GradeCard[];
  totalCards: number;
  completedCards: number;
  averageGrade: number;
}