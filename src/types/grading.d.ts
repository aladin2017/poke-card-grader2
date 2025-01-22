export type GradeStatus = 'pending' | 'in_progress' | 'completed';

export interface GradeDetails {
  centering: number;
  corners: number;
  edges: number;
  surface: number;
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

export interface GradeQueue {
  cards: GradeCard[];
  totalCards: number;
  completedCards: number;
  averageGrade: number;
}