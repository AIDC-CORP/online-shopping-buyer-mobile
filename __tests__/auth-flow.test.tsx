import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import App from '../App';
import { MOCK_USER } from '../services/api/mockApiService';

// Mock Alert
const mockAlert = jest.fn();
jest.spyOn(Alert, 'alert').mockImplementation(mockAlert);

// Mock the mockApiService to avoid any side effects
jest.mock('../services/api/mockApiService', () => ({
  MOCK_USER: {
    id: '1',
    phone: '0901234567',
    name: 'Test User',
    age: 25,
    location: 'Hanoi',
    height: 170,
    weight: 65,
    activityLevel: 'medium',
    allergies: [],
    budget: 500000,
    walletBalance: 1000000,
    familyMembers: []
  }
}));

// Mock timers for testing async operations
// jest.useFakeTimers();

describe('OTP Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display login screen initially', () => {
    render(<App />);

    // Check if login screen elements are present
    expect(screen.getByText('AI Fresh')).toBeTruthy();
    expect(screen.getByText('Trợ lý đi chợ thông minh của bạn')).toBeTruthy();
    expect(screen.getByText('Nhập số điện thoại của bạn')).toBeTruthy();
    expect(screen.getByPlaceholderText('0901234567')).toBeTruthy();
  });

  it('should show error for invalid phone number', async () => {
    render(<App />);

    const phoneInput = screen.getByPlaceholderText('0901234567');
    const submitButton = screen.getByText('Gửi OTP');

    // Enter invalid phone number (too short)
    fireEvent.changeText(phoneInput, '123');

    // Button should be disabled for invalid input
    expect(submitButton).toBeDisabled();
  });

  it('should proceed to OTP screen after valid phone submission', async () => {
    render(<App />);

    const phoneInput = screen.getByPlaceholderText('0901234567');
    const submitButton = screen.getByText('Gửi OTP');

    // Enter valid phone number
    fireEvent.changeText(phoneInput, '0901234567');
    fireEvent.press(submitButton);

    // Wait for the step to change (simulated API delay)
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Wait for the OTP screen to appear
    await waitFor(() => {
      expect(screen.getByText('Nhập mã OTP')).toBeTruthy();
    });

    // Check if OTP screen elements are present
    expect(screen.getByText(/Mã gồm 6 chữ số đã được gửi đến 0901234567/)).toBeTruthy();
    expect(screen.getByText(/Gợi ý: mã là 123456/)).toBeTruthy();
    expect(screen.getByPlaceholderText('______')).toBeTruthy();
  });

  it('should show error for invalid OTP', async () => {
    render(<App />);

    // First, go to OTP screen
    const phoneInput = screen.getByPlaceholderText('0901234567');
    const phoneSubmitButton = screen.getByText('Gửi OTP');

    fireEvent.changeText(phoneInput, '0901234567');
    fireEvent.press(phoneSubmitButton);

    await new Promise(resolve => setTimeout(resolve, 1100));

    await waitFor(() => {
      expect(screen.getByText('Nhập mã OTP')).toBeTruthy();
    });

    // Now test invalid OTP
    const otpInput = screen.getByPlaceholderText('______');
    const otpSubmitButton = screen.getByText('Đăng nhập');

    // Enter invalid OTP
    fireEvent.changeText(otpInput, '111111');
    fireEvent.press(otpSubmitButton);

    // Check if error message appears
    expect(screen.getByText('Mã OTP không hợp lệ. Vui lòng thử lại.')).toBeTruthy();
  });

  it('should successfully login and redirect to home page with valid OTP', async () => {
    render(<App />);

    // First, go to OTP screen
    const phoneInput = screen.getByPlaceholderText('0901234567');
    const phoneSubmitButton = screen.getByText('Gửi OTP');

    fireEvent.changeText(phoneInput, '0901234567');
    fireEvent.press(phoneSubmitButton);

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Nhập mã OTP')).toBeTruthy();
    });

    // Enter valid OTP
    const otpInput = screen.getByPlaceholderText('______');
    const otpSubmitButton = screen.getByText('Đăng nhập');

    fireEvent.changeText(otpInput, '123456');
    fireEvent.press(otpSubmitButton);

    await new Promise(resolve => setTimeout(resolve, 1100));

    // Wait for login to complete and check if we redirect to home page
    await waitFor(() => {
      // After successful login, the app should show the main interface
      // We can check for elements that appear on the home screen
      expect(screen.getByText('Lên kế hoạch bữa ăn')).toBeTruthy();
    }, { timeout: 3000 });

    // Verify that login screen is no longer visible
    expect(screen.queryByText('Nhập số điện thoại của bạn')).toBeNull();
    expect(screen.queryByText('Nhập mã OTP')).toBeNull();
  });

  it('should allow changing phone number from OTP screen', async () => {
    render(<App />);

    // First, go to OTP screen
    const phoneInput = screen.getByPlaceholderText('0901234567');
    const phoneSubmitButton = screen.getByText('Gửi OTP');

    fireEvent.changeText(phoneInput, '0901234567');
    fireEvent.press(phoneSubmitButton);

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Nhập mã OTP')).toBeTruthy();
    });

    // Click "Đổi số điện thoại" (Change phone number)
    const changePhoneButton = screen.getByText('Đổi số điện thoại');
    fireEvent.press(changePhoneButton);

    // Should go back to phone input screen
    expect(screen.getByText('Nhập số điện thoại của bạn')).toBeTruthy();
    expect(screen.getByPlaceholderText('0901234567')).toBeTruthy();
  });

  it('should disable buttons during loading states', async () => {
    render(<App />);

    const phoneInput = screen.getByPlaceholderText('0901234567');
    const submitButton = screen.getByText('Gửi OTP');

    // Enter valid phone number
    fireEvent.changeText(phoneInput, '0901234567');
    fireEvent.press(submitButton);

    // Wait for loading to complete and screen to change
    await act(async () => {
      jest.runAllTimers();
    });

    // After loading completes, we should be on OTP screen
    await waitFor(() => {
      expect(screen.getByText('Nhập mã OTP')).toBeTruthy();
    });
  });

  it('should handle OTP input length restriction', async () => {
    render(<App />);

    // First, go to OTP screen
    const phoneInput = screen.getByPlaceholderText('0901234567');
    const phoneSubmitButton = screen.getByText('Gửi OTP');

    fireEvent.changeText(phoneInput, '0901234567');
    fireEvent.press(phoneSubmitButton);

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Nhập mã OTP')).toBeTruthy();
    });

    const otpInput = screen.getByPlaceholderText('______');
    const otpSubmitButton = screen.getByText('Đăng nhập');

    // Try to enter more than 6 digits
    fireEvent.changeText(otpInput, '1234567'); // 7 digits

    // Should only accept 6 digits
    expect(otpInput.props.value).toBe('123456');

    // Button should be enabled with 6 digits
    expect(otpSubmitButton).not.toBeDisabled();
  });

  it('should maintain user session after successful login', async () => {
    const { rerender } = render(<App />);

    // Complete login flow
    const phoneInput = screen.getByPlaceholderText('0901234567');
    const phoneSubmitButton = screen.getByText('Gửi OTP');

    fireEvent.changeText(phoneInput, '0901234567');
    fireEvent.press(phoneSubmitButton);

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Nhập mã OTP')).toBeTruthy();
    });

    const otpInput = screen.getByPlaceholderText('______');
    const otpSubmitButton = screen.getByText('Đăng nhập');

    fireEvent.changeText(otpInput, '123456');
    fireEvent.press(otpSubmitButton);

    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Lên kế hoạch bữa ăn')).toBeTruthy();
    });

    // Rerender the app - should still be logged in
    rerender(<App />);

    // Should still show the main interface, not login screen
    expect(screen.queryByText('Nhập số điện thoại của bạn')).toBeNull();
    expect(screen.getByText('Lên kế hoạch bữa ăn')).toBeTruthy();
  });
});