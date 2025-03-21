/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  PublicUserType,
  type UserCreateData,
  CampusType,
} from '@/lib/types/userTypes'
import { useUserApi } from '@/lib/api/users'
import { useVerificationApi } from '@/lib/api/verification'
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
  const { useCreateUser } = useUserApi()
  const { useSendVerificationCode, useVerifyCode } = useVerificationApi()
  const createUserMutation = useCreateUser()
  const sendCodeMutation = useSendVerificationCode()
  const verifyCodeMutation = useVerifyCode()

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<UserCreateData>({
    tipo_usuario: PublicUserType.ESTUDANTE,
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    conexoes: [],
    negocios: [],
    curso: '',
    campus: CampusType.PICI,
    matricula: '',
  } as UserCreateData)

  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showCodeInput, setShowCodeInput] = useState(false)
  const [generalError, setGeneralError] = useState<string>('')

  useEffect(() => {
    if (currentStep === 2) {
      setIsEmailVerified(false)
      setShowCodeInput(false)
      setVerificationCode('')
      setErrors((prev) => ({ ...prev, email_verification: '' }))
    }
  }, [currentStep])

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleUserTypeChange = (value: PublicUserType) => {
    const currentUsername = formData.email.split('@')[0]
    const domain =
      value === PublicUserType.ESTUDANTE
        ? '@alu.ufc.br'
        : value === PublicUserType.PESQUISADOR
          ? '@ufc.br'
          : ''

    let newFormData = {
      ...formData,
      tipo_usuario: value,
      email: currentUsername + domain,
    }

    if (value === PublicUserType.ESTUDANTE) {
      newFormData = {
        ...newFormData,
        curso: '',
        campus: CampusType.PICI,
        matricula: '',
        lattes: undefined,
        siape: undefined,
        palavras_chave: undefined,
        empresa: undefined,
        cargo: undefined,
      }
    } else if (value === PublicUserType.PESQUISADOR) {
      newFormData = {
        ...newFormData,
        lattes: '',
        siape: '',
        palavras_chave: [],
        campus: CampusType.PICI,
        curso: undefined,
        matricula: undefined,
        empresa: undefined,
        cargo: undefined,
      }
    } else if (value === PublicUserType.EXTERNO) {
      newFormData = {
        ...newFormData,
        empresa: '',
        cargo: '',
        curso: undefined,
        campus: undefined,
        matricula: undefined,
        lattes: undefined,
        siape: undefined,
        palavras_chave: undefined,
      }
    }

    setFormData(newFormData as UserCreateData)
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
        error = utilValidatePassword(value) || ''
        break
      case 'telefone':
        if (value.replace(/\D/g, '').length !== 13)
          error = 'Telefone deve ter 13 dígitos'
        break
    }
    setErrors((prev) => ({ ...prev, [name]: error }))
    return !error
  }

  const handleSendVerificationCode = async () => {
    try {
      await sendCodeMutation.mutateAsync(formData.email)
      setShowCodeInput(true)
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email_verification:
          'Erro ao enviar código de verificação. Tente novamente.',
      }))
      setGeneralError('Algo deu errado... Verifique os passos anteriores!')
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrors((prev) => ({
        ...prev,
        email_verification: 'Por favor, digite o código de verificação.',
      }))
      return
    }

    try {
      await verifyCodeMutation.mutateAsync({
        email: formData.email,
        code: verificationCode,
      })
      setIsEmailVerified(true)
      setErrors((prev) => ({ ...prev, email_verification: '' }))
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email_verification: 'Código de verificação inválido. Tente novamente.',
      }))
    }
  }

  const handleSubmit = async () => {
    setGeneralError('')
    if (!validatePassword(formData.senha)) {
      return
    }

    try {
      await createUserMutation.mutateAsync(formData)
      onRegisterSuccess()
    } catch (error: any) {
      if (error.response?.status === 400) {
        if (error.response.data.detail === 'Email already registered') {
          setErrors((prev) => ({
            ...prev,
            email: 'Este email já está registrado.',
          }))
          setGeneralError(
            'Email já cadastrado. Por favor, use outro email ou faça login.',
          )
          setCurrentStep(1)
        } else if (
          error.response.data.detail.includes('Password validation failed')
        ) {
          setErrors((prev) => ({
            ...prev,
            senha: 'A senha não atende aos requisitos de segurança.',
          }))
        } else {
          setGeneralError(
            error.response.data.detail ||
              'Erro ao criar usuário. Tente novamente.',
          )
        }
      } else {
        setGeneralError(
          'Email já cadastrado. Por favor, use outro email ou faça login.',
        )
      }
    }
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
            isVerifying={verifyCodeMutation.isLoading}
            isEmailVerified={isEmailVerified}
            isSendingCode={sendCodeMutation.isLoading}
            showCodeInput={showCodeInput}
            emailError={errors.email_verification}
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
      case 1:
        return (
          allFieldsValid && formData.nome && formData.email && formData.telefone
        )
      case 2:
        return allFieldsValid && isEmailVerified
      case 3:
        return allFieldsValid && utilValidatePassword(formData.senha) === null
      case 4:
        return allFieldsValid
      default:
        return false
    }
  }

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
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

function utilValidatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres'
  }

  if (!/[A-Z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra maiúscula'
  }

  if (!/[a-z]/.test(password)) {
    return 'A senha deve conter pelo menos uma letra minúscula'
  }

  if (!/[0-9]/.test(password)) {
    return 'A senha deve conter pelo menos um número'
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return 'A senha deve conter pelo menos um caractere especial'
  }

  return null // Password is valid
}

function validatePassword(password: string): boolean {
  return utilValidatePassword(password) === null
}
