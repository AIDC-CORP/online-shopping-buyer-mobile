import { Order } from '../../types';

export interface OrderHistoryScreenProps {
  onSelectOrder: (order: Order) => void;
}

export interface OrderDetailScreenProps {
  order: Order;
  onBack: () => void;
}