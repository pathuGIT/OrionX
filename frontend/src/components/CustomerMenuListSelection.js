import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook to programmatically navigate between routes
import { getMenus } from "../services/MenuService"; // API service to fetch menu list types
import { Loader2, AlertCircle } from "lucide-react"; // Icons for loading and error display

const CustomerMenuListSelection = () => {
    // State to hold fetched menu list types
    const [menuListTypes, setMenuListTypes] = useState([]);
    // State to handle loading indicator
    const [loading, setLoading] = useState(true);
    // State to capture and display errors
    const [error, setError] = useState(null);
    
    const navigate = useNavigate(); // For routing the user to menu types page

    // Fetch menu list types when component mounts
    useEffect(() => {
        getMenus()
            .then(data => {
                setMenuListTypes(data); // Update state with menu list data
                setLoading(false);      // Disable loading once data is fetched
            })
            .catch(() => {
                setError("Failed to load menu list types."); // Handle fetch errors
                setLoading(false);
            });
    }, []);

    // Display loading spinner while data is being fetched
    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
        </div>
    );

    // Display error message if fetching fails
    if (error) return (
        <div className="text-red-500 flex items-center justify-center gap-2">
            <AlertCircle /> {error}
        </div>
    );

    // Render the list of menu list types as clickable cards
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Select Menu List Type</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuListTypes.map((type) => (
                    <div
                        key={type.menu_list_type_id}
                        onClick={() => navigate(`/menu-types/${type.menu_list_type_id}`)} // Navigate to menu types on click
                        className="bg-blue-100 hover:bg-blue-200 cursor-pointer p-6 rounded-lg shadow-md text-center font-semibold text-lg"
                    >
                        {type.menu_list_name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerMenuListSelection;
