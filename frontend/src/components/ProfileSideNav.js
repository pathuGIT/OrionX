import React from 'react';
import { Logout } from '../components/Logout'

const CustomerSideNav = ({ setDisplay }) => {
  return (
    <div className="border inline-block">
      <li><button onClick={() => setDisplay('customerEvent')}>Plan the Event</button></li>
      <li><button>link</button></li>
      <li><button>link</button></li>
      <li><button ><Logout/></button></li>
    </div>
  );
};

export default CustomerSideNav;
