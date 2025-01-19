const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'

// Function to send verification code
export async function sendVerificationCode(email: string) {
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

// Function to verify the code
export async function verifyCode(email: string, code: string) {
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

// Helper function to validate email format
export function isValidEmail(email: string): boolean {
  // This is a simple regex for email validation. You might want to use a more comprehensive one.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
