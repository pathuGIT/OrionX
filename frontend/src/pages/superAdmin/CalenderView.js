import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getBookings } from '../../services/BookngService';
import BookingDetailsView from '../../components/bookings/BookingDetailsView';

// Utility: build 6-week calendar grid
function getMonthMatrix(date) {
  const matrix = [];
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay();
  const startDate = new Date(year, month, 1 - startDay);

  for (let week = 0; week < 6; week++) {
    const weekRow = [];
    for (let day = 0; day < 7; day++) {
      weekRow.push(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + week * 7 + day));
    }
    matrix.push(weekRow);
  }
  return matrix;
}

export default function CalenderView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getBookings("confirmed");
      setBookings(data.data.map(b => ({ ...b, date: new Date(b.booking_date) })));
    };
    fetchBookings();
  }, []);

  const monthMatrix = getMonthMatrix(currentMonth);

  const changeMonth = (offset) => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + offset);
    setCurrentMonth(d);
  };

  const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();
  const isToday = (d) => isSameDay(d, today);
  const isUpcomingConfirmed = (d) =>
    bookings.some(b => b.date > today && isSameDay(b.date, d));

  // const handleRowClick = (id) => {
  //   getBookingDetails(id).then((data) => setSelectedBooking(data.data));
  // };


  const handleDateClick = (day) => {
    const booking = bookings.find(b => isSameDay(b.date, day) && b.date > today);
    if (booking) {
      setSelectedBooking(booking.booking_id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Popup BookingDetailsView */}
      {selectedBooking && (
        <BookingDetailsView
          bookingId={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Prev</button>
        <h2 className="text-xl font-semibold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Next</button>
      </div>

      <div className="grid grid-cols-7 text-center font-medium text-gray-600 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthMatrix.map((week, wi) =>
          week.map((day, di) => {
            const isCurr = day.getMonth() === currentMonth.getMonth();
            const isBookedUpcoming = isUpcomingConfirmed(day);

            console.log("isCurr: ", isCurr);
            console.log("day.getMonth(): ", day.getMonth());
            console.log("currentMonth.getMonth(): ", currentMonth.getMonth());



            return (
              <div
                key={`${wi}-${di}`}
                onClick={() => handleDateClick(day)}
                className={`h-24 p-2 border rounded-lg cursor-pointer flex flex-col justify-between
                  ${isCurr ? 'bg-white' : 'bg-gray-100 text-gray-400'}
                  ${isToday(day) ? 'border-blue-500 bg-blue-500 text-white font-bold' : 'border-transparent'}
                  ${isBookedUpcoming && !isToday(day) ? 'bg-green-200 hover:bg-green-300' : (!isToday(day) ? 'hover:bg-gray-50' : '')}`}
              >
                <span className="text-sm text-gray-800">{day.getDate()}</span>
                {isBookedUpcoming && <span className="text-xs font-semibold text-green-800">Upcoming</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
