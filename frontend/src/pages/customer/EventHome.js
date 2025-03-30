import { Outlet, useNavigate, useParams } from "react-router-dom";

const EventHome = () => {
  const { bookingId } = useParams(); // Get the booking ID from URL
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-100 p-4 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Navigation</h2>
        <ul>
          <li className="mb-2">
            <button
              className="block p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              onClick={() => navigate(`/event-planning/${bookingId}`)}
            >
              Plan Your Event
            </button>
          </li>
        </ul>
      </div>

      {/* Display event planning content */}
      <div className="w-3/4 p-6">
        <Outlet /> {/* Will render event planning components based on route */}
      </div>
    </div>
  );
};

export default EventHome;
