'use client'

import { useState } from 'react'
import { NetworkSearch } from './network-search'
import { NetworkFilter } from './network-filter'
import { NetworkTabs } from './network-tabs'
import { NetworkModal } from './network-modal'
import { AsyncNetworkList } from './async-network-list'
import { UserBase } from '@/types/network'

export function Network() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [institutionFilter, setInstitutionFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<UserBase | null>(null)

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
      >
        <AsyncNetworkList
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          institutionFilter={institutionFilter}
          setSelectedUser={setSelectedUser} displayMode={'all'}        />
      </NetworkTabs>
      <NetworkModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  )
}

