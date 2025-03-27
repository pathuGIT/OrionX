import React from 'react';
import { Logout } from '../components/Logout'

const CustomerSideNav = ({ setDisplay }) => {
  return (
    <div className="border inline-block">
      <li><button onClick={() => setDisplay('createEvent')}>Plan the Event</button></li>
      <li><button onClick={() => setDisplay('createWedding')}>Plan Your Wedding</button></li>
      <li><button ><Logout/></button></li>
    </div>
  );
};

export default CustomerSideNav;
