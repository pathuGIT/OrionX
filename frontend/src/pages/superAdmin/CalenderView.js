import React, { useState, useEffect, useMemo } from 'react';
import { getBookings } from '../../services/BookngService';
import BookingDetailsView from '../../components/bookings/BookingDetailsView';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameDay, isSameMonth, isToday } from 'date-fns';

// Status colors mapping
const STATUS_COLORS = {
  confirmed: 'bg-green-100 border-green-500',
  pending: 'bg-yellow-100 border-yellow-500',
  cancelled: 'bg-red-100 border-red-500',
  done: 'bg-blue-100 border-blue-500'
};

// Filter icon SVG
const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
  </svg>
);

export default function CalenderView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings("all");
        const processedBookings = data.data.map(b => ({
          ...b,
          date: new Date(b.booking_date),
          formattedDate: format(new Date(b.booking_date), 'MMM dd, yyyy')
        }));
        setBookings(processedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const days = [];
    let day = startDate;
    
    while (day <= endDate) {
      days.push(day);
      day = new Date(day);
      day.setDate(day.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  // Get bookings for specific date
  const getDateBookings = (date) => {
    return bookings.filter(b => 
      isSameDay(b.date, date) && 
      (statusFilter === 'all' || b.status === statusFilter)
    );
  };

  // Group bookings by status
  const getStatusSummary = (date) => {
    const dateBookings = getDateBookings(date);
    return dateBookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
  };

  const changeMonth = (offset) => {
    setCurrentMonth(addMonths(currentMonth, offset));
  };

  const handleDateClick = (day) => {
    const dateBookings = getDateBookings(day);
    if (dateBookings.length > 0) {
      setSelectedDate(day);
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking.booking_id);
    setSelectedDate(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 px-20">
      {/* Calendar Header - More Compact */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => changeMonth(-1)} 
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-gray-800 min-w-[180px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button 
            onClick={() => changeMonth(1)} 
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            →
          </button>
        </div>
        
        {/* Filter Button */}
        <div className="relative">
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            <FilterIcon />
            <span className="capitalize">{statusFilter === 'all' ? 'All Bookings' : statusFilter}</span>
          </button>
          
          {/* Filter Dropdown */}
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button 
                className={`block w-full text-left px-4 py-2 text-sm ${statusFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                onClick={() => {
                  setStatusFilter('all');
                  setShowFilterDropdown(false);
                }}
              >
                All Bookings
              </button>
              {Object.keys(STATUS_COLORS).map(status => (
                <button
                  key={status}
                  className={`block w-full text-left px-4 py-2 text-sm capitalize ${statusFilter === status ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowFilterDropdown(false);
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 p-1">
            {day}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            const dayBookings = getDateBookings(day);
            const statusSummary = getStatusSummary(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            
            return (
              <div
                key={idx}
                onClick={() => handleDateClick(day)}
                className={`min-h-24 p-1 rounded-lg border flex flex-col transition-all hover:shadow-md
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                  ${isToday(day) ? 'border-2 border-blue-500' : 'border-gray-200'}
                  ${dayBookings.length > 0 ? 'hover:bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm ${isToday(day) ? 'text-blue-600 font-bold' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {dayBookings.length}
                    </span>
                  )}
                </div>
                
                {/* Status Indicators */}
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {Object.entries(statusSummary).map(([status, count]) => (
                    <span 
                      key={status} 
                      className={`text-[8px] px-1 py-0.5 rounded ${STATUS_COLORS[status] || 'bg-gray-200'}`}
                    >
                      {count} {status}
                    </span>
                  ))}
                </div>
                
                {/* Booking Preview */}
                <div className="mt-auto space-y-0.5 max-h-16 overflow-y-auto">
                  {dayBookings.slice(0, 2).map(booking => (
                    <div 
                      key={booking.booking_id} 
                      className={`text-[10px] p-0.5 rounded truncate cursor-pointer ${STATUS_COLORS[booking.status] || 'bg-gray-200'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookingClick(booking);
                      }}
                    >
                      <div className="font-semibold truncate">{booking.customer_name?.split(' ')[0] || 'Customer'}</div>
                      <div className="text-gray-600 truncate">{booking.venue_name?.split(' ')[0] || 'Venue'}</div>
                    </div>
                  ))}
                  {dayBookings.length > 2 && (
                    <div className="text-[10px] text-gray-500">+{dayBookings.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsView
          bookingId={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {/* Date Bookings Modal */}
      {/* {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {format(selectedDate, 'MMM dd, yyyy')}
                </h3>
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {getDateBookings(selectedDate).map(booking => (
                  <div 
                    key={booking.booking_id}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${STATUS_COLORS[booking.status]}`}
                    onClick={() => handleBookingClick(booking)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{booking.customer_name}</h4>
                        <p className="text-gray-600 text-xs">{booking.venue_name}</p>
                      </div>
                      <span className="bg-white px-2 py-1 rounded-full text-xs capitalize border">
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-xs grid grid-cols-2 gap-1">
                      <div>
                        <span className="text-gray-500">Time: </span>
                        {format(new Date(booking.booking_date), 'hh:mm a')}
                      </div>
                      <div>
                        <span className="text-gray-500">Guests: </span>
                        {booking.number_of_guests}
                      </div>
                      <div>
                        <span className="text-gray-500">Contact: </span>
                        {booking.customer_phone}
                      </div>
                      <div>
                        <span className="text-gray-500">Amount: </span>
                        ${booking.total_amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {getDateBookings(selectedDate).length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No bookings for this date
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}