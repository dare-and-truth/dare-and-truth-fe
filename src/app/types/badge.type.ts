export interface Badge {
  id: string;
  title: string;
  image: string;
  description: string;
  startDay: string;
  endDay: string;
  badgeCriteria: number;
  points: number;
  isActive: boolean;
}
