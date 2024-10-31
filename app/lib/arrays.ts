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
  { name: 'Home', href: '/', expand: false },
  { name: 'Sobre', href: '/', expand: false },
  { name: 'Vitrines', href: '/', expand: true },
  { name: 'LINK@', href: '/', expand: true },
  { name: 'Fluxos', href: '/', expand: true },
  { name: 'Contato', href: 'contact', expand: false },
]

export { social, legal, links }
