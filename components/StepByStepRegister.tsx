/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserType, UserCreateData } from '@/lib/types/userTypes'
import { useUserApi } from '@/lib/api/users'
import { sendVerificationCode, verifyCode } from '@/lib/api/verification'
import { UserTypeStep } from './registration/UserTypeStep'
import { BasicInfoStep } from './registration/BasicInfoStep'
import { EmailVerificationStep } from './registration/EmailVerificationStep'
import { PasswordStep } from './registration/PasswordStep'
import { AdditionalInfoStep } from './registration/AdditionalInfoStep'

const steps = [
  {
    title: 'Tipo de Usuário',
    subtitle: 'Selecione o tipo de conta que você deseja criar.',
    fields: ['tipo_usuario'],
  },
  {
    title: 'Informações Básicas',
    subtitle: 'Preencha suas informações pessoais.',
    fields: ['nome', 'email', 'telefone'],
  },
  {
    title: 'Verificação de Email',
    subtitle: 'Verifique seu endereço de email.',
    fields: ['email_verification'],
  },
  {
    title: 'Senha',
    subtitle: 'Crie uma senha segura para sua conta.',
    fields: ['senha'],
  },
  {
    title: 'Informações Adicionais',
    subtitle: 'Forneça informações específicas para o seu tipo de usuário.',
    fields: ['additional_info'],
  },
]

