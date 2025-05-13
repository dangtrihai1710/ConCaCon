// src/components/Toast.jsx
import React from 'react';
import { toast } from 'react-toastify';

// Toast Helper Component
const Toast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message),
};

export default Toast;

