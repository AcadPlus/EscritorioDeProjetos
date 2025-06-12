'use client'
import ProfilePage from './components/profile'
import PrivateRoute from '@/components/private_route'
import { useSearchParams } from 'next/navigation'

const Profile = () => {
  const searchParams = useSearchParams()
  const userId = searchParams?.get('id')
  const userType = searchParams?.get('type')

  return (
    <PrivateRoute>
      <ProfilePage userId={userId} userType={userType} />
    </PrivateRoute>
  )
}

export default Profile
