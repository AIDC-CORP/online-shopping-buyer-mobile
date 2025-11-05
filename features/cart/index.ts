export interface CartScreenProps {
  // Add any props that CartScreen might need in the future
}

export interface CheckoutDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}