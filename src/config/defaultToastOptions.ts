import { ToastOptions } from 'react-toastify';

export const toastAutoCloseTimeout = 3000;

export const defaultToastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: toastAutoCloseTimeout,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
  // transition: Zoom,
};
