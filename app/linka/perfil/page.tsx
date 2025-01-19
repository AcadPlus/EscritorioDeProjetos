'use client'
import ProfilePage from './profile'
import PrivateRoute from '@/components/private_route'

const Profile = () => (
  <PrivateRoute>
    <ProfilePage />
  </PrivateRoute>
)

export default Profile
