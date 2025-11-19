export { default as NotificationsDialog } from './components/NotificationsDialogs';

export interface NotificationsDialogProps {
  visible: boolean;
  onClose: () => void;
}