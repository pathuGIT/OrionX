import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/MenuService";
import { Loader2, AlertCircle } from "lucide-react";

const CustomerCategorySelection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getCategories()
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load categories.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
    if (error) return <div className="text-red-500 flex items-center justify-center gap-2"><AlertCircle /> {error}</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Select Category</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat.category_id}
                        onClick={() => navigate(`/items/${cat.category_id}`)}
                        className="bg-green-100 hover:bg-green-200 cursor-pointer p-6 rounded-lg shadow-md text-center font-semibold text-lg"
                    >
                        {cat.category_name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerCategorySelection;
