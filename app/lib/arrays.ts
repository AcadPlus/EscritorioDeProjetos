import { FacebookIcon, Linkedin, TwitterIcon } from 'lucide-react'

const social = [
  { name: 'Twitter', href: '/', icon: TwitterIcon },
  { name: 'Linkedin', href: '/', icon: Linkedin },
  { name: 'Facebook', href: '/', icon: FacebookIcon },
]

const legal = [
  { name: 'Termos' },
  { name: 'Privacidade' },
  { name: 'Cookies' },
  { name: 'Licenças' },
]
const links = [
  { name: 'Home', href: '/', expand: null },
  { name: 'Sobre', href: '/', expand: null },
  { name: 'Vitrines', href: '/', expand: null },
  { name: 'LINK@', href: '/', expand: null },
  {
    name: 'Comitê de Uniformização',
    href: '/',
    expand: [
      { name: 'Sobre', href: '/sobre' },
      { name: 'Conferir', href: '/conferir' },
    ],
  },
  {
    name: 'Fluxos e Checklists',
    href: '/',
    expand: [
      {
        name: 'Documentos de Acordos de Parceria e Serviços Técnicos Especializados',
        href: '/fluxos_e_checklists/acordo_e_parceria_de_pdi',
      },
      {
        name: 'Termo de Confidenciabilidade (NDA)',
        href: '/fluxos_e_checklists/termo_de_confidenciabilidade',
      },
      {
        name: 'Fluxo agência de fomento',
        href: '/fluxos_e_checklists/fluxo_agencia_de_fomento',
      },
      { name: 'Legislação', href: '/fluxos_e_checklists/legislacao' },
      { name: 'Fluxos visuais', href: '/fluxos_e_checklists/fluxos_visuais' },
    ],
  },
  { name: 'Contato', href: '/contact', expand: null },
]

export { social, legal, links }
