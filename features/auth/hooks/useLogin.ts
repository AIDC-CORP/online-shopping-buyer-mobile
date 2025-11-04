import { useState, useCallback } from 'react';

export const useLogin = (onLogin: () => void) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneSubmit = useCallback(() => {
    if (phone.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  }, [phone]);

  const handleOtpSubmit = useCallback(() => {
    if (otp !== '123456') {
      setError('Mã OTP không hợp lệ. Vui lòng thử lại.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  }, [otp, onLogin]);

  return {
    step,
    setStep,
    phone,
    setPhone,
    otp,
    setOtp,
    isLoading,
    error,
    setError,
    handlePhoneSubmit,
    handleOtpSubmit,
  };
};
