import {useContext, React, useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';

export const Header = () => {
  const { user } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState();

  useEffect(()=>{
    console.log('use effect ran');
    if(sessionStorage.getItem('role') === 'super_admin'){
      setDashboard('/superAdmin')
    }else if(sessionStorage.getItem('role') === 'sub_admin'){
      setDashboard('/subAdmin')
    }else if(sessionStorage.getItem('role') === 'employee'){
      setDashboard('/employee')
    }else if(sessionStorage.getItem('role') === 'customer'){
      setDashboard('/customer')
    }else{
      setDashboard(null)
    }
    
  },[user])

  return (
    <header className=' mx-20 my-10 border border-black'>
      <nav className=' flex gap-2 relative '>
        <Link to="/" className={`${dashboard == null ? 'visible': 'hidden'}`}>Home</Link>
        <Link to={dashboard} className={`${user == null ? 'hidden': 'visible'}`} >Dashboard</Link>
        <Link to="/login" className=' absolute right-2'>Login</Link>
      </nav>
    </header>
  )
}
