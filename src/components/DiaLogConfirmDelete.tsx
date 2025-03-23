'use client';

import { DialogConfirmProps } from '@/app/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

export function DialogConfirm({
  button,
  title,
  onConfirm,
  onClose,
}: DialogConfirmProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen && onClose) onClose();
      }}
    >
      <DialogTrigger asChild>{button}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex items-center">
          <DialogTitle>{title} </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-center">
          <Button
            type="button"
            className="flex items-center"
            variant="join"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
