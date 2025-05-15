import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlanBiteMenu, getBiteMenu, UpdateBiteMenu, deleteBiteMenu, getBiteMenuItems } from '../../services/EventService';
import { decryptBookingId } from '../../utills/encryptionUtils';
import { ShoppingCartIcon, TrashIcon, PlusCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const PlanBiteForm = () => {
    const { bookingId: encryptedBookingId } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [existingPlan, setExistingPlan] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const decryptedBookingId = decryptBookingId(encryptedBookingId);

    useEffect(() => {
        const initializeData = async () => {
            try {
                const items = await getBiteMenuItems();
                setMenuItems(items || []);
                
                const existing = await getBiteMenu(decryptedBookingId);
                if (existing?.biteItems?.length > 0) {
                    setExistingPlan(existing);
                    const initialSelected = {};
                    existing.biteItems.forEach(item => {
                        initialSelected[item.menu_type_id] = item.Quantity;
                    });
                    setSelectedItems(initialSelected);
                }
            } catch (error) {
                console.error('Initialization error:', error);
                setMenuItems([]);
                setExistingPlan(null);
            }
        };
        initializeData();
    }, [decryptedBookingId]);

    const handleQuantityChange = (menuTypeId, quantity) => {
        setSelectedItems(prev => ({
            ...prev,
            [menuTypeId]: Math.max(0, Number(quantity))
        }));
    };

    const calculateTotal = () => {
        return menuItems.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const qty = selectedItems[item.menu_type_id] || 0;
            return total + (qty * price);
        }, 0);
    };

    const formatCurrency = (value) => {
        return `LKR ${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const biteItems = Object.entries(selectedItems)
            .filter(([_, qty]) => qty > 0)
            .map(([menu_type_id, quantity]) => ({
                menu_type_id,
                quantity: Number(quantity)
            }));

        if (biteItems.length === 0) {
            setError('Please select at least one menu item');
            return;
        }

        try {
            let result;
            if (existingPlan) {
                result = await UpdateBiteMenu(decryptedBookingId, biteItems);
            } else {
                result = await PlanBiteMenu(decryptedBookingId, biteItems);
            }
            setSuccess('Plan saved successfully!');
            setExistingPlan(result);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this bite plan?')) {
            try {
                await deleteBiteMenu(decryptedBookingId);
                setSuccess('Bite plan deleted successfully!');
                setExistingPlan(null);
                setSelectedItems({});
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl mt-8 border border-orange-100">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-100 rounded-lg">
                    <ShoppingCartIcon className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                    {existingPlan ? 'Manage Bite Menu' : 'Plan Your Bite Menu'}
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map(item => (
                        <div key={item.menu_type_id} className="p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {item.menu_type_name}
                                </h3>
                                <div className="text-orange-600 font-medium">
                                    {formatCurrency(item.price)}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.menu_type_id, (selectedItems[item.menu_type_id] || 0) - 1)}
                                    className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={selectedItems[item.menu_type_id] || 0}
                                    onChange={(e) => handleQuantityChange(item.menu_type_id, parseInt(e.target.value) || 0)}
                                    className="w-20 text-center border-2 border-orange-100 rounded-lg py-1"
                                    min="0"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.menu_type_id, (selectedItems[item.menu_type_id] || 0) + 1)}
                                    className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-gray-800">
                            Total: {formatCurrency(calculateTotal())}
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl"
                            >
                                {existingPlan ? (
                                    <>
                                        <PencilSquareIcon className="w-5 h-5" />
                                        Update
                                    </>
                                ) : (
                                    <>
                                        <PlusCircleIcon className="w-5 h-5" />
                                        Create
                                    </>
                                )}
                            </button>
                            
                            {existingPlan && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-6 rounded-xl"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {existingPlan && (
                <div className="mt-10 p-6 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <ShoppingCartIcon className="w-6 h-6 text-orange-500" />
                        Current Selection
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        {existingPlan.biteItems.map(item => (
                            <div key={item.Bite_ID} className="p-4 bg-orange-50 rounded-lg flex justify-between items-center">
                                <div>
                                    <h4 className="font-medium text-gray-800">{item.menu_type_name}</h4>
                                    <p className="text-sm text-gray-600">Quantity: {item.Quantity}</p>
                                </div>
                                <div className="text-orange-600 font-medium">
                                    {formatCurrency(item.Quantity * item.price)}
                                </div>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-orange-100">
                            <div className="flex justify-between items-center text-xl font-bold text-orange-800">
                                <span>Grand Total:</span>
                                <span>{formatCurrency(existingPlan.totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanBiteForm;