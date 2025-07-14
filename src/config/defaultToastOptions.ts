import { ToastOptions } from 'react-toastify';

export const toastAutoCloseTimeout = 5000;

export const defaultToastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: toastAutoCloseTimeout,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  theme: 'colored',
  // draggable: true,
  // transition: Zoom,
};
