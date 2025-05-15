import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CusgetMenuListType } from "../services/MenuService";
import { Loader2, AlertCircle } from "lucide-react";

const CustomerMenuListSelection = ({setActivePage}) => {
  // State to hold fetched menu list types
  const [menuListTypes, setMenuListTypes] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch menu list types on component mount
    const fetchMenuListTypes = async () => {
      try {
        const data = await CusgetMenuListType();

        // Assign image paths based on index (menu1.jpg, menu2.jpg, etc.)
        const updatedData = data.map((item, index) => ({
          ...item,
          image: `/images/menu${index + 1}.jpg`, // Ensure images exist in /public/images/
        }));

        setMenuListTypes(updatedData);
      } catch (err) {
        console.error("Failed to fetch menu list types", err);
        setError("Failed to load menu list types.");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchMenuListTypes();
  }, []);

  // Show loading spinner while fetching
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  // Show error message if data fails to load
  if (error) {
    return (
      <div className="text-red-500 flex items-center justify-center gap-2 mt-10">
        <AlertCircle className="w-6 h-6" /> {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Select a Menu List Type
      </h1>

      {/* Grid of menu list types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuListTypes.map((type) => (
          <div
            key={type.menu_list_type_id}
            // onClick={() => navigate(`/menu-types/${type.menu_list_type_id}`)}
             onClick={() => setActivePage('dashboard')}
            className="group bg-white border border-gray-100 hover:shadow-xl hover:border-blue-400 rounded-2xl overflow-hidden transition-transform transform hover:scale-[1.02] cursor-pointer"
          >
            {/* Image */}
            <img
              src={type.image}
              alt={type.menu_list_name}
              className="w-full h-48 object-cover group-hover:brightness-90 transition"
            />

            {/* Text content */}
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                {type.menu_list_name}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Tap to explore menu options
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerMenuListSelection;
