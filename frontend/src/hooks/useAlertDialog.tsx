"use client";

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  actionText: string;
}

export function useAlertDialog() {
  const [state, setState] = useState<AlertDialogState>({
    isOpen: false,
    title: '',
    description: '',
    actionText: 'OK',
  });

  const showAlert = (description: string, title = 'Alert', actionText = 'OK') => {
    setState({
      isOpen: true,
      title,
      description,
      actionText,
    });
  };

  const hideAlert = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  const AlertDialogComponent = () => (
    <AlertDialog open={state.isOpen} onOpenChange={hideAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state.title}</AlertDialogTitle>
          <AlertDialogDescription>{state.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={hideAlert}>
            {state.actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { showAlert, AlertDialogComponent };
}
