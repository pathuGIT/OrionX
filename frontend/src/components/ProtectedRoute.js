import { useContext } from 'react';
import { AuthContext } from '../context/Authcontext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, name }) => {
  //console.log(props.name);  
  const { user } = useContext(AuthContext);
  const role = sessionStorage.getItem("role");
    console.log(role)
  if (name === role) {
    return children;
  }else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
