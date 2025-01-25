import { useMutation } from '@tanstack/react-query'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

interface VerifyCodeParams {
  email: string
  code: string
}

export const useVerificationApi = () => {
  const sendVerificationCode = async (email: string) => {
    const response = await fetch(
      `${API_BASE_URL}/verification/send-code?email=${encodeURIComponent(email)}`,
      {
        method: 'POST',
      },
    )

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      throw new Error('Failed to send verification code')
    }

    return response.json()
  }

  const verifyCode = async ({ email, code }: VerifyCodeParams) => {
    const response = await fetch(
      `${API_BASE_URL}/verification/verify-code?email=${encodeURIComponent(email)}&code=${code}`,
      {
        method: 'POST',
      },
    )

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      }
      if (response.status === 400) {
        throw new Error('Invalid verification code')
      }
      throw new Error('Failed to verify code')
    }

    return response.json()
  }

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
