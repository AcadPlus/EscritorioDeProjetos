'use client'

import { useState } from 'react'
import { NetworkModal } from './network-modal'
import { NetworkTabs } from './network-tabs'
import type { UserBaseCreate } from '@/lib/types/userTypes'

export function Network() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<UserBaseCreate | null>(null)

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Rede</h2>
              <p className="text-sm text-gray-500">
                Conecte-se com outros membros do ecossistema e amplie sua rede
                de contatos
              </p>
            </div>

            <NetworkTabs
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              setSelectedUser={setSelectedUser}
            />
          </div>
        </div>

        <NetworkModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      </div>
    </div>
  )
}
