import React from 'react';

const CustomerSideNav = ({ setDisplay }) => {
  return (
    <div className="border inline-block">
      <li><button onClick={() => setDisplay('createEvent')}>Plan the Event</button></li>
      <li><button onClick={() => setDisplay('createWedding')}>Plan Your Wedding</button></li>
    </div>
  );
};

export default CustomerSideNav;
