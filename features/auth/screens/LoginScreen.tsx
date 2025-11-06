
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { SparklesIcon } from '../../../components/icons/Icons';
import { LoginScreenProps } from '../index';
import { useLogin } from '../hooks/useLogin';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const {
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
  } = useLogin(onLogin);

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f9ff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{
            borderRadius: 24,
            backgroundColor: '#ffffff',
            paddingHorizontal: 32,
            paddingVertical: 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}>
            {/* Teal gradient header */}
            <View style={{
              height: 120,
              backgroundColor: '#99f6e4',
              borderRadius: 16,
              marginHorizontal: -32,
              marginTop: -40,
              marginBottom: -60,
            }} />

            {/* Header content */}
            <View style={{ alignItems: 'center', marginBottom: 32, zIndex: 10 }}>
              <View style={{
                backgroundColor: '#ffffff',
                borderRadius: 50,
                padding: 12,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <SparklesIcon />
              </View>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 }}>AI Fresh</Text>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>Trợ lý đi chợ thông minh của bạn</Text>
            </View>

            {/* Form content */}
            {step === 1 ? (
              <View>
                <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', color: '#374151', marginBottom: 24 }}>
                  Nhập số điện thoại của bạn
                </Text>

                <TextInput
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(value);
                    setError('');
                  }}
                  placeholder="0901234567"
                  placeholderTextColor="#999"
                  editable={!isLoading}
                  style={{
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    textAlign: 'center',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#374151',
                    marginBottom: 16,
                  }}
                />

                {error && (
                  <Text style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
                    {error}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={handlePhoneSubmit}
                  disabled={isLoading || phone.length < 9}
                  style={{
                    backgroundColor: isLoading || phone.length < 9 ? '#a7f3d0' : '#10b981',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>Gửi OTP</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', color: '#374151', marginBottom: 24 }}>
                  Nhập mã OTP
                </Text>

                <Text style={{ fontSize: 14, textAlign: 'center', color: '#6b7280', marginBottom: 24 }}>
                  Mã gồm 6 chữ số đã được gửi đến {phone}.{'\n'}(Gợi ý: mã là 123456)
                </Text>

                <TextInput
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={(value) => {
                    setOtp(value);
                    setError('');
                  }}
                  placeholder="______"
                  placeholderTextColor="#ccc"
                  editable={!isLoading}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#1f2937',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 24,
                    textAlign: 'center',
                    letterSpacing: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    marginBottom: 16,
                    fontFamily: 'Courier',
                  }}
                />

                {error && (
                  <Text style={{ color: '#ef4444', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
                    {error}
                  </Text>
                )}

                <TouchableOpacity
                  onPress={handleOtpSubmit}
                  disabled={isLoading || otp.length !== 6}
                  style={{
                    backgroundColor: isLoading || otp.length !== 6 ? '#a7f3d0' : '#10b981',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>Đăng nhập</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setStep(1);
                    setError('');
                    setOtp('');
                  }}
                  disabled={isLoading}
                >
                  <Text style={{ textAlign: 'center', fontSize: 14, color: '#059669', fontWeight: '500' }}>
                    Đổi số điện thoại
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