export function StepByStepRegister({
  onRegisterSuccess,
}: {
  onRegisterSuccess: () => void
}) {
  const { createUser } = useUserApi()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<UserCreateData>({
    tipo_usuario: UserType.ESTUDANTE,
    nome: '',
    email: '',
    senha: '',
    telefone: '',
  } as UserCreateData)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [generalError, setGeneralError] = useState<string>('')

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleUserTypeChange = (value: UserType) => {
    // Update user type and adjust email domain
    const currentUsername = formData.email.split('@')[0]
    const domain =
      value === UserType.ESTUDANTE
        ? '@alu.ufc.br'
        : value === UserType.PESQUISADOR
          ? '@ufc.br'
          : ''

    setFormData((prev) => ({
      ...prev,
      tipo_usuario: value,
      email: currentUsername + domain,
    }))
  }

  const handleSocialMediaChange = (network: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      redes_sociais: {
        ...prev.redes_sociais,
        [network]: value,
      },
    }))
  }

  const validateField = (name: string, value: string) => {
    let error = ''
    switch (name) {
      case 'nome':
        if (value.length < 3) error = 'Nome deve ter pelo menos 3 caracteres'
        break
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) error = 'Email inválido'
        break
      case 'senha':
        if (value.length < 8) error = 'Senha deve ter pelo menos 8 caracteres'
        if (!/\d/.test(value) || !/[a-zA-Z]/.test(value))
          error = 'Senha deve conter letras e números'
        break
      case 'telefone':
        if (value.replace(/\D/g, '').length !== 13)
          error = 'Telefone deve ter 13 dígitos'
        break
      // Add more validations as needed
    }
    setErrors((prev) => ({ ...prev, [name]: error }))
    return !error
  }

  const handleInputChangeOld = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptedTerms(e.target.checked)
  }

  const handleSendVerificationCode = async () => {
    setIsSendingCode(true)
    setEmailError('')
    try {
      await sendVerificationCode(formData.email)
      setShowCodeInput(true) // Show code input after successfully sending code
    } catch (error) {
      setEmailError('Erro ao enviar código de verificação. Tente novamente.')
      setGeneralError('Algo deu errado... Verifique os passos anteriores!')
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setEmailError('Por favor, digite o código de verificação.')
      return
    }

    setIsVerifying(true)
    setEmailError('')

    try {
      await verifyCode(formData.email, verificationCode)
      setIsEmailVerified(true)
      setEmailError('')
    } catch (error) {
      setEmailError('Código de verificação inválido. Tente novamente.')
    } finally {
      setIsVerifying(false)
    }
  }

  const validatePassword = (password: string) => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const isLongEnough = password.length >= 8

    if (
      hasSpecialChar &&
      hasNumber &&
      hasUpperCase &&
      hasLowerCase &&
      isLongEnough
    ) {
      setErrors((prev) => ({ ...prev, senha: '' }))
      return true
    } else {
      setErrors((prev) => ({
        ...prev,
        senha: 'A senha não atende aos requisitos de segurança.',
      }))
      return false
    }
  }

  const handleSubmit = async () => {
    setGeneralError('')
    if (!validatePassword(formData.senha)) {
      return
    }

    try {
      await createUser(formData)
      onRegisterSuccess()
    } catch (error: any) {
      if (error.status === 400) {
        if (error.detail === 'Email already registered') {
          setErrors((prev) => ({
            ...prev,
            email: 'Este email já está registrado.',
          }))
          setGeneralError('Email em uso! Altere seu email ou faça login!')
        } else if (error.detail.includes('Password validation failed')) {
          setErrors((prev) => ({
            ...prev,
            senha: 'A senha não atende aos requisitos de segurança.',
          }))
        } else {
          setGeneralError(
            error.detail || 'Erro ao criar usuário. Tente novamente.',
          )
        }
      } else {
        setGeneralError('Erro ao criar usuário. Tente novamente.')
      }
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value.split('@')[0] // Get only the username part
    const domain =
      formData.tipo_usuario === UserType.ESTUDANTE
        ? '@alu.ufc.br'
        : formData.tipo_usuario === UserType.PESQUISADOR
          ? '@ufc.br'
          : ''

    setFormData((prev) => ({
      ...prev,
      email: username + domain,
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <UserTypeStep
            userType={formData.tipo_usuario}
            onUserTypeChange={handleUserTypeChange}
            acceptedTerms={acceptedTerms}
            onTermsChange={setAcceptedTerms}
          />
        )
      case 1:
        return (
          <BasicInfoStep
            nome={formData.nome}
            email={formData.email}
            telefone={formData.telefone}
            userType={formData.tipo_usuario}
            errors={errors}
            onInputChange={handleInputChange}
          />
        )
      case 2:
        return (
          <EmailVerificationStep
            email={formData.email}
            verificationCode={verificationCode}
            isVerifying={isVerifying}
            isEmailVerified={isEmailVerified}
            isSendingCode={isSendingCode}
            showCodeInput={showCodeInput}
            emailError={emailError}
            onSendCode={handleSendVerificationCode}
            onVerifyCode={handleVerifyCode}
            onCodeChange={setVerificationCode}
          />
        )
      case 3:
        return (
          <PasswordStep
            password={formData.senha}
            error={errors.senha}
            onChange={(value) => handleInputChange('senha', value)}
          />
        )
      case 4:
        return (
          <AdditionalInfoStep
            userType={formData.tipo_usuario}
            formData={formData}
            onInputChange={handleInputChange}
            onSocialMediaChange={handleSocialMediaChange}
          />
        )
      default:
        return null
    }
  }

  const canProceed = () => {
    const currentFields = steps[currentStep].fields
    const allFieldsValid = currentFields.every((field) => !errors[field])

    switch (currentStep) {
      case 0:
        return allFieldsValid && acceptedTerms
      case 2:
        return allFieldsValid && isEmailVerified
      default:
        return allFieldsValid
    }
  }

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // If we're on the last step, submit the form instead of incrementing step
      await handleSubmit()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{steps[currentStep].title}</h2>
        <p className="text-[#6B7280]">{steps[currentStep].subtitle}</p>
      </div>

      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300 ease-in-out"
          style={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            backgroundColor: '#000000',
          }}
        />
      </div>

      <div className="pb-4">
        <p className="text-sm text-[#6B7280]">
          Etapa {currentStep + 1} de {steps.length}
        </p>
      </div>

      {generalError && (
        <p className="text-red-500 text-sm text-center">{generalError}</p>
      )}

      {renderStep()}

      <div className="flex justify-between pt-6">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            style={{ borderColor: '#000000', color: '#000000' }}
          >
            Voltar
          </Button>
        )}
        <Button
          className={currentStep === 0 ? 'w-full' : 'ml-auto'}
          onClick={handleNext}
          disabled={!canProceed()}
          style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
        >
          {currentStep === steps.length - 1 ? 'Concluir' : 'Continuar'}
        </Button>
      </div>
    </div>
  )
}
