import { useState, useCallback, useRef } from 'react';

export const useLogin = (onLogin: () => void) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const phoneRef = useRef(phone);
  const otpRef = useRef(otp);
  phoneRef.current = phone;
  otpRef.current = otp;

  const handlePhoneSubmit = useCallback(() => {
    const currentPhone = phoneRef.current;
    if (currentPhone.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ.');
      return;
    }
    setError('');
    // Set loading synchronously
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  }, []);

  const handleOtpSubmit = useCallback(() => {
    const currentOtp = otpRef.current;
    if (currentOtp !== '123456') {
      setError('Mã OTP không hợp lệ. Vui lòng thử lại.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  }, [onLogin]);

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
