'use client'

import { useState } from 'react'
import Layout from './layout'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'

const users = [
  { id: 1, name: "Dr. Ana Silva", role: "Pesquisadora", institution: "UFC Fortaleza", avatar: "/placeholder-1.jpg" },
  { id: 2, name: "Carlos Mendes", role: "CEO", institution: "TechInova Ltda.", avatar: "/placeholder-2.jpg" },
  { id: 3, name: "Profa. Lúcia Santos", role: "Professora", institution: "UFC Quixadá", avatar: "/placeholder-3.jpg" },
  { id: 4, name: "Roberto Alves", role: "Desenvolvedor", institution: "Startup XYZ", avatar: "/placeholder-4.jpg" },
  { id: 5, name: "Dra. Fernanda Lima", role: "Pesquisadora", institution: "UFC Russas", avatar: "/placeholder-5.jpg" },
]

export function NetworkComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [institutionFilter, setInstitutionFilter] = useState("all")

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (roleFilter === "all" || user.role === roleFilter) &&
    (institutionFilter === "all" || user.institution === institutionFilter)
  )

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Rede</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Pesquisador">Pesquisador</SelectItem>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="CEO">CEO</SelectItem>
              <SelectItem value="Desenvolvedor">Desenvolvedor</SelectItem>
            </SelectContent>
          </Select>
          <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Instituição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="UFC Fortaleza">UFC Fortaleza</SelectItem>
              <SelectItem value="UFC Quixadá">UFC Quixadá</SelectItem>
              <SelectItem value="UFC Russas">UFC Russas</SelectItem>
              <SelectItem value="TechInova Ltda.">TechInova Ltda.</SelectItem>
              <SelectItem value="Startup XYZ">Startup XYZ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage alt={user.name} src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.role}</p>
                  <p className="text-sm text-gray-500">{user.institution}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link href={`/network/${user.id}`}>
                  <Button size="sm">Ver Perfil</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  )
}