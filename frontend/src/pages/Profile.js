// Customer profile page
import React, { useState } from 'react';
import CustomerSideNav from '../components/ProfileSideNav.js';
import CustomerEventPlanning from '../pages/customer/CustomerEventPlanning.js';
import CustomerBookings from '../components/CustomerBooking.js';




const Profile = () => {
  const [display, setDisplay] = useState();

  const renderContent = () => {
    switch (display) {
      case 'customerEvent':
        return <CustomerEventPlanning />;
      case 'PlanYourEvent':
        return <CustomerBookings />;
      default:
        return <p></p>;
    }
  };

  return (
    <div className="flex" style={{ minHeight: '85vh' }}>
      <div className="border py-1 px-1 bg-blue-100 w-1/5">
        <CustomerSideNav setDisplay={setDisplay} />
      </div>
      <div className="border py-2 px-2 bg-slate-400 w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
