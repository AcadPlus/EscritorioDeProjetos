'use client'
// components/VerifyCode.tsx
import { useState } from 'react'

const VerifyCode: React.FC = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const handleVerifyCode = async () => {
    const response = await fetch('/api/verifyCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    const data = await response.json()
    setMessage(data.message)
  }

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Digite seu e-mail"
      />
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Digite o código"
      />
      <button onClick={handleVerifyCode}>Verificar Código</button>
      <p>{message}</p>
    </div>
  )
}

export default VerifyCode
