import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItems, getCategoryById } from "../services/MenuService";
import { Loader2, AlertCircle } from "lucide-react";

const CustomerItemSelection = () => {
    const { categoryId } = useParams();
    const [items, setItems] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([
            getItems(),
            getCategoryById(categoryId)
        ])
            .then(([itemsData, categoryData]) => {
                const filtered = itemsData.filter(item => item.category_id === categoryId);
                setItems(filtered);
                setCategoryName(categoryData.category_name);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load items.");
                setLoading(false);
            });
    }, [categoryId]);

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
    if (error) return <div className="text-red-500 flex items-center justify-center gap-2"><AlertCircle /> {error}</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Select Item from {categoryName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                    <div
                        key={item.item_id}
                        className="bg-yellow-100 hover:bg-yellow-200 cursor-pointer p-6 rounded-lg shadow-md text-center font-semibold text-lg"
                    >
                        {item.item_name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerItemSelection;
