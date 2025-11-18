import { useState, useCallback, useRef } from 'react';
import { AuthService } from '../../../services/auth';

export const useLogin = (onLogin: () => void) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const phoneRef = useRef(phone);
  const passwordRef = useRef(password);
  phoneRef.current = phone;
  passwordRef.current = password;

  const handlePhoneSubmit = useCallback(() => {
    const currentPhone = phoneRef.current;
    if (currentPhone.length < 9) {
      setError('Vui lòng nhập số điện thoại hợp lệ.');
      return;
    }
    setError('');
    setStep(2);
  }, []);

  const handlePasswordSubmit = useCallback(async () => {
    const currentPhone = phoneRef.current;
    const currentPassword = passwordRef.current;
    
    if (!currentPassword || currentPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      await AuthService.login({
        username: currentPhone,
        password: currentPassword,
      });
      
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [onLogin]);

  return {
    step,
    setStep,
    phone,
    setPhone,
    password,
    setPassword,
    isLoading,
    error,
    setError,
    handlePhoneSubmit,
    handlePasswordSubmit,
  };
};
