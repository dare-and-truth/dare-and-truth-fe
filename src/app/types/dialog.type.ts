import { ReactNode } from 'react';

export interface DialogConfirmProps {
  button: ReactNode;
  title: string;
  onConfirm: () => void;
  onClose?:() => void;
}
