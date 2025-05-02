import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMenus } from "../services/MenuService";
import { Loader2, AlertCircle } from "lucide-react";

const CustomerMenuListSelection = () => {
    const [menuListTypes, setMenuListTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getMenus()
            .then(data => {
                console.log("Menu list types loaded:", data); // Add this line
                setMenuListTypes(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("getMenus failed:", err); // Add this line
                setError("Failed to load menu list types.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
    if (error) return <div className="text-red-500 flex items-center justify-center gap-2"><AlertCircle /> {error}</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Select Menu List Type</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuListTypes.map((type) => (
                    <div
                        key={type.menu_list_type_id}
                        onClick={() => navigate(`/menu-types/${type.menu_list_type_id}`)}
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
