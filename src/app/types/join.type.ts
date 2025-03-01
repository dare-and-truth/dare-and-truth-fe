import { Challenge } from '@/app/types/challenge.type';
import { ReactNode } from 'react';

export interface JoinDialogProps {
  challenge: Challenge;
  button: ReactNode;
  setIsJoined: React.Dispatch<React.SetStateAction<boolean>>;
}
