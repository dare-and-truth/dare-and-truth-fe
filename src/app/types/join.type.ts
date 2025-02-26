import { Challenge } from '@/app/types/challenge.type';
import { ReactNode } from 'react';

export interface JoinDialogProps {
  challenge: Challenge;
  button: ReactNode;
}
