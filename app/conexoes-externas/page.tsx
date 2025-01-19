import React from 'react'
import { Button, Input, TextArea } from '../ui/input'

export default function page() {
  return (
    <section className="flex flex-col justify-center md:max-w-screen-lg mx-auto w-full md:mb-10 mt-24">
      <h1 className="text-xl font-bold text-center"> Conexão com empresas</h1>
      <form action="" className="space-y-14 px-5">
        <div className="space-y-2">
          <p className="font-bold text-center text-sm">
            Informações sobre a empresa
          </p>
          <Input name="Empresa" placeholder="Informe o nome da empresa" />
          <div className="w-full md:flex md:gap-3 space-y-2 md:space-y-0">
            <Input name="CNPJ" placeholder="Informe o CNPJ da empresa" />
            <Input
              name="Contato"
              placeholder="Informe o nome de contato da empresa"
            />
          </div>
          <div className="w-full md:flex md:gap-3 space-y-2 md:space-y-0">
            <Input name="Email" placeholder="Informe o Email da empresa" />
            <Input name="CNPJ" placeholder="Informe o CNPJ da empresa" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-bold text-center text-sm">
            Já está em contato com algum docente ou pesquisador na UFC? Se sim,
            quem?
          </p>
          <Input name="Nome" placeholder="Informe o nome do pesquisador" />
          <div className="w-full md:flex md:gap-3 space-y-2 md:space-y-0">
            <Input name="Email" placeholder="Insira o email do pesquisador" />
            <Input
              name="Telefone"
              type="number"
              placeholder="+55 85 9999-9999"
            />
          </div>
        </div>
        <div className="space-y-2 pb-8 w-full">
          <p className="font-bold text-center text-sm">
            O que a sua empresa está buscando em termos de parceria com a
            universidade?
          </p>
          <TextArea name="Descreva sua solicitação" />
        </div>
        <Button name="Enviar formulário" />
      </form>
    </section>
  )
}
