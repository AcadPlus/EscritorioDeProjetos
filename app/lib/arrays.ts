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
  { name: 'Comitê de Uniformização', href: '/', expand: ['Sobre', 'Conferir'] },
  { name: 'Contato', href: 'contact', expand: null },
]

export { social, legal, links }
