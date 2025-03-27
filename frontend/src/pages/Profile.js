// Customer profile page
import React, { useState } from 'react';
import CustomerSideNav from '../components/ProfileSideNav.js';
import EventForm from '../components/EventForm.js';
import WeddingForm from '../components/weddingForm.js';



const Profile = () => {
  const [display, setDisplay] = useState();

  const renderContent = () => {
    switch (display) {
      case 'createEvent':
        return <EventForm/>;
      case 'createWedding':
        return <WeddingForm />;
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
