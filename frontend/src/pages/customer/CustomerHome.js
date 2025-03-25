import React from 'react'
import { Logout } from '../../components/Logout'

const CustomerHome = () => {
    return (
        <div>
            <p>Welcome Customer Home : {sessionStorage.getItem('credential')}</p>
            <Logout />
        </div>
    )
}

export default CustomerHome