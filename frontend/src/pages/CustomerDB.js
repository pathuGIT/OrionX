import React from 'react'
import { Logout } from '../components/Logout'

const CustomerDB = () => {
  return (
    <div>
      <p>Welcome Customer : {sessionStorage.getItem('credential')}!!</p>
      <Logout />
    </div>
  )
}

export default CustomerDB