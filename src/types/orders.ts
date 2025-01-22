export type OrderStatus = 'pending' | 'queued' | 'in_progress' | 'completed' | 'rejected';

export interface GradingOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  serviceType: 'standard' | 'medium' | 'priority';
  shippingMethod: 'standard' | 'express';
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
  cards: GradingCard[];
}

export interface GradingCard {
  id: string;
  name: string;
  year: string;
  set: string;
  cardNumber?: string;
  variant?: string;
  notes?: string;
  ean8?: string;
  status: OrderStatus;
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