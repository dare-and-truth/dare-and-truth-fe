export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  isActive: boolean;
  avatar?: string;
  isAdmin?: string;
}
