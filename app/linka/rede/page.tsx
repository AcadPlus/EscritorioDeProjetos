import { Network } from './network-main'
import PrivateRoute from '@/components/private_route'

export default function NetworkPage() {
  return (
    <>
      <PrivateRoute>
        <Network />
      </PrivateRoute>
    </>
  )
}
