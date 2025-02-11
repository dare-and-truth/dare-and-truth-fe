export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  status: 'Active' | 'Inactive';
  avatar: string;
}
