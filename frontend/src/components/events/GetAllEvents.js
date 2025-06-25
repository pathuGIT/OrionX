// src/components/GetAllEvents.js
import React from 'react';

const GetAllEvents = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Event Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Event Name</h3>
              <p className="mt-1">{event.Event_Name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Event Type</h3>
              <p className="mt-1 capitalize">{event.eventType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Event Date</h3>
              <p className="mt-1">
                {new Date(event.Event_Date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Event ID</h3>
              <p className="mt-1">{event.Event_ID}</p>
            </div>
          </div>

          {/* Event-Specific Details */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-4">
              {event.eventType === 'wedding' ? 'Wedding Details' : 'Event Details'}
            </h3>
            
            {event.eventType === 'wedding' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Groom's Name</h4>
                  <p>{event.details?.groomName || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Bride's Name</h4>
                  <p>{event.details?.brideName || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Poruwa Ceremony</h4>
                  <p>
                    {event.details?.poruwaCeremonyFrom || 'N/A'} - 
                    {event.details?.poruwaCeremonyTo || 'N/A'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Groom Contact</h4>
                  <p>{event.details?.groomContact || 'N/A'}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Person</h4>
                  <p>{event.details?.contactPersonName || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Number</h4>
                  <p>{event.details?.contactPersonNumber || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Event Name</h4>
                  <p>{event.details?.eventName || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetAllEvents;