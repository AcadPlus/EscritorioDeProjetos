'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function page() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="flex font-inter flex-col justify-center md:max-w-screen-xl mx-auto w-full py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="grid md:grid-cols-2 gap-16 mt-32"
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div {...fadeIn}>
          <h1 className="font-semibold text-4xl text-[#101828] mb-4">
            Entre em contato
          </h1>
          <p className="text-lg text-[#475467] mb-8">
            Nossa equipe adoraria conversar com você!
          </p>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Primeiro nome</Label>
                <Input id="firstName" placeholder="Primeiro nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" placeholder="Sobrenome" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Seu email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@alu.ufc.br"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" type="tel" placeholder="+55 (85) 00000-0000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" placeholder="Sua mensagem aqui..." />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="privacy" />
              <Label htmlFor="privacy" className="text-sm text-[#475467]">
                Você concorda com nossa{' '}
                <a
                  href="#"
                  className="underline hover:text-[#101828] transition-colors"
                >
                  política de privacidade
                </a>
                .
              </Label>
            </div>
            <Button type="submit" className="w-full">
              Enviar mensagem
            </Button>
          </form>
        </motion.div>

        <motion.div {...fadeIn} className="space-y-8">
          <div className="aspect-w-16 aspect-h-9 rounded-3xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15925.271969167099!2d-38.5695664!3d-3.7407273!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74b9a30e7eacd%3A0xebd1f33eefe87b1!2sBloco%20334%20-%20CEI%20-%20Condom%C3%ADnio%20de%20Empreendedorismo%20e%20Inova%C3%A7%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1733355896827!5m2!1spt-BR!2sbr"
              width="600"
              height="450"
              loading="lazy"
              title="Mapa da Universidade Federal do Ceará"
              className="border-0 w-full h-full"
            ></iframe>
          </div>
          <div className="bg-[#F9FAFB] rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-2xl text-[#101828]">
              Informações de Contato
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-[#475467]">
                <MapPin className="h-5 w-5" />
                <span>
                  Bloco 334 - CEI - Condomínio de Empreendedorismo e Inovação
                  Campus do Pici s/n - Pici, Fortaleza - CE, 60355-636
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[#475467]">
                <Phone className="h-5 w-5" />
                <span>+55 (85) 3366-7300</span>
              </div>
              <div className="flex items-center space-x-3 text-[#475467]">
                <Mail className="h-5 w-5" />
                <span>ep@ufc.br</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
