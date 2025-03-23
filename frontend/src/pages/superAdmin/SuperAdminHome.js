import React from 'react'
import { Logout } from '../../components/Logout'

const superAdminHome = () => {
    return (
        <div>
            <p>Welcome Super Admin: {sessionStorage.getItem('credential')}</p>
            <Logout />
        </div>
    )
}

export default superAdminHome