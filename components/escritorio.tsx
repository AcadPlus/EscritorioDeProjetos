import Image from 'next/image'

export function Escritorio() {
  return (
    <>
      <div className="flex flex-row mt-5 w-full max-w-80 md:max-w-5xl justify-center md:gap-32 gap-7">
        <div className="self-start justify-center items-center flex flex-col">
        <Image
            src="/logo_svg.svg"
            alt="Logo"
            className=""
            width={1000}
            height={1000}
            
          />
        </div>
        <div className="">
          <p className="text-md font-inter md:text-lg md:text-justify leading-5 text-slate-700">
            O Escritório de Projetos e Parcerias da Universidade Federal do
            Ceará (UFC) é uma entidade dedicada a fornecer suporte e assistência
            em todas as etapas do processo de desenvolvimento de projetos de
            Pesquisa, Desenvolvimento e Inovação (PD&I). Sua missão é facilitar
            a formatação, negociação e implementação de parcerias
            institucionais, garantindo a conformidade com as diretrizes da UFC e
            promovendo a valorização das atividades institucionais.
          </p>
        </div>
      </div>
    </>
  )
}
