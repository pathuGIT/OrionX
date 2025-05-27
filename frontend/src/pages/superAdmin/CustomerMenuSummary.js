import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSummaryByBookingId } from "../../services/MenuService";
import { Loader2, AlertCircle } from "lucide-react";

const CustomerMenuSummaryReport = () => {
  const { bookingId } = useParams(); // Assume bookingId comes from URL
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getSummaryByBookingId(bookingId);
        setSummary(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch summary data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 flex items-center gap-2 px-4 py-4">
        <AlertCircle /> {error}
      </div>
    );
  }

  if (summary.length === 0) {
    return (
      <p className="text-center text-gray-600 py-10">No summary available.</p>
    );
  }

  return (
    <div className="min-h-screen bg-white bg-opacity-40 backdrop-blur-sm px-4 py-8">
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900 drop-shadow-md">
          Your Menu Summary
        </h2>

        <div className="space-y-6">
          {/* Render each category */}
          {summary.map((category, idx) => (
            <div key={idx} className="border rounded shadow bg-blue-50 p-4">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                Category: {category.category_name} — Total Items: {category.total_items}
              </h3>

              {/* Items are a comma-separated string, split it into array */}
              <ul className="list-disc list-inside text-sm text-gray-700">
                {category.items.split(", ").map((itemName, i) => (
                  <li key={i}>{itemName}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerMenuSummaryReport;
