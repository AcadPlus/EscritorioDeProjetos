'use client'
// components/RequestVerificationCode.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const RequestVerificationCode: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSendCode = async () => {
    const response = await fetch('/api/sendCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()
    setMessage(data.message)
    router.push("teste2")
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Digite seu e-mail"
      />
      <button onClick={handleSendCode}>Enviar Código</button>
      <p>{message}</p>
    </div>
  )
}

export default RequestVerificationCode
