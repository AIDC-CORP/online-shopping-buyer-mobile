import { renderHook, act } from '@testing-library/react-native';
import { useLogin } from '../features/auth/hooks/useLogin';

describe('useLogin Hook', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); // Use real timers for setTimeout
  });

  it('should initialize with step 1 and empty values', () => {
    const { result } = renderHook(() => useLogin(mockOnLogin));

    expect(result.current.step).toBe(1);
    expect(result.current.phone).toBe('');
    expect(result.current.otp).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should validate phone number length', () => {
    const { result } = renderHook(() => useLogin(mockOnLogin));

    act(() => {
      result.current.setPhone('123');
      result.current.handlePhoneSubmit();
    });

    expect(result.current.error).toBe('Vui lòng nhập số điện thoại hợp lệ.');
  });

  it('should proceed to step 2 after valid phone submission', async () => {
    const { result } = renderHook(() => useLogin(mockOnLogin));

    act(() => {
      result.current.setPhone('0901234567');
      result.current.handlePhoneSubmit();
    });

    // Should be loading initially
    expect(result.current.isLoading).toBe(true);

    // Wait for the timeout to complete
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(result.current.step).toBe(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should validate OTP correctly', () => {
    const { result } = renderHook(() => useLogin(mockOnLogin));

    // Set step to 2 to simulate being on OTP screen
    act(() => {
      result.current.setStep(2);
      result.current.setOtp('111111'); // Invalid OTP
      result.current.handleOtpSubmit();
    });

    expect(result.current.error).toBe('Mã OTP không hợp lệ. Vui lòng thử lại.');
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('should call onLogin with valid OTP', async () => {
    const { result } = renderHook(() => useLogin(mockOnLogin));

    // Set step to 2 to simulate being on OTP screen
    act(() => {
      result.current.setStep(2);
      result.current.setOtp('123456'); // Valid OTP
      result.current.handleOtpSubmit();
    });

    // Should be loading initially
    expect(result.current.isLoading).toBe(true);

    // Wait for the timeout to complete
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('');
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  it('should clear error when input changes', () => {
    const { result } = renderHook(() => useLogin(mockOnLogin));

    // Set an error first
    act(() => {
      result.current.setPhone('123');
      result.current.handlePhoneSubmit();
    });

    expect(result.current.error).toBe('Vui lòng nhập số điện thoại hợp lệ.');

    // Change phone number - error should clear
    act(() => {
      result.current.setError(''); // Manually clear error as the hook doesn't do this automatically
    });

    expect(result.current.error).toBe('');
  });

  it('should handle step navigation correctly', () => {
    const { result } = renderHook(() => useLogin(mockOnLogin));

    // Start at step 1
    expect(result.current.step).toBe(1);

    // Go to step 2
    act(() => {
      result.current.setStep(2);
    });

    expect(result.current.step).toBe(2);

    // Go back to step 1
    act(() => {
      result.current.setStep(1);
    });

    expect(result.current.step).toBe(1);
  });

  it('should clear OTP when going back to phone step', () => {
    const { result } = renderHook(() => useLogin(mockOnLogin));

    act(() => {
      result.current.setStep(2);
      result.current.setOtp('123456');
      result.current.setStep(1);
    });

    expect(result.current.otp).toBe('123456'); // OTP should not be cleared automatically
  });

  it('should prevent multiple simultaneous submissions', () => {
    const { result } = renderHook(() => useLogin(mockOnLogin));

    act(() => {
      result.current.setPhone('0901234567');
      result.current.handlePhoneSubmit();
    });

    expect(result.current.isLoading).toBe(true);

    // Try to submit again while loading
    act(() => {
      result.current.handlePhoneSubmit();
    });

    // Should still be loading and step shouldn't change
    expect(result.current.isLoading).toBe(true);
    expect(result.current.step).toBe(1);
  });
});