export interface User {
  id?: number;
  username: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  isActive: boolean;
  avatar?: string;
}
