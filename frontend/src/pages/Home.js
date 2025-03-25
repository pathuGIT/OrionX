import React from 'react'
import { Logout } from '../components/Logout'
export const Home = () => {
  return (
    <div>
            <p>Welcome Customer Home page: {sessionStorage.getItem('credential')}</p>
            <Logout />
        </div>
  )
}
