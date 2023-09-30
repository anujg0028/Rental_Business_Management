import React from 'react'
import BaseSection from '../../Components/Base'
import { getCurrentUser } from '../../AuthServices/Auth'
import ViewUserProfile from '../../Components/ViewUserProfile'

function ProfileInfo() {
  const user = getCurrentUser();
  return (
    <BaseSection>
      <ViewUserProfile user={user} />
    </BaseSection>
  )
}

export default ProfileInfo