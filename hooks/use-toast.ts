import { toast as sonnerToast } from "sonner";

export function useToast() {
  return {
    toast: sonnerToast
  };
}

export const toast = sonnerToast;