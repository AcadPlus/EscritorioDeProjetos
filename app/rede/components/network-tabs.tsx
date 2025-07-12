"use client"

import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NetworkSearch } from "./network-search"
import { NetworkFilter } from "./network-filter"
import { AsyncNetworkList } from "./async-network-list"
import { Users, Clock, UserCheck } from "lucide-react"
import type { UserBaseCreate } from "@/lib/types/userTypes"

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
    <div className="space-y-8">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
          {/* Tabs */}
          <TabsList className="bg-white border border-purple-100 p-1 rounded-2xl shadow-lg">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-300 flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Todos
            </TabsTrigger>
            <TabsTrigger
              value="connected"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-300 flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Conectados
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-6 py-3 font-medium transition-all duration-300 flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Pendentes
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="flex-1 lg:w-80">
              <NetworkSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            <NetworkFilter roleFilter={roleFilter} setRoleFilter={setRoleFilter} />
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <AsyncNetworkList
              searchQuery={searchQuery}
              roleFilter={roleFilter}
              setSelectedUser={setSelectedUser}
              displayMode="all"
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="connected" className="mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <AsyncNetworkList
              searchQuery={searchQuery}
              roleFilter={roleFilter}
              setSelectedUser={setSelectedUser}
              displayMode="connected"
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="pending" className="mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <AsyncNetworkList
              searchQuery={searchQuery}
              roleFilter={roleFilter}
              setSelectedUser={setSelectedUser}
              displayMode="pending"
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
