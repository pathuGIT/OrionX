import React from 'react'
import { Logout } from '../components/Logout'

const Profile = () => {
    return (
        <div>
            <p>Welcome customer: {sessionStorage.getItem('credential')}</p>
            <Logout />
        </div>
    )
}

export default Profile