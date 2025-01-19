'use client'

import { useState } from 'react'
import { NetworkModal } from './network-modal'
import { NetworkTabs } from './network-tabs'
import { UserBaseCreate } from '@/lib/types/userTypes'

export function Network() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [institutionFilter, setInstitutionFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<UserBaseCreate | null>(null)

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8">Rede</h2>
      <NetworkTabs
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        setSelectedUser={setSelectedUser}
        institutionFilter={institutionFilter}
        setInstitutionFilter={setInstitutionFilter}
      />
      <NetworkModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  )
}

