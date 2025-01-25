import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NetworkSearch } from './network-search'
import { NetworkFilter } from './network-filter'
import { AsyncNetworkList } from './async-network-list'
import type { UserBaseCreate } from '@/lib/types/userTypes'

interface NetworkTabsProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  roleFilter: string
  setRoleFilter: (value: string) => void
  setSelectedUser: (user: UserBaseCreate) => void
}

export function NetworkTabs({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  setSelectedUser,
}: NetworkTabsProps) {
  return (
    <Tabs defaultValue="all">
      <TabsList className="gap-2">
        <TabsTrigger className="bg-white" value="all">
          Todos
        </TabsTrigger>
        <TabsTrigger className="bg-white" value="connected">
          Conectados
        </TabsTrigger>
        <TabsTrigger className="bg-white" value="pending">
          Pendentes
        </TabsTrigger>
      </TabsList>

      <div className="flex flex-wrap gap-4 mb-6 mt-6">
        <NetworkSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <NetworkFilter roleFilter={roleFilter} setRoleFilter={setRoleFilter} />
      </div>

      <TabsContent value="all">
        <AsyncNetworkList
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          setSelectedUser={setSelectedUser}
          displayMode="all"
        />
      </TabsContent>

      <TabsContent value="connected">
        <AsyncNetworkList
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          setSelectedUser={setSelectedUser}
          displayMode="connected"
        />
      </TabsContent>

      <TabsContent value="pending">
        <AsyncNetworkList
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          setSelectedUser={setSelectedUser}
          displayMode="pending"
        />
      </TabsContent>
    </Tabs>
  )
}
