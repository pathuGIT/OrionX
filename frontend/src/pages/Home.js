import React from 'react'

export const Home = () => {
  return (
    <div>
            <p>Welcome Customer Home : {sessionStorage.getItem('credential')}</p>
            
        </div>
  )
}
