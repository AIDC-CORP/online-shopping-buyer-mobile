import { Order } from '../../types';

export interface OrderHistoryScreenProps {
  onSelectOrder: (order: Order) => void;
}

export interface OrderDetailDialogProps {
  visible: boolean;
  onClose: () => void;
  order: Order;
}