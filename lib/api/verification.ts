import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

interface VerifyCodeParams {
  email: string
  code: string
}

export const useVerificationApi = () => {
  const sendVerificationCode = async (email: string) => {
    const response = await api.post(
      `/verification/send-code?email=${encodeURIComponent(email)}`,
    );

    if (response.status !== 200) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      throw new Error('Failed to send verification code');
    }

    return response.data;
  };

  const verifyCode = async ({ email, code }: VerifyCodeParams) => {
    const response = await api.post(
      `/verification/verify-code?email=${encodeURIComponent(email)}&code=${code}`,
    );

    if (response.status !== 200) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      if (response.status === 400) {
        throw new Error('Invalid verification code')
      }
      throw new Error('Failed to verify code');
    }

    return response.data;
  };

  const useSendVerificationCode = () =>
    useMutation({
      mutationFn: sendVerificationCode,
    })

  const useVerifyCode = () =>
    useMutation({
      mutationFn: verifyCode,
    })

  return {
    useSendVerificationCode,
    useVerifyCode,
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
